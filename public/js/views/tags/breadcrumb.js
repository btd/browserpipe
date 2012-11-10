define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'data/tags',  
  'text!templates/tags/menu.drop.down.text'
], function($, _, Backbone, AppView, tagsData, templateDropDownTable){
  var TagsBreadCrumbView = AppView.extend({
    name: 'TagsBreadCrumbView',
    el: $("#tag-breadcrumb"),
    initializeView: function(){  
      this.tagTree  = (new tagsData()).getTags();      
      this.compiledtemplateDropDownTable = _.template(templateDropDownTable)
    },    
    //Main function to load a tag, it can receive the path directly. Lat temporal item of the full path always appears with dropdown dialog opened.
    loadTag: function(fullpath, item, index, temporal) {   
        var names = fullpath.split('.');
        //Calculate the tag path
        var path = '';    
        for (i = 0; i <= index; i++) {
            path = path + names[i] + (i != index ? '.' : '');
        }
        //Gets the tag name
        var name = names[index]; //Loads the dropdown
        var newIndex = index + 1;
        //Loads the dropdown dialog, only sets dropdown dialog opened when it is the last item of the fullpath        
        this.loadTagDropDown(name, path, item, index, names.length, (newIndex  == names.length?temporal:false), temporal)
        //Loads the remaining path
        if (names.length > newIndex && item.children) {
            //Looks in the tree for the next tag by name to load it
            for (childIndex in item.children) {
                if (item.children[childIndex].name == names[index + 1]) {        
                    this.loadTag(fullpath, item.children[childIndex], newIndex, temporal);
                    return;
                }
            }
        }
    }, 
    //Function to load the dropdown dialog            
    loadTagDropDown: function(name, path, item, index, total, opened, temporal) {
        //Gets all the breadcrumb not hidden
        var breadcrumb = $('#tag-breadcrumb').children(':not(.background)');
        //If the existen breadcrum is longer than the position of the new        
        if (breadcrumb.length > index){
            //if it exists
            if (jQuery.data(breadcrumb[index], 'path') == path){    
                //if it exits and comes opened, it should open
                if(opened){
                    $(breadcrumb[index]).children('.tag-dropdown-menu').css('display', 'block');
                } 
                //if it is the last and there is still breadcrumb, it should be removed            
                if(total == index + 1)
                    this.removeRemainingBreadCrumb(index + 1, breadcrumb, temporal)
                //nothing else todo        
                return
            }
            else { //if it is not the last one
                this.removeRemainingBreadCrumb(index, breadcrumb, temporal);
            }
        }
        //Appends the breadcrumb item
        var $tagDropdown = this.addBreadCrumb(name, path, index, temporal);
        //Appends the dropwdown
        this.addDropDown(item, path, $tagDropdown, opened);
    },
    //Function to remove all breadcrumbs that are not in the loaded path. If the navigation is temporal, then it only hides the breadcrumb    
    removeRemainingBreadCrumb: function(index, breadcrumb, temporal){
        for (i = index; i < breadcrumb.length; i++){
            var $breadcrumbChild = $(breadcrumb[i]);
            if(temporal && !$breadcrumbChild.hasClass('temporal'))
                $breadcrumbChild.addClass('background');
            else
                $breadcrumbChild.remove();
        }
    },
    //Function to add a new breadcrumb
    addBreadCrumb: function(name, path, index, temporal) {
        var _this = this;        
        if(name.length > 20) 
            name = this.shortString(name, 40);
        var $tagDropdown = $('<li class="tag-dropdown dropdown' + (temporal? ' temporal' : '') + '">' + '<a class="tag-menu" role="button" href="#">' + (index == 0 ? '<img width="16px" src="/img/tag.png" />' : name) + '</a></li>');
        $('#tag-breadcrumb').append($tagDropdown);
        var $tagMenu = $('.tag-menu', $tagDropdown);        
        //Saves the path in the breadcrumb li for future use
        jQuery.data($tagDropdown[0], 'path', path);
        //When a user clicks a breadcrumb it should load
        $tagMenu.click(function() {
            console.log('clicked $tagMenu');
            //On click always temporal tags turn permanent
            _this.updateTemporalTags();
            var path = jQuery.data($tagDropdown[0], 'path');
            _this.loadTag(path, _this.tagTree, 0, false);
            //Triggers the event that a tag is selected
            _this.trigger('TagSelected', path);
        });
        //Shows or hides dropwdown dialog for breadcrumb when the mouse is over or not.
        $tagDropdown.mouseover(function() {            
            //Shows dropdown
            $('.tag-dropdown-menu').css('display', 'none');
            var $tagDropdownMenu = $('.tag-dropdown-menu', $(this));           
            $tagDropdownMenu.css('display', 'block');            
        }).mouseleave(function() {
            var $tagDropdownMenu = $('.tag-dropdown-menu', $(this));          
            //Hides dropdown
            $tagDropdownMenu.css('display', 'none');
            //Triggers the event that it is hiding  the dropdown
            _this.trigger('HideDropDownMenu', $tagDropdownMenu);
        });
        return $tagDropdown;
    },
    shortString: function(str, n){
      return str.substr(0,n-1)+(str.length>n?'&hellip;':'');
    },
    //Function to add the dropdown dialog
    addDropDown: function(item, path, $tagDropdown, opened) {
        console.time('addDropDown timer');
        if (item.children && item.children.length > 0) {      
            //Position arrow of dropdown in the middle
            var arrowLeft = $('.tag-menu', $tagDropdown).width() / 2;      
            if(arrowLeft > 80)
                arrowLeft = 40;
            var $divDropdownMenu = $(this.compiledtemplateDropDownTable({opened: opened, arrowLeft: arrowLeft}));             


            $('.edit-tag', $divDropdownMenu).click(function() {                 
                //Slide edit tag
                $pageTagEdit = $('#page-tag-edit');
                if(!$pageTagEdit.hasClass("active")){
                    $('.active').removeClass("active").addClass("hidden");
                    $pageTagEdit.removeClass("hidden").addClass("active");
                }
            });


            var $table = $tagDropdown.append($divDropdownMenu).find('.tag-menu-items:first');
            var $tr = null;
            for (index in item.children) {
                if (index % 3 == 0) {
                    $tr = $('<tr></tr>');
                    $table.append($tr);
                }
                var childitem = item.children[index];
                var name = childitem.name;
                var hasChilds = (childitem.children != null && childitem.children.length > 0);
                var $td = $('<td class="tag-menu-item"><span class="name">' + name + '</span>' + (hasChilds?'<span class="arrow">...</span>':'') + '</td>');
                $tr.append($td);
                //Saves the path on the tag td of the dropwdown dialog
                jQuery.data($td[0], 'path', path + '.' + name);                      
                //Load click and mouse over/leave events for the tag
                this.prepareTagEvents($td, hasChilds);
            }
        }
        console.timeEnd('addDropDown timer');
    },
    prepareTagEvents: function($el, hasChilds) {
        var timeout = null;
        var _this = this;
        $('.name', $el).click(function() { 
            clearTimeout(timeout);
            //on click temporal tags turn permanent
            _this.updateTemporalTags();
            _this.showTag($el, false);
            //Triggers the event that a tag is selected            
            var path = jQuery.data($el[0], 'path');
            _this.trigger('TagSelected', path);            
        })
        //for tags with children, if the user stay a certain time in selector it shows children
        if(hasChilds)
            $('.arrow', $el).mouseover(function() {
                timeout = setTimeout(function() {            
                    _this.showTag($el, true);
                    //Triggers the event that it is showing the temporalTag
                    _this.trigger('ShowTemporalTag');
                }, 350);
            }).mouseleave(function() {
                clearTimeout(timeout);
            });
    },
    //Function to show and load a tag
    showTag: function(elem, temporal){
        $('.tag-dropdown-menu').css('display', 'none');
        var path = jQuery.data(elem[0], 'path');        
        this.loadTag(path, this.tagTree, 0, temporal);
    },        
    //Make temporal tags, not more temporal
    updateTemporalTags: function(){     
        $('.tag-dropdown.temporal').removeClass('temporal');
        $('.tag-dropdown.background').remove();
    },        
    //Remove temporal tags
    removeTemporalTags: function(){
        $('.tag-dropdown.temporal').remove();
        $('.tag-dropdown.background').removeClass('background');
    },
    renderView: function(){
      return this;
    },
    postRender: function(){
      var _this = this;
      //Captures clicks outside dropdown to close opened dropdown dialogs
      $('html').on('click.dropdown.data-api', function() {
          var $tagDropdownMenu = $('.tag-dropdown-menu');
          $tagDropdownMenu.css('display', 'none');
          //Triggers the event that it is hiding the dropdown
          _this.trigger('HideDropDownMenu', $tagDropdownMenu);
          if(!$('.tag-dropdown-menu').is(':visible')) 
                _this.removeTemporalTags();  
      });
      //Capures when user leaves the breadcrumb menu, to remove temporal breadcrumbs      
      $('#tag-breadcrumb').mouseleave(function() {
          if(!$('.tag-dropdown-menu').is(':visible')) 
                _this.removeTemporalTags();    
      });
      this.loadTag('T', this.tagTree, 0, false);
    },
    collapse: function(){
        this.loadTag('T', this.tagTree, 0, false);    
    }
  });
  return TagsBreadCrumbView;
});