(function ($) {
  "use strict";

  Drupal.behaviors.wunderClickable = {
    attach: function (context, settings) {

      $('.js-clickable', context).once('wunderClickable').each(function() {
        var $clickable = $(this),
          url = $clickable.data('url');

        if (url.length) {
          $clickable.addClass('is-clickable');
          $clickable.click(function(event) {
            window.location = url;
          });
        }

      });
    }
  };

}(jQuery));