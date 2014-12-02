define(['jquery'], function ( $ ) {

  var $document = $(document)
    , $window   = $(window)

    , $LG       = $('.visible-lg')
    , $MD       = $('.visible-md')
    , $SM       = $('.visible-sm')

    , exports = {
      "width":      $window.width(),
      "height":     $window.height(),
      "scrollTop":  0,
      "scrollDir":  'down',
      "screenSize": getScreenSize()
    };

  $document.on('scroll', function () {
    var newScroll = $( document ).scrollTop();
    exports.scrollDir = ( exports.scrollTop <= newScroll ) ? 'down' : 'up' ;
    exports.scrollTop = newScroll;
  });

  $window.on('resize', function () {
    var screenSize = getScreenSize();
    exports.width  = $window.width();
    exports.height = $window.height();
    if ( screenSize != exports.screenSize ) {
      exports.screenSize = screenSize;
      $.event.trigger({
        type:       "screenSizeChanged",
        time:       new Date(),
        screenSize: screenSize
      })
    }
  });

  return exports;

  // get screen size
  function getScreenSize () {
    if ( $LG.is(':visible') ) return 'lg';
    if ( $MD.is(':visible') ) return 'md';
    if ( $SM.is(':visible') ) return 'sm';
    return 'xs';
  }

});