//
// Note: This file depends on the ExtJS 3.x library.
//
var FORMALIZE = (function(window, document, undefined) {
  // Private constants.
  var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input');
  var AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input');
  var WEBKIT = 'webkitAppearance' in document.createElement('select').style;
  var IE6 = Ext.isIE6;
  var IE7 = Ext.isIE7;

  // Expose innards of FORMALIZE.
  return {
    // FORMALIZE.go
    go: function() {
      for (var i in FORMALIZE.init) {
        FORMALIZE.init[i]();
      }
    },
    // FORMALIZE.init
    init: {
      // FORMALIZE.init.detect_webkit
      detect_webkit: function() {
        if (!WEBKIT) {
          return;
        }

        // Tweaks for Safari + Chrome.
        // <html class="is_webkit">
        Ext.get(document.documentElement).addClass('is_webkit');
      },
      // FORMALIZE.init.full_input_size
      full_input_size: function() {
        if (!IE7 || !Ext.query('textarea, input.input_full')) {
          return;
        }

        // This fixes width: 100% on <textarea> and class="input_full".
        // It ensures that form elements don't go wider than container.
        Ext.each(Ext.query('textarea, input.input_full'), function(el) {
          Ext.get(el).wrap('<span class="input_full_wrap"></span>');
        });
      },
      // FORMALIZE.init.ie6_skin_inputs
      ie6_skin_inputs: function() {
        // Test for Internet Explorer 6.
        if (!IE6 || !Ext.query('input, select, textarea')) {
          // Exit if the browser is not IE6,
          // or if no form elements exist.
          return;
        }

        // For <input type="submit" />, etc.
        var button_regex = /button|submit|reset/;

        // For <input type="text" />, etc.
        var type_regex = /date|datetime|datetime-local|email|month|number|password|range|search|tel|text|time|url|week/;

        Ext.each(Ext.query('input'), function(el) {
          // Is it a button?
          if (el.getAttribute('type').match(button_regex)) {
            Ext.get(el).addClass('ie6_button');

            /* Is it disabled? */
            if (el.disabled) {
              Ext.get(el).addClass('ie6_button_disabled');
            }
          }
          // Or is it a textual input?
          else if (el.getAttribute('type').match(type_regex)) {
            Ext.get(el).addClass('ie6_input');

            /* Is it disabled? */
            if (el.disabled) {
              Ext.get(el).addClass('ie6_input_disabled');
            }
          }
        });

        Ext.each(Ext.query('textarea, select'), function(el) {
          /* Is it disabled? */
          if (el.disabled) {
            Ext.get(el).addClass('ie6_input_disabled');
          }
        });
      },
      // FORMALIZE.init.autofocus
      autofocus: function() {
        if (AUTOFOCUS_SUPPORTED || !Ext.query('[autofocus]')) {
          return;
        }

        Ext.query('[autofocus]')[0].focus();
      },
      // FORMALIZE.init.placeholder
      placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !Ext.query('[placeholder]')) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        FORMALIZE.misc.add_placeholder();

        Ext.each(Ext.query('[placeholder]'), function(el) {
          var text = el.getAttribute('placeholder');
          var form = Ext.get(el).parent('form');

          function add_placeholder() {
            if (!el.value || el.value === text) {
              el.value = text;
              Ext.get(el).addClass('placeholder_text');
            }
          }

          Ext.get(el).on('focus', function() {
            if (el.value === text) {
              el.value = '';
              Ext.get(el).removeClass('placeholder_text');
            }
          });

          Ext.get(el).on('blur', function() {
            FORMALIZE.misc.add_placeholder();
          });

          // Prevent <form> from accidentally
          // submitting the placeholder text.
          form.on('submit', function() {
            if (el.value === text) {
              el.value = '';
              Ext.get(el).removeClass('placeholder_text');
            }
          });

          form.on('reset', function() {
            setTimeout(FORMALIZE.misc.add_placeholder, 50);
          });
        });
      }
    },
    // FORMALIZE.misc
    misc: {
      // FORMALIZE.misc.add_placeholder
      add_placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !Ext.query('[placeholder]')) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        Ext.each(Ext.query('[placeholder]'), function(el) {
          var text = el.getAttribute('placeholder');

          if (!el.value || el.value === text) {
            el.value = text;
            Ext.get(el).addClass('placeholder_text');
          }
        });
      }
    }
  };
// Alias window, document.
})(this, this.document);

// Automatically calls all functions in FORMALIZE.init
Ext.onReady(function() {
  FORMALIZE.go();
});