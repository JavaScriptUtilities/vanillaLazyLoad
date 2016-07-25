/*
 * Plugin Name: Vanilla Lazy Loading
 * Version: 0.3.0
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
            imgs,
            timeoutImgPosition;

        function init() {
            setImagesList();
            setImagesPosition();
            setEvents();
        }

        function setEvents() {
            scrollEvent();
            window.addEventListener('scroll', scrollEvent, 1);
            window.addEventListener('resize', timeoutImagesPosition, 1);
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

        function timeoutImagesPosition() {
            clearTimeout(timeoutImgPosition);
            timeoutImgPosition = setTimeout(setImagesPosition, 100);
        }

        function setImagesPosition() {
            var tmpOffset, i, len;
            for (i = 0, len = imgs_vll.length; i < len; i++) {
                if (!imgs_vll[i]) {
                    continue;
                }
                tmpOffset = imgs_vll[i].el.getAttribute('data-vlloffset') ? parseInt(imgs_vll[i].el.getAttribute('data-vlloffset'), 10) : 0;
                imgs_vll[i].type = imgs_vll[i].el.getAttribute('data-vlltype') ? imgs_vll[i].el.getAttribute('data-vlltype') : 'image';
                imgs_vll[i].src = imgs_vll[i].el.getAttribute('data-vllsrc');
                imgs_vll[i].top = imgs_vll[i].el.getBoundingClientRect().top + tmpOffset;
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
            switch (imgs_vll[i].type) {
                case 'background':
                    // Load image background
                    imgs_vll[i].el.style.backgroundImage = 'url(' + imgs_vll[i].src + ')';
                    break;
                case 'none':
                    // To avoid conflicts with the callback
                    break;
                default:
                    // Update images position on load
                    imgs_vll[i].el.addEventListener('load', timeoutImagesPosition, 1);
                    // Load image source
                    imgs_vll[i].el.src = imgs_vll[i].src;
            }

            // Callback
            triggerEvent(imgs_vll[i].el, 'vllload', imgs_vll[i]);

            // Remove attribute
            imgs_vll[i].el.removeAttribute('data-vllsrc');

            // Invalidate image
            imgs_vll[i] = false;
        }

        function triggerEvent(el, eventName, parameters) {
            parameters = parameters || {};
            var e = document.createEvent("HTMLEvents");
            e.initEvent(eventName, true, false);
            e.vllparams = parameters;
            return el.dispatchEvent(e);
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
