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
    nodeAlias('react-tools/build/modules/ReactWithAddons.js', 'react'),
    bowerAlias('socket.io-client/dist/socket.io.js', 'socket.io'),
    bowerAlias('lodash/dist/lodash.js', 'lodash'),
    bowerAlias('emitter/index.js', 'emitter'),
    bowerAlias('indexof/index.js', 'indexof'),
    bowerAlias('moco/index.js', 'moco'),
    bowerAlias('messenger/build/js/messenger.js', 'messenger'),
    bowerAlias('perfect.scrollbar/src/jquery.mousewheel.js', 'jquery.mousewheel'),
    bowerAlias('perfect.scrollbar/src/perfect-scrollbar.js', 'perfect.scrollbar'),
    bowerAlias('bootstrap/js/dropdown.js', 'bootstrap-dropdown'),

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
                    files: ['public/js/**/*.js', 'public/js/components/**/*.jsx', '!public/js/apps/**', '!public/js/test/test.js'],
                    tasks: ['browserify:mainJs']
                },
                app: {
                    files: ['app/**/*.js', 'config/**/*.js', 'app/**/*.jade'],
                    tasks: ['develop']
                }
            },

            browserify: {
                mainJs: {
                    src: ['public/js/main.js'],
                    dest: 'public/js/apps/main.js',
                    options: {
                        alias: browserifyAliases,
                        extensions: [".jsx"],
                        external: ['emitter-component'],
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
        grunt.registerTask('default', ['develop', 'browserify:mainJs', 'watch']);

        grunt.registerTask('dist', ['browserify:mainJs']);

        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-develop'); 


    };