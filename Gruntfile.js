module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concat: {
            js: {
                src: ['src/modules/*.js', 'src/**/*.js'],
                dest: 'dist/angular-international.js'
            }
        },
        uglify: {
            js: {
                files: {
                    'dist/angular-international.min.js': ['dist/angular-international.js']
                }
            }
        }
    });

    grunt.registerTask('build', [
        'concat',
        'uglify'
    ]);
};