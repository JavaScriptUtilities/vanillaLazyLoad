/*
 * Plugin Name: Vanilla Lazy Loading
 * Version: 0.8.0
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla Fake Select may be freely distributed under the MIT license.
 */

/* jshint browser: true */

function vanillaLazyLoading(options) {
    'use strict';

    if (!document.querySelectorAll) {
        return false;
    }

    if (!options || typeof options != 'object') {
        options = {};
    }

    var offsetTop = options.offsetTop || 200,
        actionEventMouseTimeout = options.actionEventMouseTimeout || 50,
        actionEventMouseMoves = options.actionEventMouseMoves || 5,
        blankSrc = options.blankSrc || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAEElEQVQY02P4jxcwjEpjAwD6HirkMLPt9gAAAABJRU5ErkJggg==',
        imgs_vll,
        imgs_actionchildren,
        imgs,
        scrollTop = 0,
        timeoutImgPosition;

    function init() {
        setImagesList();
        setImagesInitBlank();
        setImagesPosition();
        setEvents();
    }

    function setEvents() {
        scrollEvent();
        window.addEventListener('scroll', scrollEvent, 1);
        window.addEventListener('resize', timeoutImagesPosition, 1);
        for (var i = 0, len = imgs_actionchildren.length; i < len; i++) {
            imgs_actionchildren[i].addEventListener('mousemove', actionEventMouse, 1);
            imgs_actionchildren[i].addEventListener('touchstart', actionEvent, 1);
            imgs_actionchildren[i].addEventListener('click', actionEvent, 1);
        }
    }

    /* N mousemoves in Xms -> action event */
    function actionEventMouse() {
        /*jshint validthis: true */

        /* No dataset support */
        if (!this.dataset) {
            actionEvent.call(this);
            return;
        }

        this.dataset.actioneventmousetimeout = this.dataset.actioneventmousetimeout || actionEventMouseTimeout;
        this.dataset.actioneventmousemoves = this.dataset.actioneventmousemoves || actionEventMouseMoves;

        /* First passage */
        if (!this.dataset.vllcounter) {

            /* - start counter */
            (function(self) {
                self.dataset.vllcounter = 1;
                /* - stop counting after X ms */
                self.dataset.vllcountertimeout = setTimeout(function() {
                    self.dataset.vllcounter = 0;
                    clearTimeout(self.dataset.vllcountertimeout);
                }, self.dataset.actioneventmousetimeout);
            }(this));
        }
        /* Else : count as a view */
        else {
            this.dataset.vllcounter++;
            if (this.dataset.vllcounter >= this.dataset.actioneventmousemoves) {
                clearTimeout(this.dataset.vllcountertimeout);
                actionEvent.call(this);
            }
        }

    }

    function actionEvent() {
        /*jshint validthis: true */
        /* Launch only once */
        this.removeEventListener('mousemove', actionEventMouse, 1);
        this.removeEventListener('touchstart', actionEvent, 1);
        this.removeEventListener('click', actionEvent, 1);
        /* Load images */
        var imgs = this.querySelectorAll('[data-vllactionsrc]'),
            imgTmp;
        for (var i = 0, len = imgs.length; i < len; i++) {
            /* Set image */
            imgTmp = {
                el: imgs[i]
            };
            setImagePosition(imgTmp, 'data-vllactionsrc');
            /* Load it */
            loadImage(imgTmp);
        }
    }

    function scrollEvent() {
        scrollTop = window.innerHeight + window.scrollY + offsetTop;
        for (var i = 0, len = imgs_vll.length; i < len; i++) {
            loadItem(i);
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
        imgs_actionchildren = document.querySelectorAll('[data-vllactionchildren]');
    }

    function setImagesInitBlank() {
        var tmp_img = document.querySelectorAll('[data-vllblanksrc]');
        for (var i = 0, len = tmp_img.length; i < len; i++) {
            tmp_img[i].removeAttribute('data-vllblanksrc');
            tmp_img[i].setAttribute('data-vllblanksrcactive', 1);
            tmp_img[i].src = blankSrc;
        }
    }

    function timeoutImagesPosition() {
        clearTimeout(timeoutImgPosition);
        timeoutImgPosition = setTimeout(setImagesPosition, 100);
    }

    function setImagesPosition() {
        for (var i = 0, len = imgs_vll.length; i < len; i++) {
            if (!imgs_vll[i]) {
                continue;
            }
            setImagePosition(imgs_vll[i], 'data-vllsrc');
        }
    }

    function setImagePosition(img, attrSrc) {
        var tmpOffset = img.el.getAttribute('data-vlloffset') ? parseInt(img.el.getAttribute('data-vlloffset'), 10) : 0;
        img.type = img.el.getAttribute('data-vlltype') ? img.el.getAttribute('data-vlltype') : 'image';
        img.classname = img.el.getAttribute('data-vllclassname') ? img.el.getAttribute('data-vllclassname') : '';
        img.src = img.el.getAttribute(attrSrc);
        img.top = img.el.getBoundingClientRect().top - tmpOffset;
        img.target = img.el;
        if (img.el.getAttribute('data-vlltarget')) {
            switch (img.el.getAttribute('data-vlltarget')) {
                case 'parent':
                    img.target = img.el.parentNode;
                    break;
                case 'child':
                    if (img.el.childNodes[0]) {
                        img.target = img.el.childNodes[0];
                    }
                    break;
                default:

            }
        }
    }

    function loadItem(i) {
        // No image : stop script
        if (!imgs_vll[i]) {
            return false;
        }
        // Invisible image : stop script
        if (imgs_vll[i].top > scrollTop) {
            return false;
        }

        loadImage(imgs_vll[i]);

        // Remove attribute
        imgs_vll[i].el.removeAttribute('data-vllsrc');

        // Invalidate image
        imgs_vll[i] = false;
    }

    function loadImage(img) {
        switch (img.type) {
            case 'background':
                // Load image background
                img.target.style.backgroundImage = 'url(' + img.src + ')';
                break;
            case 'none':
                // To avoid conflicts with the callback
                break;
            case 'classname':
                img.target.className = img.target.className + ' ' + img.classname;
                break;
            default:
                // Update images position on load
                img.target.addEventListener('load', timeoutImagesPosition, 1);
                // Load image source
                img.target.src = img.src;
        }

        img.el.removeAttribute('data-vllblanksrcactive');

        // Callback
        triggerEvent(img.el, 'vllload', img);
    }

    function triggerEvent(el, eventName, parameters) {
        parameters = parameters || {};
        var e = document.createEvent("HTMLEvents");
        e.initEvent(eventName, true, false);
        e.vllparams = parameters;
        return el.dispatchEvent(e);
    }

    init();
}

(function autoLoadVanillaLazyLoading() {
    if (window.preventAutoLoadVanillaLazyLoading) {
        return false;
    }

    /* DOM ready fucntion */
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
    domReady(function() {
        if (window.preventAutoLoadVanillaLazyLoading) {
            return false;
        }
        vanillaLazyLoading();
    });
}());
