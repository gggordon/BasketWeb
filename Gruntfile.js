module.exports = function (grunt) {
	var jsSources = [
		'dev/vendor/jquery/dist/jquery.min.js',
		'dev/vendor/mui-0.1.2/js/mui.js',
		'dev/vendor/angularjs/angular.min.js',
		'dev/assets/js/app.js',
	],
	cssSources = [

		'dev/vendor/angularjs/angular-csp.css',
		'dev/assets/css/app.css'
	].reverse(),
	cssExtras = [],
	jsExtras = [
		'dev/vendor/jquery/dist/jquery.min.map',
		'dev/vendor/angularjs/angular.min.js.map'
	],
	appFiles = [

	];
	grunt.initConfig({
		concat : {
			js : {
				src : jsSources,
				dest : 'dev/assets/js/app.combined.js'
			},
			// css: {
			// src:cssSources,
			// dest: 'dev/assets/css/app.css'
			// },
		},
		cssmin : {
			build : {
				files : {
					'dev/assets/css/app.min.css' : cssSources
				}
			}
		},
		uglify : {
			build : {
				options : {
					mangle : false //prevents renaming variable names to shorter names
				},
				files : {
					'dev/assets/js/app.min.js' : ['dev/assets/js/app.combined.js']
				}
			}
		},
		copy : {
			publish : {
				cwd : 'dev',
				src : appFiles,
				dest : 'dist',
				expand : true
			},
			'css-extras' : {
				cwd : './',
				src : cssExtras,
				dest : 'dev/assets/css/',
				expand : true,
				filter : 'isFile',
				flatten : true
			},
			'js-extras' : {
				cwd : './',
				src : jsExtras,
				dest : 'dev/assets/js/',
				expand : true,
				filter : 'isFile',
				flatten : true
			},
		},
		karma : {
			unit : {
				configFile : 'tests/karma.config.js'
			},
			continuous : {
				//singleRun: true,
				//browsers: ['PhantomJS'],
				configFile : 'tests/karma.config.js'
			}
		},
		watch : {
			stylesheets : {
				files : 'dev/assets/css/**',
				tasks : ['stylesheets']
			},
			scripts : {
				files : jsSources,
				tasks : ['scripts']
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-htmlmin");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('speak', function () {
		console.log('Juice');
	});

	grunt.registerTask('stylesheets', 'Compiles all stylesheets', [
			'copy:css-extras', 'cssmin'
		]);

	grunt.registerTask('scripts', 'Compiles all javascript', function () {
		var taskList = [
			'copy:js-extras', 'concat:js', 'uglify'
		];
		grunt.task.run(taskList);
	});

	grunt.registerTask('build', 'Re-building Project', [
			'stylesheets', 'scripts'
		]);

	grunt.registerTask('tests', 'Testing Project', ['karma:continuous'])

	grunt.registerTask(
		'default',
		'Watches the project for changes, automatically builds them and runs a server.',
		['build', 'watch']);
}
