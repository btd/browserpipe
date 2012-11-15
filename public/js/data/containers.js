define([
  'underscore',
  'backbone',
  'data/tags'
], function(_, Backbone, tagsData) {
   var Containers = Backbone.Model.extend({  
      items: [
         {
            "title": "Daniel Fernandez (fernandezdaniel) | Trello",
            "url": "https://trello.com",
            "favicon": "https://trello.com/favicon.ico",
            "description": "This is a description and can go whatever you want about this site. Is actually really cool to be able to describe it.",
            "screenshot": "/img/temp/trello.png",
            "tags": ["tools.organization.task", "startup.tools"],
            "created": "2 Nov 2012"
         },
         {
            "title": "Inbox (52) - fernandez.daniel@gmail.com - Gmail",
            "url": "https://gmail.com/",
            "favicon": "https://mail.google.com/mail/u/0/images/2/mail_icon_32.png",
            "description": "This is a description and can go whatever you want about this site. Is actually really cool to be able to describe it.",
            "screenshot": "/img/temp/gmail.png",
            "tags": ["examples.web.single_page_applications", "startup.tools", "google.applications"],
            "created": "23 Oct 2012"
         },
         {
            "title": "GitHub",
            "url": "https://github.com/",
            "favicon": "https://github.com/favicon.ico",
            "description": "This is a description and can go whatever you want about this site. Is actually really cool to be able to describe it.",
            "screenshot": "/img/temp/github.png",
            "tags": ["cool.sites" , "tools.repositories", "sites.well_designed"],
            "created": "3 Dic 2012"
         },
         {
            "title": "danielfrndz / tagnfile.it  / source  /  — Bitbucket",
            "url": "https://bitbucket.org/danielfrndz/tagnfile.it/src",
            "favicon": "https://dwz7u9t8u8usb.cloudfront.net/m/f3ea6e8c054c/img/favicon.png",
            "description": "This is short sentence.",
            "screenshot": "/img/temp/bitbucket.png",
            "tags": ["tools.repositories"],
            "created": "11 Jan 2012"
         },
         {
            "title": "The largest professional network in the world | LinkedIn",
            "url": "https://www.linkedin.com/",
            "favicon": "https://s1-s.licdn.com/scds/common/u/img/favicon_v3.ico",
            "description": "This is short sentence.",
            "screenshot": "/img/temp/linkedin.png",
            "tags": ["cool.sites", "tools.network"],
            "created": "1 Oct 2012"
         },
         {
            "title": "Hacker News",
            "url": "http://news.ycombinator.com/",
            "favicon": "http://ycombinator.com/favicon.ico",
            "description": "This is short sentence.",
            "screenshot": "/img/temp/yc.png",
            "tags": ["news", "startup.incubator"],
            "created": "9 Jul 2012"
         },
         {
            "title": "TechCrunch",
            "url": "http://techcrunch.com/",
            "favicon": "http://s2.wp.com/wp-content/themes/vip/tctechcrunch2/images/favicon.ico?m=1310268748g",
            "description": "This is short sentence.",
            "screenshot": "/img/temp/techcrunch.png",
            "tags": ["news"],
            "created": "25 Oct 2012"
         }
      ],
      initialize: function(){
         this.fakeTagsData  = new tagsData();    
      },
      getRandomItem: function(){
         var randomIndex = Math.floor(Math.random() * this.items.length);
         return _.clone(this.items[randomIndex]);
      },
      generateFakeContainer: function(type, key){
         var numberOfItems = Math.floor(Math.random() * 50);
         var container = {
            name: key,
            type: type,
            items: []
         };
         if(type == "tag")
            container.tag = this.fakeTagsData.getTag(key);
         for (var i = 0; i < numberOfItems; i++) {
            container.items.push(this.getRandomItem());
         };
         return container;
      },
      getInitialFakeContainers: function() {
         var containers = [];
         containers.push(this.generateFakeContainer("tag", "Read Later"));
         containers.push(this.generateFakeContainer("tag", "Quick Launch"));
         containers.push(this.generateFakeContainer("tag", "Favourites"));
         return containers;
      }      
  });
  return Containers;
});