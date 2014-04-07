var path = require('path'),
  fs = require('fs')

var bowerPath = './bower_components';

try {
  bowerPath = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8')).directory;
} catch(e) {
}

var bower = function(subPath) {
  return path.join(bowerPath, subPath);
};

var alias = function(path, aliasName) {
  return path + ':' + aliasName;
};

var bowerAlias = function(path, aliasName) {
  return alias(bower(path), aliasName);
};

var nodeAlias = function(subPath, aliasName) {
  return alias(path.join('./node_modules', subPath), aliasName);
};

var browserifyAliases = [
  bowerAlias('page.js/index.js', 'page'),
  bowerAlias('react/react-with-addons.js', 'react'),
  bowerAlias('socket.io-client/dist/socket.io.js', 'socket.io'),
  bowerAlias('lodash/dist/lodash.js', 'lodash'),
  bowerAlias('emitter/index.js', 'emitter'),
  bowerAlias('moco/index.js', 'moco'),
  bowerAlias('messenger/build/js/messenger.js', 'messenger'),
  bowerAlias('bootstrap/js/dropdown.js', 'bootstrap-dropdown'),
  bowerAlias('bootstrap/js/modal.js', 'bootstrap-modal')
];

module.exports = function(grunt) {


  grunt.initConfig({
    watch: {
      publicJs: {
        files: ['public/js/**/*.js', 'public/js/components/**/*.jsx', '!public/js/apps/**', '!public/js/test/test.js'],
        tasks: ['default']
      }
    },

    browserify: {
      mainJs: {
        src: ['public/js/main.js'],
        dest: 'public/js/apps/main.js',
        options: {
          alias: browserifyAliases,
          extensions: [".jsx"],
          noParse: ['public/bower_components/react/react-with-addons.js'],
          external: ['emitter-component'],
          shim: {
            jquery: { path: "./public/bower_components/jquery/jquery.js", exports: "$" }
          },
          //debug: true,
          transform: ['reactify']
        }
      }
    }

  });

  // A very basic default task.
  grunt.registerTask('dev', ['default', 'watch']);

  grunt.registerTask('default', ['browserify:mainJs']);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');

};
