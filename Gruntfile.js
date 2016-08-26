module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      client: {
        src: ['public/client/app.js',
        'public/client/link.js',
        'public/client/links.js',
        'public/client/linkView.js',
        'public/client/linksView.js',
        'public/client/createLinkView.js',
        'public/client/router.js'],
        dest: 'public/dist/client.js',
      },
      library: {
        src: ['public/lib/jquery.js',
        'public/lib/underscore.js',
        'public/lib/backbone.js',
        'public/lib/handlebars.js'],
        dest: 'public/dist/lib.js',
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      client: {
        files: {
          'public/dist/client.js': ['public/dist/client.js']
        }
      },
      library: {
        files: {
          'public/dist/lib.js': ['public/dist/lib.js']
        }
      }
    },

    eslint: {
      target: [
        'public/client/**/*.js'
      ]
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      },
      devServer: {
        command: [
          'git push live master',
          'grunt upload --prod=true'
        ].join('&&')
      }
    },

    // secret: grunt.file.readJSON('secret.json'),

    sshexec: {
      test: {
        command: [
          'cd /root/shortly-deploy',
          'npm install',
          'npm install sqlite3',
          'grunt deploy'
        ].join(' && '),
        options: {
          host: '104.236.169.116',
          username: 'root',
          privateKey: grunt.file.exists('/Volumes/student/ssh/id_rsa') ? grunt.file.read('/Volumes/student/ssh/id_rsa') : '',
          passphrase: 'hack47'
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-ssh');

  // grunt.registerTask('server-dev', function (target) {
  //   grunt.task.run([ 'nodemon', 'watch' ]);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['sshexec']);
    } else {
      grunt.task.run(['shell:devServer']);
    }
  });

  grunt.registerTask('deploy', [
    'test',
    'eslint',
    'build', 
    'concurrent'
  ]);

};
