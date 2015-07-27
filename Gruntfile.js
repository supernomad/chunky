module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-codacy');
    
    grunt.initConfig({
        mkdir: {
            testDir: {
                options: {
                    create: [
                        'tmp/tests'
                        , 'coverage/unit'
                        , 'coverage/integration'
                    ]
                }
            }
        },
        watch: {
            files: ['test/**/*tests.js'],
            tasks: ['test'],
        },
        mocha_istanbul: {
            unit: {
                src: 'test/**/*tests.js',
                options: {
                    coverageFolder: 'coverage/unit',
                    excludes: [
                        'test/**'
                        , 'integration-test/**'
                        , 'Gruntfile.js'
                    ]
                }
            },
            integration: {
                src: 'integration-test/**/*tests.js',
                options: {
                    coverageFolder: 'coverage/integration',
                    excludes: [
                        'test/**'
                        , 'integration-test/**'
                        , 'Gruntfile.js'
                    ]
                }
            }
        },
        coveralls: {
            coverage: {
                force: true,
                src: 'coverage/unit/*.info'
            }
        },
        codacy: {
            coverage: {
                force: true,
                src: 'coverage/unit/*.info'
            }
        },
        clean: ['tmp']
    });

    grunt.registerTask('test-setup', ['mkdir:testDir']);
    grunt.registerTask('test', ['test-setup', 'mocha_istanbul:unit', 'clean']);
    grunt.registerTask('integration', ['test-setup', 'mocha_istanbul:integration', 'clean']);
    grunt.registerTask('coverage', ['codacy:coverage', 'coveralls:coverage']);
    
    grunt.registerTask('ci', ['test', 'integration', 'coverage']);
    grunt.registerTask('default', ['test']);
};