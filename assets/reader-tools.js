(function () {
  var storageKey = "nrec6006-reader-settings";
  var defaults = {
    size: "normal",
    style: "light"
  };
  var validSizes = ["normal", "large", "xlarge"];
  var validStyles = ["light", "sepia", "dark"];

  function loadSettings() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey));
      return {
        size: validSizes.indexOf(saved && saved.size) === -1 ? defaults.size : saved.size,
        style: validStyles.indexOf(saved && saved.style) === -1 ? defaults.style : saved.style
      };
    } catch (error) {
      return defaults;
    }
  }

  function saveSettings(settings) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
      // Reader settings are optional; ignore storage failures in private contexts.
    }
  }

  function setPressed(buttons, attr, value) {
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute(attr) === value));
    });
  }

  function applySettings(settings, sizeButtons, styleButtons) {
    document.documentElement.dataset.readerSize = settings.size;
    document.documentElement.dataset.readerStyle = settings.style;
    setPressed(sizeButtons, "data-reader-size", settings.size);
    setPressed(styleButtons, "data-reader-style", settings.style);
    saveSettings(settings);
  }

  function initReaderTools() {
    var root = document.querySelector("[data-reader-tools]");
    if (!root) return;
    if (root.dataset.readerToolsReady === "true") return;
    root.dataset.readerToolsReady = "true";

    var toggle = root.querySelector("[data-reader-toggle]");
    var menu = root.querySelector("[data-reader-menu]");
    var sizeButtons = Array.prototype.slice.call(root.querySelectorAll("[data-reader-size]"));
    var styleButtons = Array.prototype.slice.call(root.querySelectorAll("[data-reader-style]"));
    var settings = loadSettings();

    function closeMenu() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open reader settings");
    }

    function toggleMenu() {
      var willOpen = menu.hidden;
      menu.hidden = !willOpen;
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Close reader settings" : "Open reader settings");
    }

    toggle.addEventListener("click", toggleMenu);

    sizeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        settings.size = button.getAttribute("data-reader-size");
        applySettings(settings, sizeButtons, styleButtons);
      });
    });

    styleButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        settings.style = button.getAttribute("data-reader-style");
        applySettings(settings, sizeButtons, styleButtons);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !menu.hidden) {
        closeMenu();
        toggle.focus();
      }
    });

    applySettings(settings, sizeButtons, styleButtons);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReaderTools);
  } else {
    initReaderTools();
  }
})();
