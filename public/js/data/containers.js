define([
  'underscore',
  'backbone'
], function(_, Backbone) {
   var Containers = Backbone.Model.extend({  
      bookmarks: [
         {
            "title": "Daniel Fernandez (fernandezdaniel) | Trello",
            "url": "https://trello.com",
            "favicon": "https://trello.com/favicon.ico"
         },
         {
            "title": "Inbox (52) - fernandez.daniel@gmail.com - Gmail",
            "url": "https://gmail.com/",
            "favicon": "https://mail.google.com/mail/u/0/images/2/mail_icon_32.png"
         },
         {
            "title": "GitHub",
            "url": "https://github.com/",
            "favicon": "https://github.com/favicon.ico"
         },
         {
            "title": "danielfrndz / tagnfile.it  / source  /  — Bitbucket",
            "url": "https://bitbucket.org/danielfrndz/tagnfile.it/src",
            "favicon": "https://dwz7u9t8u8usb.cloudfront.net/m/f3ea6e8c054c/img/favicon.png"
         },
         {
            "title": "The largest professional network in the world | LinkedIn",
            "url": "https://www.linkedin.com/",
            "favicon": "https://s1-s.licdn.com/scds/common/u/img/favicon_v3.ico"
         },
         {
            "title": "Hacker News",
            "url": "http://news.ycombinator.com/",
            "favicon": "http://ycombinator.com/favicon.ico"
         },
         {
            "title": "TechCrunch",
            "url": "http://techcrunch.com/",
            "favicon": "http://s2.wp.com/wp-content/themes/vip/tctechcrunch2/images/favicon.ico?m=1310268748g"
         }
      ],
      getRandomBookmark: function(){
         var randomIndex = Math.floor(Math.random() * this.bookmarks.length);
         return _.clone(this.bookmarks[randomIndex]);
      },
      generateFakeContainer: function(key){
         var numberOfBookmarks = Math.floor(Math.random() * 50);
         var container = {
            name: key,
            bookmarks: []
         };
         for (var i = 0; i < numberOfBookmarks; i++) {
            container.bookmarks.push(this.getRandomBookmark());
         };
         return container;
      },
      getInitialFakeContainers: function() {
         var containers = [];
         containers.push(this.generateFakeContainer("read_later"));
         containers.push(this.generateFakeContainer("quick_launch"));
         containers.push(this.generateFakeContainer("favorites"));
         return containers;
      }      
  });
  return Containers;
});