! function(a) {
    "use strict";

    a.module("ngSlider", []).directive("slider", ["$compile", "$templateCache", "$timeout", "$window", "slider", function(b, c, d, e, f) {
        return {
            restrict: "AE",
            require: "?ngModel",
            scope: {
                options: "="
            },
            priority: 1,
            link: function(g, h, i, j) {
                d(function(){
                    var splittedValue = j.$viewValue.split(';');
                    g.options.budgetValues = {
                        min:splittedValue[0],
                        max:splittedValue[1]
                    };
                });
                function k() {
                    a.element(e).bind("resize", function() {
                        g.slider.onresize()
                    })
                }
                if (j) {
                    if (!g.options) throw new Error('You must provide a value for "options" attribute.');
                    a.isString(g.options) && (g.options = a.toJson(g.options)), g.mainSliderClass = "jslider", g.mainSliderClass += " jslider_round", g.mainSliderClass += g.options.vertical ? " vertical " : "", g.mainSliderClass += g.options.css ? " sliderCSS" : "", h.after(b(c.get("ng-slider/slider-bar.tmpl.html"))(g, function(a, b) {
                        b.tmplElt = a
                    }));
                    var l = !1,
                        m = function() {
                            g.from = "" + g.options.from, g.to = "" + g.options.to, g.options.calculate && "function" == typeof g.options.calculate && (g.from = g.options.calculate(g.from), g.to = g.options.calculate(g.to));
                            var b = {
                                from: g.options.from,
                                to: g.options.to,
                                step: g.options.step,
                                smooth: g.options.smooth,
                                limits: !0,
                                round: g.options.round || !1,
                                value: j.$viewValue,
                                dimension: "",
                                scale: g.options.scale,
                                vertical: g.options.vertical,
                                css: g.options.css,
                                cb: n
                            };
                            b.calculate = g.options.calculate || void 0, b.onstatechange = g.options.onstatechange || void 0, g.slider = g.slider ? g.slider.init(h, g.tmplElt, b) : o(h, g.tmplElt, b), l || k();
                            var c = g.tmplElt.find("div")[7];
                            a.element(c).html(g.slider.generateScale()), g.slider.drawScale(c), l = !0
                        };
                    j.$render = function() {
                        (j.$viewValue || 0 === j.$viewValue) && ("number" == typeof j.$viewValue && (j.$viewValue = "" + j.$viewValue), j.$viewValue.split(";")[1] || (g.mainSliderClass += " jslider-single"), g.slider && (g.slider.getPointers()[0].set(j.$viewValue.split(";")[0], !0), j.$viewValue.split(";")[1] && g.slider.getPointers()[1].set(j.$viewValue.split(";")[1], !0)))
                    };
                    var n = function(a) {
                        g.disabled || (g.$apply(function() {
                            j.$setViewValue(a)
                        }), g.options.callback && g.options.callback(a))
                    };
                    g.$watch("options", function() {
                        d(function() {
                            m()
                        })
                    }), i.$observe(i.ngDisabled, function(a) {
                        g.disabled = a, g.slider && (g.tmplElt.toggleClass("disabled"), g.slider.disable(a))
                    });
                    var o = function(a, b, c) {
                        return new f(a, b, c)
                    }
                }
            }
        }
    }]).config(function() {}).run(function() {})
}(angular),
function(a) {
    "use strict";
    a.module("ngSlider").constant("sliderConstants", {
        SLIDER: {
            settings: {
                from: 1,
                to: 40,
                step: 1,
                smooth: !0,
                limits: !1,
                round: !1,
                value: "3",
                dimension: "",
                vertical: !1,
                calculate: !1,
                onstatechange: !1,
                callback: !1
            },
            className: "jslider",
            selector: ".jslider-"
        },
        EVENTS: {}
    })
}(angular),
function(a) {
    "use strict";
    a.module("ngSlider").factory("sliderUtils", ["$window", function(a) {
        return {
            offset: function(a) {
                var b = a[0],
                    c = 0,
                    d = 0,
                    e = document.documentElement || document.body,
                    f = window.pageXOffset || e.scrollLeft,
                    g = window.pageYOffset || e.scrollTop;
                return c = b.getBoundingClientRect().left + f, d = b.getBoundingClientRect().top + g, {
                    left: c,
                    top: d
                }
            },
            browser: function() {
                var b = a.navigator.userAgent,
                    c = {
                        mozilla: /mozilla/i,
                        chrome: /chrome/i,
                        safari: /safari/i,
                        firefox: /firefox/i,
                        ie: /internet explorer/i
                    };
                for (var d in c)
                    if (c[d].test(b)) return d;
                return "unknown"
            }
        }
    }])
}(angular),
function(a) {
    "use strict";
    a.module("ngSlider").factory("sliderDraggable", ["sliderUtils", function(b) {
        function c() {
            this._init.apply(this, arguments)
        }
        return c.prototype.oninit = function() {}, c.prototype.events = function() {}, c.prototype.onmousedown = function() {
            this.ptr.css({
                position: "absolute"
            })
        }, c.prototype.onmousemove = function(a, b, c) {
            this.ptr.css({
                left: b,
                top: c
            })
        }, c.prototype.onmouseup = function() {}, c.prototype.isDefault = {
            drag: !1,
            clicked: !1,
            toclick: !0,
            mouseup: !1
        }, c.prototype._init = function() {
            if (arguments.length > 0) {
                if (this.ptr = arguments[0], this.parent = arguments[2], !this.ptr) return;
                this.is = {}, a.extend(this.is, this.isDefault);
                var c = b.offset(this.ptr);
                this.d = {
                    left: c.left,
                    top: c.top,
                    width: this.ptr[0].clientWidth,
                    height: this.ptr[0].clientHeight
                }, this.oninit.apply(this, arguments), this._events()
            }
        }, c.prototype._getPageCoords = function(a) {
            return a.targetTouches && a.targetTouches[0] ? {
                x: a.targetTouches[0].pageX,
                y: a.targetTouches[0].pageY
            } : {
                x: a.pageX,
                y: a.pageY
            }
        }, c.prototype._bindEvent = function(a, b, c) {
            this.supportTouches_ ? a[0].addEventListener(this.events_[b], c, !1) : a.bind(this.events_[b], c)
        }, c.prototype._events = function() {
            var b = this;
            this.supportTouches_ = "ontouchend" in document, this.events_ = {
                click: this.supportTouches_ ? "touchstart" : "click",
                down: this.supportTouches_ ? "touchstart" : "mousedown",
                move: this.supportTouches_ ? "touchmove" : "mousemove",
                up: this.supportTouches_ ? "touchend" : "mouseup",
                mousedown: (this.supportTouches_, "mousedown")
            };
            var c = a.element(window.document);
            this._bindEvent(c, "move", function(a) {
                b.is.drag && (a.stopPropagation(), a.preventDefault(), b.parent.disabled || b._mousemove(a))
            }), this._bindEvent(c, "down", function(a) {
                b.is.drag && (a.stopPropagation(), a.preventDefault())
            }), this._bindEvent(c, "up", function(a) {
                b._mouseup(a)
            }), this._bindEvent(this.ptr, "down", function(a) {
                return b._mousedown(a), !1
            }), this._bindEvent(this.ptr, "up", function(a) {
                b._mouseup(a)
            }), this.events()
        }, c.prototype._mousedown = function(b) {
            this.is.drag = !0, this.is.clicked = !1, this.is.mouseup = !1;
            var c = this._getPageCoords(b);
            this.cx = c.x - this.ptr[0].offsetLeft, this.cy = c.y - this.ptr[0].offsetTop, a.extend(this.d, {
                left: this.ptr[0].offsetLeft,
                top: this.ptr[0].offsetTop,
                width: this.ptr[0].clientWidth,
                height: this.ptr[0].clientHeight
            }), this.outer && this.outer.get(0) && this.outer.css({
                height: Math.max(this.outer.height(), $(document.body).height()),
                overflow: "hidden"
            }), this.onmousedown(b)
        }, c.prototype._mousemove = function(a) {
            this.is.toclick = !1;
            var b = this._getPageCoords(a);
            this.onmousemove(a, b.x - this.cx, b.y - this.cy);
        }, c.prototype._mouseup = function(a) {
            if (this.is.drag) {
                this.is.drag = !1;
                var c = b.browser();
                this.outer && this.outer.get(0) && (this.outer.css("mozilla" === c ? {
                    overflow: "hidden"
                } : {
                    overflow: "visible"
                }), this.outer.css({
                    height: "auto"
                })), this.onmouseup(a)
            }
        }, c
    }])
}(angular),
function(a) {
    "use strict";
    a.module("ngSlider").factory("sliderPointer", ["sliderDraggable", "sliderUtils", function(b, c) {
        function d() {
            b.apply(this, arguments)
        }
        return d.prototype = new b, d.prototype.oninit = function(b, c, d, e) {
            this.uid = c, this.parent = e, this.value = {}, this.vertical = d, this.settings = a.copy(e.settings)
        }, d.prototype.onmousedown = function() {
            var a = c.offset(this.parent.domNode),
                b = {
                    left: a.left,
                    top: a.top,
                    width: this.parent.domNode[0].clientWidth,
                    height: this.parent.domNode[0].clientHeight
                };
            this._parent = {
                offset: b,
                width: b.width,
                height: b.height
            }, this.ptr.addClass("jslider-pointer-hover")
        }, d.prototype.onmousemove = function(a) {
            var b = this._getPageCoords(a);
            this._set(this.calc(this.vertical ? b.y : b.x))
        }, d.prototype.onmouseup = function() {
            this.settings.cb && a.isFunction(this.settings.cb) && this.settings.cb.call(this.parent, this.parent.getValue()), this.is.drag || this.ptr.removeClass("jslider-pointer-hover")
        }, d.prototype.limits = function(a) {
            return this.parent.limits(a, this)
        }, d.prototype.calc = function(a) {
            return this.limits(this.vertical ? 100 * (a - this._parent.offset.top) / this._parent.height : 100 * (a - this._parent.offset.left) / this._parent.width)
        }, d.prototype.set = function(a, b) {
            this.value.origin = this.parent.round(a), this._set(this.parent.valueToPrc(a, this), b)
        }, d.prototype._set = function(a, b) {
            b || (this.value.origin = this.parent.prcToValue(a)), this.value.prc = a, this.ptr.css(this.vertical ? {
                top: a + "%",
                marginTop: -5
            } : {
                left: a + "%"
            }), this.parent.redraw(this)
        }, d
    }])
}(angular),
function(a) {
    "use strict";

    a.module("ngSlider").factory("slider", ["$timeout", "sliderPointer", "sliderConstants", "sliderUtils", function($timeout, b, c, d) {
        function e() {
            return this.init.apply(this, arguments)
        }
        return e.prototype.init = function(b, c, d) {
            return this.settings = d, this.inputNode = b, this.inputNode.addClass("ng-hide"), this.settings.interval = this.settings.to - this.settings.from, this.settings.calculate && a.isFunction(this.settings.calculate) && (this.nice = this.settings.calculate), this.settings.onstatechange && a.isFunction(this.settings.onstatechange) && (this.onstatechange = this.settings.onstatechange), this.is = {
                init: !1
            }, this.o = {}, this.initValue = {}, this.create(c), this
        }, e.prototype.create = function(c) {
            var e = this;
            this.domNode = c;
            var f = this.domNode.find("div"),
                g = this.domNode.find("i"),
                h = a.element(f[1]),
                i = a.element(f[2]),
                j = a.element(f[5]),
                k = a.element(f[6]),
                l = a.element(g[0]),
                m = a.element(g[2]),
                n = a.element(g[3]),
                o = a.element(g[4]),
                p = a.element(g[5]),
                q = d.offset(this.domNode),
                r = {
                    left: q.left,
                    top: q.top,
                    width: this.domNode[0].clientWidth,
                    height: this.domNode[0].clientHeight
                };
            this.sizes = {
                domWidth: this.domNode[0].clientWidth,
                domHeight: this.domNode[0].clientHeight,
                domOffset: r
            }, a.extend(this.o, {
                pointers: {},
                labels: {
                    0: {
                        o: j
                    },
                    1: {
                        o: k
                    }
                },
                limits: {
                    0: a.element(f[3]),
                    1: a.element(f[4])
                },
                indicators: {
                    0: n,
                    1: o,
                    2: p
                }
            }), a.extend(this.o.labels[0], {
                value: this.o.labels[0].o.find("span")
            }), a.extend(this.o.labels[1], {
                value: this.o.labels[1].o.find("span")
            }), e.settings.value.split(";")[1] || (this.settings.single = !0);
            var s = [h, i];
            a.forEach(s, function(c, d) {
                e.settings = a.copy(e.settings);
                var f = e.settings.value.split(";")[d];
                if (f) {
                    e.o.pointers[d] = new b(c, d, e.settings.vertical, e);
                    var g = e.settings.value.split(";")[d - 1];
                    g && parseInt(f, 10) < parseInt(g, 10) && (f = g);
                    var h = f < e.settings.from ? e.settings.from : f;
                    h = f > e.settings.to ? e.settings.to : f, e.o.pointers[d].set(h, !0), 0 === d && e.domNode.bind("mousedown", e.clickHandler.apply(e))
                }
            }), this.o.value = a.element(this.domNode.find("i")[2]), this.is.init = !0, this.settings.css && (l.css(this.settings.css.background ? this.settings.css.background : {}), this.o.pointers[1] || (n.css(this.settings.css.before ? this.settings.css.before : {}), o.css(this.settings.css["default"] ? this.settings.css["default"] : {}), p.css(this.settings.css.after ? this.settings.css.after : {})), m.css(this.settings.css.range ? this.settings.css.range : {}), h.css(this.settings.css.pointer ? this.settings.css.pointer : {}), i.css(this.settings.css.pointer ? this.settings.css.pointer : {})), a.forEach(this.o.pointers, function(a) {
                e.redraw(a)
            })
        }, e.prototype.clickHandler = function() {
            var a = this;
            return function(b) {
                if (!a.disabled) {
                    var c = b.target.className,
                        e = 0;
                    c.indexOf("jslider-pointer-to") > 0 && (e = 1);
                    var f = d.offset(a.domNode),
                        g = {
                            left: f.left,
                            top: f.top,
                            width: a.domNode[0].clientWidth,
                            height: a.domNode[0].clientHeight
                        },
                        h = a.o.pointers[e];
                    return h._parent = {
                        offset: g,
                        width: g.width,
                        height: g.height
                    }, h._mousemove(b), h.onmouseup(), !1
                }
            }
        }, e.prototype.disable = function(a) {
            this.disabled = a
        }, e.prototype.nice = function(a) {
            return a
        }, e.prototype.onstatechange = function() {}, e.prototype.limits = function(a, b) {
            if (!this.settings.smooth) {
                var c = 100 * this.settings.step / this.settings.interval;
                a = Math.round(a / c) * c
            }
            var d = this.o.pointers[1 - b.uid];
            return d && b.uid && a < d.value.prc && (a = d.value.prc), d && !b.uid && a > d.value.prc && (a = d.value.prc), 0 > a && (a = 0), a > 100 && (a = 100), Math.round(10 * a) / 10
        }, e.prototype.getPointers = function() {
            return this.o.pointers
        }, e.prototype.generateScale = function() {
            if (this.settings.scale && this.settings.scale.length > 0) {
                for (var a = "", b = this.settings.scale, c = (100 / (b.length - 1)).toFixed(2), d = this.settings.vertical ? "top" : "left", e = 0; e < b.length; e++) a += '<span style="' + d + ": " + e * c + '%">' + ("|" != b[e] ? "<ins>" + b[e] + "</ins>" : "") + "</span>";
                return a
            }
            return ""
        }, e.prototype.onresize = function() {
            var b = this;
            this.sizes = {
                domWidth: this.domNode[0].clientWidth,
                domHeight: this.domNode[0].clientHeight,
                domOffset: {
                    left: this.domNode[0].offsetLeft,
                    top: this.domNode[0].offsetTop,
                    width: this.domNode[0].clientWidth,
                    height: this.domNode[0].clientHeight
                }
            }, a.forEach(this.o.pointers, function(a) {
                b.redraw(a)
            })
        }, e.prototype.update = function() {
            this.onresize(), this.drawScale()
        }, e.prototype.drawScale = function(b) {
            a.forEach(a.element(b).find("ins"), function(a) {
                a.style.marginLeft = -a.clientWidth / 2
            })
        }, e.prototype.redraw = function(a) {
            var that = this;
            $timeout(function(){
                var optionsRef = angular.element(that.o.labels[0].o.find("span")[0]).scope().options.budgetValues,
                    s = that.o.labels[0].o.find("span")[0].textContent || that.o.labels[0].o.find("span")[0].innerText,
                    splittedVals = s.replace(/\s/g,"").split("–"),
                    s2 = that.o.labels[1].o.find("span")[0].textContent || that.o.labels[1].o.find("span")[0].innerText;

                optionsRef.min = splittedVals[0];
                optionsRef.max = s2;
            });
            if (!this.is.init) return this.o.pointers[0] && !this.o.pointers[1] && (this.originValue = this.o.pointers[0].value.prc, this.o.indicators[0].css(this.settings.vertical ? {
                top: 0,
                height: this.o.pointers[0].value.prc + "%"
            } : {
                left: 0,
                width: this.o.pointers[0].value.prc + "%"
            }), this.o.indicators[1].css(this.settings.vertical ? {
                top: this.o.pointers[0].value.prc + "%"
            } : {
                left: this.o.pointers[0].value.prc + "%"
            }), this.o.indicators[2].css(this.settings.vertical ? {
                top: this.o.pointers[0].value.prc + "%"
            } : {
                left: this.o.pointers[0].value.prc + "%"
            })), !1;
            if (this.setValue(), this.o.pointers[0] && this.o.pointers[1]) {
                var b = this.settings.vertical ? {
                    top: this.o.pointers[0].value.prc + "%",
                    height: this.o.pointers[1].value.prc - this.o.pointers[0].value.prc + "%"
                } : {
                    left: this.o.pointers[0].value.prc + "%",
                    width: this.o.pointers[1].value.prc - this.o.pointers[0].value.prc + "%"
                };
                this.o.value.css(b)
            }
            if (this.o.pointers[0] && !this.o.pointers[1]) {
                var c = this.o.pointers[0].value.prc - this.originValue;
                this.o.indicators[2].css(c >= 0 ? this.settings.vertical ? {
                    height: c + "%"
                } : {
                    width: c + "%"
                } : this.settings.vertical ? {
                    height: 0
                } : {
                    width: 0
                }), this.o.indicators[0].css(this.o.pointers[0].value.prc < this.originValue ? this.settings.vertical ? {
                    height: this.o.pointers[0].value.prc + "%"
                } : {
                    width: this.o.pointers[0].value.prc + "%"
                } : this.settings.vertical ? {
                    height: this.originValue + "%"
                } : {
                    width: this.originValue + "%"
                })
            }
            this.o.labels[a.uid].value.html(this.nice(a.value.origin)), this.redrawLabels(a)
        }, e.prototype.redrawLabels = function(a) {
            function b(a, b, d) {
                b.margin = -b.label / 2;
                var e = c.settings.vertical ? c.sizes.domHeight : c.sizes.domWidth,
                    f = b.border + b.margin;
                return 0 > f && (b.margin -= f), b.border + b.label / 2 > e ? (b.margin = 0, b.right = !0) : b.right = !1, a.o.css(c.settings.vertical ? {
                    top: d + "%",
                    marginLeft: "20px",
                    marginTop: b.margin,
                    bottom: "auto"
                } : {
                    left: d + "%",
                    marginLeft: b.margin + "px",
                    right: "auto"
                }), b.right && a.o.css(c.settings.vertical ? {
                    top: "auto",
                    bottom: 0
                } : {
                    left: "auto",
                    right: 0
                }), b
            }
            var c = this,
                d = this.o.labels[a.uid],
                e = a.value.prc,
                f = {
                    label: c.settings.vertical ? d.o[0].offsetHeight : d.o[0].offsetWidth,
                    right: !1,
                    border: e * (c.settings.vertical ? this.sizes.domHeight : this.sizes.domWidth) / 100
                },
                g = null,
                h = null;
            if (!this.settings.single && !this.settings.vertical) switch (h = this.o.pointers[1 - a.uid], g = this.o.labels[h.uid], a.uid) {
                case 0:
                    f.border + f.label / 2 > g.o[0].offsetLeft - this.sizes.domOffset.left ? (g.o.css({
                        visibility: "hidden"
                    }), g.value.html(this.nice(h.value.origin)), d.o.css({
                        visibility: "visible"
                    }), e = (h.value.prc - e) / 2 + e, h.value.prc != a.value.prc && (d.value.html(this.nice(a.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(h.value.origin)), f.label = d.o[0].offsetWidth, f.border = e * i / 100)) : g.o.css({
                        visibility: "visible"
                    });
                    break;
                case 1:
                    f.border - f.label / 2 < g.o[0].offsetLeft - this.sizes.domOffset.left + g.o[0].offsetWidth ? (g.o.css({
                        visibility: "hidden"
                    }), g.value.html(this.nice(h.value.origin)), d.o.css({
                        visibility: "visible"
                    }), e = (e - h.value.prc) / 2 + h.value.prc, h.value.prc != a.value.prc && (d.value.html(this.nice(h.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(a.value.origin)), f.label = d.o[0].offsetWidth, f.border = e * i / 100)) : g.o.css({
                        visibility: "visible"
                    })
            }
            f = b(d, f, e);
            var i = c.settings.vertical ? c.sizes.domHeight : c.sizes.domWidth;
            if (g) {
                var j = {
                    label: c.settings.vertical ? g.o[0].offsetHeight : g.o[0].offsetWidth,
                    right: !1,
                    border: h.value.prc * this.sizes.domWidth / 100
                };
                f = b(g, j, h.value.prc)
            }
            this.redrawLimits()
        }, e.prototype.redrawLimits = function() {
            if (this.settings.limits) {
                var b = [!0, !0];
                for (var c in this.o.pointers)
                    if (!this.settings.single || 0 === c) {
                        var d = this.o.pointers[c],
                            e = this.o.labels[d.uid],
                            f = e.o[0].offsetLeft - this.sizes.domOffset.left,
                            g = this.o.limits[0];
                        f < g[0].clientWidth && (b[0] = !1), g = this.o.limits[1], f + e.o[0].clientWidth > this.sizes.domWidth - g[0].clientWidth && (b[1] = !1)
                    }
                for (var h = 0; h < b.length; h++) a.element(this.o.limits[h]).addClass(b[h] ? "animate-show" : "animate-hidde")
            }
        }, e.prototype.setValue = function() {
            var a = this.getValue();
            this.inputNode.attr("value", a), this.onstatechange.call(this, a, this.inputNode)
        }, e.prototype.getValue = function() {
            if (!this.is.init) return !1;
            var b = this,
                c = "";
            return a.forEach(this.o.pointers, function(a, d) {
                void 0 === a.value.prc || isNaN(a.value.prc) || (c += (d > 0 ? ";" : "") + b.prcToValue(a.value.prc))
            }), c
        }, e.prototype.getPrcValue = function() {
            if (!this.is.init) return !1;
            var a = "";
            return a
        }, e.prototype.prcToValue = function(a) {
            var b;
            if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0)
                for (var c = this.settings.heterogeneity, d = 0, e = this.settings.from, f = 0; f <= c.length; f++) {
                    var g;
                    g = c[f] ? c[f].split("/") : [100, this.settings.to], a >= d && a <= g[0] && (b = e + (a - d) * (g[1] - e) / (g[0] - d)), d = g[0], e = g[1]
                } else b = this.settings.from + a * this.settings.interval / 100;
            return this.round(b)
        }, e.prototype.valueToPrc = function(a, b) {
            var c;
            if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0)
                for (var d = this.settings.heterogeneity, e = 0, f = this.settings.from, g = 0; g <= d.length; g++) {
                    var h;
                    h = d[g] ? d[g].split("/") : [100, this.settings.to], a >= f && a <= h[1] && (c = b.limits(e + (a - f) * (h[0] - e) / (h[1] - f))), e = h[0], f = h[1]
                } else c = b.limits(100 * (a - this.settings.from) / this.settings.interval);
            return c
        }, e.prototype.round = function(a) {
            return a = Math.round(a / this.settings.step) * this.settings.step, a = this.settings.round ? Math.round(a * Math.pow(10, this.settings.round)) / Math.pow(10, this.settings.round) : Math.round(a)
        }, e
    }])
}(angular),
function(a) {
    "use strict";
    a.module("ngSlider").run(["$templateCache", function(a) {
        a.put("ng-slider/slider-bar.tmpl.html", '<span ng-class="mainSliderClass" id="{{sliderTmplId}}"><table><tr><td><div class="jslider-bg"><i class="l"></i><i class="r"></i><i class="v"></i><i class="p"></i><i class="s"></i><i class="f"></i></div><div class="jslider-pointer"></div><div class="jslider-pointer jslider-pointer-to"></div><div class="jslider-label"><span>{{from}}</span>{{options.dimension}}</div><div class="jslider-label jslider-label-to"><span>{{to}}</span>{{options.dimension}}</div><div class="jslider-value"><span></span>{{options.dimension}}</div><div class="jslider-value jslider-value-to"><span></span>{{options.dimension}}</div><div class="jslider-scale" id="{{sliderScaleDivTmplId}}"></div></td></tr></table></span>')
    }])
}(window.angular);