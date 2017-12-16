const dotenv = require('dotenv')
dotenv.config({ silent: true })

module.exports = grunt => {
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-replace')

  grunt.registerTask('dev', ['connect:server', 'watch'])

  grunt.initConfig({
    connect: {
      server  : {
        options   : {
          base        : 'www',
          port        : 3000,
          livereload  : true
        }
      }
    },
    watch:{
      all: {
        files:['www/app.js'],
        tasks:['default','timestamp']
      },
    },
    replace: {
      app:

  })
}