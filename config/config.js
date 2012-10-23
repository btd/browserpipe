
module.exports = {
    development: {
      db: {
        uri: 'mongodb://localhost/everbookmark'
      },
      facebook: {
          appId: "147484312059729"
        , appSecret: "632b8055f1824abb1b8920569a53ec3d"
        , callbackURL: "http://localhost:4000/auth/facebook/callback"
      },
      twitter: {
          consumerKey: "3VUr5nN4JlQIDAO4uTUz6w"
        , consumerSecret: "BsTli6tyipxarjfbbTdgIg2pZuaLTSYAkQm5LETwJs"
        , callbackURL: "http://localhost:4000/auth/twitter/callback"
      },
      google: {
          clientID: "1086393338414.apps.googleusercontent.com"
        , clientSecret: "tFZatA6ZOzL6qkgBEBOx55ab"
        , callbackURL: "http://localhost:4000/auth/google/callback"
      }
    }
  , test: {

    }
  , production: {

    }
}
