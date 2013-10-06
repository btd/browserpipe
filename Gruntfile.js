var path = require('path'),
    fs = require('fs')

var bowerPath = './bower_components';

try {
    bowerPath = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8')).directory;
} catch(e) {}

var bower = function(subPath) {
    return path.join(bowerPath, subPath);
};

var alias = function(path, aliasName) {
    return path + ':' + aliasName;
};

var bowerAlias = function(path, aliasName) {
    return alias(bower(path), aliasName);
};

var nodeAlias = function(subPath, aliasName) {
    return alias(path.join('./node_modules', subPath), aliasName);
};

var browserifyAliases = [
    bowerAlias('page.js/index.js', 'page'),
    nodeAlias('react-tools/build/modules/React.js', 'react'),
    bowerAlias('socket.io-client/dist/socket.io.js', 'socket.io'),
    bowerAlias('lodash/dist/lodash.js', 'lodash'),
    bowerAlias('emitter/index.js', 'emitter'),
    bowerAlias('indexof/index.js', 'indexof')
];

module.exports = function(grunt) {



    grunt.initConfig({

            develop: {
                server: {
                    file: 'server.js',
                    env: {
                        NODE_ENV: 'development'
                    }
                }
            },

            watch: {
                publicJs: {
                    files: ['public/js/**/*.js', 'public/js/components/**/*.jsx', '!public/js/apps/**'],
                    tasks: ['browserify']
                },
                app: {
                    files: ['app/**/*.js', 'config/**/*.js', 'app/**/*.jade'],
                    tasks: ['develop']
                },
                tests: {
                    files: ['public/js/**/*.js', 'public/js/components/**/*.jsx', '!public/js/apps/**', 'public/js/test/tests.js'],
                    tasks: ['browserify:tests']
                }
            },

            browserify: {
                mainJs: {
                    src: ['public/js/main.js'],
                    dest: 'public/js/apps/main.js',
                    options: {
                        alias: browserifyAliases,
                        extensions: [".jsx"],
                        shim: {
                            jquery: { path: "./public/bower_components/jquery/jquery.js", exports: "$" }
                        },
                        debug: true,
                        transform: ['reactify']
                    }
                },
                tests: {
                    src: ['public/js/test/tests.js'],
                    dest: 'public/js/test/test.js',
                    options: {
                        alias: browserifyAliases.concat([
                            bowerAlias('should.js/lib/should.js', 'should')
                        ]),
                        extensions: [".jsx"],
                        shim: {
                            jquery: { path: "./public/bower_components/jquery/jquery.js", exports: "$" }
                        },
                        debug: true,
                        transform: ['reactify']
                    }
                }
            }

        });

        // A very basic default task.
        grunt.registerTask('default', ['develop', 'browserify', 'watch']);

        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-develop'); 


    };