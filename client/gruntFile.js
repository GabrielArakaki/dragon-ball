module.exports = grunt => {

  grunt.registerTask('buildjs', ['html2js','concat','replace:application','sass','copy:assets']);

}