/*
 * Plugin Name: Vanilla Lazy Loading
 * Version: 0.1.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla Fake Select may be freely distributed under the MIT license.
 */

/* jshint browser: true */

(function vanillaLazyLoading() {
    'use strict';

    if (!document.querySelectorAll) {
        return false;
    }

    /* Lazy load */
    var vll = function() {
        var scrollTop = 0,
            offsetTop = 200,
            imgs_vll,
            imgs;

        function init() {
            setImagesList();
            setImagesPosition();
            setEvents();
        }

        function setEvents() {
            scrollEvent();
            window.addEventListener('scroll', scrollEvent, 1);
            window.addEventListener('resize', setImagesPosition, 1);
        }

        function scrollEvent() {
            scrollTop = window.innerHeight + window.scrollY + offsetTop;
            for (var i = 0, len = imgs_vll.length; i < len; i++) {
                loadImage(i);
            }
        }

        function setImagesList() {
            var tmp_img;
            imgs_vll = [];
            imgs = document.querySelectorAll('[data-vllsrc]');
            for (var i = 0, len = imgs.length; i < len; i++) {
                tmp_img = {
                    el: imgs[i]
                };
                imgs_vll.push(tmp_img);
            }
        }

        function setImagesPosition() {
            for (var i = 0, len = imgs_vll.length; i < len; i++) {
                if (!imgs_vll[i]) {
                    continue;
                }
                imgs_vll[i].src = imgs_vll[i].el.getAttribute('data-vllsrc');
                imgs_vll[i].top = imgs_vll[i].el.getBoundingClientRect().top;
            }
        }

        function loadImage(i) {
            // No image : stop script
            if (!imgs_vll[i]) {
                return false;
            }
            // Invisible image : stop script
            if (imgs_vll[i].top > scrollTop) {
                return false;
            }
            // Update images position on load
            imgs_vll[i].el.addEventListener('load', function(e) {
                setImagesPosition();
            }, 1);
            // Load image source
            imgs_vll[i].el.src = imgs_vll[i].src;
            // Invalidate image
            imgs_vll[i] = false;
        }

        init();
    };

    /* dom ready */
    var domReady = function(func) {
        if (/in/.test(document.readyState) || !document.body) {
            setTimeout(function() {
                domReady(func);
            }, 9);
        }
        else {
            func();
        }
    };

    /* Launch LL at domready */
    domReady(vll);
}());
