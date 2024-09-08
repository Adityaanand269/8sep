/*! SmartMenus jQuery Plugin - v1.2.1 - November 3, 2022
 * http://www.smartmenus.org/
 * Copyright Vasil Dinkov, Vadikom Web Ltd. http://vadikom.com; Licensed MIT */ !(function (
  a
) {
  "function" == typeof define && define.amd
    ? define(["jquery"], a)
    : "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = a(require("jquery")))
    : a(jQuery);
})(function (a) {
  function b(b) {
    var i = ".smartmenus_mouse";
    if (h || b) h && b && (a(document).off(i), (h = !1));
    else {
      var j = !0,
        k = null,
        l = {
          mousemove: function (b) {
            var c = { x: b.pageX, y: b.pageY, timeStamp: new Date().getTime() };
            if (k) {
              var d = Math.abs(k.x - c.x),
                g = Math.abs(k.y - c.y);
              if (
                (d > 0 || g > 0) &&
                d <= 4 &&
                g <= 4 &&
                c.timeStamp - k.timeStamp <= 300 &&
                ((f = !0), j)
              ) {
                var h = a(b.target).closest("a");
                h.is("a") &&
                  a.each(e, function () {
                    if (a.contains(this.$root[0], h[0]))
                      return this.itemEnter({ currentTarget: h[0] }), !1;
                  }),
                  (j = !1);
              }
            }
            k = c;
          },
        };
      (l[
        g
          ? "touchstart"
          : "pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut"
      ] = function (a) {
        c(a.originalEvent) && (f = !1);
      }),
        a(document).on(d(l, i)),
        (h = !0);
    }
  }
  function c(a) {
    return !/^(4|mouse)$/.test(a.pointerType);
  }
  function d(a, b) {
    b || (b = "");
    var c = {};
    for (var d in a) c[d.split(" ").join(b + " ") + b] = a[d];
    return c;
  }
  var e = [],
    f = !1,
    g = "ontouchstart" in window,
    h = !1,
    i =
      window.requestAnimationFrame ||
      function (a) {
        return setTimeout(a, 1e3 / 60);
      },
    j =
      window.cancelAnimationFrame ||
      function (a) {
        clearTimeout(a);
      },
    k = !!a.fn.animate;
  return (
    (a.SmartMenus = function (b, c) {
      (this.$root = a(b)),
        (this.opts = c),
        (this.rootId = ""),
        (this.accessIdPrefix = ""),
        (this.$subArrow = null),
        (this.activatedItems = []),
        (this.visibleSubMenus = []),
        (this.showTimeout = 0),
        (this.hideTimeout = 0),
        (this.scrollTimeout = 0),
        (this.clickActivated = !1),
        (this.focusActivated = !1),
        (this.zIndexInc = 0),
        (this.idInc = 0),
        (this.$firstLink = null),
        (this.$firstSub = null),
        (this.disabled = !1),
        (this.$disableOverlay = null),
        (this.$touchScrollingSub = null),
        (this.cssTransforms3d =
          "perspective" in b.style || "webkitPerspective" in b.style),
        (this.wasCollapsible = !1),
        this.init();
    }),
    a.extend(a.SmartMenus, {
      hideAll: function () {
        a.each(e, function () {
          this.menuHideAll();
        });
      },
      destroy: function () {
        for (; e.length; ) e[0].destroy();
        b(!0);
      },
      prototype: {
        init: function (c) {
          var f = this;
          if (!c) {
            e.push(this),
              (this.rootId = (
                new Date().getTime() +
                Math.random() +
                ""
              ).replace(/\D/g, "")),
              (this.accessIdPrefix = "sm-" + this.rootId + "-"),
              this.$root.hasClass("sm-rtl") &&
                (this.opts.rightToLeftSubMenus = !0);
            var g = ".smartmenus";
            this.$root
              .data("smartmenus", this)
              .attr("data-smartmenus-id", this.rootId)
              .dataSM("level", 1)
              .on(
                d(
                  {
                    "mouseover focusin": a.proxy(this.rootOver, this),
                    "mouseout focusout": a.proxy(this.rootOut, this),
                    keydown: a.proxy(this.rootKeyDown, this),
                  },
                  g
                )
              )
              .on(
                d(
                  {
                    mouseenter: a.proxy(this.itemEnter, this),
                    mouseleave: a.proxy(this.itemLeave, this),
                    mousedown: a.proxy(this.itemDown, this),
                    focus: a.proxy(this.itemFocus, this),
                    blur: a.proxy(this.itemBlur, this),
                    click: a.proxy(this.itemClick, this),
                  },
                  g
                ),
                "a"
              ),
              (g += this.rootId),
              this.opts.hideOnClick &&
                a(document).on(
                  d(
                    {
                      touchstart: a.proxy(this.docTouchStart, this),
                      touchmove: a.proxy(this.docTouchMove, this),
                      touchend: a.proxy(this.docTouchEnd, this),
                      click: a.proxy(this.docClick, this),
                    },
                    g
                  )
                ),
              a(window).on(
                d(
                  { "resize orientationchange": a.proxy(this.winResize, this) },
                  g
                )
              ),
              this.opts.subIndicators &&
                ((this.$subArrow = a("<span/>").addClass("sub-arrow")),
                this.opts.subIndicatorsText &&
                  this.$subArrow.html(this.opts.subIndicatorsText)),
              b();
          }
          if (
            ((this.$firstSub = this.$root
              .find("ul")
              .each(function () {
                f.menuInit(a(this));
              })
              .eq(0)),
            (this.$firstLink = this.$root.find("a").eq(0)),
            this.opts.markCurrentItem)
          ) {
            var h = /(index|default)\.[^#\?\/]*/i,
              i = /#.*/,
              j = window.location.href.replace(h, ""),
              k = j.replace(i, "");
            this.$root.find("a:not(.mega-menu a)").each(function () {
              var b = this.href.replace(h, ""),
                c = a(this);
              (b != j && b != k) ||
                (c.addClass("current"),
                f.opts.markCurrentTree &&
                  c
                    .parentsUntil("[data-smartmenus-id]", "ul")
                    .each(function () {
                      a(this).dataSM("parent-a").addClass("current");
                    }));
            });
          }
          this.wasCollapsible = this.isCollapsible();
        },
        destroy: function (b) {
          if (!b) {
            var c = ".smartmenus";
            this.$root
              .removeData("smartmenus")
              .removeAttr("data-smartmenus-id")
              .removeDataSM("level")
              .off(c),
              (c += this.rootId),
              a(document).off(c),
              a(window).off(c),
              this.opts.subIndicators && (this.$subArrow = null);
          }
          this.menuHideAll();
          var d = this;
          this.$root
            .find("ul")
            .each(function () {
              var b = a(this);
              b.dataSM("scroll-arrows") && b.dataSM("scroll-arrows").remove(),
                b.dataSM("shown-before") &&
                  ((d.opts.subMenusMinWidth || d.opts.subMenusMaxWidth) &&
                    b
                      .css({ width: "", minWidth: "", maxWidth: "" })
                      .removeClass("sm-nowrap"),
                  b.dataSM("scroll-arrows") &&
                    b.dataSM("scroll-arrows").remove(),
                  b.css({
                    zIndex: "",
                    top: "",
                    left: "",
                    marginLeft: "",
                    marginTop: "",
                    display: "",
                  })),
                0 == (b.attr("id") || "").indexOf(d.accessIdPrefix) &&
                  b.removeAttr("id");
            })
            .removeDataSM("in-mega")
            .removeDataSM("shown-before")
            .removeDataSM("scroll-arrows")
            .removeDataSM("parent-a")
            .removeDataSM("level")
            .removeDataSM("beforefirstshowfired")
            .removeAttr("role")
            .removeAttr("aria-hidden")
            .removeAttr("aria-labelledby")
            .removeAttr("aria-expanded"),
            this.$root
              .find("a.has-submenu")
              .each(function () {
                var b = a(this);
                0 == b.attr("id").indexOf(d.accessIdPrefix) &&
                  b.removeAttr("id");
              })
              .removeClass("has-submenu")
              .removeDataSM("sub")
              .removeAttr("aria-haspopup")
              .removeAttr("aria-controls")
              .removeAttr("aria-expanded")
              .closest("li")
              .removeDataSM("sub"),
            this.opts.subIndicators &&
              this.$root.find("span.sub-arrow").remove(),
            this.opts.markCurrentItem &&
              this.$root.find("a.current").removeClass("current"),
            b ||
              ((this.$root = null),
              (this.$firstLink = null),
              (this.$firstSub = null),
              this.$disableOverlay &&
                (this.$disableOverlay.remove(), (this.$disableOverlay = null)),
              e.splice(a.inArray(this, e), 1));
        },
        disable: function (b) {
          if (!this.disabled) {
            if (
              (this.menuHideAll(),
              !b && !this.opts.isPopup && this.$root.is(":visible"))
            ) {
              var c = this.$root.offset();
              this.$disableOverlay = a(
                '<div class="sm-jquery-disable-overlay"/>'
              )
                .css({
                  position: "absolute",
                  top: c.top,
                  left: c.left,
                  width: this.$root.outerWidth(),
                  height: this.$root.outerHeight(),
                  zIndex: this.getStartZIndex(!0),
                  opacity: 0,
                })
                .appendTo(document.body);
            }
            this.disabled = !0;
          }
        },
        docClick: function (b) {
          return this.$touchScrollingSub
            ? void (this.$touchScrollingSub = null)
            : void (
                ((this.visibleSubMenus.length &&
                  !a.contains(this.$root[0], b.target)) ||
                  a(b.target).closest("a").length) &&
                this.menuHideAll()
              );
        },
        docTouchEnd: function (b) {
          if (this.lastTouch) {
            if (
              this.visibleSubMenus.length &&
              (void 0 === this.lastTouch.x2 ||
                this.lastTouch.x1 == this.lastTouch.x2) &&
              (void 0 === this.lastTouch.y2 ||
                this.lastTouch.y1 == this.lastTouch.y2) &&
              (!this.lastTouch.target ||
                !a.contains(this.$root[0], this.lastTouch.target))
            ) {
              this.hideTimeout &&
                (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
              var c = this;
              this.hideTimeout = setTimeout(function () {
                c.menuHideAll();
              }, 350);
            }
            this.lastTouch = null;
          }
        },
        docTouchMove: function (a) {
          if (this.lastTouch) {
            var b = a.originalEvent.touches[0];
            (this.lastTouch.x2 = b.pageX), (this.lastTouch.y2 = b.pageY);
          }
        },
        docTouchStart: function (a) {
          var b = a.originalEvent.touches[0];
          this.lastTouch = { x1: b.pageX, y1: b.pageY, target: b.target };
        },
        enable: function () {
          this.disabled &&
            (this.$disableOverlay &&
              (this.$disableOverlay.remove(), (this.$disableOverlay = null)),
            (this.disabled = !1));
        },
        getClosestMenu: function (b) {
          for (var c = a(b).closest("ul"); c.dataSM("in-mega"); )
            c = c.parent().closest("ul");
          return c[0] || null;
        },
        getHeight: function (a) {
          return this.getOffset(a, !0);
        },
        getOffset: function (a, b) {
          var c;
          "none" == a.css("display") &&
            ((c = {
              position: a[0].style.position,
              visibility: a[0].style.visibility,
            }),
            a.css({ position: "absolute", visibility: "hidden" }).show());
          var d = a[0].getBoundingClientRect && a[0].getBoundingClientRect(),
            e =
              d &&
              (b ? d.height || d.bottom - d.top : d.width || d.right - d.left);
          return (
            e || 0 === e || (e = b ? a[0].offsetHeight : a[0].offsetWidth),
            c && a.hide().css(c),
            e
          );
        },
        getStartZIndex: function (a) {
          var b = parseInt(this[a ? "$root" : "$firstSub"].css("z-index"));
          return (
            !a && isNaN(b) && (b = parseInt(this.$root.css("z-index"))),
            isNaN(b) ? 1 : b
          );
        },
        getTouchPoint: function (a) {
          return (
            (a.touches && a.touches[0]) ||
            (a.changedTouches && a.changedTouches[0]) ||
            a
          );
        },
        getViewport: function (a) {
          var b = a ? "Height" : "Width",
            c = document.documentElement["client" + b],
            d = window["inner" + b];
          return d && (c = Math.min(c, d)), c;
        },
        getViewportHeight: function () {
          return this.getViewport(!0);
        },
        getViewportWidth: function () {
          return this.getViewport();
        },
        getWidth: function (a) {
          return this.getOffset(a);
        },
        handleEvents: function () {
          return !this.disabled && this.isCSSOn();
        },
        handleItemEvents: function (a) {
          return this.handleEvents() && !this.isLinkInMegaMenu(a);
        },
        isCollapsible: function () {
          return "static" == this.$firstSub.css("position");
        },
        isCSSOn: function () {
          return "inline" != this.$firstLink.css("display");
        },
        isFixed: function () {
          var b = "fixed" == this.$root.css("position");
          return (
            b ||
              this.$root.parentsUntil("body").each(function () {
                if ("fixed" == a(this).css("position")) return (b = !0), !1;
              }),
            b
          );
        },
        isLinkInMegaMenu: function (b) {
          return a(this.getClosestMenu(b[0])).hasClass("mega-menu");
        },
        isTouchMode: function () {
          return !f || this.opts.noMouseOver || this.isCollapsible();
        },
        itemActivate: function (b, c) {
          var d = b.closest("ul"),
            e = d.dataSM("level");
          if (
            e > 1 &&
            (!this.activatedItems[e - 2] ||
              this.activatedItems[e - 2][0] != d.dataSM("parent-a")[0])
          ) {
            var f = this;
            a(d.parentsUntil("[data-smartmenus-id]", "ul").get().reverse())
              .add(d)
              .each(function () {
                f.itemActivate(a(this).dataSM("parent-a"));
              });
          }
          if (
            ((this.isCollapsible() && !c) ||
              this.menuHideSubMenus(
                this.activatedItems[e - 1] &&
                  this.activatedItems[e - 1][0] == b[0]
                  ? e
                  : e - 1
              ),
            (this.activatedItems[e - 1] = b),
            this.$root.triggerHandler("activate.smapi", b[0]) !== !1)
          ) {
            var g = b.dataSM("sub");
            g &&
              (this.isTouchMode() ||
                !this.opts.showOnClick ||
                this.clickActivated) &&
              this.menuShow(g);
          }
        },
        itemBlur: function (b) {
          var c = a(b.currentTarget);
          this.handleItemEvents(c) &&
            this.$root.triggerHandler("blur.smapi", c[0]);
        },
        itemClick: function (b) {
          var c = a(b.currentTarget);
          if (this.handleItemEvents(c)) {
            if (
              this.$touchScrollingSub &&
              this.$touchScrollingSub[0] == c.closest("ul")[0]
            )
              return (this.$touchScrollingSub = null), b.stopPropagation(), !1;
            if (this.$root.triggerHandler("click.smapi", c[0]) === !1)
              return !1;
            var d = c.dataSM("sub"),
              e = !!d && 2 == d.dataSM("level");
            if (d) {
              var f = a(b.target).is(".sub-arrow"),
                g = this.isCollapsible(),
                h = /toggle$/.test(this.opts.collapsibleBehavior),
                i = /link$/.test(this.opts.collapsibleBehavior),
                j = /^accordion/.test(this.opts.collapsibleBehavior);
              if (d.is(":visible")) {
                if (!g && this.opts.showOnClick && e)
                  return (
                    this.menuHide(d),
                    (this.clickActivated = !1),
                    (this.focusActivated = !1),
                    !1
                  );
                if (g && (h || f))
                  return this.itemActivate(c, j), this.menuHide(d), !1;
              } else if (
                (!i || !g || f) &&
                (!g && this.opts.showOnClick && e && (this.clickActivated = !0),
                this.itemActivate(c, j),
                d.is(":visible"))
              )
                return (this.focusActivated = !0), !1;
            }
            return (
              !(
                (!g && this.opts.showOnClick && e) ||
                c.hasClass("disabled") ||
                this.$root.triggerHandler("select.smapi", c[0]) === !1
              ) && void 0
            );
          }
        },
        itemDown: function (b) {
          var c = a(b.currentTarget);
          this.handleItemEvents(c) && c.dataSM("mousedown", !0);
        },
        itemEnter: function (b) {
          var c = a(b.currentTarget);
          if (this.handleItemEvents(c)) {
            if (!this.isTouchMode()) {
              this.showTimeout &&
                (clearTimeout(this.showTimeout), (this.showTimeout = 0));
              var d = this;
              this.showTimeout = setTimeout(
                function () {
                  d.itemActivate(c);
                },
                this.opts.showOnClick && 1 == c.closest("ul").dataSM("level")
                  ? 1
                  : this.opts.showTimeout
              );
            }
            this.$root.triggerHandler("mouseenter.smapi", c[0]);
          }
        },
        itemFocus: function (b) {
          var c = a(b.currentTarget);
          this.handleItemEvents(c) &&
            (!this.focusActivated ||
              (this.isTouchMode() && c.dataSM("mousedown")) ||
              (this.activatedItems.length &&
                this.activatedItems[this.activatedItems.length - 1][0] ==
                  c[0]) ||
              this.itemActivate(c, !0),
            this.$root.triggerHandler("focus.smapi", c[0]));
        },
        itemLeave: function (b) {
          var c = a(b.currentTarget);
          this.handleItemEvents(c) &&
            (this.isTouchMode() ||
              (c[0].blur(),
              this.showTimeout &&
                (clearTimeout(this.showTimeout), (this.showTimeout = 0))),
            c.removeDataSM("mousedown"),
            this.$root.triggerHandler("mouseleave.smapi", c[0]));
        },
        menuHide: function (b) {
          if (
            this.$root.triggerHandler("beforehide.smapi", b[0]) !== !1 &&
            (k && b.stop(!0, !0), "none" != b.css("display"))
          ) {
            var c = function () {
              b.css("z-index", "");
            };
            this.isCollapsible()
              ? k && this.opts.collapsibleHideFunction
                ? this.opts.collapsibleHideFunction.call(this, b, c)
                : b.hide(this.opts.collapsibleHideDuration, c)
              : k && this.opts.hideFunction
              ? this.opts.hideFunction.call(this, b, c)
              : b.hide(this.opts.hideDuration, c),
              b.dataSM("scroll") &&
                (this.menuScrollStop(b),
                b
                  .css({
                    "touch-action": "",
                    "-ms-touch-action": "",
                    "-webkit-transform": "",
                    transform: "",
                  })
                  .off(".smartmenus_scroll")
                  .removeDataSM("scroll")
                  .dataSM("scroll-arrows")
                  .hide()),
              b
                .dataSM("parent-a")
                .removeClass("highlighted")
                .attr("aria-expanded", "false"),
              b.attr({ "aria-expanded": "false", "aria-hidden": "true" });
            var d = b.dataSM("level");
            this.activatedItems.splice(d - 1, 1),
              this.visibleSubMenus.splice(
                a.inArray(b, this.visibleSubMenus),
                1
              ),
              this.$root.triggerHandler("hide.smapi", b[0]);
          }
        },
        menuHideAll: function () {
          this.showTimeout &&
            (clearTimeout(this.showTimeout), (this.showTimeout = 0));
          for (
            var a = this.opts.isPopup ? 1 : 0,
              b = this.visibleSubMenus.length - 1;
            b >= a;
            b--
          )
            this.menuHide(this.visibleSubMenus[b]);
          this.opts.isPopup &&
            (k && this.$root.stop(!0, !0),
            this.$root.is(":visible") &&
              (k && this.opts.hideFunction
                ? this.opts.hideFunction.call(this, this.$root)
                : this.$root.hide(this.opts.hideDuration))),
            (this.activatedItems = []),
            (this.visibleSubMenus = []),
            (this.clickActivated = !1),
            (this.focusActivated = !1),
            (this.zIndexInc = 0),
            this.$root.triggerHandler("hideAll.smapi");
        },
        menuHideSubMenus: function (a) {
          for (var b = this.activatedItems.length - 1; b >= a; b--) {
            var c = this.activatedItems[b].dataSM("sub");
            c && this.menuHide(c);
          }
        },
        menuInit: function (a) {
          if (!a.dataSM("in-mega")) {
            a.hasClass("mega-menu") && a.find("ul").dataSM("in-mega", !0);
            for (
              var b = 2, c = a[0];
              (c = c.parentNode.parentNode) != this.$root[0];

            )
              b++;
            var d = a.prevAll("a").eq(-1);
            d.length || (d = a.prevAll().find("a").eq(-1)),
              d.addClass("has-submenu").dataSM("sub", a),
              a
                .dataSM("parent-a", d)
                .dataSM("level", b)
                .parent()
                .dataSM("sub", a);
            var e = d.attr("id") || this.accessIdPrefix + ++this.idInc,
              f = a.attr("id") || this.accessIdPrefix + ++this.idInc;
            d.attr({
              id: e,
              "aria-haspopup": "true",
              "aria-controls": f,
              "aria-expanded": "false",
            }),
              a.attr({
                id: f,
                role: "group",
                "aria-hidden": "true",
                "aria-labelledby": e,
                "aria-expanded": "false",
              }),
              this.opts.subIndicators &&
                d[this.opts.subIndicatorsPos](this.$subArrow.clone());
          }
        },
        menuPosition: function (b) {
          var c,
            e,
            f = b.dataSM("parent-a"),
            h = f.closest("li"),
            i = h.parent(),
            j = b.dataSM("level"),
            k = this.getWidth(b),
            l = this.getHeight(b),
            m = f.offset(),
            n = m.left,
            o = m.top,
            p = this.getWidth(f),
            q = this.getHeight(f),
            r = a(window),
            s = r.scrollLeft(),
            t = r.scrollTop(),
            u = this.getViewportWidth(),
            v = this.getViewportHeight(),
            w =
              i.parent().is("[data-sm-horizontal-sub]") ||
              (2 == j && !i.hasClass("sm-vertical")),
            x =
              (this.opts.rightToLeftSubMenus && !h.is("[data-sm-reverse]")) ||
              (!this.opts.rightToLeftSubMenus && h.is("[data-sm-reverse]")),
            y =
              2 == j
                ? this.opts.mainMenuSubOffsetX
                : this.opts.subMenusSubOffsetX,
            z =
              2 == j
                ? this.opts.mainMenuSubOffsetY
                : this.opts.subMenusSubOffsetY;
          if (
            (w
              ? ((c = x ? p - k - y : y),
                (e = this.opts.bottomToTopSubMenus ? -l - z : q + z))
              : ((c = x ? y - k : p - y),
                (e = this.opts.bottomToTopSubMenus ? q - z - l : z)),
            this.opts.keepInViewport)
          ) {
            var A = n + c,
              B = o + e;
            if (
              (x && A < s
                ? (c = w ? s - A + c : p - y)
                : !x && A + k > s + u && (c = w ? s + u - k - A + c : y - k),
              w ||
                (l < v && B + l > t + v
                  ? (e += t + v - l - B)
                  : (l >= v || B < t) && (e += t - B)),
              (w && (B + l > t + v + 0.49 || B < t)) || (!w && l > v + 0.49))
            ) {
              var C = this;
              b.dataSM("scroll-arrows") ||
                b.dataSM(
                  "scroll-arrows",
                  a([
                    a(
                      '<span class="scroll-up"><span class="scroll-up-arrow"></span></span>'
                    )[0],
                    a(
                      '<span class="scroll-down"><span class="scroll-down-arrow"></span></span>'
                    )[0],
                  ])
                    .on({
                      mouseenter: function () {
                        (b.dataSM("scroll").up = a(this).hasClass("scroll-up")),
                          C.menuScroll(b);
                      },
                      mouseleave: function (a) {
                        C.menuScrollStop(b), C.menuScrollOut(b, a);
                      },
                      "mousewheel DOMMouseScroll": function (a) {
                        a.preventDefault();
                      },
                    })
                    .insertAfter(b)
                );
              var D = ".smartmenus_scroll";
              if (
                (b
                  .dataSM("scroll", {
                    y: this.cssTransforms3d ? 0 : e - q,
                    step: 1,
                    itemH: q,
                    subH: l,
                    arrowDownH: this.getHeight(b.dataSM("scroll-arrows").eq(1)),
                  })
                  .on(
                    d(
                      {
                        mouseover: function (a) {
                          C.menuScrollOver(b, a);
                        },
                        mouseout: function (a) {
                          C.menuScrollOut(b, a);
                        },
                        "mousewheel DOMMouseScroll": function (a) {
                          C.menuScrollMousewheel(b, a);
                        },
                      },
                      D
                    )
                  )
                  .dataSM("scroll-arrows")
                  .css({
                    top: "auto",
                    left: "0",
                    marginLeft: c + (parseInt(b.css("border-left-width")) || 0),
                    width:
                      k -
                      (parseInt(b.css("border-left-width")) || 0) -
                      (parseInt(b.css("border-right-width")) || 0),
                    zIndex: b.css("z-index"),
                  })
                  .eq(w && this.opts.bottomToTopSubMenus ? 0 : 1)
                  .show(),
                this.isFixed())
              ) {
                var E = {};
                (E[
                  g
                    ? "touchstart touchmove touchend"
                    : "pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp"
                ] = function (a) {
                  C.menuScrollTouch(b, a);
                }),
                  b
                    .css({ "touch-action": "none", "-ms-touch-action": "none" })
                    .on(d(E, D));
              }
            }
          }
          b.css({ top: "auto", left: "0", marginLeft: c, marginTop: e - q });
        },
        menuScroll: function (a, b, c) {
          var d,
            e = a.dataSM("scroll"),
            g = a.dataSM("scroll-arrows"),
            h = e.up ? e.upEnd : e.downEnd;
          if (!b && e.momentum) {
            if (((e.momentum *= 0.92), (d = e.momentum), d < 0.5))
              return void this.menuScrollStop(a);
          } else
            d =
              c ||
              (b || !this.opts.scrollAccelerate
                ? this.opts.scrollStep
                : Math.floor(e.step));
          var j = a.dataSM("level");
          if (
            (this.activatedItems[j - 1] &&
              this.activatedItems[j - 1].dataSM("sub") &&
              this.activatedItems[j - 1].dataSM("sub").is(":visible") &&
              this.menuHideSubMenus(j - 1),
            (e.y =
              (e.up && h <= e.y) || (!e.up && h >= e.y)
                ? e.y
                : Math.abs(h - e.y) > d
                ? e.y + (e.up ? d : -d)
                : h),
            a.css(
              this.cssTransforms3d
                ? {
                    "-webkit-transform": "translate3d(0, " + e.y + "px, 0)",
                    transform: "translate3d(0, " + e.y + "px, 0)",
                  }
                : { marginTop: e.y }
            ),
            f &&
              ((e.up && e.y > e.downEnd) || (!e.up && e.y < e.upEnd)) &&
              g.eq(e.up ? 1 : 0).show(),
            e.y == h)
          )
            f && g.eq(e.up ? 0 : 1).hide(), this.menuScrollStop(a);
          else if (!b) {
            this.opts.scrollAccelerate &&
              e.step < this.opts.scrollStep &&
              (e.step += 0.2);
            var k = this;
            this.scrollTimeout = i(function () {
              k.menuScroll(a);
            });
          }
        },
        menuScrollMousewheel: function (a, b) {
          if (this.getClosestMenu(b.target) == a[0]) {
            b = b.originalEvent;
            var c = (b.wheelDelta || -b.detail) > 0;
            a
              .dataSM("scroll-arrows")
              .eq(c ? 0 : 1)
              .is(":visible") &&
              ((a.dataSM("scroll").up = c), this.menuScroll(a, !0));
          }
          b.preventDefault();
        },
        menuScrollOut: function (b, c) {
          f &&
            (/^scroll-(up|down)/.test((c.relatedTarget || "").className) ||
              ((b[0] == c.relatedTarget || a.contains(b[0], c.relatedTarget)) &&
                this.getClosestMenu(c.relatedTarget) == b[0]) ||
              b.dataSM("scroll-arrows").css("visibility", "hidden"));
        },
        menuScrollOver: function (b, c) {
          if (
            f &&
            !/^scroll-(up|down)/.test(c.target.className) &&
            this.getClosestMenu(c.target) == b[0]
          ) {
            this.menuScrollRefreshData(b);
            var d = b.dataSM("scroll"),
              e =
                a(window).scrollTop() -
                b.dataSM("parent-a").offset().top -
                d.itemH;
            b.dataSM("scroll-arrows")
              .eq(0)
              .css("margin-top", e)
              .end()
              .eq(1)
              .css("margin-top", e + this.getViewportHeight() - d.arrowDownH)
              .end()
              .css("visibility", "visible");
          }
        },
        menuScrollRefreshData: function (b) {
          var c = b.dataSM("scroll"),
            d =
              a(window).scrollTop() -
              b.dataSM("parent-a").offset().top -
              c.itemH;
          this.cssTransforms3d && (d = -(parseFloat(b.css("margin-top")) - d)),
            a.extend(c, {
              upEnd: d,
              downEnd: d + this.getViewportHeight() - c.subH,
            });
        },
        menuScrollStop: function (a) {
          if (this.scrollTimeout)
            return (
              j(this.scrollTimeout),
              (this.scrollTimeout = 0),
              (a.dataSM("scroll").step = 1),
              !0
            );
        },
        menuScrollTouch: function (b, d) {
          if (((d = d.originalEvent), c(d))) {
            var e = this.getTouchPoint(d);
            if (this.getClosestMenu(e.target) == b[0]) {
              var f = b.dataSM("scroll");
              if (/(start|down)$/i.test(d.type))
                this.menuScrollStop(b)
                  ? (d.preventDefault(), (this.$touchScrollingSub = b))
                  : (this.$touchScrollingSub = null),
                  this.menuScrollRefreshData(b),
                  a.extend(f, {
                    touchStartY: e.pageY,
                    touchStartTime: d.timeStamp,
                  });
              else if (/move$/i.test(d.type)) {
                var g = void 0 !== f.touchY ? f.touchY : f.touchStartY;
                if (void 0 !== g && g != e.pageY) {
                  this.$touchScrollingSub = b;
                  var h = g < e.pageY;
                  void 0 !== f.up &&
                    f.up != h &&
                    a.extend(f, {
                      touchStartY: e.pageY,
                      touchStartTime: d.timeStamp,
                    }),
                    a.extend(f, { up: h, touchY: e.pageY }),
                    this.menuScroll(b, !0, Math.abs(e.pageY - g));
                }
                d.preventDefault();
              } else
                void 0 !== f.touchY &&
                  ((f.momentum =
                    15 *
                    Math.pow(
                      Math.abs(e.pageY - f.touchStartY) /
                        (d.timeStamp - f.touchStartTime),
                      2
                    )) &&
                    (this.menuScrollStop(b),
                    this.menuScroll(b),
                    d.preventDefault()),
                  delete f.touchY);
            }
          }
        },
        menuShow: function (a) {
          if (
            (a.dataSM("beforefirstshowfired") ||
              (a.dataSM("beforefirstshowfired", !0),
              this.$root.triggerHandler("beforefirstshow.smapi", a[0]) !==
                !1)) &&
            this.$root.triggerHandler("beforeshow.smapi", a[0]) !== !1 &&
            (a.dataSM("shown-before", !0),
            k && a.stop(!0, !0),
            !a.is(":visible"))
          ) {
            var b = a.dataSM("parent-a"),
              c = this.isCollapsible();
            if (
              ((this.opts.keepHighlighted || c) && b.addClass("highlighted"), c)
            )
              a.removeClass("sm-nowrap").css({
                zIndex: "",
                width: "auto",
                minWidth: "",
                maxWidth: "",
                top: "",
                left: "",
                marginLeft: "",
                marginTop: "",
              });
            else {
              if (
                (a.css(
                  "z-index",
                  (this.zIndexInc =
                    (this.zIndexInc || this.getStartZIndex()) + 1)
                ),
                (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) &&
                  (a
                    .css({ width: "auto", minWidth: "", maxWidth: "" })
                    .addClass("sm-nowrap"),
                  this.opts.subMenusMinWidth &&
                    a.css("min-width", this.opts.subMenusMinWidth),
                  this.opts.subMenusMaxWidth))
              ) {
                var d = this.getWidth(a);
                a.css("max-width", this.opts.subMenusMaxWidth),
                  d > this.getWidth(a) &&
                    a
                      .removeClass("sm-nowrap")
                      .css("width", this.opts.subMenusMaxWidth);
              }
              this.menuPosition(a);
            }
            var e = function () {
              a.css("overflow", "");
            };
            c
              ? k && this.opts.collapsibleShowFunction
                ? this.opts.collapsibleShowFunction.call(this, a, e)
                : a.show(this.opts.collapsibleShowDuration, e)
              : k && this.opts.showFunction
              ? this.opts.showFunction.call(this, a, e)
              : a.show(this.opts.showDuration, e),
              b.attr("aria-expanded", "true"),
              a.attr({ "aria-expanded": "true", "aria-hidden": "false" }),
              this.visibleSubMenus.push(a),
              this.$root.triggerHandler("show.smapi", a[0]);
          }
        },
        popupHide: function (a) {
          this.hideTimeout &&
            (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
          var b = this;
          this.hideTimeout = setTimeout(
            function () {
              b.menuHideAll();
            },
            a ? 1 : this.opts.hideTimeout
          );
        },
        popupShow: function (a, b) {
          if (!this.opts.isPopup)
            return void alert(
              'SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.'
            );
          if (
            (this.hideTimeout &&
              (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
            this.$root.dataSM("shown-before", !0),
            k && this.$root.stop(!0, !0),
            !this.$root.is(":visible"))
          ) {
            this.$root.css({ left: a, top: b });
            var c = this,
              d = function () {
                c.$root.css("overflow", "");
              };
            k && this.opts.showFunction
              ? this.opts.showFunction.call(this, this.$root, d)
              : this.$root.show(this.opts.showDuration, d),
              (this.visibleSubMenus[0] = this.$root);
          }
        },
        refresh: function () {
          this.destroy(!0), this.init(!0);
        },
        rootKeyDown: function (b) {
          if (this.handleEvents())
            switch (b.keyCode) {
              case 27:
                var c = this.activatedItems[0];
                if (c) {
                  this.menuHideAll(), c[0].focus();
                  var d = c.dataSM("sub");
                  d && this.menuHide(d);
                }
                break;
              case 32:
                var e = a(b.target);
                if (e.is("a") && this.handleItemEvents(e)) {
                  var d = e.dataSM("sub");
                  d &&
                    !d.is(":visible") &&
                    (this.itemClick({ currentTarget: b.target }),
                    b.preventDefault());
                }
            }
        },
        rootOut: function (a) {
          if (
            this.handleEvents() &&
            !this.isTouchMode() &&
            a.target != this.$root[0] &&
            (this.hideTimeout &&
              (clearTimeout(this.hideTimeout), (this.hideTimeout = 0)),
            !this.opts.showOnClick || !this.opts.hideOnClick)
          ) {
            var b = this;
            this.hideTimeout = setTimeout(function () {
              b.menuHideAll();
            }, this.opts.hideTimeout);
          }
        },
        rootOver: function (a) {
          this.handleEvents() &&
            !this.isTouchMode() &&
            a.target != this.$root[0] &&
            this.hideTimeout &&
            (clearTimeout(this.hideTimeout), (this.hideTimeout = 0));
        },
        winResize: function (a) {
          if (this.handleEvents()) {
            if (
              !("onorientationchange" in window) ||
              "orientationchange" == a.type
            ) {
              var b = this.isCollapsible();
              (this.wasCollapsible && b) ||
                (this.activatedItems.length &&
                  this.activatedItems[this.activatedItems.length - 1][0].blur(),
                this.menuHideAll()),
                (this.wasCollapsible = b);
            }
          } else if (this.$disableOverlay) {
            var c = this.$root.offset();
            this.$disableOverlay.css({
              top: c.top,
              left: c.left,
              width: this.$root.outerWidth(),
              height: this.$root.outerHeight(),
            });
          }
        },
      },
    }),
    (a.fn.dataSM = function (a, b) {
      return b ? this.data(a + "_smartmenus", b) : this.data(a + "_smartmenus");
    }),
    (a.fn.removeDataSM = function (a) {
      return this.removeData(a + "_smartmenus");
    }),
    (a.fn.smartmenus = function (b) {
      if ("string" == typeof b) {
        var c = arguments,
          d = b;
        return (
          Array.prototype.shift.call(c),
          this.each(function () {
            var b = a(this).data("smartmenus");
            b && b[d] && b[d].apply(b, c);
          })
        );
      }
      return this.each(function () {
        var c = a(this).data("sm-options") || null;
        c &&
          "object" != typeof c &&
          ((c = null),
          alert(
            'ERROR\n\nSmartMenus jQuery init:\nThe value of the "data-sm-options" attribute must be valid JSON.'
          )),
          c &&
            a.each(
              [
                "showFunction",
                "hideFunction",
                "collapsibleShowFunction",
                "collapsibleHideFunction",
              ],
              function () {
                this in c && delete c[this];
              }
            ),
          new a.SmartMenus(this, a.extend({}, a.fn.smartmenus.defaults, b, c));
      });
    }),
    (a.fn.smartmenus.defaults = {
      isPopup: !1,
      mainMenuSubOffsetX: 0,
      mainMenuSubOffsetY: 0,
      subMenusSubOffsetX: 0,
      subMenusSubOffsetY: 0,
      subMenusMinWidth: "10em",
      subMenusMaxWidth: "20em",
      subIndicators: !0,
      subIndicatorsPos: "append",
      subIndicatorsText: "",
      scrollStep: 30,
      scrollAccelerate: !0,
      showTimeout: 250,
      hideTimeout: 500,
      showDuration: 0,
      showFunction: null,
      hideDuration: 0,
      hideFunction: function (a, b) {
        a.fadeOut(200, b);
      },
      collapsibleShowDuration: 0,
      collapsibleShowFunction: function (a, b) {
        a.slideDown(200, b);
      },
      collapsibleHideDuration: 0,
      collapsibleHideFunction: function (a, b) {
        a.slideUp(200, b);
      },
      showOnClick: !1,
      hideOnClick: !0,
      noMouseOver: !1,
      keepInViewport: !0,
      keepHighlighted: !0,
      markCurrentItem: !1,
      markCurrentTree: !0,
      rightToLeftSubMenus: !1,
      bottomToTopSubMenus: !1,
      collapsibleBehavior: "default",
    }),
    a
  );
});
