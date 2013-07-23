
$(function() {
    var $input = $('input[name=invite_email]');

    var error = function(msg) {
        $input.parent('.control-group').addClass('error');
        $input.siblings('.help-inline').html(msg).removeClass('hide');
    };

    var showThanksBox = function() {
		$('#form_invitation').hide();
        $('#thanks_box').show();
	};

	$('#form_invitation').on("submit", function(e){
		e.preventDefault();

        var email = $input.val().trim();
        if(email && email.indexOf('@')) {
            $.post("/invitations", { email: email }, function(res) {
              if(res._id) showThanksBox();
              else if(res.email) error("Please, enter a valid email.")
              else error("An error has occurred, please try again.")
            }, "json")
            .fail(function() {
                error("An error has occurred, please try again.");
            });
        } else {
            error('Does it really email?');
        }
	});
});