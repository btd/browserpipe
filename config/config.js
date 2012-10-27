
module.exports = {
    development: {
      db: {
        uri: 'mongodb://localhost/tagnfileit'
      }
    , facebook: {
          appId: "147484312059729"
        , appSecret: "632b8055f1824abb1b8920569a53ec3d"
        , callbackURL: "http://localhost:4000/auth/facebook/callback"
      }
    , twitter: {
          consumerKey: "3VUr5nN4JlQIDAO4uTUz6w"
        , consumerSecret: "BsTli6tyipxarjfbbTdgIg2pZuaLTSYAkQm5LETwJs"
        , callbackURL: "http://localhost:4000/auth/twitter/callback"
      }
    , google: {
          clientID: "1086393338414.apps.googleusercontent.com"
        , clientSecret: "tFZatA6ZOzL6qkgBEBOx55ab"
        , callbackURL: "http://localhost:4000/auth/google/callback"
      }      
    , requirejs: {
          baseUrl: 'public/js'
          //Uncomment this line if uglify minification is not wanted.
          //,  optimize: 'none'
        , include: ['main']
          //Uncomment this if you want to debug three.js by itself
          //,  excludeShallow: ['three']
        , out: 'public/js/tagnfile.it.js'
        , paths: {
            jQuery: 'libs/jquery/jquery-1.8.0.min',
            underscore: 'libs/underscore/underscore-min',
            backbone: 'libs/backbone/backbone-min',
            text: 'libs/require/text',
            templates: '../templates',
            bootstrap: 'libs/bootstrap/bootstrap.min'
          }
        , shim: {
              'backbone': {
                  deps: ['underscore', 'jQuery'],
                  exports: 'Backbone'
              },
              'underscore': {
                  exports: "_"
              },
              'jQuery': {
                  exports: "jQuery"
              }
          }
      }
    }
  , test: {

    }
  , production: {

    }
}
