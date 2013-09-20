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
                    files: ['public/js/**/*.js', 'public/js/components/**/*.jsx', 'public/templates/**/*.text', '!public/js/apps/*'],
                    tasks: ['react', 'lmd', 'develop'],
                    options: {
                        //interrupt: true
                        //spawn: false
                    }
                },
                app: {
                    files: ['app/**/*.js', 'config/**/*.js', 'app/**/*.jade'],
                    tasks: ['develop'],
                    options: {
                        //interrupt: true
                        //spawn: false
                    }
                }
            },

            lmd: {
                publicJs: {
                    build: 'default'
                }
            },
            
            react: {
                options: {
                    extension: 'jsx'
                },
                app: {
                    files: {
                        'public/js/components/built': 'public/js/components/jsx'
                    }
                }
            },

        });

        // A very basic default task.
        grunt.registerTask('react', ['react']);
        grunt.registerTask('default', ['develop', 'react', 'lmd', 'watch']);

        grunt.loadNpmTasks('grunt-contrib-watch'); 
        grunt.loadNpmTasks('grunt-react');
        grunt.loadNpmTasks('grunt-lmd'); 
        grunt.loadNpmTasks('grunt-develop'); 


    };