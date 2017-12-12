//Current Password Tooltip
$('#current-password').tooltip({
    'trigger':'focus',
    'title': 'Enter your current password',
    'animation': 'true'
});

//New Password tooltip
$('#new-password').tooltip({
    'trigger': 'focus',
    'title': 'Password Must Contain: Atleast 6 characters, Uppercase, Lowercase'
});

//JQuery Validate Plugin
$(function() {
    $("form[name='change-password']").validate({
        rules: {
            currentPassword: {
                required: true,
                minlength: 1
            },
            newPassword: {
                required: true,
                minlength: 6,
                containsUppercase:  true,
                containsLowercase: true
            },
            confirmPassword: {
                required: true,
                minlength: 6,
                containsUppercase: true,
                containsLowercase: true,
                passwordMatch: true
            }
        },
        messages: {
            currentPassword: {
                required: "Please enter your current password",
                minlength: "Please enter your current password"
            },
            newPassword: {
                required: "Please enter your new password",
                minlength: "Your new password must be at least 6 characters"
            },
            confirmPassword: {
                required: "Please confirm your new password",
                minlength: "Your new password must be at least 6 characters"
            }
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
});

jQuery.validator.addMethod("containsUppercase", function(val, el) {
    if (val.match(/[A-Z]/)) {
        return true;
    }
    return false;
}, "Password must contain at least 1 uppercase character");

jQuery.validator.addMethod("containsLowercase", function(val, el) {
    if (val.match(/[a-z]/)) {
        return true;
    }
    return false;
}, "Password must contain at least 1 lowercase character");

jQuery.validator.addMethod("passwordMatch", function(val, el) {
    var newPassword = $('#new-password').val();
    var confirmPassword = val;

    if (newPassword === confirmPassword) {
        return true;
    }
    return false;
}, "Ensure both passwords match!");
