/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['src/*.js'],
      options: {
        config: '.eslintrc'
      }
    },
    jscs: {
        src: ['src/*.js'],
        options: {
            config: '.jscsrc'
        }
    },
    jsdoc2md: {
      separateOutputFilePerInput: {
        options: {
          index: true
        },
        files: [
            { src: 'src/TableLayout.js', dest: 'docs/TableLayout.md' }
        ]
      }
    },
    'ftp-deploy': {
      build: {
        auth: {
          host: 'ftp.pcextreme.nl',
          port: 21,
          authKey: 'gloey.nl'
        },
        src: 'example/dist',
        dest: '/domains/gloey.nl/htdocs/www/apps/tablelayout'
      }
    },
    exec: {
      clean: 'rm -rf ./example/dist',
      build: 'webpack --minify',
      'build-debug': 'webpack',
      'open-dev': 'open http://localhost:8080/webpack-dev-server/',
      'run-dev': 'webpack-dev-server'
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-exec');

  // Default task.
  grunt.registerTask('default', ['eslint', 'jscs', 'jsdoc2md']);
  grunt.registerTask('clean', ['exec:clean']);
  grunt.registerTask('run', ['eslint', 'jscs', 'exec:open-dev', 'exec:run-dev']);
  grunt.registerTask('deploy', ['eslint', 'jscs', 'exec:clean', 'exec:build-debug', 'ftp-deploy']);
};
