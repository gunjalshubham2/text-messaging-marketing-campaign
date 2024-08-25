#Text Messaging Marketing Campaign

Description:

This Node.js application provides a micro-service for managing text message marketing campaigns. It handles message queuing, sending, rate limiting, and error handling.

Prerequisites:

Install Node.js and npm (or yarn)  version 20.17.0 
An AWS account
AWS CLI configured with your credentials
A Redis instance
An SMS gateway account (e.g. SendGrid)

Installation:

Install dependencies:

npm install

Configuration:

Add environment creds in .env file in the project /server folder and add the details for following environment variables:

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
SMS_GATEWAY_API_KEY=your_sms_gateway_api_key
SMS_GATEWAY_BASE_URL=your_sms_gateway_base_url

Running Locally:

Start the Redis server.
Run the application:
with directory path /server
node app.js


Deploying to AWS:

Create an AWS Serverless application:

serverless create --template aws-nodejs --name sms-marketing-service


Deploy the application:

serverless deploy

Usage:

Send a POST request to the API endpoint /queue-message with the following JSON payload:

JSON
{
    "text": "Your message content",
    "phoneNumber": "+1234567890"
}

CURL:
curl --location 'http://localhost:3000/api/queue' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'text=Your message content' \
--data-urlencode 'phoneNumber=+1234567890' \
--data-urlencode '%7B%20%22text%22%3A%20%22Hello%2C%20world!%22%2C%20%22recipient%22%3A%20%22%201234567890%22%20%7D='