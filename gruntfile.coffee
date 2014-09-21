module.exports = (grunt) ->
  @initConfig
    manifest: grunt.file.readJSON("package.json")
    "interval":
      dist:
        options:
          taskIntervals: [
            interval: 20000
            tasks: [
              "build"
            ]
          ]

    coffee:
      options:
        bare: true
      src:
        expand: true,
        cwd: "src/coffee",
        src: ["**/*.coffee"],
        dest: "src/js",
        ext: ".js"

    concat:
      all:
        files:
          "public/assets/js/gameoflife.js"             : "src/js/**/*.js"

    uglify:
      dist:
        files:
          "public/assets/js/gameoflife.min.js"      : "public/assets/js/gameoflife.js"

    filesize:
      main: true

    generate_buildtime:
      main: true

    clean: ["src/js"]

    watch:
      options:
        livereload: 1337
        nospawn: true
        spawn: false
        interrupt: true
      src:
        files: ["src/coffee/**/*.coffee"]
        tasks: ["build"]

  grunt.registerMultiTask "generate_buildtime", "A task that writes the build time.", ->
    fs = require "fs"
    fs.writeFileSync "src/js/01_generated.js", "window.js_buildtime='#{grunt.template.today("yyyy-mm-dd H:MM:ss")}';"

  # load external Grunt task plugins.
  @loadNpmTasks "grunt-contrib-coffee"
  @loadNpmTasks "grunt-contrib-concat"
  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-uglify"
  @loadNpmTasks "grunt-contrib-watch"
  @loadNpmTasks "grunt-task-interval"

  @registerTask "build", [
    "coffee:src",
    "generate_buildtime",
    "concat:all",
    "uglify:dist",
    "clean"
  ]
  #@registerTask "serve", ["interval","watch"]
  @registerTask "serve", ["watch"]
