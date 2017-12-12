//Wait Unil DOM Has Loaded
$(document).ready(function() {
    //Validation Rules For Password Field
    $("#password").keyup(function() {
        var pass = $(this).val();
        var confirm = $("input[name='confirm']").val();

        var lengthFlag = false;
        var charFlag = false;
        var capitalFlag = false;
        var numFlag = false;

        //Validate Password Length
        if (pass.length < 8) {
            $('#length').removeClass('valid').addClass('invalid');
            lengthFlag = false;
        } else {
            $('#length').removeClass('invalid').addClass('valid');
            lengthFlag = true;
        }

        //Validate Letters
        if (pass.match(/[A-z]/)) {
            $('#letter').removeClass('invalid').addClass('valid');
            charFlag = true;
        } else {
		        $('#letter').removeClass('valid').addClass('invalid');
            charFlag = false;
        }

        //Validate Capital Letters
        if (pass.match(/[A-Z]/)) {
            $('#capital').removeClass('invalid').addClass('valid');
            capitalFlag = true;
        } else {
		        $('#capital').removeClass('valid').addClass('invalid');
            capitalFlag = false;
        }

        //Validate Numbers
        if (pass.match(/\d/)) {
            $('#number').removeClass('invalid').addClass('valid');
            numFlag = true;
		    } else {
            $('#number').removeClass('valid').addClass('invalid');
            numFlag = false;
	      }

        //Check Matching Passwords In-Case User Goes Back
        if (pass == confirm) {
            $('#match').removeClass('invalid').addClass('valid');
            matchFlag = true;
        } else {
            $('#match').removeClass('valid').addClass('invalid');
            matchFlag = false;
        }

        //Check If All Password Reqs Are Met
        if (lengthFlag && charFlag && capitalFlag && numFlag) {
            $('#pswd_info').hide();
            $('#password-icon').removeClass('invalid-icon').addClass('valid-icon');
        } else {
            $('#pswd_info').show();
            $('#password-icon').removeClass('valid-icon').addClass('invalid-icon');
        }
    }).blur(function() {
        if ($(this).val().length == 0) {
            $('#pswd_info').hide();
        }
    });

    //Validation Rules For Confirm Password Field
    $("#confirm").keyup(function() {
        var pass = $("input[name='password']").val();
        var confirm = $(this).val();

        if (pass == confirm) {
            $('#match').removeClass('invalid').addClass('valid');
            toggleValid("confirm-icon");
        } else {
            $('#match').removeClass('valid').addClass('invalid');
            toggleInvalid("confirm-icon");
        }
    }).focus(function() {
        $('#confirm_info').show();
    }).blur(function() {
        $('#confirm_info').hide();
    });

    //Validation For Email Field
    $('#email').keyup(function() {
        if(validEmail()) {
            $('#email_format').removeClass('invalid').addClass('valid');
            toggleValid("email-icon");
        } else {
            $('#email_format').removeClass('valid').addClass('invalid');
            toggleInvalid("email-icon");
        }
    }).focus(function() {
        $('#email_info').show();
    }).blur(function() {
        $('#email_info').hide();
    });

    //Validation For Username Field
    $('#username').keyup(function() {
        if (validUsername()) {
            toggleValid("username-icon");
        } else {
            toggleInvalid("username-icon");
        }
    });

    //Validation For Database Privilegs Field
    $('#database').on("mouseup", function() {
        if (validPrivileges()) {
            toggleValid("database-icon");
        } else {
            toggleInvalid("#database-icon");
        }
    });

    $('#role').on("mouseup", function() {
        if (validRole()) {
            toggleValid("role-icon");
        } else {
            toggleInvalid("role-icon");
        }
    });

    //Validation For Collections Field
    $('#collections').keyup(function() {
        if (validCollections()) {
            //$('#collection-icon').removeClass('invalid-icon').addClass('valid-icon');
            toggleValid("collection-icon");
        } else {
            //$('#collection-icon').removeClass('valid-icon').addClass('invalid-icon');
             toggleInvalid("collection-icon");
        }
    });

    //Listen For Key Up On All elements
    $("#username, #email, #password, #confirm, #database, #collections").keyup(function() {
        if (validUsername() && validEmail() && passMeetsReqs() && validPrivileges() && validCollections() && validRole()) {
            $('#button').removeAttr('disabled');
        } else if (!passMeetsReqs()) {
            $('#button').attr('disabled', 'true');
        } else {
             $('#button').attr('disabled', 'true');
        }
    });
});

function passMeetsReqs() {
    var pass = $("#password").val();
    var confirm = $("#confirm").val();
    var db = $('#database').val();
    var coll = $('#collections').val();

    //If Everything Is Validated Correctly
    if (pass.length >= 8 && pass.match(/[A-z]/) && pass.match(/[A-Z]/) && pass.match(/\d/) && pass == confirm && validUsername()) {
        return true;
    } else {
        return false;
    }
}

function validUsername() {
    var username = $('#username').val();
    //For now, just checks length.
    if (username.length > 0) {
        return true;
    } else {
        return false;
    }
}

function validEmail() {
    var email = $('#email').val();
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (regex.test(email) && email.length != 0) {
        return true;
    } else {
        return false;
    }
}

function validRole() {
    var role = (($('#role').val() == "") ? false : true);
    return role;
}

function validPrivileges() {
    var dbp = (($('#database').val() == "") ? false : true);
    return dbp;
}

function validCollections() {
    var coll = $('#collections').val();
    var result = ((coll.length > 0) ? true : false);
    return result;
}

function toggleValid(el) {
    var target = "#" + el;
    $(target).addClass('valid-icon').removeClass('invalid-icon');
}

function toggleInvalid(el) {
    var target = "#" + el;
    $(target).addClass('invalid-icon').removeClass('valid-icon');
}