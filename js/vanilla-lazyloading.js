/*
 * Plugin Name: Vanilla Lazy Loading
 * Version: 0.11.0
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
        blankSrc = options.blankSrc || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        imgs_vll,
        imgs_actionchildren,
        imgs,
        scrollTop = 0,
        timeoutImgPosition;

    /* Attributes */
    var attrActionChildren = 'data-vllactionchildren',
        attrActionSrc = 'data-vllactionsrc',
        attrBlankSrc = 'data-vllblanksrc',
        attrBlankSrcActive = 'data-vllblanksrcactive',
        attrClassname = 'data-vllclassname',
        attrMainSrc = 'data-vllsrc',
        attrOffset = 'data-vlloffset',
        attrTarget = 'data-vlltarget',
        attrSrcLoaded = 'data-vllwaitforload',
        attrType = 'data-vlltype';

    /* Events */
    var eventLoadActionChildren = 'loadvllactionchildren';

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
            imgs_actionchildren[i].addEventListener(eventLoadActionChildren, actionEvent, 1);
        }
    }

    /* N mousemoves in Xms -> action event */
    function actionEventMouse() {
        /*jshint validthis: true */

        var actionEventTimeoutProp = 'actioneventmousetimeout',
            actionEventMoveProp = 'actioneventmousemoves',
            counterProp = 'vllcounter',
            counterTimeoutProp = 'vllcountertimeout',
            datasetProp = 'dataset';

        /* No dataset support */
        if (!this[datasetProp]) {
            actionEvent.call(this);
            return;
        }

        this[datasetProp][actionEventTimeoutProp] = this[datasetProp][actionEventTimeoutProp] || actionEventMouseTimeout;
        this[datasetProp][actionEventMoveProp] = this[datasetProp][actionEventMoveProp] || actionEventMouseMoves;

        /* First passage */
        if (!this[datasetProp][counterProp]) {

            /* - start counter */
            (function(self) {
                self[datasetProp][counterProp] = 1;
                /* - stop counting after X ms */
                self[datasetProp][counterTimeoutProp] = setTimeout(function() {
                    self[datasetProp][counterProp] = 0;
                    clearTimeout(self[datasetProp][counterTimeoutProp]);
                }, self[datasetProp][actionEventTimeoutProp]);
            }(this));
        }
        /* Else : count as a view */
        else {
            this[datasetProp][counterProp]++;
            if (this[datasetProp][counterProp] >= this[datasetProp][actionEventMoveProp]) {
                clearTimeout(this[datasetProp][counterTimeoutProp]);
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
        this.removeEventListener(eventLoadActionChildren, actionEvent, 1);
        /* Load images */
        var imgs = this.querySelectorAll('[' + attrActionSrc + ']'),
            imgTmp;
        for (var i = 0, len = imgs.length; i < len; i++) {
            /* Set image */
            imgTmp = {
                el: imgs[i]
            };
            setImagePosition(imgTmp, attrActionSrc);
            /* Load it */
            loadImageAsync(imgTmp);
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
        imgs = document.querySelectorAll('[' + attrMainSrc + ']');
        for (var i = 0, len = imgs.length; i < len; i++) {
            tmp_img = {
                el: imgs[i]
            };
            imgs_vll.push(tmp_img);
        }
        imgs_actionchildren = document.querySelectorAll('[' + attrActionChildren + ']');
    }

    function setImagesInitBlank() {
        var tmp_img = document.querySelectorAll('[' + attrBlankSrc + ']');
        for (var i = 0, len = tmp_img.length; i < len; i++) {
            tmp_img[i].removeAttribute(attrBlankSrc);
            tmp_img[i].setAttribute(attrBlankSrcActive, 1);
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
            setImagePosition(imgs_vll[i], attrMainSrc);
        }
    }

    function setImagePosition(img, attrSrc) {
        var tmpOffset = img.el.getAttribute(attrOffset) ? parseInt(img.el.getAttribute(attrOffset), 10) : 0;
        img.type = img.el.getAttribute(attrType) ? img.el.getAttribute(attrType) : 'image';
        img.classname = img.el.getAttribute(attrClassname) ? img.el.getAttribute(attrClassname) : '';
        img.src = img.el.getAttribute(attrSrc);
        img.top = img.el.getBoundingClientRect().top - tmpOffset;
        img.target = img.el;
        if (img.el.getAttribute(attrTarget)) {
            switch (img.el.getAttribute(attrTarget)) {
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

        loadImageAsync(imgs_vll[i]);

        // Remove attribute
        imgs_vll[i].el.removeAttribute(attrMainSrc);

        // Invalidate image
        imgs_vll[i] = false;
    }

    function loadImageAsync(img) {
        if (img.el.getAttribute(attrSrcLoaded) == '1') {
            callOnImgLoad(img.src, function() {
                loadImage(img);
                img.el.removeAttribute(attrSrcLoaded);
            });
        }
        else {
            loadImage(img);
        }
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

        img.el.removeAttribute(attrBlankSrcActive);

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

    function callOnImgLoad(url, callback) {
        // Create a new image
        var img = new Image();

        // Trigger callback on load
        img.onload = callback;

        // Set image load
        img.src = url;
    }

    init();
}

(function autoLoadVanillaLazyLoading() {
    'use strict';

    var attributePrevent = 'preventAutoLoadVanillaLazyLoading';
    if (window[attributePrevent]) {
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
        if (window[attributePrevent]) {
            return false;
        }
        vanillaLazyLoading();
    });
}());
