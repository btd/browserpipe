var isCoverage = process.env.APP_COV;

if(isCoverage) {
	console.log('Code coverage on');
	exports.require = function(path) {
		var instrumentedPath = path.replace('/app', '/app-cov');
		try {
      require.resolve(instrumentedPath);
      return require(instrumentedPath);
    } catch (e) {
      console.log('Coverage on, but no instrumented file found at ' 
        + instrumentedPath);
      return require(path);
    }
	}
} else {
	console.log('Code coverage off');
	exports.require = require;
}