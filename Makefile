MOCHA_OPTS= ./test
REPORTER = spec

clean:
	@rm -fr ./cache
	@rm -fr ./compiled-assets
	@rm -fr ./coverage

start: clean
	@NODE_ENV=development ./node_modules/.bin/nodemon --watch app --watch config server.js

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

test-cov:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- \
		--recursive \
		--check-leaks \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

start-prod: clean
	@NODE_ENV=production ./node_modules/.bin/nodemon --watch app --watch config server.js

lint:
	./node_modules/.bin/jshint --show-non-errors app config public/js api


jshint-jenkins:
	./node_modules/.bin/jshint --reporter=checkstyle app config public/js 1> results/checkstyle.xml || exit 0

watch-main:
	watchify -t reactify --extension .jsx --debug public/js/main.js -o ./public/js/apps/main.js

watch-main:
	browserify -t reactify --extension .jsx --debug public/js/main.js -o ./public/js/apps/main.js

install:
	bower install
	npm install


.PHONY: test test-unit test-cov