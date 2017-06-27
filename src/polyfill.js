(function(window){
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
    for ( var i = 0; i < elements.length; i++ ) {
      if ( callback ) callback( elements[i] );
    }
  }
  // -------------------------------------------------------------------
  function initPolyfill () {
    if ( document.styleSheets ) {
      loop( document.styleSheets, function ( styleSheet ){
        loop( styleSheet.rules, function ( rule ){
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
      me.initialTop = initialStyles.top.indexOf('%') > -1 ? ( window.parent.innerHeight / 100 * initialStyles.top.slice(0,-1) ) : element.offsetTop;
      me.updateTimeout = null;

      // Define internal functions
      me.update = function ( scrollTop ) {
        me.element.style.top = me.initialTop + ( scrollTop >= window.frameElement.offsetTop ? scrollTop - window.frameElement.offsetTop : scrollTop ) + 'px';
      }

      // Initialize element position
      me.element.style.top = me.initialTop + 'px';
      me.element.setAttribute( 'data-iframe-position-fixed-initialized', true );

      // When the parent scrolls, attempt to update the element position ever 500ms.
      // If another scroll event comes in place, cancel the previous attempt and retry.
      window.parent.addEventListener( 'scroll', function ( event ){
        if ( me.updateTimeout ) clearTimeout( me.updateTimeout );
        me.updateTimeout = setTimeout( function(){ me.update( window.parent.pageYOffset ) }, 100 );
      }, true)
    }
  }
})(window);