/*! ComboBreaker - v0.1.2 - 2012-11-23
* https://github.com/Problematic/ComboBreaker
* Copyright (c) 2012 Derek Stobbe; Licensed MIT */

(function ($) {
    "use strict";

    var ComboBreaker = function (combo, callback, options) {
        var root = this, index = 0, timeout = null;

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

        this._keyEventCallback = function (e) {
            // for some reason, jQuery always gives us back the upper-case
            // ASCII value for e.which, which brings us to:
            var expected = root.options.keyMap[root.combo[index]] ||
                root.combo[index].toUpperCase().charCodeAt();

            clearTimeout(timeout);

            if (e.which === expected) {
                if (typeof root.options.stepCallback === "function") {
                    root.options.stepCallback(root.combo, root.combo[index]);
                }
                if (index === root.combo.length - 1) {
                    root.callback(root.combo);
                    index = 0;

                    return;
                }

                index++;
                timeout = setTimeout(function () {
                    index = 0;
                }, root.options.resetTime);
            } else if (root.options.resetOnMistake === true) {
                index = 0;
            }
        };

        $(this.options.target).keyup(this._keyEventCallback);
    };

    ComboBreaker.prototype.tearDown = function () {
        $(this.options.target).unbind("keyup", this._keyEventCallback);
    };

    window.ComboBreaker = ComboBreaker;
}(window.jQuery));
