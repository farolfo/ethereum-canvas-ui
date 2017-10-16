'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        less: {
            dist: {
                files: {
                    'src/styles.min.css': [
                        'src/styles.less'
                    ]
                },
                options: {
                    compress: true,
                    // LESS source map
                    // To enable, set sourceMap to true and update sourceMapRootpath based on your install
                    sourceMap: false,
                    sourceMapFilename: 'src/styles.min.css',
                    sourceMapRootpath: '/'
                }
            },
            dev: {
                files: {
                    'src/styles.min.css': [
                        'src/styles.less'
                    ]
                },
                options: {
                    compress: false,
                    // LESS source map
                    // To enable, set sourceMap to true and update sourceMapRootpath based on your install
                    sourceMap: true,
                    sourceMapFilename: 'src/styles.min.css',
                    sourceMapRootpath: '/'
                }
            }
        },
        watch: {
            less: {
                files: [
                    'src/*.less'
                ],
                tasks: ['less:dev']
            },
            html: {
                files: ['**/*.html'],
                tasks: []
            },
            js: {
                files: [
                    'src/*.js',
                    'config/*.js'
                ],
                tasks: []
            },
            livereload: {
                // Browser live reloading
                // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
                options: {
                    livereload: true
                },
                files: [
                    'dist/*'
                ]
            }
        },
        clean: {
            dist: [
                'src/styles.min.css',
                'src/styles.min.css.map',
                'dist/*'
            ]
        },
        connect: {
            server: {
                options: {
                    livereload: true,
                    base: '.',
                    port: 9000
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Register tasks
    grunt.registerTask('default', [
        'clean',
        'less:dist'
    ]);

    grunt.registerTask('serve', [
        'default',
        'connect:server',
        'watch'
    ]);
};