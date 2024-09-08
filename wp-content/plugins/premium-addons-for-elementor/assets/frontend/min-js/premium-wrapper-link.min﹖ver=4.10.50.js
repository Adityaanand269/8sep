jQuery(window).on("elementor/frontend/init", function () {
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/global",
    function (l) {
      l.on("click.onWrapperLink", function () {
        var e = l.data("premium-element-link");
        if (e) {
          var n,
            t,
            o,
            r = l.data("id"),
            i = document.createElement("a");
          if (
            ((i.id = "premium-wrapper-link-" + r),
            (o = e.href),
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.-]{2,})([\/\w \u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF%.-]*)*\/?$/i.test(
              o
            ))
          )
            (i.href = e.href),
              (i.target =
                "url" === e.type
                  ? e.link.is_external
                    ? "_blank"
                    : "_self"
                  : ""),
              (i.rel =
                "url" === e.type && e.link.nofollow
                  ? "nofollow noreferer"
                  : ""),
              (i.style.display = "none"),
              document.body.appendChild(i),
              (n = document.getElementById(i.id)).click(),
              (t = setTimeout(function () {
                n.remove(), clearTimeout(t);
              }));
        }
      });
    }
  );
});
