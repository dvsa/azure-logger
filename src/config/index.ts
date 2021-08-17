import dotenv from 'dotenv';

if (!process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  dotenv.config();
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
