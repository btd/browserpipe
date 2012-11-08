define([
  'underscore',
  'backbone'
], function(_, Backbone) {
   var TagTree = Backbone.Model.extend({   
      tree: {
         "name":"T",
         "leaf":false,
         "children":[
            {
               "name":"administration",
               "leaf":false,
               "children":[
                  {
                     "name":"java_metrics",
                     "leaf":true
                  },
                  {
                     "name":"site_optimization",
                     "leaf":true
                  }
               ]
            },
            {
               "name":"books",
               "leaf":false,
               "children":[
                  {
                     "name":"to_be_bought",
                     "leaf":true
                  }
               ]
            },
            {
               "name":"deployment",
               "leaf":false,
               "children":[
                  {
                     "name":"debian",
                     "leaf":false,
                     "children":[
                        {
                           "name":"java",
                           "leaf":true
                        },
                        {
                           "name":"ssh",
                           "leaf":true
                        }
                     ]
                  },
                  {
                     "name":"nginx",
                     "leaf":true
                  },
                  {
                     "name":"osx",
                     "leaf":true
                  }
               ]
            },
            {
               "name":"design",
               "leaf":false,
               "children":[
                  {
                     "name":"articles",
                     "leaf":true
                  },
                  {
                     "name":"blogs",
                     "leaf":true
                  },
                  {
                     "name":"bootstrap jajajaj very long to test something really cool, even more longer than I thought it should be, a bit longer so it goes to the next line",
                     "leaf":false,
                     "children":[
                        {
                           "name":"date_range_picker",
                           "leaf":false,
                           "children":[
                              {
                                 "name":"css",
                                 "leaf":true
                              },
                              {
                                 "name":"components",
                                 "leaf":true
                              }
                           ]
                        },
                        {
                           "name":"buttons",
                           "leaf":false,
                           "children":[
                              {
                                 "name":"good",
                                 "leaf":true
                              },
                              {
                                 "name":"test",
                                 "leaf":true
                              }
                           ]
                        }
                     ]
                  },
                  {
                     "name":"colors",
                     "leaf":true
                  },
                  {
                     "name":"css",
                     "leaf":true
                  },
                  {
                     "name":"discussions",
                     "leaf":true
                  }
               ]
            },
            {
               "name":"development",
               "leaf":true
            },
            {
               "name":"entertainment",
               "leaf":true
            },
            {
               "name":"managment",
               "leaf":true
            },
            {
               "name":"personal",
               "leaf":true
            },
            {
               "name":"projects",
               "leaf":true
            },
            {
               "name":"startup",
               "leaf":true
            },
            {
               "name":"tools",
               "leaf":true
            },
            {
               "name":"useful_pages",
               "leaf":true
            },
            {
               "name":"various",
               "leaf":false,
               "children":[
                  {
                     "name":"java_metrics",
                     "leaf":true
                  },
                  {
                     "name":"site_optimization",
                     "leaf":true
                  }
               ]
            },
            {
               "name":"wifi",
               "leaf":true
            }
         ]
      },
      initialize: function(){
      },
      getTree: function() {
         return this.tree;
      }      
  });
  return TagTree;
});