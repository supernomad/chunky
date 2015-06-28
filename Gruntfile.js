module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mkdir');    
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
        },
        codacy: {
            options: {
                token: "67fda9f7292a4d1ab17273d23077abd4"
            },
            coverage: {
                
            }
        }
    });

    grunt.registerTask('build', ['mkdir:testDir', 'mocha_istanbul:coverage', 'codacy:coverage']);
    grunt.registerTask('default', ['mkdir:testDir', 'mocha_istanbul:coverage']);
};