//This is a fix to avoid auto selecting first item on boostrap typeahead
$.fn.typeahead.Constructor.prototype.render = function (items) {
	var that = this;
	items = $(items).map(function (i, item) {
	  i = $(that.options.item).attr('data-value', item);
	  i.find('a').html(that.highlighter(item));
	  return i[0];
	});

	this.$menu.html(items);
	return this;
};

$.fn.typeahead.Constructor.prototype.keyup = function (e) {
  switch(e.keyCode) {
    case 38: // up arrow
          e.preventDefault()
          this.prev()
          break
    case 40: // down arrow
      e.preventDefault()
      this.next()
      break
    case 9: // tab
      e.preventDefault()
      break
    case 13: // enter
      if (!this.shown) return
      this.select()
      break

    case 27: // escape
      if (!this.shown) return
      this.hide()
      break

    default:
      this.lookup()
  }

  e.stopPropagation()
  e.preventDefault()
};


$.fn.typeahead.Constructor.prototype.listen = function() {
  this.$element
    .on('blur',     $.proxy(this.blur, this))
    .on('keypress', $.proxy(this.keypress, this))
    .on('keyup',    $.proxy(this.keyup, this))
    .on('keydown',  $.proxy(this.keydownEl, this))  //Added the keydown for element

  if ($.browser.webkit || $.browser.msie) {
    this.$element.on('keydown', $.proxy(this.keydown, this))
  }

  this.$menu
    .on('click', $.proxy(this.click, this))
    .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
}

//When tab pressed on item it completes the input
$.fn.typeahead.Constructor.prototype.keydownEl = function (e) {
  switch(e.keyCode) {
    case 9: // tab
      if (!this.shown) return        
      e.preventDefault()
      var val = this.$menu.find('.active').attr('data-value')      
      this.$element.val(val)
      this.hide()
      break
  }
};