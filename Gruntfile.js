module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-coveralls');    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mkdir');    
    
    grunt.initConfig({
        mkdir: {
            testDir: {
                options: {
                    create: ['tmp/tests']
                }
            }
        },
        watch: {
            files: ['test/**/*tests.js'],
            tasks: ['default'],
        },
        mocha_istanbul: {
            coverage: {
                src: 'test/**/*tests.js'
            }
        },
        coveralls: {
            options: {
                force: true
            },
            coverage: {
                src: 'coverage/*.info'
            }
        }
    });

    grunt.registerTask('default', ['mkdir:testDir', 'mocha_istanbul:coverage', 'coveralls:coverage']);
};