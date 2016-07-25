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

## How to adjust

* `data-vlloffset="200"` : Element is viewed by the script 200px lower.
* `data-vlltype="background"` : Load the image as a background image.
* `data-vlltype="none"` : Do nothing, and use the event "vllload" on the item to trigger your custom action.

## Changelog

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
