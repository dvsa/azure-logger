import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
  const result = dotenv.config();
  if (result.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

export default {

  logs: {
    level: process.env.LOG_LEVEL,
  },
  applicationInsights: {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || '',
  },

  /**
   * Development mode
   */
  developmentMode: process.env.NODE_ENV === 'development',
};
