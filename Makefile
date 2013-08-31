
MOCHA_OPTS= ./test
REPORTER = spec

clean:
	@rm -fr ./cache
	@rm -fr ./compiled-assets
	@rm -fr ./coverage
	@rm -f ./public/js/*.min.js
	@rm -f ./public/js/*.min.map

lmd: 
	lmd build default
	lmd watch default

start: clean
	@NODE_ENV=development ./node_modules/.bin/nodemon --watch app --watch config server.js

test: test-unit

test-jenkins-xunit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--recursive \
		--check-leaks \
		--reporter xunit \
		$(MOCHA_OPTS)

test-jenkins-cov:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover --report cobertura --dir ./results ./node_modules/.bin/_mocha -- \
		--recursive \
		--check-leaks \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

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

start-prod: clean
	@NODE_ENV=production ./node_modules/.bin/nodemon --watch app --watch config server.js

lint:
	./node_modules/.bin/jshint --show-non-errors app config public/js


jshint-jenkins:
	./node_modules/.bin/jshint --show-non-errors --reporter=checkstyle app config public/js

install:
	bower install
	npm install


.PHONY: test test-unit test-cov