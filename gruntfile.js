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
				tasks: ["uglify:app", "jshint"]
			},
			tplmin: {
				files: ["<%= src %>/app/**/*.html"],
				tasks: ["htmlmin"]
			}
		},
		compass: {
			options: {
				sassDir: "<%= src %>/sass",
				cssDir: "<%= dist %>/css",
				outputStyle: "compressed",
				noLineComments: true,
				cache: false,
				//sourcemap: true
			},
			dist: {
			}
		},
		uglify: {
			options: {
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
					eqnull: true,
					browser: true,
					globals: {
						jQuery: "angular"
					},
				},
				src: ["<%= src %>/**/*.js"]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [
					{
						expand: true,
						cwd: "<%= src %>/app",
						src: ["**/*.html"],
						dest: "<%= dist %>/tpl"
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