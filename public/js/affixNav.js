$(document).ready(function(){

    $('#smallNav').prop('disabled', true);
    
    // When the affix feature is triggered (when we scroll down the page)
    $("#navigationb").on('affixed.bs.affix', function(){
        $('#mainStyle').prop('disabled', true);
        $('#smallNav').prop('disabled', false);
    });
    // Back to the original state (when we scroll back to the top of the page)
    $("#navigationb").on("affixed-top.bs.affix", function(){
        $('#mainStyle').prop('disabled', false);
        $('#smallNav').prop('disabled', true);
    });
});