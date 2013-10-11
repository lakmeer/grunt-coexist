
module.exports = (grunt) ->

  grunt.initConfig
    pkg : grunt.file.readJSON 'package.json'
    lsc : 'tasks/coexist.js' : [ 'tasks/coexist.ls' ]

  grunt.loadNpmTasks 'grunt-lsc'
  grunt.registerTask 'default', [ 'lsc' ]

