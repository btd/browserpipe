MOCHA_OPTS= ./test
REPORTER = spec
JS= app models util logger.js config.js public/js bookmarklet

clean:
	@rm -fr ./cache
	@rm -fr ./compiled-assets
	@rm -fr ./coverage

test: test-unit

test-jenkins-xunit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--recursive \
		--check-leaks \
		--reporter xunit \
		$(MOCHA_OPTS) 1> results/xunit.xml

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

start-prod: clean
	@NODE_ENV=production ./node_modules/.bin/nodemon server.js

lint:
	@./node_modules/.bin/jshint --reporter=node_modules/jshint-nice-reporter/index.js $(JS)


jshint-jenkins:
	@./node_modules/.bin/jshint  --reporter=checkstyle-reporter.js $(JS) 1> results/checkstyle.xml || exit 0

install:
	bower install
	npm install


.PHONY: test test-unit