/*!
 * grunt-coexist
 *
 * lakmeer - github.com/lakmeer
 * BSD Lisence
 *
 * Compiles scripts together regardless of language
 *
 */
(function(){
  var unique, log, LS, CS, extensionOf, formatError;
  unique = require('prelude-ls').unique;
  log = function(){
    console.log.apply(console, arguments);
    return arguments[0];
  };
  LS = require('LiveScript');
  CS = require('coffee-script');
  extensionOf = function(filename){
    var that;
    if (that = filename.match(/\.(\w+)$/)) {
      return that[1];
    } else {
      return "";
    }
  };
  formatError = function(file, error){
    var errorLine, ref$, errorText, nl, errorString;
    error = String(error);
    errorLine = ((ref$ = error.match(/line (\d+)/)) != null ? ref$[1] : void 8) || "";
    errorText = ((ref$ = error.match(/: ([^:]+)$/)) != null ? ref$[1] : void 8) || error;
    nl = "\\n";
    errorString = "Compiler Error: " + nl + " in " + file + " | line " + errorLine + " " + nl + " " + errorText;
    return "console.error(\"" + errorString + "\");";
  };
  module.exports = function(grunt){
    return grunt.registerMultiTask('coexist', "Compiles files together regardless of language", function(){
      var options, compile, processFile, i$, ref$, len$, file, compiledSource, results$ = [];
      options = this.options({
        noDuplicates: true,
        forwardErrors: true,
        addBanner: true,
        verbose: false,
        banner: function(file, ix){
          return "\n/*! " + file + " - File number: " + ix + " */\n\n";
        }
      });
      compile = function(file){
        var source, error;
        try {
          source = grunt.file.read(file);
          if (options.verbose) {
            grunt.log.writeln(file.grey, ("(" + extensionOf(file) + ")").grey);
          }
          switch (extensionOf(file)) {
          case 'cs':
          case 'coffee':
            return CS.compile(source);
          case 'ls':
            return LS.compile(source);
          default:
            return source;
          }
        } catch (e$) {
          error = e$;
          if (error.code === "ENOENT") {
            grunt.log.writeln("✗".red, file.yellow, ':'.grey, "Can't find source file");
            return "";
          } else {
            grunt.log.writeln("✗".red, file.yellow, ':'.grey, error.message);
            if (options.forwardErrors) {
              return formatError(file, error.message);
            } else {
              return "";
            }
          }
        }
      };
      processFile = function(file, i){
        if (options.addBanner) {
          return options.banner(file, i) + compile(file);
        } else {
          return compile(file);
        }
      };
      for (i$ = 0, len$ = (ref$ = this.files).length; i$ < len$; ++i$) {
        file = ref$[i$];
        if (options.verbose) {
          grunt.log.writeln('Preparing source for', file.dest);
        }
        if (options.noDuplicates) {
          file.src = unique(file.src);
        }
        compiledSource = file.src.map(processFile);
        grunt.file.write(file.dest, compiledSource.join('\n'));
        results$.push(grunt.log.writeln("✔".green, file.dest, ("created from " + file.src.length + " source files").grey));
      }
      return results$;
    });
  };
}).call(this);
