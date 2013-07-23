
MOCHA_OPTS= ./test
REPORTER = spec

start:
	@NODE_ENV=development ./node_modules/.bin/nodemon --watch app --watch config server.js

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--recursive \
		--check-leaks \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

test-cov:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- \
		--recursive \
		--check-leaks \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

prod:
	@NODE_ENV=production node server.js

.PHONY: test test-unit test-cov