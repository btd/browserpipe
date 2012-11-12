define([
  'underscore',
  'backbone'
], function(_, Backbone) {
   var Tags = Backbone.Model.extend({   
      tags: {
         "root": {
            "name": "root",
            "isRoot" : true,
            "icon" : "/img/tag.png",
            "children":[
               {
                  "name":"administration"                 
               },
               {
                  "name":"books"                     
               },
               {
                  "name":"deployment"                 
               },
               {
                  "name":"design"                     
               },
               {
                  "name":"development"                 
               },
               {
                  "name":"entertainment"                     
               },
               {
                  "name":"managment"                 
               },
               {
                  "name":"personal"                     
               },
               {
                  "name":"projects"                 
               },
               {
                  "name":"startup"                     
               },
               {
                  "name":"tools"                 
               },
               {
                  "name":"useful_pages"                     
               },
               {
                  "name":"various"                     
               },
               {
                  "name":"wifi"                     
               }
            ]
         },
         "administration": { 
            "children":[
               {
                  "name":"java_metrics"                 
               },
               {
                  "name":"site_optimization"                     
               }
            ]
         },
         "administration.java_metrics": {},
         "administration.site_optimization": {},
         "books": {              
            "children":[
               {
                  "name":"to_be_bought"                     
               }
            ]
         },
         "books.to_be_bought": {},
         "deployment": {              
            "children":[
               {
                  "name":"debian"                 
               },               
               {
                  "name":"nginx"                     
               },
               {
                  "name":"osx"                     
               }
            ]
         },
         "deployment.debian": {                  
            "children":[
               {
                  "name":"java"                           
               },
               {
                  "name":"ssh"                           
               }
            ]
         },
         "deployment.debian.java": {},
         "deployment.debian.ssh": {},
         "deployment.nginx": {},
         "deployment.osx": {},
         "design": {              
            "children":[
               {
                  "name":"articles"                     
               },
               {
                  "name":"blogs"                     
               },
               {
                  "name":"testing long"
               },
               {
                  "name":"colors"                     
               },
               {
                  "name":"css"                     
               },
               {
                  "name":"discussions"                     
               }
            ]
         },
         "design.articles": {},
         "design.blogs": {},
         "design.testing long": {
            "children":[
               {
                  "name":"date_range_picker"           
               },
               {
                  "name":"buttons"                   
               }
            ]
         },
         "design.testing long.date_range_picker": {                            
            "children":[
               {
                  "name":"css3"                                 
               },
               {
                  "name":"components"                                 
               }
            ]
         },
         "design.testing long.css3": {},
         "design.testing long.date_range_picker.components": {},
         "design.testing long": {                            
            "children":[
               {
                  "name":"good"                                 
               },
               {
                  "name":"test"                                 
               }
            ]
         },
         "design.testing long.good": {},
         "design.testing long.test": {},
         "design.colors": {},
         "design.css": {},
         "design.discussions": {},
         "development": {},
         "entertainment": {},                         
         "managment": {},                         
         "personal": {},                              
         "projects": {},                               
         "startup": {},                               
         "tools": {},                                  
         "useful_pages": {},
         "various": {     
            "children":[
               {
                  "name":"java_metrics"                     
               },
               {
                  "name":"site_optimization"                     
               }
            ]
         },
         "various.java_metrics": {},
         "various.site_optimization": {},
         "wifi": {}
      },
      initialize: function(){
      },
      getRoot: function(){
         var tag = this.tags["root"];
         tag.path = "";
         return tag;
      },
      getTag: function(path){
        var tag = this.tags[path];
        var names = path.split('.');
        //Calculate the tag path
        tag.path = '';    
        var  i = 0;
        for (;i < names.length - 1; i++) {
            tag.path = (tag.path!=""?tag.path + ".":"") + names[i];
        }
        //Gets the tag name
        tag.name = names[i];
        tag.isRoot = false;
         return tag;
      },
      getTags: function() {
         return this.tags;
      }      
  });
  return Tags;
});