/*! ComboBreaker - v0.2.0 - 2012-11-24
* https://github.com/Problematic/ComboBreaker
* Copyright (c) 2012 Derek Stobbe; Licensed MIT */

(function ($) {
    "use strict";

    var ComboBreaker = function (combo, callbacks, options) {
        var root = this, index = 0, timeout = null;

        if (!(this instanceof ComboBreaker)) { return new ComboBreaker(combo, callbacks, options); }

        if (typeof callbacks === "function") {
            callbacks = { success: callbacks };
        }

        this.callbacks = callbacks;

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
            target: document
        }, options);
        this.combo = combo;

        this._keyEventCallback = function (e) {
            // for some reason, jQuery always gives us back the upper-case
            // ASCII value for e.which, which brings us to:
            var expected = root.options.keyMap[root.combo[index]] ||
                root.combo[index].toUpperCase().charCodeAt();

            clearTimeout(timeout);

            if (e.which === expected) {
                if (root.callbacks.step) {
                    root.callbacks.step(root.combo, root.combo[index]);
                }
                if (index === root.combo.length - 1) {
                    root.callbacks.success(root.combo, root.combo[index]);
                    index = 0;

                    return;
                }

                index++;
                timeout = setTimeout(function () {
                    index = 0;
                    if (root.callbacks.timeout) {
                        root.callbacks.timeout(root.combo, root.combo[index]);
                    }
                }, root.options.resetTime);
            } else if (index > 0 && root.options.resetOnMistake === true) {
                index = 0;
                if (root.callbacks.mistake) {
                    root.callbacks.mistake(root.combo, root.combo[index]);
                }
            }
        };

        $(this.options.target).keyup(this._keyEventCallback);
    };

    ComboBreaker.prototype.tearDown = function () {
        $(this.options.target).unbind("keyup", this._keyEventCallback);
    };

    window.ComboBreaker = ComboBreaker;
    if (typeof define === "function") {
        define(ComboBreaker);
    }
}(window.jQuery));
