/*! ComboBreaker - v0.2.1 - 2012-11-24
* https://github.com/Problematic/ComboBreaker
* Copyright (c) 2012 Derek Stobbe; Licensed MIT */

(function ($) {
    "use strict";

    var ComboBreaker = function (combo, callbacks, options) {
        var root = this;

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
        this._timeout = null;
        this._index = 0;

        this._keyEventCallback = function (e) {
            // for some reason, jQuery always gives us back the upper-case
            // ASCII value for e.which, which brings us to:
            var expected = root.options.keyMap[root.combo[root._index]] ||
                root.combo[root._index].toUpperCase().charCodeAt();

            clearTimeout(root._timeout);

            if (e.which === expected) {
                if (root.callbacks.step) {
                    root.callbacks.step(root.combo, root.combo[root._index]);
                }
                if (root._index === root.combo.length - 1) {
                    root.callbacks.success(root.combo, root.combo[root._index]);
                    root._index = 0;

                    return;
                }

                root._index++;

                root._timeout = setTimeout(function () {
                    root._index = 0;
                    if (root.callbacks.timeout) {
                        root.callbacks.timeout(root.combo, root.combo[root._index]);
                    }
                }, root.options.resetTime);
            } else if (root._index > 0 && root.options.resetOnMistake === true) {
                root._index = 0;
                if (root.callbacks.mistake) {
                    root.callbacks.mistake(root.combo, root.combo[root._index]);
                }
            }
        };

        $(this.options.target).keyup(this._keyEventCallback);
    };

    ComboBreaker.prototype.tearDown = function () {
        clearTimeout(this._timeout);
        this._index = 0;
        $(this.options.target).unbind("keyup", this._keyEventCallback);
    };

    window.ComboBreaker = ComboBreaker;
    if (typeof define === "function") {
        define(ComboBreaker);
    }
}(window.jQuery));
