
MOCHA_OPTS=
REPORTER = nyan

start:
	@NODE_ENV=development ./node_modules/.bin/nodemon ./server.js

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

test-cov: app-cov
	@APP_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

app-cov:
	@jscoverage app app-cov

clean:
	rm -f coverage.html
	rm -fr app-cov

.PHONY: test test-unit test-acceptance benchmark clean