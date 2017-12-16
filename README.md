# Vanilla Lazy Load

Lazy load images. No JS dependency.

## How to use

Include the JS file in your HEAD.

```javascript
<script src="js/vanilla-lazyloading.min.js"></script>
```

Add the src of the image to lazy load in an attribute.

```html
<img data-vllsrc="mybigimage.jpg" src="default.jpg" alt="" />
```

## Settings by element

* `data-vlloffset="200"` : Element is viewed by the script 200px lower.
* `data-vlltarget="parent"` : Changes are applied on the parent.
* `data-vlltarget="child"` : Changes are applied on the child.
* `data-vllclassname="myclassname"` : Class name applied on the child.
* `data-vllblanksrc="1"` : Add a default square transparent image (in data-url) to avoid layout bugs.

### Type

* `data-vlltype="background"` : Load the image as a background image.
* `data-vlltype="classname"` : Add a classname on the element.
* `data-vlltype="none"` : Do nothing, and use the event "vllload" on the item to trigger your custom action.

## Action Children

Load child images when interacting with items (mousemove, touchstart, click).

```html
<div style="height:100px;" data-vllactionchildren="1">
    <img data-vllactionsrc="images/image-1.jpg" alt="" />
    <img data-vllactionsrc="images/image-2.jpg" alt="" />
    <img data-vllactionsrc="images/image-3.jpg" alt="" />
</div>
```

## Prevent autoload

Just declare `window.preventAutoLoadVanillaLazyLoading = true` before domready.

## Global settings.

```javascript
window.preventAutoLoadVanillaLazyLoading = true;
new vanillaLazyLoading({
    // Action event with mouse : at least 4 mousemoves in a 50ms span.
    actionEventMouseMoves: 4,
    actionEventMouseTimeout: 50
});
```

## Changelog

v 0.10.0 - 2017-12-16
* Add a custom event to trigger action children.
* Better example for action children.

v 0.9.0 - 2017-10-15
* Smaller default image.
* Smaller Minified JS.

v 0.8.0 - 2017-02-16
* Fix demo.
* Add global options.
* Invert offset logic.
* Add a small timeout for action event on mousemove.

v 0.7.1 - 2016-11-29
* Add properties during blank image use.

v 0.7.0 - 2016-11-27
* Add a default blank image.

v 0.6.0 - 2016-11-20
* Action children : load child images when interacting with items.

v 0.5.0 - 2016-09-19
* Choose parent or child as a target.
* Add a classname on target element.

v 0.4.1 - 2016-07-26
* Prevent autoload at will.

v 0.4.0 - 2016-07-25
* Trigger a callback when image is loaded.

v 0.3.0 - 2016-07-24
* Documentation \o/
* Debounce on the resize and load action to avoid multiple reloads.
* Offset can be defined on each item.

v 0.2.0 — 2016-07-23
* Load image in background if asked.

v 0.1.1 — 2016-07-21
* Fix invalid domready call.

v 0.1 — 2016-07-21
* Simple auto initializing lazy loading script.
