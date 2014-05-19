var config = require('./config');
/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['WebApp'],
  /**
   * Your New Relic license key.
   */
  license_key: 'b20dac0fd0c3acf3257b999238f98ccc60a0a50b',

  agent_enabled: config.env != 'development',

  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },

  browser_monitoring: {
    enable: config.env != 'development'
  }
};
