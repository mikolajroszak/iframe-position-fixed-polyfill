(function(window){
  // *** Prepare configuration ***
  window.iFramePositionFixPolyfillConfiguration = window.iFramePositionFixPolyfillConfiguration || {};
  // *** Merge configuration ***
  window.iFramePositionFixPolyfillConfiguration.debug = window.iFramePositionFixPolyfillConfiguration.debug || false;
  window.iFramePositionFixPolyfillConfiguration.parent = window.iFramePositionFixPolyfillConfiguration.parent || window.parent;
  window.iFramePositionFixPolyfillConfiguration.parentScrollTopProperty = window.iFramePositionFixPolyfillConfiguration.parentScrollTopProperty || 'pageYOffset';
  window.iFramePositionFixPolyfillConfiguration.updateScrollTimeout = 100;
  // *** Static helpers ***
  // log: log something in the console, if the debug flag is set
  if ( !('log' in window.iFramePositionFixPolyfillConfiguration) )
    window.iFramePositionFixPolyfillConfiguration.log = function () {
      if ( window.iFramePositionFixPolyfillConfiguration.debug )
        console.log( '>> iFramePositionFixPolyfillConfiguration:', arguments );
    };
  // setInitialState: set the initial state of the element
  if ( !('setInitialState' in window.iFramePositionFixPolyfillConfiguration) )
    window.iFramePositionFixPolyfillConfiguration.setInitialState = function ( initialStyles ) {
      var me = this;

      me.updateTimeout = null;
      me.initialTop = initialStyles.top.indexOf('%') > -1 ? ( window.iFramePositionFixPolyfillConfiguration.parent.innerHeight / 100 * initialStyles.top.slice(0,-1) ) : me.element.offsetTop;
      me.element.style.top = me.initialTop + 'px';
    };
  // updateState: updates the element state on scroll
  if ( !('updateState' in window.iFramePositionFixPolyfillConfiguration) )
    window.iFramePositionFixPolyfillConfiguration.updateState = function () {
      var me = this,
          scrollTop = window.iFramePositionFixPolyfillConfiguration.parent[ window.iFramePositionFixPolyfillConfiguration.parentScrollTopProperty ];

      if ( me.updateTimeout ) clearTimeout( me.updateTimeout );
      me.updateTimeout = setTimeout( function() {
        window.iFramePositionFixPolyfillConfiguration.log( 'updateScroll', me, scrollTop );
        window.requestAnimationFrame( function (){
          me.element.style.top = me.initialTop + ( scrollTop >= window.frameElement.offsetTop ? scrollTop - window.frameElement.offsetTop : scrollTop ) + 'px';
        });
      }, window.iFramePositionFixPolyfillConfiguration.updateScrollTimeout );
    };
  // Initialize this polyfill when the document has been fully loaded, including CSS
  window.addEventListener('load', initPolyfill, false);
  // Observe for new added elements
  var observer = new MutationObserver(initPolyfill);
  observer.observe(document.documentElement, {
      childList: true,
      subtree: true
  });
  // -------------------------------------------------------------------
  function loop ( elements, callback ) {
    if ( elements ) {
      for ( var i = 0; i < elements.length; i++ ) {
        if ( callback ) callback( elements[i] );
      }
    }
  }
  // -------------------------------------------------------------------
  function initPolyfill () {
    if ( document.styleSheets ) {
      loop( document.styleSheets, function ( styleSheet ){
        loop( styleSheet.cssRules, function ( rule ){
          if ( rule.style ) {
            if ( rule.style.position == 'fixed' ) {
              loop( document.querySelectorAll( rule.selectorText ), function ( element ){
                new iFramePositionFixPolyfill( element, rule.style );
              })
            }
          }
        })
      });
    }
  }
  // -------------------------------------------------------------------
  function iFramePositionFixPolyfill ( element, initialStyles ) {
    var me = this,
        isInitialized = ( element.getAttribute('data-iframe-position-fixed-initialized') === "true" );

    if ( !isInitialized ) {
      // Define properties
      me.element = element;

      // Allow the user to configure the initial position through the external helper method
      window.iFramePositionFixPolyfillConfiguration.setInitialState.call(me, initialStyles);

      // Initialize element position
      me.element.setAttribute( 'data-iframe-position-fixed-initialized', true );

      // When the parent scrolls, attempt to update the element position ever 500ms.
      // If another scroll event comes in place, cancel the previous attempt and retry.
      window.iFramePositionFixPolyfillConfiguration.parent.addEventListener( 'scroll', function ( event ){
        window.iFramePositionFixPolyfillConfiguration.updateState.call( me );
      }, {passive: true});
    }
  }
})(window);