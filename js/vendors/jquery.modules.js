/*
 * POP-UP PLUGIN
 * Author: 
 * Licensed under the MIT license
 */
;(function ( $ ) {

    $.popUp = function ( el, action, options ) {
        var app = this;
        app.$el = $(el);
        app.$body = $('body');
        app.el = el;

        app.init = function () {
            app.options = $.extend({}, $.popUp.defaultOptions, options);

            /* BIND CLOSE BUTTON */
            app.$el.find(".close").click(function(){
                app.close();
            });

            if ( app.options.closeOnEscape ) {
                $(document).keyup(function(e){ if (e.keyCode == 27) app.close(); });
            }

            app.$el.click(function(e){
                if ( $(e.target).closest(".inner").length ) return;
                app.close();
            });

            // SCROLLBAR
            app.originalBodyPad = document.body.style.paddingRight || '';
            app.scrollbarWidth = app.measureScrollBar();
        };

        app.open = function() {
            app.$el.trigger( "popUp:beforeOpen", app );
            app.centering();

            app.setScrollBar();
            app.$body.addClass("pop-up-open");

            app.$el.stop(true, false).fadeIn( app.options.openAnimationDuration, function () {
                app.$el.trigger( "popUp:afterOpen", app );
                app.$el.addClass("active");
            });

            app.$el.addClass('in');
        };

        app.close = function() {
            app.$el.trigger( "popUp:beforeClose", app );

            app.$el.stop(true, false).fadeOut( app.options.closeAnimationDuration, function (){
                app.$el.trigger( "popUp:afterClose", app );
                app.$el.removeClass("active");

                app.resetScrollBar();
                app.$body.removeClass("pop-up-open");

                if (app.options.clearHashAfterClose) {
                    window.location.hash = "#/";
                }
            });

            app.$el.removeClass('in');
        };

        app.setScrollBar = function () {
            var bodyPad = parseInt((app.$body.css('padding-right') || 0), 10);
            app.originalBodyPad = document.body.style.paddingRight || '';
            app.$body.css('padding-right', bodyPad + app.scrollbarWidth);
        };

        app.resetScrollBar = function () {
            app.$body.css('padding-right', app.originalBodyPad);
        };

        app.measureScrollBar = function () {
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'pop-up-scrollBar-measure';
            app.$body.append(scrollDiv);
            var scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            app.$body[0].removeChild(scrollDiv);
            return scrollBarWidth;
        };

        app.centering = function() {
            if ( app.options.centeringVertical )
                app.$el.find(".inner").css({
                    "margin-top": "-" + (app.$el.find(".inner").actual('innerHeight') / 2) + "px"
                });

            if ( app.options.centeringHorizontal )
                app.$el.find(".inner").css({
                    "margin-left": "-" + (app.$el.find(".inner").actual('innerWidth') / 2) + "px"
                });
        };

        var target = app.$el.data().popUp;
        if ( typeof target == 'undefined' ) {
            app.init();
            app.$el.data( "popUp" , app );
        } else {
            app = target;
        }

        if (action == "open") {
            app.open();

            if ( app.options.autoClose )
                setTimeout( app.close, app.options.autoCloseDelay );
        }
        else if (action == "close") {
            app.close();
        }
    };

    $.popUp.defaultOptions = {
        openAnimationDuration: 500,
        closeAnimationDuration: 500,
        closeOnEscape: true,
        centeringVertical: false,
        centeringHorizontal: false,
        autoClose: false,
        autoCloseDelay: 3000,
        clearHashAfterClose: false
    };

    $.fn.popUp = function( action, options ) {
        return this.each(function() {
            (new $.popUp(this, action, options))
        });
    };

})( jQuery );

/*
 * CAROUSEL PLUGIN
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {

    $.carousel = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "carousel" , app );

        app.init = function () {
            app.options = $.extend({}, $.carousel.defaultOptions, options);
            app.slides = app.$el.find("ul.slides");
            app.controls = app.$el.find("div.controls");

            /* */
            app.slides.find("li:lt(3)").addClass("active");

            //app.controls.find("ul li a").click();
            app.controls.find("a.next").click(function(e){
                e.preventDefault();
                console.log(app.getNextPageSlides())
                app.switchSlides( app.getNextPageSlides() );
            });

            app.controls.find("a.prev").click(function(e){
                e.preventDefault();
                console.log(app.getPrevPageSlides())
                app.switchSlides( app.getPrevPageSlides() );
            });
        };

        app.switchSlides = function(slides){
            app.slides.find("li.active").stop(true, true).fadeOut(0, function(){
                $(this).removeClass("active");
                slides.fadeIn(600, function(){
                    slides.addClass("active");
                });
            });
        };

        app.getPrevPageSlides = function(){
            var firstActive = app.slides.find("li.active").first();
            if (firstActive.prev().length)
                return firstActive.prevAll(":lt(3)");
            else
                return app.slides.find("li").slice(-3);
        };

        app.getNextPageSlides = function(){
            var lastActive = app.slides.find("li.active").last();
            if (lastActive.next().length)
                return lastActive.nextAll(":lt(3)");
            else
                return app.slides.find("li:lt(3)");
        };

        app.init();
    };

    $.carousel.defaultOptions = { };

    $.fn.carousel = function( options ) {
        return this.each(function() {
            (new $.carousel(this, options))
        });
    };

})( jQuery );

/*
 * HINT PLUGIN
 * Author: 
 * Licensed under the MIT license
 */
;(function ( $ ) {
    $.hint = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "hint" , app );

        app.init = function () {
            app.options = $.extend({}, $.hint.defaultOptions, options);
            app.hint = $("<div class='hint-inner'>" + app.$el.attr( app.options.selectAttr ) + "</div>");
            if (typeof app.$el.attr( app.options.selectAttr ) == "undefined") return;
            app.$el.removeAttr(app.options.selectAttr);

            /* */
            if ( app.options.event == 'hover' ) {
                app.$el.mouseenter(function(){
                    app.showHint();
                });

                app.$el.mouseleave(function(){
                    app.hideHint();
                });
            } else if ( app.options.event == 'click' ) {
                app.$el.click(function(){
                    if ( app.$el.hasClass('active') ) {
                        app.hideHint();
                    } else {
                        app.showHint();
                    }
                });
                app.hint.click(function(){
                    app.hint.css({ 'z-index': app.getVisibleHintPosition() + 1 });
                });
            }
        };

        app.showHint = function() {
            $("body").prepend( app.hint );
            app.hint.addClass(app.options.position);

            app.top = app.$el.offset().top;
            app.left = app.$el.offset().left;
            app.width = app.$el.width();
            app.height = app.$el.height();
            app.hintWidth = app.hint.actual('innerWidth');
            app.hintHeight = app.hint.actual('innerHeight');
            if ( app.getVisibleHintPosition() == 0 ) {
                app.zIndex = $('.hint-inner').length + 1000;
            } else {
                app.zIndex = app.getVisibleHintPosition() + 1;
            }

            app.hint.stop(false, true);
            app.$el.addClass('active');

            if ( app.options.position == 'top' ) {
                app.hint.css({
                    top: app.top - app.hintHeight - app.options.offset,
                    left: app.left + app.width/2 - app.hintWidth/2
                });
            } else if ( app.options.position == 'left' ) {
                app.hint.css({
                    top: app.top + app.height/2 - app.hintHeight/2,
                    left: app.left - app.hintWidth - app.options.offset
                });
            } else if ( app.options.position == 'right' ) {
                app.hint.css({
                    top: app.top + app.height/2 - app.hintHeight/2,
                    left: app.left + app.width + app.options.offset
                });
            } else if ( app.options.position == 'bottom' ) {
                app.hint.css({
                    top: app.top + app.height + app.options.offset,
                    left: app.left + app.width/2 - app.hintWidth/2
                });
            }

            app.hint.css({ 'z-index': app.zIndex });
            app.hint.fadeIn( app.options.fadeInSpeed );
        };

        app.hideHint = function() {
            app.$el.removeClass('active');
            app.hint
                .stop(false, true)
                .fadeOut( app.options.fadeOutSpeed , function(){
                    app.hint.remove();
                });
        };

        app.getVisibleHintPosition = function() {
            var hints = $('.hint-inner');
            var index = 0;

            hints.each(function(){
                if ( Number($(this).css('z-index')) > index ) {
                    index = Number($(this).css('z-index'));
                }
            });
            return index;
        };

        app.init();
    };

    $.hint.defaultOptions = {
        selectAttr: "title",
        position: "top",
        event: "hover",
        offset: 0,
        fadeInSpeed: 200,
        fadeOutSpeed: 200
    };

    $.fn.hint = function( options ) {
        return this.each(function() {
            (new $.hint(this, options))
        });
    };

})( jQuery );

/*
 * CUSTOM SELECT PLUGIN
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {

    $.customSelect = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "customSelect" , app );

        app.customSelect = $('<div class="custom-select"><a href="#"></a><ul></ul><input type="hidden" /></div>');
        app.activeItem = app.customSelect.find("a");
        app.itemsList = app.customSelect.find("ul");
        app.hiddenInput = app.customSelect.find('input[type="hidden"]');

        app.init = function () {
            app.options = $.extend({}, $.customSelect.defaultOptions, options);

            app.renderSelect();

            app.activeItem.click(function(e){
                e.preventDefault();
                if ( app.customSelect.attr("disabled") ) return;
                if ( app.customSelect.hasClass('disabled') ) return;
                app.displayListItems();
            });
            app.itemsList.find("li").click(function(){
                app.selectItem($(this).text(), $(this).data("value"));
                app.displayListItems();
            });
            $('body').click(function(e){
                if ( app.customSelect.hasClass('active') ) {
                    if ( ! $(e.target).closest(app.customSelect).length ) {
                        app.displayListItems();
                    }
                }
            });

            if (app.options.width != "auto") {
                app.setSelectWidth(app.options.width);
            }
        };

        app.renderSelect = function(){
            app.hiddenInput.attr({
                id: app.$el.attr("id"),
                name: app.$el.attr("name"),
                class: app.$el.attr("class")
            });

            if ( app.$el.find("option[selected]").length ) {
                app.selectItem( app.$el.val(), app.$el.val() );
            } else {
                app.activeItem.html(app.options.defaultValue);
            }

            var newItem = "";
            app.$el.find("option").each(function(){
                newItem = $("<li>" + $(this).text() + "</li>");

                if ( $(this).attr("selected") ) {
                    newItem.addClass("active");
                }
                if ( $(this).attr("value") ) {
                    newItem.attr( "data-value", $(this).attr("value") );
                }
                else {
                    newItem.attr( "data-value", $(this).val() );
                }
                app.itemsList.append(newItem);
            });

            app.$el.after(app.customSelect);
            app.$el.remove();
        };

        app.displayListItems = function() {
            if( app.itemsList.is(':hidden') ) {
                app.customSelect.addClass('active');
                app.itemsList.slideDown( app.options.slideDownSpeed );
            } else {
                app.itemsList.slideUp( app.options.slideUpSpeed, function(){
                    app.customSelect.removeClass('active');
                });
            }
        };

        app.selectItem = function( text, value ) {
            app.activeItem.text( text );
            app.hiddenInput.val( value ).change();
        };

        app.setSelectWidth = function(width) {
            app.customSelect.css("width", width);
        };

        app.init();
    };

    $.customSelect.defaultOptions = {
        slideUpSpeed: 200,
        slideDownSpeed: 200,
        defaultValue: 'Выберите',
        width: "auto"
    };

    $.fn.customSelect = function( options ) {
        return this.each(function() {
            (new $.customSelect(this, options))
        });
    };

})( jQuery );


/*
 * SLIDE SHOW PLUGIN
 * Author: 
 * Licensed under the MIT license
 */
;(function ( $ ) {

    $.slideShow = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "slideShow" , app );

        app.init = function () {
            app.options = $.extend({}, $.slideShow.defaultOptions, options);
            app.slides = app.$el.find("ul.slides");
            app.controls = app.$el.find("div.controls");
            app.activeSlide = app.slides.find("li.active");

            /* auto play */
            if (app.options.autoPlay) {
                app.timer = setInterval(function(){
                    if ( ! app.$el.hasClass("animated") )
                        app.changeSlide( app.getNextSlide() );
                }, app.options.autoPlayDelay);

                app.$el.mouseenter(function(){
                    clearInterval(app.timer);
                });

                app.$el.mouseleave(function(){
                    app.timer = setInterval(function(){
                        if ( ! app.$el.hasClass("animated") )
                            app.changeSlide( app.getNextSlide() );
                    }, app.options.autoPlayDelay);
                });
            }

            /* clicks functions */
            app.controls.find("ul li a").click(function(e){
                e.preventDefault();
                if ( $(this).parent("li").hasClass("active") ) return;
                app.changeSlide(app.slides.find("li[data-slide-id=" + $(this).data("change-slide") + "]"));
            });
            app.controls.find("a.next").click(function(e){
                e.preventDefault();
                app.changeSlide( app.getNextSlide() );
            });
            app.controls.find("a.prev").click(function(e){
                e.preventDefault();
                app.changeSlide( app.getPrevSlide() );
            });
        };

        app.changeSlide = function(slide) {
            app.$el.addClass("animated");

            // CONTROLS
            app.controls.find("ul li a[data-change-slide=" + slide.data("slide-id") + "]").parent("li")
                .addClass("active").siblings("li").removeClass("active");

            //SLIDES
            app.slides.find("li").stop(true, true)
                .filter(".active").fadeOut( app.options.fadeInSpeed, function(){
                    app.activeSlide.removeClass("active");
                    slide.fadeIn( app.options.fadeOutSpeed, function(){
                        slide.addClass("active");
                        app.activeSlide = slide;
                        app.$el.removeClass("animated");
                    });
                });
        };
        app.getNextSlide = function() {
            if ( app.activeSlide.next().length ) {
                return app.activeSlide.next();
            } else {
                return app.slides.find("li").first();
            }
        };
        app.getPrevSlide = function() {
            if ( app.activeSlide.prev().length ) {
                return app.activeSlide.prev();
            } else {
                return app.slides.find("li").last();
            }
        };

        app.init();
    };

    $.slideShow.defaultOptions = {
        fadeInSpeed: 200,
        fadeOutSpeed: 200,
        autoPlay: false,
        autoPlayDelay: 600
    };

    $.fn.slideShow = function( options ) {
        return this.each(function() {
            (new $.slideShow(this, options))
        });
    };

})( jQuery );

/*
 * CUSTOM CHECKBOX PLUGIN
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {

    $.customCheckbox = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "customCheckbox" , app );

        app.$el.wrap('<div class="custom-checkbox"></div>');
        app.container = app.$el.parent(".custom-checkbox");
        if ( app.$el.is(":checked") ) app.container.addClass("checked");
        if ( app.$el.is(":disabled") ) app.container.addClass("disabled");

        app.init = function () {
            app.options = $.extend({}, $.customCheckbox.defaultOptions, options);

            app.container.click(function(){
                if ( app.$el.is(":disabled") ) return false;
                if ( app.$el.hasClass('disabled') ) return;
                app.container.toggleClass("checked");
                app.$el.prop('checked', function(idx, oldProp) {
                    return !oldProp;
                });
                if (typeof app.options.afterChecked == 'function') { app.options.afterChecked.call( app, app); }
            });

            $("label[for='" + app.$el.attr("id") + "']").click(function(e){
                e.preventDefault();
                app.container.click();
            });

            app.$el.change(function() {
                if (app.$el.is(':checked')) app.container.addClass('checked');
                else app.container.removeClass('checked');
            });
        };

        app.init();
    };

    $.customCheckbox.defaultOptions = {
        afterChecked: null
    };

    $.fn.customCheckbox = function( options ) {
        return this.each(function() {
            (new $.customCheckbox(this, options))
        });
    };

})( jQuery );

/*
 * CUSTOM RADIO BUTTON PLUGIN
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {

    $.customRadioButton = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "customRadioButton" , app );

        app.$el.wrap('<div class="custom-radio-button"></div>');
        app.container = app.$el.parent(".custom-radio-button");
        if ( app.$el.is(":checked") ) app.container.addClass("checked");
        if ( app.$el.is(":disabled") ) app.container.addClass("disabled");

        app.init = function () {
            app.options = $.extend({}, $.customRadioButton.defaultOptions, options);

            app.container.click(function(){
                if ( app.$el.is(":disabled") ) return false;
                if ( app.$el.hasClass('disabled') ) return;
                app.$el.change();
            });

            app.$el.change(function() {
                $("input[type=radio][name='" + app.$el.attr("name") + "']").parent("div").removeClass("checked");
                app.container.toggleClass("checked");
                app.$el.prop('checked', function(idx, oldProp) {
                    return !oldProp;
                });
            });
        };

        app.init();
    };

    $.customRadioButton.defaultOptions = { };

    $.fn.customRadioButton = function( options ) {
        return this.each(function() {
            (new $.customRadioButton(this, options))
        });
    };

})( jQuery );

/*
 * TABS PLUGIN
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {

    $.tabs = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "tabs" , app );

        app.init = function () {
            app.options = $.extend({}, $.tabs.defaultOptions, options);
            app.$nav = $('main>nav');
            app.$activeMenuItem = $('li.active', app.$nav);

            /* */
            if ( app.options.arrowsNavigation )
                $(document).keyup(function(e){
                    if (e.keyCode == 39) {
                        app.switchTab( '#' + app.getNextTab().attr('id') );
                    } else if (e.keyCode == 37) {
                        app.switchTab( '#' + app.getPreviousTab().attr('id') );
                    }
                });

            app.$el.find(".switch-tab").click(function(e){
                e.preventDefault();
                if ( $(this).hasClass('disabled') ) return;

                if ( app.$nav.length ) {
                    app.activeMenuItem = $("li a[href='#page/" + $(this).attr("href") + "']", app.$nav).parent("li");
                    app.activeMenuItem.addClass("active").siblings().removeClass("active");
                    $("a.switch-tab", app.$nav).removeClass("active");
                    $("a.switch-tab", app.activeMenuItem).addClass("active");
                }

                app.switchTab( $(this).attr("href") );
            });
        };

        app.getPreviousTab = function(){
            if ( app.$el.find("section.active").prev().length ) {
                return app.$el.find("section.active").prev();
            } else {
                return app.$el.find("section").last();
            }
        };

        app.getNextTab = function(){
            if ( app.$el.find("section.active").next().length ) {
                return app.$el.find("section.active").next();
            } else {
                return app.$el.find("section").first();
            }
        };

        app.switchTab = function( tabId ){
            app.currentTab = tabId;
            if (typeof app.options.beforeSwitch == 'function') { app.options.beforeSwitch.call(app, app); }

            app.activeMenuItem = $("li a[href='#page/" + tabId.attr('id').split('page')[1] + "']", app.$nav).parent("li");
            app.activeMenuItem.addClass("active").siblings().removeClass("active");

            if (app.currentTab.hasClass('gray')) {
                app.$nav.addClass('dark');
            } else {
                app.$nav.removeClass('dark');
            }

            $('body').css({
                'background': $("section.active", app.$el).css('background-color'),
                'overflow': 'hidden'
            });

            var target = app.$el.find( tabId );
            app.$el.find(">section").stop(true, true)
                .filter("section.active").fadeOut( app.options.fadeOutSpeed , function(){
                    $(this).removeClass("active");
                    target.fadeIn( app.options.fadeInSpeed , function(){
                        target.addClass("active");

                        $('body').css({
                            'overflow': 'auto'
                        });

                        if (typeof app.options.afterSwitch == 'function') { app.options.afterSwitch.call( app, app); }
                    });
                });
        };

        app.init();
    };

    $.tabs.defaultOptions = {
        fadeInSpeed: 200,
        fadeOutSpeed: 200,
        beforeSwitch: false,
        afterSwitch: false,
        arrowsNavigation: false
    };

    $.fn.tabs = function( options ) {
        return this.each(function() {
            (new $.tabs(this, options))
        });
    };

})( jQuery );

/*
 * FILE SELECT
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {
    $.customFileSelect = function ( el, options ) {
        var app = this;
        app.el = el;
        app.$el = $(el);
        app.container = $(el).wrap("<div class='custom-file-select'>").parent();

        app.init = function () {
            app.options = $.extend({}, $.customFileSelect.defaultOptions, options);
            app.container.prepend("<button>" + app.options.buttonText + "</button>");
            app.container.append("<div class='status-container'></div>");

            app.button = app.container.find("button");
            app.status = app.container.find('.status-container');

            /* */
            app.button.click(function(e){
                e.preventDefault();
                app.$el.val(''); // Bug fix for chrome
                app.$el.click();
            });

            app.$el.change(function(){
                if ( app.el.files && app.el.files[0] ) {
                    if ( app.el.files[0].type.match('image.*') ) {
                        if ( app.options.showStatus ) app.status.html(app.el.files[0].name);

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            app.$el.trigger( "fileSelect:afterSelect", [app, e.target.result, app.getFilesData()] );
                        };
                        reader.readAsDataURL(app.el.files[0]);
                    }
                    else {
                        app.$el.trigger( "fileSelect:wrongFileType", app );
                        if ( app.options.showStatus )
                            app.status.html('Данный файл не является изображением.');
                    }
                }
                else {
                    if ( app.options.showStatus )
                        app.status.html('Ошибка загрузки изображения');
                }
            });
        };

        app.getFilesData = function(){
            var data = new FormData();
            $.each(app.el.files, function(key, value) {
                data.append(key, value);
            });
            return data;
        };

        app.init();
    };

    $.customFileSelect.defaultOptions = {
        buttonText: "Выберите изображение",
        showStatus: true
    };

    $.fn.customFileSelect = function( options ) {
        return this.each(function() {
            (new $.customFileSelect(this, options))
        });
    };

})( jQuery );

/*
 * PRELOADER PLUGIN
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {

    $.preLoader = function ( method, options, el ) {
        var app = this;
        app.options = $.extend({}, $.preLoader.defaultOptions, options);
        app.template = $('<div class="pre-loader"><span></span></div>');

        if ( typeof el == 'undefined' ) {
            app.$el = $('body');
        } else {
            app.$el = $(el);
        }

        app.init = function () {
            app.fps = Math.round(100 / app.options.speed);
            app.secondsBetweenFrames = 1 / app.fps;
            app.framePosition = 0;
            app.currentFrameIndex = 0;
            app.timer = false;

            if ( method == 'show' ) {
                app.show();
            } else if ( method == 'hide' ) {
                app.hide();
            }
        };

        app.animate = function(){
            app.framePosition += app.frameWidth;
            app.currentFrameIndex += 1;

            if (app.currentFrameIndex >= app.options.totalFrames) {
                app.framePosition = 0;
                app.currentFrameIndex = 0;
            }

            app.frame.css({
                backgroundPosition: (-app.framePosition)+'px 0'
            });
        };

        app.show = function(){
            app.createPreLoader();
            app.timer = setInterval(app.animate, app.secondsBetweenFrames * 1000);
            app.container.stop(true, false).fadeIn( app.options.openAnimationDuration );
        };

        app.hide = function(){
            if ( typeof app.container == 'undefined' ) return;
            app.container.stop(true, false).fadeOut( app.options.closeAnimationDuration, function (){
                clearInterval(app.timer);
                app.deletePreLoader();
            });
        };

        app.createPreLoader = function(){
            app.container = app.template.prependTo( app.$el );
            app.frame = $('span', app.container);
            app.frameWidth = app.frame.width();

            if ( typeof el != 'undefined' ) {
                app.$el.css({
                    'position': 'relative'
                });

                app.container.css({
                    'top': app.$el.scrollTop()
                });

            }
        };

        app.deletePreLoader = function(){
            app.container.remove();
            app.$el.data( "preLoader", false );
        };

        var target = app.$el.data().preLoader;
        if ( typeof target == 'undefined' || target == false ) {
            app.init();
            app.$el.data( "preLoader", app );
        } else {
            if ( method == 'hide' ) {
                target.hide();
            }
        }
    };

    $.preLoader.defaultOptions = {
        speed: 9,
        totalFrames: 12,
        openAnimationDuration: 300,
        closeAnimationDuration: 300
    };

    $.fn.preLoader = function( method, options ) {
        return this.each(function() {
            (new $.preLoader(method, options, this))
        });
    };

})( jQuery );

/*
 * NEW PLUGIN
 * Author: 
 * Licensed under the MIT license
 */

;(function ( $ ) {

    $.plagin = function ( el, options ) {
        var app = this;
        app.$el = $(el);
        app.el = el;
        app.$el.data( "plagin" , app );

        app.init = function () {
            app.options = $.extend({}, $.plagin.defaultOptions, options);

            /* */
        };

        app.render = function(){

        };

        app.init();
    };

    $.plagin.defaultOptions = { };

    $.fn.plagin = function( options ) {
        return this.each(function() {
            (new $.plagin(this, options))
        });
    };

})( jQuery );
