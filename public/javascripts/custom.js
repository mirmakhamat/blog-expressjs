(function ($) {
	
	"use strict";

	$(function() {
        $("#tabs").tabs();
    });

	$(window).scroll(function() {
	  let scroll = $(window).scrollTop();
	  let box = $('.header-text').height();
	  let header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	

	$('.schedule-filter li').on('click', function() {
        let tsfilter = $(this).data('tsfilter');
        $('.schedule-filter li').removeClass('active');
        $(this).addClass('active');
        if (tsfilter == 'all') {
            $('.schedule-components').removeClass('filtering');
            $('.ts-item').removeClass('show');
        } else {
            $('.schedule-components').addClass('filtering');
        }
        $('.ts-item').each(function() {
            $(this).removeClass('show');
            if ($(this).data('tsmeta') == tsfilter) {
                $(this).addClass('show');
            }
        });
    });


	// Window Resize Mobile Menu Fix
	mobileNav();


	// Scroll animation init
	window.sr = new scrollReveal();
	

	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	function onScroll(event){
	    let scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        let currLink = $(this);
	        let refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Page loading animation
	 $(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		let width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}
	$("button[data-bs-target=#staticBackdrop]").click(function(){
		$('#del-input').attr('value', $(this).attr('data-id'))
	})
	$("button[data-info]").click(function(){
		$('#ModalEdit input').each((i, el) => {
			let data = JSON.parse($(this).attr('data-info'))
			$(el).attr('value', data[$(el).attr('name')])
			if($(el).attr('name') === 'password'){
				$(el).attr('value', '')
			}
		})
		$('#ModalEdit textarea').each((i, el) => {
			let data = JSON.parse($(this).attr('data-info'))
			$(el).text(data[$(el).attr('name')]);
		})
	})

})(window.jQuery);
