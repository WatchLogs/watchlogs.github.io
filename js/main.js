$(document).ready(function(){
    //$(".pop-up").popUp("open");
    //$("div.pop-up#first").on('popUp:beforeOpen', function ( e, app ) {});
    //$(".slide-show").slideShow();
    //$(".hint").hint();
    //$(".carousel").carousel();
    //$("select.custom-select").customSelect();
    //$("input.custom-checkbox").customCheckbox();
    //$("input.custom-radio-button").customRadioButton();
    //$("div.tabs:first").tabs();
    //$("input.custom-file-select").customFileSelect();
    //$.preLoader('show');

    $('.pop-up.active').popUp("open");
    $(document).on('click', "a.pop-up, button.pop-up", function(e){
        e.preventDefault();
        if ( $(this).hasClass('disabled') ) return;

        var target = $( $(this).attr("href") );
        if ( ! target.length ) return;

        target.popUp("open");
    });

    $(".pages").onepage_scroll({
        sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
        easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
                                         // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
        animationTime: 500,             // AnimationTime let you define how long each section takes to animate
        pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
        updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
        beforeMove: function(index) {},  // This option accepts a callback function. The function will be called before the page moves.
        afterMove: function(index) {
            if ( index == 1 ) {
                $('ul.onepage-pagination').addClass('blue');
            } else {
                $('ul.onepage-pagination').removeClass('blue');
            }
        },   // This option accepts a callback function. The function will be called after the page moves.
        loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
        keyboard: true,                  // You can activate the keyboard controls
        responsiveFallback: false,        // You can fallback to normal page scroll by defining the width of the browser in which
        // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
        // the browser's width is less than 600, the fallback will kick in.
        direction: "vertical"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
    });

    $('ul.onepage-pagination').addClass('blue');

    $(".pages").changeOpts({ animationTime: 0 });
    $(".pages").moveTo( 2 );
    $(".pages").changeOpts({ animationTime: 500 });

    $('a.switch-page').click(function(e){
        e.preventDefault();
        $(".pages").moveTo( $(this).attr('data-index') );
    });

    imagesLoaded( $('body'), function( instance ) {
        $(".pages section").each(function(){
            $('.content', this).css({
                "margin-top": "-" + $('.content', this).actual('innerHeight') / 2 + "px",
                "margin-left": "-" + $('.content', this).actual('innerWidth') / 2 + "px"
            });
            scaleContainer( $('.content', this) );
        });
    });

    $(window).resize(function(){
        $(".pages section").each(function(){
            $('.content', this).css({
                "margin-top": "-" + $('.content', this).actual('innerHeight') / 2 + "px",
                "margin-left": "-" + $('.content', this).actual('innerWidth') / 2 + "px"
            });
            scaleContainer( $('.content', this) );
        });
    });

    function scaleContainer( el ) {
        var windowHeight = $(window).height();
        var scaleElementHeight = el.height();
        var scale = 1;

        if ( windowHeight < (scaleElementHeight + 30) ) {
            scale = Math.min(  windowHeight / (scaleElementHeight + 30) );
        }
        el.css({
            '-webkit-transform' : 'scale(' + scale + ')',
            '-moz-transform'    : 'scale(' + scale + ')',
            '-ms-transform'     : 'scale(' + scale + ')',
            '-o-transform'      : 'scale(' + scale + ')',
            'transform'         : 'scale(' + scale + ')'
        });
    }

});
