import dotenv from 'dotenv';

if (!process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  const result = dotenv.config();
  if (result.error) {
    // This error should crash whole process
    throw new Error('⚠️Env vars have not been set and no .env file has been found');
  }
}

export default {

  logs: {
    level: process.env.LOG_LEVEL,
  },
  applicationInsights: {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
  },

  /**
   * Development mode
   */
  developmentMode: process.env.NODE_ENV === 'development',
};
