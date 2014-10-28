module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			csscommon: {
				files: ['src/sass/*.scss'],
				tasks: ['compass']
			},
			jsapp: {
				files: ['src/app/**/*.js', 'src/common/**/*.js'],
				tasks: ['uglify:app']
			}
		},
		compass: {
			options: {
				sassDir: "src/sass",
				cssDir: "dist/css",
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
					{src: 'src/app/**/*.js', dest: 'dist/js/app.min.js'},
					{src: 'src/common/**/*.js', dest: 'dist/js/common.min.js'}
				]
			}
		},
		karma: {
			unit: {
				configFile: 'karma.config.js'
			}
		}
	});

	grunt.registerTask('default', []);

	//grunt.loadNpmTasks('grunt-contrib-compass');
}