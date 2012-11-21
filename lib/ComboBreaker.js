(function ($) {
    "use strict";

    var ComboBreaker = function (combo, callback, options) {
        var index = 0, timeout = null;

        if (!(this instanceof ComboBreaker)) { return new ComboBreaker(combo, callback, options); }

        this.options = $.extend({}, {
            keyMap: {
                'enter':    13,
                'esc':      27,
                'left':     37,
                'up':       38,
                'right':    39,
                'down':     40
            },
            resetTime: 1000,
            resetOnMistake: true,
            stepCallback: null,
            target: document
        }, options);
        this.combo = combo;
        this.callback = callback;

        $(this.options.target).keyup(function (e) {
            // for some reason, jQuery always gives us back the upper-case
            // ASCII value for e.which, which brings us to:
            var expected = this.options.keyMap[this.combo[index]] ||
                this.combo[index].toUpperCase().charCodeAt();

            clearTimeout(timeout);

            if (e.which === expected) {
                if (typeof this.options.stepCallback === "function") {
                    this.options.stepCallback(this.combo, this.combo[index]);
                }
                if (index === this.combo.length - 1) {
                    this.callback(this.combo);
                    index = 0;

                    return;
                }

                index++;
                timeout = setTimeout(function () {
                    index = 0;
                }.bind(this), this.options.resetTime);
            } else if (this.options.resetOnMistake === true) {
                index = 0;
            }
        }.bind(this));
    };

    window.ComboBreaker = ComboBreaker;
}(window.jQuery));
