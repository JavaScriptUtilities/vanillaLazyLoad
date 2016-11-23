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

## Changelog

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
