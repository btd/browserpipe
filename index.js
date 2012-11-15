module.exports = process.env.APP_COV
  ? require('./app-cov/app')
  : require('./app/app');