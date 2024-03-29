﻿/**
 * @preserve  textfill
 * @name      jquery.textfill.js
 * @author    Russ Painter
 * @author    Yu-Jie Lin
 * @version   0.3.3
 * @date      2013-03-26
 * @copyright (c) 2012-2013 Yu-Jie Lin
 * @copyright (c) 2009 Russ Painter
 * @license   MIT License
 * @homepage  https://github.com/jquery-textfill/jquery-textfill
 * @example   http://jquery-textfill.github.com/jquery-textfill/Example.htm
*/
; (function($) {
  /**
  * Resizes an inner element's font so that the inner element completely fills the outer element.
  * @param {Object} Options which are maxFontPixels (default=40), innerTag (default='span')
  * @return All outer elements processed
  */
  $.fn.textfill = function(options) {
    var defaults = {
      debug: false,
      maxFontPixels: 40,
      minFontPixels: 4,
      innerTag: 'span',
      widthOnly: false,
      callback: null,
      complete: null,
      explicitWidth: null,
      explicitHeight: null
    };
    var Opts = jQuery.extend(defaults, options);

    function _debug_sizing(prefix, ourText, maxHeight, maxWidth, minFontPixels, maxFontPixels) {
      if (!Opts.debug) {
        return;
      }

      function _m(v1, v2) {
        var marker = ' / ';
        if (v1 > v2) {
          marker = ' > ';
        } else if (v1 == v2) {
          marker = ' = ';
        }
        return marker;
      }

      console.debug(
        prefix +
        'font: ' + ourText.css('font-size') +
        ', H: ' + ourText.height() + _m(ourText.height(), maxHeight) + maxHeight +
        ', W: ' + ourText.width()  + _m(ourText.width() , maxWidth)  + maxWidth +
        ', minFontPixels: ' + minFontPixels +
        ', maxFontPixels: ' + maxFontPixels
      );
    }

    function _sizing(prefix, ourText, func, max, maxHeight, maxWidth, minFontPixels, maxFontPixels) {
      _debug_sizing(prefix + ': ', ourText, maxHeight, maxWidth, minFontPixels, maxFontPixels);
      while (minFontPixels < maxFontPixels - 1) {
        var fontSize = Math.floor((minFontPixels + maxFontPixels) / 2)
        ourText.css('font-size', fontSize);
        if (func.call(ourText) <= max) {
          minFontPixels = fontSize;
          if (func.call(ourText) == max) {
            break;
          }
        } else {
          maxFontPixels = fontSize;
        }
        _debug_sizing(prefix + ': ', ourText, maxHeight, maxWidth, minFontPixels, maxFontPixels);
      }
      ourText.css('font-size', maxFontPixels);
      if (func.call(ourText) <= max) {
        minFontPixels = maxFontPixels;
        _debug_sizing(prefix + '* ', ourText, maxHeight, maxWidth, minFontPixels, maxFontPixels);
      }
      return minFontPixels;
    }

    this.each(function() {
      var ourText = $(Opts.innerTag + ':visible:first', this);
      // Use explicit dimensions when specified
      var maxHeight = Opts.explicitHeight || $(this).height();
      var maxWidth = Opts.explicitWidth || $(this).width();
      var oldFontSize = ourText.css('font-size');
      var fontSize;

      if (Opts.debug) {
        console.log('Opts: ', Opts);
        console.log('Vars:' +
          ' maxHeight: ' + maxHeight +
          ', maxWidth: ' + maxWidth
        );
      }

      var minFontPixels = Opts.minFontPixels;
      var maxFontPixels = Opts.maxFontPixels <= 0 ? maxHeight : Opts.maxFontPixels;
      var HfontSize = undefined;
      if (!Opts.widthOnly) {
        HfontSize = _sizing('H', ourText, $.fn.height, maxHeight, maxHeight, maxWidth, minFontPixels, maxFontPixels);
      }
      var WfontSize = _sizing('W', ourText, $.fn.width, maxWidth, maxHeight, maxWidth, minFontPixels, maxFontPixels);

      if (Opts.widthOnly) {
        ourText.css('font-size', WfontSize);
      } else {
        ourText.css('font-size', Math.min(HfontSize, WfontSize));
      }
      if (Opts.debug) {
        console.debug('Final: ' + ourText.css('font-size'));
      }

      if (ourText.width() > maxWidth || ourText.height() > maxHeight) {
        ourText.css('font-size', oldFontSize);
      }
      // call callback on each result
      if (Opts.callback) Opts.callback(this);
    });

    // call complete when all is complete
    if (Opts.complete) Opts.complete(this);

    return this;
  };
})(jQuery);
