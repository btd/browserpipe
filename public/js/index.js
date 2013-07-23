$(function() {
	function error(msg){
		var $input = $('input[name=invite_email]');
		$input.parent('.control-group').addClass('error');
		$input.siblings('.help-inline').html(msg).removeClass('hide');
	}
	function showThanksBox(){
		$('#form_invitation').hide(); $('#thanks_box').show();
	}
	$('#form_invitation').on("submit", function(e){
		e.preventDefault();
		var jqxhr = $.post("/invitations", { email: $('input[name=invite_email]').val() }, function(res) {
		  if(res._id) showThanksBox();
		  else if(res.email) error("Please, enter a valid email.")
		  else error("An error has ocurred, please try again.")
		}, "json")
		.fail(function() { error("An error has ocurred, please try again."); })
	});
});