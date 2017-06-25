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

```
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

# Demo

Sure. Feel free [to take a look](https://julianxhokaxhiu.github.io/iframe-position-fixed-polyfill/)

# License

See [LICENSE](LICENSE)