module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-codacy');
    
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
            tasks: ['test'],
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
                src: 'coverage/lcov.info'
            }
        },
        codacy: {
            options: {
            },
            coverage: {
                src: 'coverage/lcov.info'
            }
        }
    });

    grunt.registerTask('test', ['mkdir:testDir', 'mocha_istanbul:coverage']);
    grunt.registerTask('codacy', ['codacy:coverage']);
    grunt.registerTask('coveralls', ['coveralls:coverage']);
    
    grunt.registerTask('ci', ['test', 'codacy', 'coveralls']);
    grunt.registerTask('default', ['test']);
};