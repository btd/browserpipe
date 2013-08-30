module.exports = function(grunt) {

    grunt.initConfig({
        develop: {
            server: {
                file: 'server.js',
                env: { NODE_ENV: 'development' }
            }
        },

        watch: {
            publicJs: {
                files: ['public/js/**/*.js', 'public/templates/**/*.text', '!public/js/apps/*'],
                tasks: ['lmd'],
                options: {
                    interrupt: true
                    //spawn: false
                }
            },
            app: {
                files: ['app/**/*.js', 'config/**/*.js', 'app/**/*.jade'],
                tasks: ['develop'],
                options: {
                    interrupt: true
                    //spawn: false
                }
            }
        },

        lmd: {
            publicJs: {
                build: 'default'
            }
        }

    });

    // A very basic default task.
    grunt.registerTask('default', ['develop', 'lmd', 'watch']);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-lmd');
    grunt.loadNpmTasks('grunt-develop');

};