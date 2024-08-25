const redis = require('redis');
const config = require('../config');
const smsGateway = require('../util/smsGateway');
const express = require('express');
const app = express();
app.use(express.json()); 
//const client = redis.createClient();

const client = redis.createClient({
    host: 'localhost',
    port: 44393
});

// Rate limiting implementation using a token bucket algorithm
const tokenBucket = {
    capacity: 45, // Maximum rate of 45 segments per second
    tokens: 45,
    refillRate: 45,
    refillInterval: 1000, // Refill tokens every 1000 milliseconds (1 second)
};

function refillTokens() {
    tokenBucket.tokens += tokenBucket.refillRate;
    if (tokenBucket.tokens > tokenBucket.capacity) {
        tokenBucket.tokens = tokenBucket.capacity;
    }
    setTimeout(refillTokens, tokenBucket.refillInterval);
}



// Function to calculate segments based on encoding
function calculateSegments(text) {
    const gsm7Length = 160;
    const ucs2Length = 70;
    
    // Check if the text is GSM-7
    const isGSM7 = /^[\x00-\x7F]*$/.test(text); 
    const segmentLength = isGSM7 ? gsm7Length : ucs2Length;
    const segments = Math.ceil(text.length / segmentLength);
    return { segments, isGSM7 };
}

function queueMessage(req, res) {
    const { text, phoneNumber } = req.body;

    // Validate input data
    if (!text || !phoneNumber) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // Calculate segments
    const { segments } = calculateSegments(text);
    const messageData = {
        text,
        phoneNumber,
        segments,
    };

    // Store message data in the queue
    client.rpush('messages', JSON.stringify(messageData));
    res.json({ message: 'Message queued successfully' });
}

function sendMessage() {
    client.lpop('messages', (err, message) => {
        if (err) {
            console.error('Error retrieving message from queue:', err);
            return;
        }

        if (!message) {
            // No messages to process
            return; 
        }

        const { text, phoneNumber, segments } = JSON.parse(message);
        const { isGSM7 } = calculateSegments(text);

        // Split the message into segments
        const segmentLength = isGSM7 ? 160 : 70;
        const messageSegments = [];
        for (let i = 0; i < segments; i++) {
            messageSegments.push(text.substr(i * segmentLength, segmentLength));
        }

        // Send each segment while respecting the rate limit
        messageSegments.forEach(segment => {
            if (tokenBucket.tokens > 0) {
                tokenBucket.tokens--;

                // Send the segment to the SMS gateway
                smsGateway.sendSMS(phoneNumber, segment)
                    .then(() => {
                        console.log('Segment sent successfully:', segment);
                    })
                    .catch(err => {
                        console.error('Failed to send segment:', err);
                        // Retry logic can be implemented here
                    });
            } else {
                console.log('Rate limit exceeded. Segment will be retried later.');
                client.rpush('messages', message); // Requeue the message
            }
        });
    });
}

// Start the refill process and set up the interval for sending messages
function startMessageProcessing() {
    refillTokens();
    // Set up an interval to send messages while respecting the rate limit
    setInterval(sendMessage, 100);
}

module.exports = {
    queueMessage,
    startMessageProcessing
};