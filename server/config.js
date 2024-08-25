module.exports = {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    smsGateway: {
      apiKey: process.env.SMS_GATEWAY_API_KEY,
      baseUrl: process.env.SMS_GATEWAY_BASE_URL,
    },
  };