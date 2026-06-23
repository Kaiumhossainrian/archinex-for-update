(function ($) {
  "use strict";

  jQuery(function () {
    const $burger = $("#burgerBtn");
    const $mobileMenu = $("#mobileMenu");
    const $body = $("body");

    $burger.on("click", () => {
      $burger.toggleClass("open");
      $mobileMenu.toggleClass("open");
      $body.css("overflow", $mobileMenu.hasClass("open") ? "hidden" : "");
    });

    $(".mob-link").on("click", function (e) {
      const id = $(this).data("section");
      if (!id) return;

      e.preventDefault();
      smoothScrollTo(sections[id]);

      $burger.add($mobileMenu).removeClass("open");
      $body.css("overflow", "");
    });

    function isInViewport($el) {
      var rect = $el[0].getBoundingClientRect();
      var windowHeight = $(window).height();
      var windowWidth = $(window).width();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= windowHeight &&
        rect.right <= windowWidth
      );
    }

    function triggerOdometer($el) {
      $el.html($el.data("odometer-final"));
      $el.addClass("odometer-done");
    }

    function checkAndTriggerOdometer() {
      $(".odometer").each(function () {
        var $this = $(this);
        if (!$this.hasClass("odometer-done") && isInViewport($this)) {
          triggerOdometer($this);
        }
      });
    }

    $(window).on("load scroll resize", function () {
      checkAndTriggerOdometer();
    });

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

    gsap.config({
      nullTargetWarn: false,
    });

    $('a[href^="#"]:not([href="#"])').on("click", function (event) {
      event.preventDefault();

      const target = $(this).attr("href");

      if ($(target).length) {
        gsap.to(window, {
          scrollTo: {
            y: $(target)[0],
            offsetY: 170,
          },
          duration: 1,
          ease: "sine.inOut",
        });
      }

      $("header").find("li").removeClass("active");
      const parentLi = $(this).closest("li");
      if (parentLi.length) {
        parentLi.addClass("active");
      }
    });

    const $nav = $("#mainNav");

    ScrollTrigger.create({
      start: 40,
      onEnter: () => $nav.addClass("scrolled"),
      onLeaveBack: () => $nav.removeClass("scrolled"),
    });

    if ($(".btn-animated-text").length) {
      $(".btn-animated-text").each(function () {
        var $btn = $(this);
        var text = $btn.attr("data-text");
        $btn.empty();

        if (!text) return;

        for (var i = 0; i < text.length; i++) {
          var char = text[i] === " " ? "\u00A0" : text[i];
          var $span = $("<span></span>").attr("data-text", char).text(char);
          $btn.append($span);
        }
      });
    }

    const lenis = new Lenis();

    gsap.ticker.add(function (time) {
      lenis.raf(time * 500);
    });
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.update();

    const sections = {
      demos: $("#demos"),
      features: $("#features"),
      elements: $("#elements"),
    };

    function smoothScrollTo($targetEl) {
      if (!$targetEl || !$targetEl.length) return;

      gsap.to(window, {
        duration: 1.1,
        scrollTo: { y: $targetEl[0], offsetY: 72 },
        ease: "power3.inOut",
      });
    }

    function setActive(id) {
      $(".nav-link").each(function () {
        const $el = $(this);
        $el.toggleClass("active", $el.data("section") === id);
      });
    }

    $(".nav-link").on("click", function (e) {
      const id = $(this).data("section");
      if (!id) return;

      e.preventDefault();

      smoothScrollTo(sections[id]);
      setActive(id);

      $("#burgerBtn, #mobileMenu").removeClass("open");
      $("body").css("overflow", "");
    });

    $.each(sections, function (id, $el) {
      if (!$el.length) return;

      ScrollTrigger.create({
        trigger: $el[0],
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      });
    });

    function initScrollAnimations() {
      const animations = {
        "fade-up": { y: 30 },
        "fade-down": { y: -30 },
        "fade-left": { x: 30 },
        "fade-right": { x: -30 },
      };

      let hasAnyTargets = false;

      $.each(animations, function (className) {
        if ($(`.${className}`).length > 0) {
          hasAnyTargets = true;
          return false;
        }
      });

      if (hasAnyTargets) {
        $.each(animations, function (className, animationProps) {
          const $allItems = $(`.${className}`);

          $allItems.each(function () {
            const $el = $(this);
            const customDelay = parseFloat($el.attr("data-delay"));
            const delay = !isNaN(customDelay) ? customDelay / 1000 : 0;

            gsap.from(this, {
              scrollTrigger: {
                trigger: this,
                start: "top 90%",
                once: true,
              },
              opacity: 0,
              duration: 0.6,
              ease: "slow(0.1, 0.1, false)",
              delay: delay,
              ...animationProps,
            });
          });
        });
      }
    }

    initScrollAnimations();

    function initPreloaderAnimations() {
      const progressBar = document.querySelector(".preloader-progress");
      const count = document.querySelector(".preloader-count");
      let obj = { val: 0 };

      function runSplitAnimations() {
        document.fonts.ready.then(() => {
          document.querySelectorAll(".title-animation").forEach((el) => {
            const childSplit = new SplitText(el, {
              type: "lines, chars",
              linesClass: "split-parent",
              charsClass: "split-child",
            });
            gsap.set(el, { opacity: 1 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                end: "bottom 60%",
                scrub: false,
                toggleActions: "play none none none",
              },
            });
            tl.from(childSplit.lines, {
              duration: 0.8,
              yPercent: 100,
              stagger: 0.1,
            });
            tl.from(
              childSplit.chars,
              { duration: 0.8, y: 100, autoAlpha: 0, stagger: 0 },
              "-=0.8",
            );
          });

          document.querySelectorAll(".title-animation-lg").forEach((el) => {
            const split = new SplitText(el, {
              type: "words, chars",
              wordsClass: "split-parent-lg",
              charsClass: "split-child-lg",
            });
            gsap.set(el, { opacity: 1 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                end: "bottom 60%",
              },
            });
            tl.from(split.chars, {
              duration: 0.7,
              yPercent: 60,
              autoAlpha: 0,
              ease: "power3.out",
              stagger: { each: 0.065, from: "center" },
            });
          });

          document.querySelectorAll(".title-animation-sd").forEach((el) => {
            const split = new SplitText(el, {
              type: "lines, chars",
              linesClass: "split-parent-sd",
              charsClass: "split-child-sd",
            });
            gsap.set(el, { opacity: 1 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                end: "bottom 60%",
              },
            });
            split.lines.forEach((line) => {
              tl.from(line.querySelectorAll(".split-child-sd"), {
                duration: 0.7,
                autoAlpha: 0,
                x: -10,
                ease: "power3.out",
                stagger: 0.05,
              });
            });
          });

          document.querySelectorAll(".title-animation-color").forEach((el) => {
            const split = new SplitText(el, {
              type: "words",
              wordsClass: "split-word",
            });
            const wordSpans = el.querySelectorAll(".split-word");
            gsap.set(el, { opacity: 1 });
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: el,
                  start: "top 70%",
                  end: "bottom 50%",
                  scrub: true,
                },
              })
              .to(wordSpans, {
                color: getComputedStyle(el).getPropertyValue("--char-active"),
                stagger: 0.2,
                ease: "none",
              });
          });
        });
      }

      gsap.to(obj, {
        val: 100,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          const number = Math.floor(obj.val);
          progressBar.style.width = number + "%";
          count.innerText = number + "%";
        },
        onComplete: () => {
          gsap.to(".preloader", {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            onComplete: runSplitAnimations,
          });
        },
      });
    }

    initPreloaderAnimations();
  });
})(jQuery);
