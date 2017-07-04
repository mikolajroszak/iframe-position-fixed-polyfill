# iframe-position-fixed-polyfill
An iFrame position:fixed polyfill

# Introduction

You may wonder "it's 2017, who the heck uses iFrames today?". Well, there are some cases you may want to use them. Especially if you want to sandbox the context of the application you're embedding, still leaveraging the possibility to use the context as it was embedded natively within your page.

Borned from the frustation of not finding **anything** on the Internet that was working out-of-the-box, this polyfill sets it's goal to provide a working `position:fixed` within the context of the iFrame. Drop it inside your iFrame HTML and have fun!

# How it works

Basically the code is all about listening to the parent `scroll` event, capturing the `pageYOffset` and boucing it back to the element, by setting its `top` property, with some minor logic calculations.

When the event `load` will be triggered, the polyfill will initialize itself, searching through your stylesheets where you have declared a `position:fixed`, it will lookup into elements using `querySelectorAll` and it will initialize the polyfill on top of any element found.

Not only elements that are already existing in the DOM will benefit from this polyfill, but also future appended elements anywhere in the DOM will benefit from this polyfill too. Everytime a new element will be appended, the polyfill will initialize those elements, leaving untouched the already initialized once. All of this, thanks to the `MutationObserver` functionality.

Nothing more, nothing less.

# Limitations

As the scripts is using the context of `window.parent` it presumes that the iFrame has **cross-origin** access to its parent. Although, if this is not the case, you may want to take a look at [PostEvent](https://github.com/julianxhokaxhiu/PostEvent), which will provide you a full cross-origin event handler. Although the architecture and the implementation of it, it's up to you.

It's also known to work up to IE11+. If you're willing to support older IEs, feel free to drop a PR.

# How to use

As simple as it should be. Download the [polyfill](src/polyfill.js) and add it into your iFrame HTML, like on this example:

```html
<!doctype html>
<html>
  <head>
    ...
  </head>
  <body>
    ...
    <script src="src/polyfill.js"></script>
  </body>
</html>
```

Refresh the page and...enjoy :)

# Configuration

Of course you can configure the behavior of the Polyfill if you prefer, especially in situations where you embed you iFrame in a container that will scroll, and block the main window scroll. In such cases you will find handy these three options:

- _Boolean_ **debug:** set to `true` if you want to see the updated values of the scrollTop per Element.
- _DOMElement_ **parent:** defines on which element the _scroll_ event will listen, by default is set to `window.parent`
- _String_ **parentScrollTopProperty:** defines which property to read to trach the Y position of the scrollbar, by default is `pageYOffset`

You can set your configurations by defining these properties **_before_** you load the polyfill, like on this example:

```html
<!doctype html>
<html>
  <head>
    ...
  </head>
  <body>
    <script>
      window.iFramePositionFixPolyfillConfiguration = {
        debug: true
      }
    </script>
    <script src="src/polyfill.js"></script>
  </body>
</html>
```

# Helper Functions

Helper functions are there and defined, so you can completely change the default behavior of the polyfill. 

### log( _arg1, arg2, ..._ )

This function will get any argument, and it will pass it to `console.log` if the **debug** flag is set to `true`.

### setInitialState( _initialStyles_ )

This function will set the initial state of the element. It accepts one argument:

- **initialStyles:** the initial CSS style of the element. This is inherited directly from `document.styleSheets` dictionary, using the related `rule.style` property, for the matched element.

On top of the arguments, you will also get:

- **this:** the current instance. To fetch the DOM element use `this.element`.

### updateState()

This function will update the element state when the user will scroll. This function has no arguments.

On top of the arguments, you will also get:

- **this:** the current instance. To fetch the DOM element use `this.element`.

You can change the behavior of these functions by defining them **_before_** you load the polyfill, like on this example:

```html
<!doctype html>
<html>
  <head>
    ...
  </head>
  <body>
    <script>
      window.iFramePositionFixPolyfillConfiguration = {
        log: function () {
          console.info( '>> LOG OVERRIDEN: ', arguments );
        }
      }
    </script>
    <script src="src/polyfill.js"></script>
  </body>
</html>
```

# Demo

Sure. Feel free [to take a look](https://julianxhokaxhiu.github.io/iframe-position-fixed-polyfill/)

# License

See [LICENSE](LICENSE)