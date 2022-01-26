if (!process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  throw new Error('Required application insights instrumentation key is missing');
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
  console: {
    disablePrettyPrint: process.env.LOG_DISABLE_PRETTY_PRINT === 'true',
  },
  files: {
    enabled: process.env.LOG_FILES_ENABLED === 'true',
  },
};
