const axios = require('axios');
const config = require('../config');

const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(config.smsGateway.baseUrl, messageData, {
      headers: {
        Authorization: `Bearer ${config.smsGateway.apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendMessage,
};