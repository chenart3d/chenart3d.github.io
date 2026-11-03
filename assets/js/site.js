/* 陈领航 · 作品集 —— 交互脚本（无依赖） */
(function () {
  "use strict";

  /* 站点图标（内联 SVG，不依赖外部文件） */
  if (!document.querySelector('link[rel="icon"]')) {
    var icon = document.createElement("link");
    icon.rel = "icon";
    icon.href =
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
          '<rect width="32" height="32" fill="#0b0b0d"/>' +
          '<rect x="6.5" y="6.5" width="19" height="19" fill="none" stroke="#5ce1e6" stroke-width="1.6"/>' +
          '<rect x="13" y="13" width="6" height="6" fill="#e23b2e"/>' +
        "</svg>"
      );
    document.head.appendChild(icon);
  }

  /* 导航滚动变实 */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 滚动淡入 */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* 图片加载失败时收起整个图框（用于尚未补齐的过程图） */
  document.querySelectorAll(".proc img, .gallery img").forEach(function (img) {
    function hide() {
      var box = img.closest(".proc, figure");
      if (box) box.classList.add("is-empty");
    }
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide);
  });

  /* 灯箱 */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML =
    '<span class="lightbox__close">ESC / 点击关闭</span><img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img");

  function openLB(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.classList.add("is-open");
  }
  function closeLB() {
    lb.classList.remove("is-open");
    lbImg.removeAttribute("src");
  }

  document.querySelectorAll("[data-zoom] img, img[data-zoom]").forEach(function (el) {
    var img = el.tagName === "IMG" ? el : null;
    var target = img || el.querySelector("img");
    if (!target) return;
    var trigger = img || el;
    trigger.style.cursor = "zoom-in";
    trigger.addEventListener("click", function () {
      openLB(target.getAttribute("src"), target.getAttribute("alt"));
    });
  });

  lb.addEventListener("click", closeLB);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLB();
  });

  /* 手机号：点击才显示 */
  var phoneBtn = document.querySelector("[data-phone]");
  if (phoneBtn) {
    phoneBtn.addEventListener("click", function () {
      var num = phoneBtn.getAttribute("data-phone");
      var slot = document.createElement("a");
      slot.href = "tel:" + num;
      slot.textContent = num;
      slot.className = "revealed-phone";
      phoneBtn.replaceWith(slot);
    });
  }

  /* 邮箱：点击复制 */
  var copyBtn = document.querySelector("[data-copy]");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      var done = function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = "已复制 ✓";
        setTimeout(function () {
          copyBtn.textContent = old;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch (err) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }

  /* 二维码页：根据输入生成二维码图片 */
  var qrInput = document.querySelector("[data-qr-input]");
  var qrImg = document.querySelector("[data-qr-img]");
  var qrLink = document.querySelector("[data-qr-link]");
  if (qrInput && qrImg) {
    function render() {
      var v = qrInput.value.trim() || qrInput.getAttribute("placeholder");
      var url =
        "https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=8&data=" +
        encodeURIComponent(v);
      qrImg.src = url;
      if (qrLink) {
        qrLink.href = v;
        qrLink.textContent = v;
      }
    }
    var t = null;
    qrInput.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(render, 420);
    });
    render();
  }
})();
