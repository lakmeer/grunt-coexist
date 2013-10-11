/*!
 * grunt-coexist
 *
 * lakmeer - github.com/lakmeer
 * BSD Lisence
 *
 * Compiles scripts together regardless of language
 *
 */

#
# Require
#

{ unique } = require \prelude-ls
log = -> console.log.apply console, &; &0

LS = require \LiveScript
CS = require \coffee-script


#
# Helpers
#

# Extract file ext
extension-of = (filename) -> if filename.match /\.(\w+)$/ then that.1 else ""

# Create error readout string
formatError = (file, error) ->
  error      = String error
  error-line = error.match(/line (\d+)/)?[1] or ""
  error-text = error.match(/: ([^:]+)$/)?[1] or error
  nl         = "\\n"

  error-string = "Compiler Error: #nl in #file | line #error-line #nl #error-text"

  return "console.error(\"#error-string\");"


#
# Grunt Task - 'coexist'
#

module.exports = (grunt) ->

  grunt.register-multi-task 'coexist', "Compiles files together regardless of language", ->

    # Import options from user grunt config

    options = @options {
      no-duplicates  : yes
      forward-errors : yes
      add-banner     : yes
      verbose        : no
      banner         : (file, ix) -> "\n/*! #file - File number: #ix */\n\n"
    }


    #
    # Main compilation functions
    #

    # Compile a file when given it's filename

    compile = (file) ->

      try
        source = grunt.file.read file

        if options.verbose then grunt.log.writeln file.grey, "(#{ extension-of file })".grey

        # Compile by inferring language from file extension
        switch extension-of file
          | 'cs', 'coffee' => CS.compile source
          | 'ls'           => LS.compile source
          | _ => source  # JS: no work needed - future: harmony shim?

      catch error

        # Can't read filename - output is empty string
        if error.code is "ENOENT"
          grunt.log.writeln "✗".red, file.yellow, ':'.grey, "Can't find source file"
          ""

        # Compilation error - output front-end compatible error message
        else
          grunt.log.writeln "✗".red, file.yellow, ':'.grey, error.message
          if options.forward-errors
            formatError file, error.message
          else
            ""

    # Add filename and index banner to space in between files while compiling

    process-file = (file, i) ->
      if options.add-banner
        (options.banner file, i) + compile file

      else
        compile file


    #
    # Begin actual processing
    #

    for file in @files

      if options.verbose then grunt.log.writeln 'Preparing source for', file.dest

      # Remove duplicates?
      if options.no-duplicates
        file.src = unique file.src

      # Create list of compiled file contents
      compiled-source = file.src.map process-file

      # Write output file
      grunt.file.write file.dest, compiled-source.join '\n'

      # Indicate success
      grunt.log.writeln "✔".green, file.dest, "created from #{ file.src.length } source files".grey


