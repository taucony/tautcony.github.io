module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' */\n',
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            main: {
                files: {
                    'js/<%= pkg.name %>.min.js': ['js/<%= pkg.name %>.js'],
                    'js/tcupdate.min.js': ['js/tcupdate.js']
                }
            }
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/<%= pkg.name %>.css": "less/<%= pkg.name %>.less",
                    "css/tcupdate.css": "less/tcupdate.less"
                }
            },
            minified: {
                options: {
                    paths: ["css"],
                    banner: '<%= banner %>',
                    compress: true
                },
                files: {
                    "css/<%= pkg.name %>.min.css": "less/<%= pkg.name %>.less",
                    "css/tcupdate.min.css": "less/tcupdate.less"
                }
            }
        },
        ts: {
            base: {
                src: ['ts/*.ts', "typings/globals/**/*.d.ts", "!ts/background-canvas.ts"],
                //dest: 'js',
                out: 'js/<%= pkg.name %>.js',
                references: "typings/globals/**/*.d.ts",
                options: {
                    fast: "watch",
                    target: 'es5',
                    sourceMap: false,
                    declaration: false,
                    removeComments: true
                }
            }
        },
        watch: {
            ts: {
                files: ['ts/*.ts'],
                tasks: ['ts', 'uglify'],
                options: {
                    spawn: false
                }
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },
            jekyll: {
                files: ['**/*', '!**/node_modules/**', '!**/_site/**', '!.tscache/**'],
                tasks: ['jekyll'],
                options: {
                    spawn: false
                }
            }
        },
        jekyll: {
            build: {
                options: {
                    serve: false,
                    drafts: true,
                    incremental: true,
                    quiet: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: '_site'
                }
            }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-ts');

    // Default task(s).
    grunt.registerTask('default', ['ts', 'uglify', 'less', 'jekyll', 'connect', 'watch']);

};
