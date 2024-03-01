/*! jQuery UI - v1.13.2 - 2022-08-09
 * http://jqueryui.com
 * Includes: widget.js, keycode.js, widgets/mouse.js, widgets/slider.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */
! function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
}(function(l) {
    "use strict";
    l.ui = l.ui || {};
    l.ui.version = "1.13.2";
    var n, i = 0,
        o = Array.prototype.hasOwnProperty,
        h = Array.prototype.slice;
    l.cleanData = (n = l.cleanData, function(e) {
        for (var t, i, s = 0; null != (i = e[s]); s++)(t = l._data(i, "events")) && t.remove && l(i).triggerHandler("remove");
        n(e)
    }), l.widget = function(e, i, t) {
        var s, n, a, o = {},
            h = e.split(".")[0],
            r = h + "-" + (e = e.split(".")[1]);
        return t || (t = i, i = l.Widget), Array.isArray(t) && (t = l.extend.apply(null, [{}].concat(t))), l.expr.pseudos[r.toLowerCase()] = function(e) {
            return !!l.data(e, r)
        }, l[h] = l[h] || {}, s = l[h][e], n = l[h][e] = function(e, t) {
            if (!this || !this._createWidget) return new n(e, t);
            arguments.length && this._createWidget(e, t)
        }, l.extend(n, s, {
            version: t.version,
            _proto: l.extend({}, t),
            _childConstructors: []
        }), (a = new i).options = l.widget.extend({}, a.options), l.each(t, function(t, s) {
            function n() {
                return i.prototype[t].apply(this, arguments)
            }

            function a(e) {
                return i.prototype[t].apply(this, e)
            }
            o[t] = "function" == typeof s ? function() {
                var e, t = this._super,
                    i = this._superApply;
                return this._super = n, this._superApply = a, e = s.apply(this, arguments), this._super = t, this._superApply = i, e
            } : s
        }), n.prototype = l.widget.extend(a, {
            widgetEventPrefix: s && a.widgetEventPrefix || e
        }, o, {
            constructor: n,
            namespace: h,
            widgetName: e,
            widgetFullName: r
        }), s ? (l.each(s._childConstructors, function(e, t) {
            var i = t.prototype;
            l.widget(i.namespace + "." + i.widgetName, n, t._proto)
        }), delete s._childConstructors) : i._childConstructors.push(n), l.widget.bridge(e, n), n
    }, l.widget.extend = function(e) {
        for (var t, i, s = h.call(arguments, 1), n = 0, a = s.length; n < a; n++)
            for (t in s[n]) i = s[n][t], o.call(s[n], t) && void 0 !== i && (l.isPlainObject(i) ? e[t] = l.isPlainObject(e[t]) ? l.widget.extend({}, e[t], i) : l.widget.extend({}, i) : e[t] = i);
        return e
    }, l.widget.bridge = function(a, t) {
        var o = t.prototype.widgetFullName || a;
        l.fn[a] = function(i) {
            var e = "string" == typeof i,
                s = h.call(arguments, 1),
                n = this;
            return e ? this.length || "instance" !== i ? this.each(function() {
                var e, t = l.data(this, o);
                return "instance" === i ? (n = t, !1) : t ? "function" != typeof t[i] || "_" === i.charAt(0) ? l.error("no such method '" + i + "' for " + a + " widget instance") : (e = t[i].apply(t, s)) !== t && void 0 !== e ? (n = e && e.jquery ? n.pushStack(e.get()) : e, !1) : void 0 : l.error("cannot call methods on " + a + " prior to initialization; attempted to call method '" + i + "'")
            }) : n = void 0 : (s.length && (i = l.widget.extend.apply(null, [i].concat(s))), this.each(function() {
                var e = l.data(this, o);
                e ? (e.option(i || {}), e._init && e._init()) : l.data(this, o, new t(i, this))
            })), n
        }
    }, l.Widget = function() {}, l.Widget._childConstructors = [], l.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            classes: {},
            disabled: !1,
            create: null
        },
        _createWidget: function(e, t) {
            t = l(t || this.defaultElement || this)[0], this.element = l(t), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = l(), this.hoverable = l(), this.focusable = l(), this.classesElementLookup = {}, t !== this && (l.data(t, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(e) {
                    e.target === t && this.destroy()
                }
            }), this.document = l(t.style ? t.ownerDocument : t.document || t), this.window = l(this.document[0].defaultView || this.document[0].parentWindow)), this.options = l.widget.extend({}, this.options, this._getCreateOptions(), e), this._create(), this.options.disabled && this._setOptionDisabled(this.options.disabled), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: function() {
            return {}
        },
        _getCreateEventData: l.noop,
        _create: l.noop,
        _init: l.noop,
        destroy: function() {
            var i = this;
            this._destroy(), l.each(this.classesElementLookup, function(e, t) {
                i._removeClass(t, e)
            }), this.element.off(this.eventNamespace).removeData(this.widgetFullName), this.widget().off(this.eventNamespace).removeAttr("aria-disabled"), this.bindings.off(this.eventNamespace)
        },
        _destroy: l.noop,
        widget: function() {
            return this.element
        },
        option: function(e, t) {
            var i, s, n, a = e;
            if (0 === arguments.length) return l.widget.extend({}, this.options);
            if ("string" == typeof e)
                if (a = {}, e = (i = e.split(".")).shift(), i.length) {
                    for (s = a[e] = l.widget.extend({}, this.options[e]), n = 0; n < i.length - 1; n++) s[i[n]] = s[i[n]] || {}, s = s[i[n]];
                    if (e = i.pop(), 1 === arguments.length) return void 0 === s[e] ? null : s[e];
                    s[e] = t
                } else {
                    if (1 === arguments.length) return void 0 === this.options[e] ? null : this.options[e];
                    a[e] = t
                } return this._setOptions(a), this
        },
        _setOptions: function(e) {
            for (var t in e) this._setOption(t, e[t]);
            return this
        },
        _setOption: function(e, t) {
            return "classes" === e && this._setOptionClasses(t), this.options[e] = t, "disabled" === e && this._setOptionDisabled(t), this
        },
        _setOptionClasses: function(e) {
            var t, i, s;
            for (t in e) s = this.classesElementLookup[t], e[t] !== this.options.classes[t] && s && s.length && (i = l(s.get()), this._removeClass(s, t), i.addClass(this._classes({
                element: i,
                keys: t,
                classes: e,
                add: !0
            })))
        },
        _setOptionDisabled: function(e) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!e), e && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _classes: function(n) {
            var a = [],
                o = this;

            function e(e, t) {
                for (var i, s = 0; s < e.length; s++) i = o.classesElementLookup[e[s]] || l(), i = n.add ? (function() {
                    var i = [];
                    n.element.each(function(e, t) {
                        l.map(o.classesElementLookup, function(e) {
                            return e
                        }).some(function(e) {
                            return e.is(t)
                        }) || i.push(t)
                    }), o._on(l(i), {
                        remove: "_untrackClassesElement"
                    })
                }(), l(l.uniqueSort(i.get().concat(n.element.get())))) : l(i.not(n.element).get()), o.classesElementLookup[e[s]] = i, a.push(e[s]), t && n.classes[e[s]] && a.push(n.classes[e[s]])
            }
            return (n = l.extend({
                element: this.element,
                classes: this.options.classes || {}
            }, n)).keys && e(n.keys.match(/\S+/g) || [], !0), n.extra && e(n.extra.match(/\S+/g) || []), a.join(" ")
        },
        _untrackClassesElement: function(i) {
            var s = this;
            l.each(s.classesElementLookup, function(e, t) {
                -1 !== l.inArray(i.target, t) && (s.classesElementLookup[e] = l(t.not(i.target).get()))
            }), this._off(l(i.target))
        },
        _removeClass: function(e, t, i) {
            return this._toggleClass(e, t, i, !1)
        },
        _addClass: function(e, t, i) {
            return this._toggleClass(e, t, i, !0)
        },
        _toggleClass: function(e, t, i, s) {
            var n = "string" == typeof e || null === e,
                i = {
                    extra: n ? t : i,
                    keys: n ? e : t,
                    element: n ? this.element : e,
                    add: s = "boolean" == typeof s ? s : i
                };
            return i.element.toggleClass(this._classes(i), s), this
        },
        _on: function(n, a, e) {
            var o, h = this;
            "boolean" != typeof n && (e = a, a = n, n = !1), e ? (a = o = l(a), this.bindings = this.bindings.add(a)) : (e = a, a = this.element, o = this.widget()), l.each(e, function(e, t) {
                function i() {
                    if (n || !0 !== h.options.disabled && !l(this).hasClass("ui-state-disabled")) return ("string" == typeof t ? h[t] : t).apply(h, arguments)
                }
                "string" != typeof t && (i.guid = t.guid = t.guid || i.guid || l.guid++);
                var s = e.match(/^([\w:-]*)\s*(.*)$/),
                    e = s[1] + h.eventNamespace,
                    s = s[2];
                s ? o.on(e, s, i) : a.on(e, i)
            })
        },
        _off: function(e, t) {
            t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.off(t), this.bindings = l(this.bindings.not(e).get()), this.focusable = l(this.focusable.not(e).get()), this.hoverable = l(this.hoverable.not(e).get())
        },
        _delay: function(e, t) {
            var i = this;
            return setTimeout(function() {
                return ("string" == typeof e ? i[e] : e).apply(i, arguments)
            }, t || 0)
        },
        _hoverable: function(e) {
            this.hoverable = this.hoverable.add(e), this._on(e, {
                mouseenter: function(e) {
                    this._addClass(l(e.currentTarget), null, "ui-state-hover")
                },
                mouseleave: function(e) {
                    this._removeClass(l(e.currentTarget), null, "ui-state-hover")
                }
            })
        },
        _focusable: function(e) {
            this.focusable = this.focusable.add(e), this._on(e, {
                focusin: function(e) {
                    this._addClass(l(e.currentTarget), null, "ui-state-focus")
                },
                focusout: function(e) {
                    this._removeClass(l(e.currentTarget), null, "ui-state-focus")
                }
            })
        },
        _trigger: function(e, t, i) {
            var s, n, a = this.options[e];
            if (i = i || {}, (t = l.Event(t)).type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), t.target = this.element[0], n = t.originalEvent)
                for (s in n) s in t || (t[s] = n[s]);
            return this.element.trigger(t, i), !("function" == typeof a && !1 === a.apply(this.element[0], [t].concat(i)) || t.isDefaultPrevented())
        }
    }, l.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(a, o) {
        l.Widget.prototype["_" + a] = function(t, e, i) {
            var s, n = (e = "string" == typeof e ? {
                effect: e
            } : e) ? !0 !== e && "number" != typeof e && e.effect || o : a;
            "number" == typeof(e = e || {}) ? e = {
                duration: e
            }: !0 === e && (e = {}), s = !l.isEmptyObject(e), e.complete = i, e.delay && t.delay(e.delay), s && l.effects && l.effects.effect[n] ? t[a](e) : n !== a && t[n] ? t[n](e.duration, e.easing, i) : t.queue(function(e) {
                l(this)[a](), i && i.call(t[0]), e()
            })
        }
    });
    l.widget, l.ui.keyCode = {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    }, l.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    var a = !1;
    l(document).on("mouseup", function() {
        a = !1
    });
    l.widget("ui.mouse", {
        version: "1.13.2",
        options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var t = this;
            this.element.on("mousedown." + this.widgetName, function(e) {
                return t._mouseDown(e)
            }).on("click." + this.widgetName, function(e) {
                if (!0 === l.data(e.target, t.widgetName + ".preventClickEvent")) return l.removeData(e.target, t.widgetName + ".preventClickEvent"), e.stopImmediatePropagation(), !1
            }), this.started = !1
        },
        _mouseDestroy: function() {
            this.element.off("." + this.widgetName), this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(e) {
            if (!a) {
                this._mouseMoved = !1, this._mouseStarted && this._mouseUp(e), this._mouseDownEvent = e;
                var t = this,
                    i = 1 === e.which,
                    s = !("string" != typeof this.options.cancel || !e.target.nodeName) && l(e.target).closest(this.options.cancel).length;
                return i && !s && this._mouseCapture(e) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    t.mouseDelayMet = !0
                }, this.options.delay)), this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = !1 !== this._mouseStart(e), !this._mouseStarted) ? (e.preventDefault(), !0) : (!0 === l.data(e.target, this.widgetName + ".preventClickEvent") && l.removeData(e.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(e) {
                    return t._mouseMove(e)
                }, this._mouseUpDelegate = function(e) {
                    return t._mouseUp(e)
                }, this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate), e.preventDefault(), a = !0)) : !0
            }
        },
        _mouseMove: function(e) {
            if (this._mouseMoved) {
                if (l.ui.ie && (!document.documentMode || document.documentMode < 9) && !e.button) return this._mouseUp(e);
                if (!e.which)
                    if (e.originalEvent.altKey || e.originalEvent.ctrlKey || e.originalEvent.metaKey || e.originalEvent.shiftKey) this.ignoreMissingWhich = !0;
                    else if (!this.ignoreMissingWhich) return this._mouseUp(e)
            }
            return (e.which || e.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, e), this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted)
        },
        _mouseUp: function(e) {
            this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && l.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer), this.ignoreMissingWhich = !1, a = !1, e.preventDefault()
        },
        _mouseDistanceMet: function(e) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0
        }
    }), l.widget("ui.slider", l.ui.mouse, {
        version: "1.13.2",
        widgetEventPrefix: "slide",
        options: {
            animate: !1,
            classes: {
                "ui-slider": "ui-corner-all",
                "ui-slider-handle": "ui-corner-all",
                "ui-slider-range": "ui-corner-all ui-widget-header"
            },
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: !1,
            step: 1,
            value: 0,
            values: null,
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        numPages: 5,
        _create: function() {
            this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this._calculateNewMax(), this._addClass("ui-slider ui-slider-" + this.orientation, "ui-widget ui-widget-content"), this._refresh(), this._animateOff = !1
        },
        _refresh: function() {
            this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue()
        },
        _createHandles: function() {
            var e, t = this.options,
                i = this.element.find(".ui-slider-handle"),
                s = [],
                n = t.values && t.values.length || 1;
            for (i.length > n && (i.slice(n).remove(), i = i.slice(0, n)), e = i.length; e < n; e++) s.push("<span tabindex='0'></span>");
            this.handles = i.add(l(s.join("")).appendTo(this.element)), this._addClass(this.handles, "ui-slider-handle", "ui-state-default"), this.handle = this.handles.eq(0), this.handles.each(function(e) {
                l(this).data("ui-slider-handle-index", e).attr("tabIndex", 0)
            })
        },
        _createRange: function() {
            var e = this.options;
            e.range ? (!0 === e.range && (e.values ? e.values.length && 2 !== e.values.length ? e.values = [e.values[0], e.values[0]] : Array.isArray(e.values) && (e.values = e.values.slice(0)) : e.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? (this._removeClass(this.range, "ui-slider-range-min ui-slider-range-max"), this.range.css({
                left: "",
                bottom: ""
            })) : (this.range = l("<div>").appendTo(this.element), this._addClass(this.range, "ui-slider-range")), "min" !== e.range && "max" !== e.range || this._addClass(this.range, "ui-slider-range-" + e.range)) : (this.range && this.range.remove(), this.range = null)
        },
        _setupEvents: function() {
            this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles)
        },
        _destroy: function() {
            this.handles.remove(), this.range && this.range.remove(), this._mouseDestroy()
        },
        _mouseCapture: function(e) {
            var i, s, n, a, t, o, h = this,
                r = this.options;
            return !r.disabled && (this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            }, this.elementOffset = this.element.offset(), o = {
                x: e.pageX,
                y: e.pageY
            }, i = this._normValueFromMouse(o), s = this._valueMax() - this._valueMin() + 1, this.handles.each(function(e) {
                var t = Math.abs(i - h.values(e));
                (t < s || s === t && (e === h._lastChangedValue || h.values(e) === r.min)) && (s = t, n = l(this), a = e)
            }), !1 !== this._start(e, a) && (this._mouseSliding = !0, this._handleIndex = a, this._addClass(n, null, "ui-state-active"), n.trigger("focus"), t = n.offset(), o = !l(e.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = o ? {
                left: 0,
                top: 0
            } : {
                left: e.pageX - t.left - n.width() / 2,
                top: e.pageY - t.top - n.height() / 2 - (parseInt(n.css("borderTopWidth"), 10) || 0) - (parseInt(n.css("borderBottomWidth"), 10) || 0) + (parseInt(n.css("marginTop"), 10) || 0)
            }, this.handles.hasClass("ui-state-hover") || this._slide(e, a, i), this._animateOff = !0))
        },
        _mouseStart: function() {
            return !0
        },
        _mouseDrag: function(e) {
            var t = {
                    x: e.pageX,
                    y: e.pageY
                },
                t = this._normValueFromMouse(t);
            return this._slide(e, this._handleIndex, t), !1
        },
        _mouseStop: function(e) {
            return this._removeClass(this.handles, null, "ui-state-active"), this._mouseSliding = !1, this._stop(e, this._handleIndex), this._change(e, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1
        },
        _detectOrientation: function() {
            this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function(e) {
            var t, e = "horizontal" === this.orientation ? (t = this.elementSize.width, e.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (t = this.elementSize.height, e.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)),
                e = e / t;
            return (e = 1 < e ? 1 : e) < 0 && (e = 0), "vertical" === this.orientation && (e = 1 - e), t = this._valueMax() - this._valueMin(), t = this._valueMin() + e * t, this._trimAlignValue(t)
        },
        _uiHash: function(e, t, i) {
            var s = {
                handle: this.handles[e],
                handleIndex: e,
                value: void 0 !== t ? t : this.value()
            };
            return this._hasMultipleValues() && (s.value = void 0 !== t ? t : this.values(e), s.values = i || this.values()), s
        },
        _hasMultipleValues: function() {
            return this.options.values && this.options.values.length
        },
        _start: function(e, t) {
            return this._trigger("start", e, this._uiHash(t))
        },
        _slide: function(e, t, i) {
            var s, n = this.value(),
                a = this.values();
            this._hasMultipleValues() && (s = this.values(t ? 0 : 1), n = this.values(t), 2 === this.options.values.length && !0 === this.options.range && (i = 0 === t ? Math.min(s, i) : Math.max(s, i)), a[t] = i), i !== n && !1 !== this._trigger("slide", e, this._uiHash(t, i, a)) && (this._hasMultipleValues() ? this.values(t, i) : this.value(i))
        },
        _stop: function(e, t) {
            this._trigger("stop", e, this._uiHash(t))
        },
        _change: function(e, t) {
            this._keySliding || this._mouseSliding || (this._lastChangedValue = t, this._trigger("change", e, this._uiHash(t)))
        },
        value: function(e) {
            return arguments.length ? (this.options.value = this._trimAlignValue(e), this._refreshValue(), void this._change(null, 0)) : this._value()
        },
        values: function(e, t) {
            var i, s, n;
            if (1 < arguments.length) return this.options.values[e] = this._trimAlignValue(t), this._refreshValue(), void this._change(null, e);
            if (!arguments.length) return this._values();
            if (!Array.isArray(e)) return this._hasMultipleValues() ? this._values(e) : this.value();
            for (i = this.options.values, s = e, n = 0; n < i.length; n += 1) i[n] = this._trimAlignValue(s[n]), this._change(null, n);
            this._refreshValue()
        },
        _setOption: function(e, t) {
            var i, s = 0;
            switch ("range" === e && !0 === this.options.range && ("min" === t ? (this.options.value = this._values(0), this.options.values = null) : "max" === t && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), Array.isArray(this.options.values) && (s = this.options.values.length), this._super(e, t), e) {
                case "orientation":
                    this._detectOrientation(), this._removeClass("ui-slider-horizontal ui-slider-vertical")._addClass("ui-slider-" + this.orientation), this._refreshValue(), this.options.range && this._refreshRange(t), this.handles.css("horizontal" === t ? "bottom" : "left", "");
                    break;
                case "value":
                    this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                    break;
                case "values":
                    for (this._animateOff = !0, this._refreshValue(), i = s - 1; 0 <= i; i--) this._change(null, i);
                    this._animateOff = !1;
                    break;
                case "step":
                case "min":
                case "max":
                    this._animateOff = !0, this._calculateNewMax(), this._refreshValue(), this._animateOff = !1;
                    break;
                case "range":
                    this._animateOff = !0, this._refresh(), this._animateOff = !1
            }
        },
        _setOptionDisabled: function(e) {
            this._super(e), this._toggleClass(null, "ui-state-disabled", !!e)
        },
        _value: function() {
            var e = this.options.value;
            return e = this._trimAlignValue(e)
        },
        _values: function(e) {
            var t, i;
            if (arguments.length) return e = this.options.values[e], e = this._trimAlignValue(e);
            if (this._hasMultipleValues()) {
                for (t = this.options.values.slice(), i = 0; i < t.length; i += 1) t[i] = this._trimAlignValue(t[i]);
                return t
            }
            return []
        },
        _trimAlignValue: function(e) {
            if (e <= this._valueMin()) return this._valueMin();
            if (e >= this._valueMax()) return this._valueMax();
            var t = 0 < this.options.step ? this.options.step : 1,
                i = (e - this._valueMin()) % t,
                e = e - i;
            return 2 * Math.abs(i) >= t && (e += 0 < i ? t : -t), parseFloat(e.toFixed(5))
        },
        _calculateNewMax: function() {
            var e = this.options.max,
                t = this._valueMin(),
                i = this.options.step;
            (e = Math.round((e - t) / i) * i + t) > this.options.max && (e -= i), this.max = parseFloat(e.toFixed(this._precision()))
        },
        _precision: function() {
            var e = this._precisionOf(this.options.step);
            return e = null !== this.options.min ? Math.max(e, this._precisionOf(this.options.min)) : e
        },
        _precisionOf: function(e) {
            var t = e.toString(),
                e = t.indexOf(".");
            return -1 === e ? 0 : t.length - e - 1
        },
        _valueMin: function() {
            return this.options.min
        },
        _valueMax: function() {
            return this.max
        },
        _refreshRange: function(e) {
            "vertical" === e && this.range.css({
                width: "",
                left: ""
            }), "horizontal" === e && this.range.css({
                height: "",
                bottom: ""
            })
        },
        _refreshValue: function() {
            var t, i, e, s, n, a = this.options.range,
                o = this.options,
                h = this,
                r = !this._animateOff && o.animate,
                u = {};
            this._hasMultipleValues() ? this.handles.each(function(e) {
                i = (h.values(e) - h._valueMin()) / (h._valueMax() - h._valueMin()) * 100, u["horizontal" === h.orientation ? "left" : "bottom"] = i + "%", l(this).stop(1, 1)[r ? "animate" : "css"](u, o.animate), !0 === h.options.range && ("horizontal" === h.orientation ? (0 === e && h.range.stop(1, 1)[r ? "animate" : "css"]({
                    left: i + "%"
                }, o.animate), 1 === e && h.range[r ? "animate" : "css"]({
                    width: i - t + "%"
                }, {
                    queue: !1,
                    duration: o.animate
                })) : (0 === e && h.range.stop(1, 1)[r ? "animate" : "css"]({
                    bottom: i + "%"
                }, o.animate), 1 === e && h.range[r ? "animate" : "css"]({
                    height: i - t + "%"
                }, {
                    queue: !1,
                    duration: o.animate
                }))), t = i
            }) : (e = this.value(), s = this._valueMin(), n = this._valueMax(), i = n !== s ? (e - s) / (n - s) * 100 : 0, u["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[r ? "animate" : "css"](u, o.animate), "min" === a && "horizontal" === this.orientation && this.range.stop(1, 1)[r ? "animate" : "css"]({
                width: i + "%"
            }, o.animate), "max" === a && "horizontal" === this.orientation && this.range.stop(1, 1)[r ? "animate" : "css"]({
                width: 100 - i + "%"
            }, o.animate), "min" === a && "vertical" === this.orientation && this.range.stop(1, 1)[r ? "animate" : "css"]({
                height: i + "%"
            }, o.animate), "max" === a && "vertical" === this.orientation && this.range.stop(1, 1)[r ? "animate" : "css"]({
                height: 100 - i + "%"
            }, o.animate))
        },
        _handleEvents: {
            keydown: function(e) {
                var t, i, s, n = l(e.target).data("ui-slider-handle-index");
                switch (e.keyCode) {
                    case l.ui.keyCode.HOME:
                    case l.ui.keyCode.END:
                    case l.ui.keyCode.PAGE_UP:
                    case l.ui.keyCode.PAGE_DOWN:
                    case l.ui.keyCode.UP:
                    case l.ui.keyCode.RIGHT:
                    case l.ui.keyCode.DOWN:
                    case l.ui.keyCode.LEFT:
                        if (e.preventDefault(), !this._keySliding && (this._keySliding = !0, this._addClass(l(e.target), null, "ui-state-active"), !1 === this._start(e, n))) return
                }
                switch (s = this.options.step, t = i = this._hasMultipleValues() ? this.values(n) : this.value(), e.keyCode) {
                    case l.ui.keyCode.HOME:
                        i = this._valueMin();
                        break;
                    case l.ui.keyCode.END:
                        i = this._valueMax();
                        break;
                    case l.ui.keyCode.PAGE_UP:
                        i = this._trimAlignValue(t + (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case l.ui.keyCode.PAGE_DOWN:
                        i = this._trimAlignValue(t - (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case l.ui.keyCode.UP:
                    case l.ui.keyCode.RIGHT:
                        if (t === this._valueMax()) return;
                        i = this._trimAlignValue(t + s);
                        break;
                    case l.ui.keyCode.DOWN:
                    case l.ui.keyCode.LEFT:
                        if (t === this._valueMin()) return;
                        i = this._trimAlignValue(t - s)
                }
                this._slide(e, n, i)
            },
            keyup: function(e) {
                var t = l(e.target).data("ui-slider-handle-index");
                this._keySliding && (this._keySliding = !1, this._stop(e, t), this._change(e, t), this._removeClass(l(e.target), null, "ui-state-active"))
            }
        }
    })
});
$(document).ready(function() {
    if ($('#categoria-pg').length > 0) {
        paginaAtual = "Categoria";
        if ($('.dg-categoria-semfavoritos').length === 0) {
            createGTAGItems($('.dg-boxproduto-lista .dg-boxproduto'), "Categoria");
        }
        if ($('.dg-categoria-desc-wrapper').length > 0) {
            descCategoria();
        }
    } else if ($('#busca-pg').length > 0) {
        paginaAtual = "Busca";
        createGTAGItems($('.dg-boxproduto-lista .dg-boxproduto'), "Busca");
    }
    $(".pageFooter").html($(".pageHeader").html());
    $(".jsAbrirOrdenar").click(function() {
        $(".dg-categoria-ordenacao").toggleClass("dg-ativo");
    });
    $(".jsAbrirFiltrar").click(function() {
        $(".dg-categoria-sidebar").toggleClass("dg-ativo");
    });

    function descCategoria() {
        var descricao = $('.dg-categoria-desc-wrapper');
        var descricaoTxt = descricao.html();
        var descricaoTitle = $('.dg-categoria-desc-titulo').text();
        var currentSize = descricao.height();
        var fullSize = descricao[0].scrollHeight;
        if (currentSize < fullSize - 4) {
            var content = '<a href="javascript:void(0)" class="dg-categoria-desc-vermais"><span class="dg-categoria-desc-vermais-mais">Ver Mais</span> <span class="dg-categoria-desc-vermais-menos">Ver Menos</span></a>';
            if (window.innerWidth > 991) {
                $(".dg-categoria-desc .dg-categoria-desc-vermais").remove();
                $(".dg-categoria-desc-titulo").append(content);
            }
            $(".dg-categoria-desc-wrapper").addClass("dg-txtao");
            $(".dg-categoria-desc-vermais").click(function() {
                if ($(".dg-familia").length > 0 && window.innerWidth < 992) {
                    $('body').addClass("dg-overflow-hidden");
                    if ($(".dg-categoria-desc-wrapper-side").length === 0) {
                        $(".dg-categoria-desc").append(`<div class="dg-categoria-desc-wrapper-side">
                                <div class="dg-categoria-desc-wrapper-side-text-wrapper">
                                    <button class="dg-categoria-desc-wrapper-side-close jsFecharAbaDescricao dg-desktop-hide"><span class="dg-icon dg-icon-arrow01-left"></span>Voltar</button>
                                    <div class="dg-categoria-desc-wrapper-side-title">` + descricaoTitle + `</div>
                                    <div class="dg-categoria-desc-wrapper-side-text">` + descricaoTxt + `</div>
                                </div>
                            </div>`)
                        $('.jsFecharAbaDescricao').click(function() {
                            $('.dg-categoria-desc-wrapper-side').removeClass('dg-ativo');
                            $('body').removeClass("dg-overflow-hidden");
                        });
                        setTimeout(function() {
                            $(".dg-categoria-desc-wrapper-side").addClass('dg-ativo');
                        }, 200);
                    } else {
                        $(".dg-categoria-desc-wrapper-side").addClass('dg-ativo');
                    }
                } else {
                    $(".dg-categoria-desc-wrapper").toggleClass("dg-ativo");
                    $(".dg-categoria-desc-vermais").toggleClass("dg-ativo");
                }
            });
            $('.dg-categoria-topo-wrapper').addClass('dg-vermais');
        } else {
            if ($(".dg-familia").length > 0) {
                $(".dg-familia").removeClass('dg-familia');
            }
        }
    }
});
// Preço Categoria Slider
(function PrecoRangeSlider() {
    var slider = $('.jsProductPriceRangeSlider');
    if (slider.length > 0) {
        function findGetParameter(parameterName) {
            var result = null,
                tmp = [];
            location.search.substr(1).split("&").forEach(function(item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
            return result;
        }
        var urlbase = $('.jsProductPriceRangeSlider').data('base-url');
        var fv = findGetParameter('fv');
        var menorPrecoAtual = 0;
        var maiorPrecoAtual = 0;
        if (fv) {
            fv = fv.split(';');
            menorPrecoAtual = parseInt(fv[0]);
            maiorPrecoAtual = parseInt(fv[1]);
            _mep = fv[0].replace(",", ".");
            _maxp = fv[1].replace(",", ".");
        }

        function removeDecimal(value) {
            var newValue = value.split('.').slice(0, -1);
            var finalValue = '';
            for (var i = 0; i < newValue.length; i++) {
                // console.log(newValue[i]);
                finalValue += newValue[i];
            }
            return finalValue;
        }
        var valueMin = parseInt($('.jsProductPriceRangeSlider').attr('data-min-price'));
        if (!valueMin) {
            valueMin = 0;
        }
        var valueMax = parseInt($('.jsProductPriceRangeSlider').attr('data-max-price'));
        $(".jsProductPriceRangeSliderLow").attr('data-current-min', valueMin);
        $(".jsProductPriceRangeSliderMax").attr('data-current-max', valueMax);
        $(".jsProductPriceRangeSlider").slider({
            range: true,
            min: valueMin,
            max: valueMax,
            values: [menorPrecoAtual, maiorPrecoAtual > 0 ? maiorPrecoAtual : valueMax],
            slide: function(event, ui) {
                $(".jsProductPriceRangeSliderLow").attr('data-current-min', ui.values[0]);
                $(".jsProductPriceRangeSliderMax").attr('data-current-max', ui.values[1]);
                $(".jsProductPriceRangeSliderLow").text("R$" + ui.values[0]);
                $(".jsProductPriceRangeSliderMax").text("R$" + ui.values[1]);
            },
            change: function() {
                var Url = window.location.href;
                if (Url.indexOf("?") <= -1) {
                    locationHrefCustom('?');
                } else {
                    if (Url.indexOf("fv") > 0) {
                        var UrNovo = "";
                        var parametrosDaUrl = Url.split("?")[1];
                        var listaDeParametros = parametrosDaUrl.split("&");
                        for (var i = 0; i < listaDeParametros.length; i++) {
                            var parametro = listaDeParametros[i].split("=");
                            var chave = parametro[0];
                            var valor = parametro[1];
                            if (chave == "fv") {
                                valor = $(".jsProductPriceRangeSliderLow").attr('data-current-min') + ';' + $(".jsProductPriceRangeSliderMax").attr('data-current-max');
                            }
                            if (chave.length > 0) {
                                if (chave !== "fv") {
                                    UrNovo = UrNovo + chave + "=" + valor + "&";
                                } else {
                                    UrNovo = UrNovo + chave + "=" + valor;
                                }
                            }
                        }
                        var parametrosDaUrl2 = Url.split("?")[0];
                        UrNovo = parametrosDaUrl2 + "?" + UrNovo;
                        location.href = UrNovo;
                    } else {
                        locationHrefCustom('&');
                    }
                }

                function locationHrefCustom(type) {
                    location.href = Url + type + 'fv=' + $(".jsProductPriceRangeSliderLow").attr('data-current-min') + ';' + $(".jsProductPriceRangeSliderMax").attr('data-current-max');
                }
            }
        });
        $(".jsProductPriceRangeSliderLow").text("R$" + $(".jsProductPriceRangeSlider").slider("values", 0));
        $(".jsProductPriceRangeSliderMax").text("R$" + $(".jsProductPriceRangeSlider").slider("values", 1));
    }
})();
