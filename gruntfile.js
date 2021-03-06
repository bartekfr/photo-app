module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		src: "src/",
		dist: "dist",
		bower: "bower_components/",
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
				outputStyle: 'compressed',
				noLineComments: true,
				cache: false,
				relativeAssets: true,
				fontsDir: "bower_components/bootstrap-sass-official/assets/fonts/bootstrap",
				sourcemap: true
			},
			dist: {
			}
		},
		uglify: {
			options: {
				//beautify: true
				sourceMap: true
			},
			bower: {
				files: [
					{
						src: [
							"<%= bower %>/d3/d3.min.js",
							"<%= bower %>/oauth-js/dist/oauth.js",
							"<%= bower %>/angular/angular.js",
							"<%= bower %>/angular-ui-router/release/angular-ui-router.min.js",
							"<%= bower %>/angular-resource/angular-resource.min.js"
						], 
						dest: "<%= dist %>/js/vendors.min.js"
					}
				]		
			},
			app: {
				files: [
					{src: "<%= src %>/app/**/*.js", dest: "<%= dist %>/js/app.min.js"},
					{src: ["<%= src %>/common/modules-init.js", "<%= src %>/common/**/*.js"], dest: "<%= dist %>/js/common.min.js"}
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
		"http-server": {
			'dev': {
				root: ".",
				port: 8080,
				host: "127.0.0.1",
				cache: 1000,
				showDir : true,
				autoIndex: true,
				ext: "html",
				runInBackground: true
			}
		},
		karma: {
			unit: {
				configFile: "karma.config.js"
			}
		}
	});

	grunt.registerTask("default", ["compass", "jshint", "uglify", "htmlmin", "karma"]);
	grunt.registerTask("serve", ['http-server', "watch"]);
}