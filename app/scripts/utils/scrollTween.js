define(['jquery','utils/windowWatch','TweenMax','utils/stripJsonComments'],
  function ( $, WW, TweenMax ) {

    // var tweens = $('[tween-element]');

    $(document).on('screenSizeChanged', function ( e ) {

      tweenSetup();

      if ( e.screenSize != 'xs' ) {
        $(document)
          .off('scroll.tween')
          .on('scroll.tween', function () {
            requestAnimationFrame( onScroll );
          }).scroll()
        ;
      }

      else {
        $(document).off('scroll.tween');
      }

    }).trigger('screenSizeChanged');

    function tweenSetup () {

      $('[tween-container]').each( function ( index, container ) {
        var $container = $( container );

        // containers must be atleast the hight of the window
        if ( $container.height() < WW.height ) {
          $container.css('minHeight', WW.height );
          console.log('ScrollTween Warning: Containers must have a height equal or greater than the window\'s height.')
        }

        var offsetTop    = $container.offset().top;
        var scrollLength = $container.height() + Math.min( WW.height, offsetTop );

        // for bottom sections that land against the bottom
        var x = offsetTop + $container.height() - $('body').height();
        if ( x > WW.height * -1 )
          scrollLength -= WW.height + x;

        $container.data('offsetTop', offsetTop );
        $container.data('scrollLength', scrollLength );

        $container.find('[tween-element]').each( function ( index, element ) {
          var $element = $( element );
          var $script  = $element.next('script');
          var cfgs;

          try {
            cfgs = JSON.parse(stripJsonComments($script.html()));
            if ( ! $.isArray( cfgs ) )
              cfgs = [ cfgs ];
          } catch (e) { console.log( e ); }

          if ( ! cfgs.length ) return; // exit

          var timeline = new TimelineLite();

          $.each( cfgs, function ( index, cfg ) {
            timeline[ cfg.method || 'from' ]( element, ( cfg.duration || 1 ), cfg.vars, cfg.delay );
          });

          $container.data('timeline', timeline );
        });
      });
    }

    function onScroll () {
      $('[tween-container]').each( function ( index, container ) {
        var $container = $( container );
        var offsetTop  = $container.data('offsetTop');
        var timeline   = $container.data('timeline');

        var duration = $container.data('scrollLength');
        var position = WW.scrollTop + Math.min( offsetTop, WW.height ) - offsetTop;
        var p        = position / duration;

        if ( p < 0 ) p = 0;
        if ( p > 1 ) p = 1;

        timeline.progress( p ).pause();
      });
    }

  }
);