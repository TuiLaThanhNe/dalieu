/**
 * COLOR HUNT PALETTE ENGINE & MINI THEME POPOVER MANAGER
 * Curated palettes from ColorHunt.co + Dark Mode + Font Size + Custom Colors
 */

(function () {
  "use strict";

  const COLOR_HUNT_PALETTES = [
    {
      id: "medical-teal",
      shortName: "Medical Teal",
      name: "Medical Teal & Slate (Mặc định Y Khoa)",
      colors: ["#0F766E", "#14B8A6", "#F0FDFA", "#0F172A"],
      primary: "#0d9488",
      primaryDark: "#0f766e",
      accent: "#0284c7",
      bgLight: "#f4fbf9",
      cardLight: "#ffffff",
      bgDark: "#0b1519",
      cardDark: "#122229"
    },
    {
      id: "dr-fox-warm",
      shortName: "Dr. Fox Warm",
      name: "Dr. Fox Warm Sketch (Cáo Bác Sĩ Ấm Áp)",
      colors: ["#EA580C", "#FB923C", "#FFF7ED", "#431407"],
      primary: "#ea580c",
      primaryDark: "#c2410c",
      accent: "#d97706",
      bgLight: "#fffaf5",
      cardLight: "#ffffff",
      bgDark: "#18120e",
      cardDark: "#241b15"
    },
    {
      id: "nordic-ocean",
      shortName: "Nordic Ocean",
      name: "Color Hunt #1: Nordic Ocean Blue",
      colors: ["#112D4E", "#3F72AF", "#DBE2EF", "#F9F7F7"],
      primary: "#3f72af",
      primaryDark: "#112d4e",
      accent: "#2563eb",
      bgLight: "#f4f7fb",
      cardLight: "#ffffff",
      bgDark: "#0d1726",
      cardDark: "#16243b"
    },
    {
      id: "sage-botanical",
      shortName: "Matcha Sage",
      name: "Color Hunt #2: Matcha Sage & Forest",
      colors: ["#1A4D2E", "#4F6F52", "#E8DFCA", "#F5EFE6"],
      primary: "#2e6f40",
      primaryDark: "#1a4d2e",
      accent: "#4f6f52",
      bgLight: "#f6f5f0",
      cardLight: "#ffffff",
      bgDark: "#0f1c14",
      cardDark: "#182b20"
    },
    {
      id: "royal-indigo",
      shortName: "Royal Indigo",
      name: "Color Hunt #3: Royal Academic Indigo",
      colors: ["#2D3250", "#424769", "#7077A1", "#F6B17A"],
      primary: "#4f46e5",
      primaryDark: "#3730a3",
      accent: "#e07a5f",
      bgLight: "#f5f6fb",
      cardLight: "#ffffff",
      bgDark: "#141625",
      cardDark: "#1f2338"
    },
    {
      id: "sakura-clinic",
      shortName: "Sakura Rose",
      name: "Color Hunt #4: Sakura Rose Dermatology",
      colors: ["#BE185D", "#EC4899", "#FCE7F3", "#FFF1F2"],
      primary: "#db2777",
      primaryDark: "#9d174d",
      accent: "#8b5cf6",
      bgLight: "#fdf6f9",
      cardLight: "#ffffff",
      bgDark: "#1c1018",
      cardDark: "#291723"
    },
    {
      id: "vintage-paper",
      shortName: "Oxford Paper",
      name: "Color Hunt #5: Oxford Textbook Parchment",
      colors: ["#8D493A", "#D0B8A8", "#DFD3C3", "#F8EDE3"],
      primary: "#8d493a",
      primaryDark: "#6c3428",
      accent: "#b45309",
      bgLight: "#f9f4ef",
      cardLight: "#fffdfa",
      bgDark: "#1b1614",
      cardDark: "#28201d"
    },
    {
      id: "cyber-mint",
      shortName: "Mint & Navy",
      name: "Color Hunt #6: Mint & Deep Navy",
      colors: ["#04364A", "#176B87", "#64CCC5", "#DAFFFB"],
      primary: "#176b87",
      primaryDark: "#04364a",
      accent: "#0d9488",
      bgLight: "#f2fbfb",
      cardLight: "#ffffff",
      bgDark: "#071a24",
      cardDark: "#0f2938"
    },
    {
      id: "lavender-calm",
      shortName: "Lavender Calm",
      name: "Color Hunt #7: Lavender Mindful Study",
      colors: ["#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4"],
      primary: "#6d597a",
      primaryDark: "#4a4e69",
      accent: "#b56576",
      bgLight: "#f7f3f5",
      cardLight: "#ffffff",
      bgDark: "#171620",
      cardDark: "#232130"
    },
    {
      id: "emerald-gold",
      shortName: "Emerald Pearl",
      name: "Color Hunt #8: Emerald & Amber Pearl",
      colors: ["#064E3B", "#059669", "#F59E0B", "#ECFDF5"],
      primary: "#059669",
      primaryDark: "#065f46",
      accent: "#d97706",
      bgLight: "#f2fbf7",
      cardLight: "#ffffff",
      bgDark: "#091915",
      cardDark: "#112821"
    },
    {
      id: "sunset-coral",
      shortName: "Sunset Coral",
      name: "Color Hunt #9: Sunset Coral & Slate",
      colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C"],
      primary: "#e11d48",
      primaryDark: "#9f1239",
      accent: "#3b82f6",
      bgLight: "#f7f8fa",
      cardLight: "#ffffff",
      bgDark: "#131520",
      cardDark: "#1e2132"
    },
    {
      id: "ocean-breeze",
      shortName: "Aegean Sky",
      name: "Color Hunt #10: Aegean Sky & Cerulean",
      colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"],
      primary: "#0077b6",
      primaryDark: "#023e8a",
      accent: "#0096c7",
      bgLight: "#f2fafe",
      cardLight: "#ffffff",
      bgDark: "#081726",
      cardDark: "#10253b"
    }
  ];

  const STORAGE_KEY = "dalieu_theme_settings_v1";

  let state = {
    paletteId: "medical-teal",
    darkMode: false,
    fontSize: 16,
    customPrimary: null,
    customAccent: null
  };

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign({}, state, parsed);
      }
    } catch (e) {
      console.warn("Could not read theme settings", e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function hexToRgbString(hex) {
    const clean = (hex || "#0d9488").replace("#", "");
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return r + ", " + g + ", " + b;
  }

  function renderMiniPopoverGrid() {
    const gridEl = document.getElementById("popover-palette-grid");
    if (!gridEl) return;

    gridEl.innerHTML = COLOR_HUNT_PALETTES.map((p) => {
      const isActive = p.id === state.paletteId && !state.customPrimary;
      const bars = p.colors
        .map((c) => '<span style="flex:1;background:' + c + ';"></span>')
        .join("");
      return (
        '<button class="mini-palette-item ' +
        (isActive ? "active" : "") +
        '" onclick="window.ThemeEngine.setPalette(\'' +
        p.id +
        '\', true)" title="' +
        p.name +
        '">' +
        '<div class="mini-palette-bar">' +
        bars +
        "</div>" +
        '<div class="mini-palette-name">' +
        (isActive ? "✓ " : "") +
        p.shortName +
        "</div>" +
        "</button>"
      );
    }).join("");
  }

  function applyTheme() {
    const pal =
      COLOR_HUNT_PALETTES.find((p) => p.id === state.paletteId) ||
      COLOR_HUNT_PALETTES[0];

    const primary = state.customPrimary || pal.primary;
    const primaryDark = state.customPrimary || pal.primaryDark;
    const accent = state.customAccent || pal.accent;
    const root = document.documentElement;

    root.style.setProperty("--primary", primary);
    root.style.setProperty("--primary-rgb", hexToRgbString(primary));
    root.style.setProperty("--primary-dark", primaryDark);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-rgb", hexToRgbString(accent));
    root.style.setProperty("--base-font-size", state.fontSize + "px");

    if (state.darkMode) {
      document.body.classList.add("dark-mode");
      root.style.setProperty("--bg-main", pal.bgDark);
      root.style.setProperty("--bg-card", pal.cardDark);
      root.style.setProperty("--bg-elevated", "#1e293b");
      root.style.setProperty("--text-main", "#f1f5f9");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--border-color", "rgba(255,255,255,0.1)");
    } else {
      document.body.classList.remove("dark-mode");
      root.style.setProperty("--bg-main", pal.bgLight);
      root.style.setProperty("--bg-card", pal.cardLight);
      root.style.setProperty("--bg-elevated", "#f8fafc");
      root.style.setProperty("--text-main", "#0f172a");
      root.style.setProperty("--text-muted", "#475569");
      root.style.setProperty("--border-color", "rgba(15,23,42,0.09)");
    }

    // Update UI indicators
    const dmBtn = document.getElementById("btn-dark-mode");
    if (dmBtn) {
      dmBtn.innerHTML = state.darkMode
        ? '<span class="nav-icon">☀️</span><span>Đang bật: Chế độ Tối</span>'
        : '<span class="nav-icon">🌙</span><span>Đang bật: Chế độ Sáng</span>';
    }

    const fontValEl = document.getElementById("popover-font-size-val");
    if (fontValEl) {
      fontValEl.textContent = state.fontSize + "px";
    }

    const pPicker = document.getElementById("mini-custom-primary");
    const aPicker = document.getElementById("mini-custom-accent");
    if (pPicker) pPicker.value = primary;
    if (aPicker) aPicker.value = accent;

    const swatchBar = document.getElementById("active-palette-swatches");
    if (swatchBar) {
      swatchBar.innerHTML = pal.colors
        .map(
          (c) =>
            '<span class="mini-swatch" style="background:' +
            c +
            '" title="' +
            c +
            '"></span>'
        )
        .join("");
    }

    renderMiniPopoverGrid();
  }

  function setPalette(paletteId, showNotification) {
    state.paletteId = paletteId;
    state.customPrimary = null;
    state.customAccent = null;
    saveSettings();
    applyTheme();
    const pal =
      COLOR_HUNT_PALETTES.find((p) => p.id === paletteId) ||
      COLOR_HUNT_PALETTES[0];
    if (showNotification && window.showToast) {
      const swatchesHtml = pal.colors
        .map(
          (c) =>
            '<span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:' +
            c +
            ';margin-right:4px;vertical-align:middle;border:1px solid rgba(0,0,0,0.15)"></span>'
        )
        .join("");
      window.showToast(
        "🎨 Bảng màu: <strong>" + pal.shortName + "</strong> " + swatchesHtml
      );
    }
  }

  function randomizePalette() {
    const others = COLOR_HUNT_PALETTES.filter((p) => p.id !== state.paletteId);
    const pick = others[Math.floor(Math.random() * others.length)];
    setPalette(pick.id, true);
    return pick;
  }

  function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    saveSettings();
    applyTheme();
    if (window.showToast) {
      window.showToast(
        state.darkMode
          ? "🌙 Đã chuyển sang Chế độ Đọc Đêm (Dark Mode)"
          : "☀️ Đã chuyển sang Chế độ Sáng (Light Mode)"
      );
    }
  }

  function changeFontSize(delta) {
    state.fontSize = Math.min(22, Math.max(13, state.fontSize + delta));
    saveSettings();
    applyTheme();
  }

  function resetFontSize() {
    state.fontSize = 16;
    saveSettings();
    applyTheme();
  }

  function setCustomColors(primaryHex, accentHex) {
    state.customPrimary = primaryHex;
    state.customAccent = accentHex;
    saveSettings();
    applyTheme();
  }

  // Mini Popover open/close handlers
  window.toggleThemePopover = function (e) {
    if (e) e.stopPropagation();
    const pop = document.getElementById("theme-mini-popover");
    if (!pop) return;
    pop.classList.toggle("open");
    if (pop.classList.contains("open")) {
      renderMiniPopoverGrid();
    }
  };

  window.closeThemePopover = function () {
    const pop = document.getElementById("theme-mini-popover");
    if (pop) pop.classList.remove("open");
  };

  window.applyMiniCustomColors = function () {
    const p = document.getElementById("mini-custom-primary");
    const a = document.getElementById("mini-custom-accent");
    if (p && a) {
      setCustomColors(p.value, a.value);
    }
  };

  document.addEventListener("click", function (e) {
    const container = document.getElementById("theme-popover-container");
    if (container && !container.contains(e.target)) {
      window.closeThemePopover();
    }
  });

  loadSettings();

  window.ThemeEngine = {
    palettes: COLOR_HUNT_PALETTES,
    getState: () => Object.assign({}, state),
    apply: applyTheme,
    setPalette: setPalette,
    randomize: randomizePalette,
    toggleDarkMode: toggleDarkMode,
    changeFontSize: changeFontSize,
    resetFontSize: resetFontSize,
    setCustomColors: setCustomColors
  };
})();
