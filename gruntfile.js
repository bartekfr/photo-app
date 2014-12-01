module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		src: "src/",
		dist: "dist",
		watch: {
			csscommon: {
				files: ["<%= src %>/sass/*.scss"],
				tasks: ["compass"]
			},
			appjs: {
				files: ["<%= src %>/**/*.js"],
				tasks: ["jshint", "uglify:app"]
			},
			tplmin: {
				files: ["<%= src %>/app/**/*.html"],
				tasks: ["htmlmin:app"]
			},
			directivetplmin: {
				files: ["<%= src %>/common/**/*.html"],
				tasks: ["htmlmin:dir"]
			}
		},
		compass: {
			options: {
				httpPath: "/",
				sassDir: "<%= src %>/sass",
				cssDir: "<%= dist %>/css",
				outputStyle: "expanded",
				noLineComments: true,
				cache: false,
				relativeAssets: true,
				fontsDir: "bower_components/bootstrap-sass-official/assets/fonts/bootstrap"
				//sourcemap: true
			},
			dist: {
			}
		},
		uglify: {
			options: {
				//beautify: true
			},
			app: {
				files: [
					{src: "<%= src %>/app/**/*.js", dest: "<%= dist %>/js/app.min.js"},
					{src: "<%= src %>/common/**/*.js", dest: "<%= dist %>/js/common.min.js"}
				]
			}
		},
		jshint: {
			all: {
				options: {
					curly: true,
					eqeqeq: true,
					loopfunc: true,
					undef: true,
					eqnull: true,
					browser: true,
					globals: {
						jQuery: true,
						angular: true,
						d3: true,
						OAuth: true

					},
				},
				src: ["<%= src %>/**/*.js"]
			}
		},
		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true
			},
			app: {
				files: [
					{
						expand: true,
						cwd: "<%= src %>/app",
						src: ["**/*.html"],
						dest: "<%= dist %>/tpl"
					}
				]
			},
			dir: {
				files: [
					{
						expand: true,
						cwd: "<%= src %>/common/templates",
						src: ["**/*.html"],
						dest: "<%= dist %>/tpl/directives"
					}
				]
			}
		},
		karma: {
			unit: {
				configFile: "karma.config.js"
			}
		}
	});

	grunt.registerTask("default", ["compass", "jshint", "uglify", "htmlmin", "karma"]);
}