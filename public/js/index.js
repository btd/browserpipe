
$(function() {
    var $input1 = $('input[name=invite_email]');
    var $input2 = $('input[name=invite_email2]');

    var error = function($input, msg) {
        $input.parent('.control-group').addClass('error');
        $input.siblings('.help-inline').html(msg).removeClass('hide');
    };

    var showThanksBox = function() {
		$('#form_invitation').hide();
        $('#form_invitation2').hide();
        $('#thanks_box').show();
        $('#thanks_box2').show();
	};

    var postInvitation = function(email, $input){
        if(email && email.indexOf('@')) {
            $.post("/invitations", { email: email }, function(res) {
              if(res._id) showThanksBox();
              else if(res.email) error($input, "Please, enter a valid email.")
              else error($input, "An error has occurred, please try again.")
            }, "json")
            .fail(function() {
                error($input, "An error has occurred, please try again.");
            });
        } else {
            error($input, 'Please, enter a valid email.');
        }
    }

	$('#form_invitation').on("submit", function(e){
		e.preventDefault();
        var email = $input1.val().trim();
        postInvitation(email, $input1);
	});

    $('#form_invitation2').on("submit", function(e){
        e.preventDefault();
        var email = $input2.val().trim();
        postInvitation(email, $input2);
    });
});