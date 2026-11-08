/**
 * DALIEU-EDU: MAIN APPLICATION CONTROLLER (PHASE 1)
 * Features:
 *  - Dr. Fox Virtual Classroom (Slide-by-Slide Interactive Teaching)
 *  - Comprehensive Medical Textbook Reader (with TOC, Filters, PDF link)
 *  - 3D Spaced-Repetition Clinical Flashcards (254 Cards)
 *  - Clinical Mini-Cases & 90 Golden Principles Interactive Hub
 *  - Instant Medical Search, 429-Image Clinical Atlas & Study Notebook
 */

(function () {
  "use strict";

  const STORAGE_KEY = "dalieu_study_progress_v1";

  const MASCOT_IMAGES = {
    teaching: "assets/mascot/dr_fox_teaching.png",
    tip: "assets/mascot/dr_fox_tip.png",
    warning: "assets/mascot/dr_fox_warning.png",
    thinking: "assets/mascot/dr_fox_thinking.png",
    cheering: "assets/mascot/dr_fox_cheering.png",
    peeking: "assets/mascot/dr_fox_peeking.png"
  };

  const MOOD_LABELS = {
    teaching: "🦊 Bác sĩ Cáo giảng bài",
    tip: "💡 Mẹo Lâm Sàng (Clinical Pearl)",
    warning: "🚨 Cảnh báo Đỏ Lâm Sàng",
    thinking: "🤔 Tư duy Chẩn đoán Phân biệt",
    cheering: "🎉 Bác sĩ Cáo khen ngợi"
  };

  let appState = {
    mode: "classroom", // 'dashboard' | 'classroom' | 'reader' | 'flashcards' | 'cases' | 'search'
    currentLectureId: "01",
    currentSlideIdx: 0, // 0-based index within lecture.slides
    currentSlideImgIdx: 0,
    classroomLayout: "dual", // 'dual' | 'single'
    readerFilter: "all", // 'all' | 'pearls' | 'images' | 'golden' | 'cases'
    tocVisible: true,
    sidebarCollapsed: false,
    zenMode: false,
    // Flashcard state
    fcLectureFilter: "all",
    fcCategoryFilter: "all",
    fcStatusFilter: "all",
    fcViewMode: "deck", // 'deck' | 'grid'
    fcCurrentIdx: 0,
    fcIsFlipped: false,
    fcShuffledIds: null,
    // Cases & Golden Hub state
    casesSubTab: "cases", // 'cases' | 'golden'
    casesLectureFilter: "all",
    // Search / Atlas / Notebook / Theme Studio subtab
    utilitySubTab: "search", // 'search' | 'atlas' | 'notebook' | 'themes'
    searchQuery: "",
    atlasLectureFilter: "all",
    atlasSearchQuery: "",
    // Lightbox state
    lightboxZoom: 1
  };

  let userProgress = {
    studiedSlides: {}, // { [slideId]: true }
    completedLectures: {}, // { [lectureId]: true }
    bookmarks: {}, // { [slideId]: true }
    notes: {}, // { [slideId]: "text" }
    caseDrafts: {}, // { [caseId]: "user reasoning" }
    caseRevealed: {}, // { [caseId]: true }
    flashcardStatus: {}, // { [cardId]: 'hard' | 'good' | 'easy' }
    lastStudied: { lectureId: "01", slideIdx: 0 }
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        userProgress = Object.assign({}, userProgress, parsed);
      }
    } catch (e) {
      console.warn("Failed to load progress", e);
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {}
    updateGlobalProgressUI();
  }

  function getData() {
    return window.DALIEU_DATA || { lectures: [], stats: {} };
  }

  function getLecture(id) {
    const lectures = getData().lectures || [];
    return lectures.find((l) => l.id === id) || lectures[0];
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function resolveImg(src) {
    if (!src) return "";
    return window.resolveAtlasImage ? window.resolveAtlasImage(src) : src;
  }

  /* ==========================================================================
     TOAST & LIGHTBOX HELPERS
     ========================================================================== */
  let toastTimer = null;
  window.showToast = function (htmlMsg) {
    const el = document.getElementById("toast-notification");
    if (!el) return;
    el.innerHTML = htmlMsg;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
    }, 3200);
  };

  window.openLightbox = function (src, caption) {
    const modal = document.getElementById("lightbox-modal");
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-caption");
    if (!modal || !img) return;
    appState.lightboxZoom = 1;
    img.src = resolveImg(src);
    img.style.transform = "scale(1)";
    if (cap) cap.textContent = caption || "Hình ảnh lâm sàng Da liễu";
    modal.classList.add("open");
  };

  window.closeLightbox = function () {
    const modal = document.getElementById("lightbox-modal");
    if (modal) modal.classList.remove("open");
  };

  window.openPdfModal = function (pdfUrl, title) {
    const modal = document.getElementById("pdf-viewer-modal");
    const iframe = document.getElementById("pdf-modal-iframe");
    const titleEl = document.getElementById("pdf-modal-title");
    const newTabLink = document.getElementById("pdf-modal-newtab");
    if (!modal || !iframe) return;
    const encoded = encodeURI(pdfUrl);
    iframe.src = encoded;
    if (titleEl) titleEl.textContent = "📄 Slide gốc: " + (title || "Bài giảng Da liễu");
    if (newTabLink) newTabLink.href = encoded;
    modal.classList.add("open");
  };

  window.closePdfModal = function () {
    const modal = document.getElementById("pdf-viewer-modal");
    const iframe = document.getElementById("pdf-modal-iframe");
    if (modal) modal.classList.remove("open");
    if (iframe) iframe.src = "";
  };

  window.zoomLightbox = function (delta) {
    const img = document.getElementById("lightbox-img");
    if (!img) return;
    appState.lightboxZoom = Math.min(
      3.5,
      Math.max(0.5, appState.lightboxZoom + delta)
    );
    img.style.transform = "scale(" + appState.lightboxZoom + ")";
  };

  /* ==========================================================================
     SIDEBAR & GLOBAL PROGRESS RENDERING
     ========================================================================== */
  function calculateLecturePercent(lecture) {
    if (!lecture || !lecture.slides || !lecture.slides.length) return 0;
    const doneCount = lecture.slides.filter(
      (s) => userProgress.studiedSlides[s.id]
    ).length;
    return Math.round((doneCount / lecture.slides.length) * 100);
  }

  function updateGlobalProgressUI() {
    const data = getData();
    const lectures = data.lectures || [];
    let totalUnits = 0;
    let studiedUnits = 0;

    lectures.forEach((l) => {
      totalUnits += l.slides.length;
      l.slides.forEach((s) => {
        if (userProgress.studiedSlides[s.id]) studiedUnits++;
      });
    });

    const pct = totalUnits > 0 ? Math.round((studiedUnits / totalUnits) * 100) : 0;
    const pctEl = document.getElementById("global-progress-pct");
    const fillEl = document.getElementById("global-progress-fill");
    const subEl = document.getElementById("global-progress-sub");

    if (pctEl) pctEl.textContent = pct + "%";
    if (fillEl) fillEl.style.width = pct + "%";
    if (subEl)
      subEl.textContent =
        studiedUnits + " / " + totalUnits + " đơn vị bài giảng đã học";

    renderSidebarLectures();
  }

  function renderSidebarLectures() {
    const listEl = document.getElementById("sidebar-lecture-list");
    if (!listEl) return;
    const lectures = getData().lectures || [];

    listEl.innerHTML = lectures
      .map((lec) => {
        const isActive =
          lec.id === appState.currentLectureId &&
          (appState.mode === "classroom" ||
            appState.mode === "reader" ||
            appState.mode === "quiz");
        const pct = calculateLecturePercent(lec);
        const isCompleted = pct === 100 || userProgress.completedLectures[lec.id];

        return (
          '<button class="lecture-nav-item ' +
          (isActive ? "active" : "") +
          '" onclick="window.selectLecture(\'' +
          lec.id +
          '\')" title="' +
          escapeHtml(lec.title) +
          " (" +
          pct +
          '% đã học)">' +
          '<div class="lecture-num-badge">' +
          lec.id +
          (isCompleted ? '<span class="lecture-done-dot"></span>' : "") +
          "</div>" +
          '<div class="lecture-item-info">' +
          '<div class="lecture-item-title">' +
          escapeHtml(lec.shortTitle.replace(/^\d+\.\s*/, "")) +
          "</div>" +
          '<div class="lecture-item-meta">' +
          "<span>📑 " +
          lec.totalSlides +
          " slide</span>" +
          "<span>•</span>" +
          '<span style="color:var(--primary);font-weight:700">' +
          pct +
          "%</span>" +
          "</div>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");
  }

  /* ==========================================================================
     MODE 0: HOME DASHBOARD (TỔNG QUAN KHÓA HỌC)
     ========================================================================== */
  function renderDashboardView() {
    const data = getData();
    const lectures = data.lectures || [];
    let totalUnits = 0;
    let studiedUnits = 0;
    lectures.forEach((l) => {
      totalUnits += l.slides.length;
      l.slides.forEach((s) => {
        if (userProgress.studiedSlides[s.id]) studiedUnits++;
      });
    });

    const masteredFc = Object.values(userProgress.flashcardStatus).filter(
      (v) => v === "easy"
    ).length;
    const totalFc = data.stats ? data.stats.totalFlashcards : 254;
    const bookmarkCount = Object.keys(userProgress.bookmarks).filter(
      (k) => userProgress.bookmarks[k]
    ).length;
    const noteCount = Object.keys(userProgress.notes).filter(
      (k) => userProgress.notes[k] && userProgress.notes[k].trim()
    ).length;

    const lastLec = getLecture(userProgress.lastStudied.lectureId || "01");
    const lastSlideIdx = Math.min(
      (lastLec.slides || []).length - 1,
      userProgress.lastStudied.slideIdx || 0
    );
    const lastSlide = (lastLec.slides || [])[lastSlideIdx];

    let html = '<div style="max-width:1320px;margin:0 auto;">';

    // Welcome Banner with Dr. Fox
    html +=
      '<div class="dr-fox-stage" style="margin-bottom:24px;padding:24px 28px;">' +
      '<div class="dr-fox-mascot-box">' +
      '<div class="dr-fox-frame" style="width:140px;height:140px;">' +
      '<img src="' +
      MASCOT_IMAGES.teaching +
      '" alt="Dr. Fox" />' +
      "</div>" +
      '<span class="dr-fox-mood-tag">🦊 Giảng viên Bác sĩ Cáo</span>' +
      "</div>" +
      '<div style="flex:1;">' +
      '<h1 style="font-size:1.5rem;font-weight:800;margin-bottom:8px;color:var(--text-main);">Chào mừng bạn đến với Phòng học Lâm sàng Da Liễu!</h1>' +
      '<p style="font-size:0.93rem;color:var(--text-muted);margin-bottom:16px;">' +
      "Mình là <strong>Bác sĩ Cáo (Dr. Fox)</strong>! Mình sẽ đồng hành cùng bạn chinh phục trọn vẹn <strong>9 chuyên đề Da liễu</strong> (411 slide bài giảng gốc, 429 hình ảnh lâm sàng thực tế, 90 nguyên lý vàng và 27 tình huống lâm sàng)." +
      "</p>" +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;">' +
      '<button class="btn-primary" onclick="window.resumeLastStudy()">' +
      "▶️ Học tiếp: " +
      escapeHtml(lastLec.shortTitle) +
      " (" +
      escapeHtml(lastSlide ? lastSlide.slideLabel : "Slide 1") +
      ")" +
      "</button>" +
      '<button class="btn-secondary" onclick="window.switchMode(\'quiz\')">📝 Luyện 270 Câu Trắc Nghiệm & Thi Thử</button>' +
      '<button class="btn-secondary" onclick="window.switchMode(\'flashcards\')">🗂️ Luyện 254 Thẻ Flashcard</button>' +
      '<button class="btn-secondary" onclick="window.switchMode(\'cases\')">🩺 Giải 27 Ca Lâm Sàng & 90 Nguyên Lý Vàng</button>' +
      '<button class="btn-secondary" onclick="window.ThemeEngine.randomize()">🎲 Đổi bảng màu Color Hunt</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    // 4 Stat Cards
    html +=
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:28px;">' +
      '<div class="classroom-pane" style="padding:18px 20px;display:flex;align-items:center;gap:14px;">' +
      '<div style="font-size:2rem;background:rgba(var(--primary-rgb),0.12);width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;">🦊</div>' +
      "<div>" +
      '<div style="font-size:1.35rem;font-weight:800;color:var(--primary);">' +
      studiedUnits +
      " / " +
      totalUnits +
      "</div>" +
      '<div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">Đơn vị Slide đã học (411 Slide gốc)</div>' +
      "</div></div>" +
      '<div class="classroom-pane" style="padding:18px 20px;display:flex;align-items:center;gap:14px;">' +
      '<div style="font-size:2rem;background:rgba(16,185,129,0.12);width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;">🗂️</div>' +
      "<div>" +
      '<div style="font-size:1.35rem;font-weight:800;color:#10b981;">' +
      masteredFc +
      " / " +
      totalFc +
      "</div>" +
      '<div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">Thẻ Flashcard đã thuộc lòng</div>' +
      "</div></div>" +
      '<div class="classroom-pane" style="padding:18px 20px;display:flex;align-items:center;gap:14px;">' +
      '<div style="font-size:2rem;background:rgba(245,158,11,0.12);width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;">📸</div>' +
      "<div>" +
      '<div style="font-size:1.35rem;font-weight:800;color:#f59e0b;">429 Ảnh & 27 Ca</div>' +
      '<div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">Hình thái lâm sàng & Tình huống thực tế</div>' +
      "</div></div>" +
      '<div class="classroom-pane" style="padding:18px 20px;display:flex;align-items:center;gap:14px;cursor:pointer;" onclick="window.openNotebookTab()">' +
      '<div style="font-size:2rem;background:rgba(139,92,246,0.12);width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;">⭐</div>' +
      "<div>" +
      '<div style="font-size:1.35rem;font-weight:800;color:#8b5cf6;">' +
      bookmarkCount +
      " Sao • " +
      noteCount +
      " Ghi chú</div>" +
      '<div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">Sổ tay học tập cá nhân của bạn</div>' +
      "</div></div>" +
      "</div>";

    // 9 Curriculum Lecture Cards Grid
    html +=
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">' +
      '<h2 style="font-size:1.25rem;font-weight:800;">📚 Danh Mục 9 Chuyên Đề Lâm Sàng Da Liễu Toàn Diện</h2>' +
      '<span style="font-size:0.82rem;color:var(--text-muted);">Chọn chế độ Phòng học Bác sĩ Cáo hoặc Đọc Giáo trình cho từng chuyên đề</span>' +
      "</div>";

    html +=
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:20px;">';

    lectures.forEach((lec) => {
      const pct = calculateLecturePercent(lec);
      const thumbImg =
        lec.allImages && lec.allImages.length > 1
          ? lec.allImages[1].src
          : lec.allImages && lec.allImages.length > 0
          ? lec.allImages[0].src
          : "";

      html +=
        '<div class="classroom-pane" style="display:flex;flex-direction:column;justify-content:space-between;padding:22px;transition:transform 0.2s ease,box-shadow 0.2s ease;">' +
        "<div>" +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">' +
        '<span class="hero-cat-badge" style="margin:0;">' +
        lec.icon +
        " " +
        escapeHtml(lec.category) +
        "</span>" +
        '<span style="font-size:0.78rem;font-weight:800;color:var(--primary);">Tiến độ: ' +
        pct +
        "%</span>" +
        "</div>" +
        '<h3 style="font-size:1.12rem;font-weight:800;margin-bottom:6px;color:var(--text-main);">' +
        escapeHtml(lec.shortTitle) +
        ": " +
        escapeHtml(lec.title.replace(/\([^)]*\)$/, "").trim()) +
        "</h3>" +
        '<p style="font-size:0.83rem;color:var(--text-muted);margin-bottom:12px;">' +
        escapeHtml(lec.subtitle) +
        "</p>";

      if (thumbImg) {
        html +=
          '<div style="height:145px;border-radius:10px;overflow:hidden;background:#0f172a;margin-bottom:12px;position:relative;cursor:pointer;" onclick="window.openLectureInMode(\'' +
          lec.id +
          "', 'classroom')\">" +
          '<img src="' +
          escapeHtml(resolveImg(thumbImg)) +
          '" alt="' +
          escapeHtml(lec.title) +
          '" style="width:100%;height:100%;object-fit:cover;opacity:0.92;" loading="lazy" />' +
          '<div style="position:absolute;bottom:8px;left:8px;right:8px;display:flex;justify-content:space-between;align-items:center;">' +
          '<span style="background:rgba(15,23,42,0.82);color:#fff;font-size:0.72rem;padding:3px 9px;border-radius:99px;font-weight:700;">📑 ' +
          lec.totalSlides +
          " Slide (" +
          lec.slides.length +
          " đơn vị giảng)</span>" +
          '<span style="background:rgba(15,23,42,0.82);color:#fff;font-size:0.72rem;padding:3px 9px;border-radius:99px;font-weight:700;">📸 ' +
          lec.imageCount +
          " ảnh • 🗂️ " +
          lec.flashcards.length +
          " thẻ</span>" +
          "</div>" +
          "</div>";
      }

      html +=
        '<div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:10px;">👨‍⚕️ <strong>Giảng viên:</strong> ' +
        escapeHtml(lec.author) +
        "</div>" +
        '<div class="progress-track" style="margin-bottom:14px;"><div class="progress-fill" style="width:' +
        pct +
        '%"></div></div>' +
        "</div>" +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid var(--border-color);">' +
        '<button class="btn-primary" style="flex:1;justify-content:center;" onclick="window.openLectureInMode(\'' +
        lec.id +
        "', 'classroom')\">🦊 Học cùng Bác sĩ Cáo</button>" +
        '<button class="btn-secondary" onclick="window.openLectureInMode(\'' +
        lec.id +
        "', 'reader')\" title=\"Đọc toàn bộ giáo trình chuyên sâu\">📖 Giáo trình</button>" +
        '<button class="btn-secondary" onclick="window.QuizEngine && window.QuizEngine.openLectureQuiz(\'' +
        lec.id +
        '\')" title="Luyện 30 câu Trắc nghiệm bài này">📝 Quiz</button>' +
        '<button class="btn-secondary" onclick="window.openLectureFlashcards(\'' +
        lec.id +
        '\')" title="Luyện Flashcard bài này">🗂️ Flashcard</button>' +
        '<button class="btn-secondary" onclick="window.openPdfModal(\'' +
        escapeHtml(lec.pdfFile).replace(/'/g, "\\'") +
        "', '" +
        escapeHtml(lec.shortTitle).replace(/'/g, "\\'") +
        '\')" title="Xem nhanh Slide PDF gốc ngay trên màn hình hiện tại">📄 PDF</button>' +
        "</div>" +
        "</div>";
    });

    html += "</div></div>";
    return html;
  }

  /* ==========================================================================
     MODE 1: DR. FOX VIRTUAL CLASSROOM (PHÒNG HỌC ẢO CÙNG BÁC SĨ CÁO)
     ========================================================================== */
  function renderClassroomView() {
    const lec = getLecture(appState.currentLectureId);
    if (!lec || !lec.slides || !lec.slides.length) {
      return '<div class="classroom-pane">Không tìm thấy dữ liệu bài giảng.</div>';
    }

    if (appState.currentSlideIdx >= lec.slides.length) {
      appState.currentSlideIdx = 0;
    }
    const slide = lec.slides[appState.currentSlideIdx];
    const totalUnits = lec.slides.length;

    // Mark current slide as studied & update lastStudied
    userProgress.studiedSlides[slide.id] = true;
    userProgress.lastStudied = {
      lectureId: lec.id,
      slideIdx: appState.currentSlideIdx
    };
    saveProgress();

    const isBookmarked = !!userProgress.bookmarks[slide.id];
    const slideNote = userProgress.notes[slide.id] || "";
    const fox = slide.drFox || {
      mood: "teaching",
      greeting: "🦊 **Bác sĩ Cáo giảng bài:** Cùng phân tích kỹ nội dung lâm sàng của slide này nhé!",
      keyPoints: []
    };
    const mascotImg = MASCOT_IMAGES[fox.mood] || MASCOT_IMAGES.teaching;
    const moodLabel = MOOD_LABELS[fox.mood] || MOOD_LABELS.teaching;

    let html = '<div class="classroom-container">';

    // 1. Classroom Top Control Header
    html +=
      '<div class="classroom-header-card">' +
      '<div class="classroom-title-wrap">' +
      '<div class="classroom-part-badge">' +
      "<span>" +
      lec.icon +
      " " +
      escapeHtml(lec.shortTitle) +
      "</span>" +
      "<span>•</span>" +
      "<span>" +
      escapeHtml(slide.partTitle) +
      "</span>" +
      "</div>" +
      '<h1 class="classroom-slide-title">' +
      escapeHtml(slide.title) +
      "</h1>" +
      "</div>" +
      '<div class="classroom-nav-controls">' +
      '<button class="btn-secondary" onclick="window.prevSlide()" ' +
      (appState.currentSlideIdx === 0 ? "disabled" : "") +
      ' title="Phím tắt: Mũi tên Trái (←)">⬅ Slide trước</button>' +
      '<select class="btn-secondary" style="max-width:230px;font-weight:700;" onchange="window.goToSlide(Number(this.value))">';

    lec.slides.forEach((s, idx) => {
      const doneMark = userProgress.studiedSlides[s.id] ? "✓ " : "";
      html +=
        '<option value="' +
        idx +
        '" ' +
        (idx === appState.currentSlideIdx ? "selected" : "") +
        ">" +
        doneMark +
        "(" +
        (idx + 1) +
        "/" +
        totalUnits +
        ") " +
        escapeHtml(s.slideLabel) +
        ": " +
        escapeHtml(s.title.replace(/^SLIDE\s+[^:]+:\s*/i, "").slice(0, 38)) +
        "</option>";
    });

    html +=
      "</select>" +
      '<button class="btn-primary" onclick="window.nextSlide()" ' +
      (appState.currentSlideIdx >= totalUnits - 1 ? "disabled" : "") +
      ' title="Phím tắt: Mũi tên Phải (→)">Slide tiếp theo ➡</button>' +
      '<button class="btn-secondary" onclick="window.toggleClassroomLayout()" title="Đổi bố cục 2 cột / 1 cột">' +
      (appState.classroomLayout === "dual" ? "📐 1 Cột" : "📖 2 Cột") +
      "</button>" +
      '<button class="btn-secondary" onclick="window.switchMode(\'reader\')" title="Xem toàn bộ bài giảng dạng sách giáo khoa">📖 Đọc toàn bài</button>' +
      '<button class="btn-secondary" onclick="window.openPdfModal(\'' +
      escapeHtml(lec.pdfFile).replace(/'/g, "\\'") +
      "', '" +
      escapeHtml(lec.shortTitle).replace(/'/g, "\\'") +
      '\')" title="Mở khung xem Slide PDF gốc ngay tại màn hình này">📄 PDF gốc</button>' +
      "</div>";

    // Interactive Step Progress Strip
    html += '<div class="slide-progress-strip">';
    lec.slides.forEach((s, idx) => {
      const cls =
        idx === appState.currentSlideIdx
          ? "current"
          : userProgress.studiedSlides[s.id]
          ? "studied"
          : "";
      html +=
        '<div class="slide-step-dot ' +
        cls +
        '" onclick="window.goToSlide(' +
        idx +
        ')" title="' +
        escapeHtml(s.title) +
        '"></div>';
    });
    html += "</div></div>";

    // 2. Dr. Fox Interactive Teacher Stage
    html +=
      '<div class="dr-fox-stage">' +
      '<div class="dr-fox-mascot-box">' +
      '<div class="dr-fox-frame" onclick="window.triggerFoxEncourage()" title="Bấm vào Bác sĩ Cáo để nhận lời khuyên học tập!">' +
      '<img src="' +
      mascotImg +
      '" alt="Bác sĩ Cáo Dr. Fox" />' +
      "</div>" +
      '<span class="dr-fox-mood-tag">' +
      moodLabel +
      "</span>" +
      "</div>" +
      '<div class="dr-fox-speech-bubble">' +
      '<div class="dr-fox-speech-header">' +
      '<div class="dr-fox-greeting">' +
      window.MedicalMarkdown.renderInline(fox.greeting) +
      "</div>" +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
      '<button class="btn-secondary" style="padding:5px 10px;font-size:0.76rem;" onclick="window.speakCurrentSlide()">🔊 Nghe Bác sĩ Cáo tóm tắt</button>' +
      '<button class="btn-secondary" style="padding:5px 10px;font-size:0.76rem;' +
      (isBookmarked
        ? "background:rgba(245,158,11,0.18);border-color:#f59e0b;color:#d97706;"
        : "") +
      '" onclick="window.toggleBookmark(\'' +
      slide.id +
      "')\">" +
      (isBookmarked ? "⭐ Đã lưu Bookmark" : "☆ Lưu Slide quan trọng") +
      "</button>" +
      "</div>" +
      "</div>";

    if (fox.keyPoints && fox.keyPoints.length > 0) {
      html += '<ul class="dr-fox-keypoints">';
      fox.keyPoints.forEach((kp) => {
        html += "<li>" + window.MedicalMarkdown.renderInline(kp) + "</li>";
      });
      html += "</ul>";
    } else {
      html +=
        '<p style="font-size:0.88rem;color:var(--text-muted);margin-top:4px;">Hãy đối chiếu nội dung nguyên bản trên Slide bên trái và đọc kỹ phần phân tích lâm sàng chuyên sâu của BSCKII bên phải nhé!</p>';
    }

    html += "</div></div>";

    // 3. Dual-Pane Slide Content + Deep BSCKII Clinical Explanation
    const hasBothPanes =
      (slide.images.length > 0 || slide.slideOriginalMarkdown) &&
      slide.clinicalExplanationMarkdown;
    const gridClass =
      appState.classroomLayout === "dual" && hasBothPanes
        ? "classroom-dual-grid"
        : "classroom-dual-grid single-col";

    html += '<div class="' + gridClass + '">';

    // LEFT PANE: Slide Visuals & Original Slide Content
    if (slide.images.length > 0 || slide.slideOriginalMarkdown || !slide.clinicalExplanationMarkdown) {
      html += '<div class="classroom-pane">';
      html +=
        '<div class="pane-header">' +
        '<div class="pane-title">📽️ NỘI DUNG & HÌNH ẢNH TRÊN SLIDE GỐC (' +
        escapeHtml(slide.slideLabel) +
        ")</div>" +
        (slide.images.length > 0
          ? '<span style="font-size:0.76rem;font-weight:700;color:var(--text-muted);">📸 ' +
            slide.images.length +
            " hình ảnh</span>"
          : "") +
        "</div>";

      // Image Gallery for this Slide
      if (slide.images && slide.images.length > 0) {
        const imgIdx = Math.min(
          slide.images.length - 1,
          appState.currentSlideImgIdx || 0
        );
        const activeImg = slide.images[imgIdx];

        html +=
          '<div class="slide-gallery-box">' +
          '<div class="slide-main-image-wrap" onclick="window.openLightbox(\'' +
          escapeHtml(activeImg.src).replace(/'/g, "\\'") +
          "', '" +
          escapeHtml(activeImg.alt).replace(/'/g, "\\'") +
          '\')">' +
          '<img src="' +
          escapeHtml(resolveImg(activeImg.src)) +
          '" alt="' +
          escapeHtml(activeImg.alt) +
          '" />' +
          '<span class="md-img-zoom-hint">🔍 Bấm để phóng to toàn màn hình</span>' +
          "</div>" +
          '<div class="slide-img-caption">📸 ' +
          escapeHtml(activeImg.alt) +
          (slide.images.length > 1
            ? " (" + (imgIdx + 1) + "/" + slide.images.length + ")"
            : "") +
          "</div>";

        if (slide.images.length > 1) {
          html += '<div class="slide-thumbs-row">';
          slide.images.forEach((im, iIdx) => {
            html +=
              '<button class="slide-thumb-btn ' +
              (iIdx === imgIdx ? "active" : "") +
              '" onclick="window.selectSlideImage(' +
              iIdx +
              ')" title="' +
              escapeHtml(im.alt) +
              '">' +
              '<img src="' +
              escapeHtml(resolveImg(im.src)) +
              '" alt="Thumb" />' +
              "</button>";
          });
          html += "</div>";
        }
        html += "</div>";
      }

      // Original Slide Markdown Text
      const origToRender =
        slide.slideOriginalMarkdown ||
        (!slide.clinicalExplanationMarkdown ? slide.rawMarkdown : "");
      if (origToRender) {
        html +=
          '<div class="md-content">' +
          window.MedicalMarkdown.render(origToRender, { hideImages: true }) +
          "</div>";
      } else {
        html +=
          '<p style="font-size:0.86rem;color:var(--text-muted);font-style:italic;">Slide hình ảnh lâm sàng trực quan — Xem phân tích bán chứng học chi tiết của BSCKII ở khung bên cạnh.</p>';
      }

      html += "</div>";
    }

    // RIGHT PANE: Deep Clinical Explanation from BSCKII
    if (slide.clinicalExplanationMarkdown) {
      html +=
        '<div class="classroom-pane">' +
        '<div class="pane-header">' +
        '<div class="pane-title">🩺 GIẢNG GIẢI CHUYÊN SÂU CỦA GIẢNG VIÊN LÂM SÀNG (BSCKII)</div>' +
        '<span class="brand-badge">Phân tích Y học thực chứng</span>' +
        "</div>" +
        '<div class="md-content">' +
        window.MedicalMarkdown.render(slide.clinicalExplanationMarkdown, {
          hideImages: true
        }) +
        "</div>" +
        "</div>";
    }

    html += "</div>"; // end dual-grid

    // 4. Personal Slide Note & Quick Actions Footer
    html +=
      '<div class="classroom-pane" style="margin-top:4px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:10px;">' +
      '<div style="font-weight:800;font-size:0.92rem;display:flex;align-items:center;gap:8px;">📝 Ghi chú cá nhân của bạn tại ' +
      escapeHtml(slide.slideLabel) +
      "</div>" +
      '<span style="font-size:0.76rem;color:var(--text-muted);">Tự động lưu vào bộ nhớ trình duyệt trên máy của bạn</span>' +
      "</div>" +
      '<textarea id="slide-note-input" rows="2" placeholder="Nhập ghi chú, mẹo nhớ nhanh hoặc thắc mắc của bạn cho slide này..." style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-elevated);color:var(--text-main);font-family:inherit;font-size:0.88rem;resize:vertical;" oninput="window.saveSlideNote(\'' +
      slide.id +
      '\', this.value)">' +
      escapeHtml(slideNote) +
      "</textarea>" +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid var(--border-color);flex-wrap:wrap;gap:10px;">' +
      '<button class="btn-secondary" onclick="window.prevSlide()" ' +
      (appState.currentSlideIdx === 0 ? "disabled" : "") +
      ">⬅ Quay lại Slide trước</button>" +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button class="btn-secondary" onclick="window.QuizEngine && window.QuizEngine.openLectureQuiz(\'' +
      lec.id +
      "')\">📝 Trắc nghiệm bài này (30 câu)</button>" +
      '<button class="btn-secondary" onclick="window.openLectureFlashcards(\'' +
      lec.id +
      "')\">🗂️ Ôn Flashcard bài này (" +
      lec.flashcards.length +
      " thẻ)</button>" +
      '<button class="btn-secondary" onclick="window.openLectureCases(\'' +
      lec.id +
      "')\">🌟 Xem 10 Nguyên lý Vàng & 3 Ca lâm sàng</button>" +
      (appState.currentSlideIdx < totalUnits - 1
        ? '<button class="btn-primary" onclick="window.nextSlide()">Học tiếp Slide (' +
          (appState.currentSlideIdx + 2) +
          "/" +
          totalUnits +
          ") ➡</button>"
        : '<button class="btn-primary" style="background:#10b981;" onclick="window.completeLecture(\'' +
          lec.id +
          "')\">🎉 Hoàn thành bài giảng & Luyện Ca lâm sàng!</button>") +
      "</div>" +
      "</div>" +
      "</div>";

    html += "</div>";
    return html;
  }

  /* ==========================================================================
     MODE 2: COMPREHENSIVE MEDICAL TEXTBOOK READER (GIÁO TRÌNH CHUYÊN SÂU)
     ========================================================================== */
  function renderReaderView() {
    const lec = getLecture(appState.currentLectureId);
    if (!lec) return "";

    const pct = calculateLecturePercent(lec);

    let html =
      '<div class="reader-layout ' +
      (appState.tocVisible ? "" : "toc-hidden") +
      '">';

    // MAIN COLUMN
    html += '<div class="reader-main-col">';

    // Lecture Hero Banner
    html +=
      '<div class="lecture-hero-card">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">' +
      '<span class="hero-cat-badge">' +
      lec.icon +
      " " +
      escapeHtml(lec.category) +
      "</span>" +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '<button class="btn-primary" onclick="window.switchMode(\'classroom\')">🦊 Vào Phòng Học Bác sĩ Cáo</button>' +
      '<button class="btn-secondary" onclick="window.QuizEngine && window.QuizEngine.openLectureQuiz(\'' +
      lec.id +
      "')\">📝 Trắc nghiệm (30 câu)</button>" +
      '<button class="btn-secondary" onclick="window.openLectureFlashcards(\'' +
      lec.id +
      "')\">🗂️ Flashcard (" +
      lec.flashcards.length +
      ")</button>" +
      '<button class="btn-secondary" onclick="window.openPdfModal(\'' +
      escapeHtml(lec.pdfFile).replace(/'/g, "\\'") +
      "', '" +
      escapeHtml(lec.shortTitle).replace(/'/g, "\\'") +
      '\')">📄 Xem Slide PDF Gốc</button>' +
      '<button class="btn-secondary" onclick="window.toggleToc()">' +
      (appState.tocVisible ? "Ẩn Mục lục" : "Hiện Mục lục") +
      "</button>" +
      "</div>" +
      "</div>" +
      '<h1 class="hero-title">' +
      escapeHtml(lec.shortTitle) +
      ": " +
      escapeHtml(lec.title) +
      "</h1>" +
      '<p class="hero-subtitle">' +
      escapeHtml(lec.subtitle) +
      "</p>" +
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:12px;border-top:1px solid var(--border-color);">' +
      '<div class="hero-topic-tags" style="margin-top:0;">' +
      (lec.keyTopics || [])
        .map((t) => '<span class="topic-tag"># ' + escapeHtml(t) + "</span>")
        .join("") +
      "</div>" +
      '<div class="brand-logo-wrap">' +
      '<span class="topic-tag" style="cursor:pointer;color:var(--primary);border-color:rgba(var(--primary-rgb),0.35);font-weight:700;">ℹ️ Thông tin giảng viên &amp; học liệu</span>' +
      '<div class="brand-hover-card" style="left:auto;right:0;width:320px;">' +
      '<div class="brand-hover-body">' +
      "<div>👨‍⚕️ <strong>Tác giả Slide:</strong> " +
      escapeHtml(lec.author) +
      "</div>" +
      "<div>🩺 <strong>Giảng giải:</strong> " +
      escapeHtml(lec.commentator) +
      "</div>" +
      "<div>📊 <strong>Tiến độ:</strong> " +
      pct +
      "% (" +
      lec.totalSlides +
      " slide • " +
      lec.imageCount +
      " ảnh)</div>" +
      "</div></div></div>" +
      "</div>" +
      "</div>";

    // Reader Filter Bar
    const filters = [
      { id: "all", label: "📚 Toàn bộ Giáo trình (" + lec.slides.length + " mục)" },
      { id: "pearls", label: "💡 Chỉ xem Hộp Kinh nghiệm (Clinical Pearls)" },
      { id: "images", label: "📸 Chỉ xem Bộ ảnh Lâm sàng (" + lec.imageCount + " ảnh)" },
      { id: "golden", label: "🌟 10 Nguyên lý Vàng Lâm sàng" },
      { id: "cases", label: "🩺 3 Tình huống Lâm sàng (Mini-Cases)" }
    ];

    html +=
      '<div class="classroom-pane" style="padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
      '<span style="font-size:0.8rem;font-weight:800;color:var(--text-muted);margin-right:4px;">Chế độ xem:</span>';
    filters.forEach((f) => {
      html +=
        '<button class="mode-btn ' +
        (appState.readerFilter === f.id ? "active" : "") +
        '" onclick="window.setReaderFilter(\'' +
        f.id +
        "')\">" +
        f.label +
        "</button>";
    });
    html += "</div>";

    // BSCKII Opening Letter (if filter === 'all')
    if (appState.readerFilter === "all" && lec.introQuote) {
      html +=
        '<div class="dr-fox-stage" style="margin-bottom:22px;">' +
        '<div class="dr-fox-mascot-box">' +
        '<div class="dr-fox-frame">' +
        '<img src="' +
        MASCOT_IMAGES.teaching +
        '" alt="Dr. Fox" />' +
        "</div>" +
        '<span class="dr-fox-mood-tag">Lời mở đầu BSCKII</span>' +
        "</div>" +
        '<div class="dr-fox-speech-bubble">' +
        '<div style="font-weight:800;color:var(--primary);margin-bottom:8px;">🎙️ TÂM THƯ & ĐỊNH HƯỚNG LÂM SÀNG TỪ GIẢNG VIÊN (BSCKII)</div>' +
        '<div class="md-content">' +
        window.MedicalMarkdown.render(lec.introQuote) +
        "</div>" +
        "</div>" +
        "</div>";
    }

    // Filter content rendering
    if (appState.readerFilter === "all") {
      let lastPart = "";
      lec.slides.forEach((s, idx) => {
        if (s.partTitle && s.partTitle !== lastPart) {
          lastPart = s.partTitle;
          html +=
            '<div id="reader-part-' +
            idx +
            '" style="margin:28px 0 14px;padding:12px 18px;border-radius:12px;background:linear-gradient(90deg,var(--primary),var(--accent));color:#fff;font-weight:800;font-size:1.05rem;box-shadow:var(--shadow-sm);">' +
            "📂 " +
            escapeHtml(s.partTitle) +
            "</div>";
        }

        const isBookmarked = !!userProgress.bookmarks[s.id];

        html +=
          '<section id="reader-slide-' +
          idx +
          '" class="classroom-pane" style="margin-bottom:18px;">' +
          '<div class="pane-header">' +
          '<div class="pane-title" style="font-size:1.05rem;">' +
          escapeHtml(s.title) +
          "</div>" +
          '<div style="display:flex;gap:6px;">' +
          '<button class="btn-secondary" style="padding:4px 10px;font-size:0.75rem;" onclick="window.openSlideInClassroom(\'' +
          lec.id +
          "', " +
          idx +
          ')">🦊 Học slide này với Dr. Fox</button>' +
          '<button class="btn-secondary" style="padding:4px 10px;font-size:0.75rem;' +
          (isBookmarked ? "color:#d97706;border-color:#f59e0b;" : "") +
          '" onclick="window.toggleBookmark(\'' +
          s.id +
          "')\">" +
          (isBookmarked ? "⭐ Đã lưu" : "☆ Lưu") +
          "</button>" +
          "</div>" +
          "</div>" +
          '<div class="md-content">' +
          window.MedicalMarkdown.render(s.rawMarkdown) +
          "</div>" +
          "</section>";
      });
    } else if (appState.readerFilter === "pearls") {
      html +=
        '<div class="classroom-pane" style="margin-bottom:20px;">' +
        '<h2 style="font-size:1.2rem;font-weight:800;margin-bottom:14px;color:var(--primary);">💡 Tổng hợp các Hộp Kinh Nghiệm & Cảnh Báo Lâm Sàng trong bài</h2>';
      let count = 0;
      lec.slides.forEach((s, idx) => {
        if (s.alerts && s.alerts.length > 0) {
          s.alerts.forEach((al) => {
            count++;
            html +=
              '<div style="margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border-color);">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
              '<span style="font-weight:800;font-size:0.86rem;color:var(--primary);">' +
              escapeHtml(s.title) +
              "</span>" +
              '<button class="btn-secondary" style="padding:3px 9px;font-size:0.74rem;" onclick="window.openSlideInClassroom(\'' +
              lec.id +
              "', " +
              idx +
              ')">Mở Slide ➡</button>' +
              "</div>" +
              window.MedicalMarkdown.render(
                "> [!" + al.type + "]\n> " + al.content.replace(/\n/g, "\n> ")
              ) +
              "</div>";
          });
        }
      });
      if (count === 0) {
        html +=
          '<p style="color:var(--text-muted);">Hãy xem thêm 10 Nguyên lý Vàng bên dưới để nắm trọn các kinh nghiệm lâm sàng cốt lõi của bài học.</p>';
      }
      html += "</div>";
    } else if (appState.readerFilter === "images") {
      html +=
        '<div class="classroom-pane" style="margin-bottom:20px;">' +
        '<h2 style="font-size:1.2rem;font-weight:800;margin-bottom:16px;color:var(--primary);">📸 Bộ sưu tập ' +
        lec.imageCount +
        " Hình ảnh Lâm sàng & Vi thể (" +
        escapeHtml(lec.shortTitle) +
        ")</h2>" +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;">';
      lec.slides.forEach((s, idx) => {
        (s.images || []).forEach((im) => {
          html +=
            '<div style="background:var(--bg-elevated);border:1px solid var(--border-color);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">' +
            '<div style="height:190px;background:#0f172a;display:flex;align-items:center;justify-content:center;cursor:zoom-in;" onclick="window.openLightbox(\'' +
            escapeHtml(im.src).replace(/'/g, "\\'") +
            "', '" +
            escapeHtml(im.alt).replace(/'/g, "\\'") +
            '\')">' +
            '<img src="' +
            escapeHtml(resolveImg(im.src)) +
            '" alt="' +
            escapeHtml(im.alt) +
            '" style="max-width:100%;max-height:190px;object-fit:contain;" loading="lazy" />' +
            "</div>" +
            '<div style="padding:10px 12px;">' +
            '<div style="font-size:0.8rem;font-weight:700;margin-bottom:6px;">' +
            escapeHtml(im.alt) +
            "</div>" +
            '<button class="btn-secondary" style="width:100%;justify-content:center;padding:5px;font-size:0.75rem;" onclick="window.openSlideInClassroom(\'' +
            lec.id +
            "', " +
            idx +
            ')">🦊 Xem giảng giải (' +
            escapeHtml(s.slideLabel) +
            ")</button>" +
            "</div>" +
            "</div>";
        });
      });
      html += "</div></div>";
    }

    // 10 GOLDEN PRINCIPLES SECTION
    if (
      appState.readerFilter === "all" ||
      appState.readerFilter === "golden" ||
      appState.readerFilter === "pearls"
    ) {
      html +=
        '<section id="reader-golden-sec" class="classroom-pane" style="margin-bottom:22px;border:2px solid rgba(245,158,11,0.4);">' +
        '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">' +
        '<img src="' +
        MASCOT_IMAGES.tip +
        '" alt="Dr. Fox Tip" style="width:68px;height:68px;background:transparent;object-fit:contain;" />' +
        "<div>" +
        '<div style="font-size:0.76rem;font-weight:800;color:#d97706;text-transform:uppercase;">Tổng kết Tinh hoa Thực hành</div>' +
        '<h2 style="font-size:1.3rem;font-weight:800;">🌟 10 NGUYÊN LÝ "VÀNG" CỦA BSCKII TRÊN LÂM SÀNG</h2>' +
        "</div>" +
        "</div>" +
        '<div class="golden-grid">';

      (lec.goldenPrinciples || []).forEach((gp) => {
        html +=
          '<div class="golden-card">' +
          '<div class="golden-num">' +
          gp.number +
          "</div>" +
          "<div>" +
          '<div style="font-weight:800;font-size:0.95rem;margin-bottom:4px;color:var(--text-main);">' +
          escapeHtml(gp.title) +
          "</div>" +
          '<div class="md-content" style="font-size:0.88rem;">' +
          window.MedicalMarkdown.renderInline(gp.content) +
          "</div>" +
          "</div>" +
          "</div>";
      });

      html += "</div></section>";
    }

    // 3 CLINICAL MINI-CASES SECTION
    if (appState.readerFilter === "all" || appState.readerFilter === "cases") {
      html +=
        '<section id="reader-cases-sec" class="classroom-pane" style="margin-bottom:24px;border:2px solid rgba(var(--primary-rgb),0.35);">' +
        '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">' +
        '<img src="' +
        MASCOT_IMAGES.thinking +
        '" alt="Dr. Fox Thinking" style="width:68px;height:68px;background:transparent;object-fit:contain;" />' +
        "<div>" +
        '<div style="font-size:0.76rem;font-weight:800;color:var(--primary);text-transform:uppercase;">Lượng giá Tư duy Bác sĩ</div>' +
        '<h2 style="font-size:1.3rem;font-weight:800;">🩺 3 TÌNH HUỐNG LÂM SÀNG THỰC TẾ (MINI-CASES)</h2>' +
        "</div>" +
        "</div>";

      (lec.miniCases || []).forEach((mc) => {
        html += renderSingleCaseCard(mc, lec);
      });

      html += "</section>";
    }

    html += "</div>"; // end reader-main-col

    // STICKY TABLE OF CONTENTS SIDEBAR
    if (appState.tocVisible) {
      html +=
        '<aside class="reader-toc-card">' +
        '<div style="font-weight:800;font-size:0.88rem;color:var(--primary);display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;border-bottom:1px solid var(--border-color);">' +
        "<span>📑 MỤC LỤC BÀI GIẢNG</span>" +
        '<span style="font-size:0.72rem;color:var(--text-muted);">' +
        lec.slides.length +
        " mục</span>" +
        "</div>" +
        '<div class="toc-list">';

      let currentPart = "";
      lec.slides.forEach((s, idx) => {
        if (s.partTitle && s.partTitle !== currentPart) {
          currentPart = s.partTitle;
          html +=
            '<button class="toc-item-btn toc-part" onclick="window.scrollToReaderEl(\'reader-part-' +
            idx +
            "')\">" +
            escapeHtml(s.partTitle) +
            "</button>";
        }
        html +=
          '<button class="toc-item-btn" onclick="window.scrollToReaderEl(\'reader-slide-' +
          idx +
          "')\">" +
          (userProgress.studiedSlides[s.id] ? "✓ " : "• ") +
          escapeHtml(s.title) +
          "</button>";
      });

      html +=
        '<button class="toc-item-btn toc-part" style="color:#d97706;" onclick="window.scrollToReaderEl(\'reader-golden-sec\')">🌟 10 Nguyên lý Vàng</button>' +
        '<button class="toc-item-btn toc-part" style="color:var(--primary);" onclick="window.scrollToReaderEl(\'reader-cases-sec\')">🩺 3 Tình huống Lâm sàng</button>' +
        "</div></aside>";
    }

    html += "</div>";
    return html;
  }

  function renderSingleCaseCard(mc, lec) {
    const isRevealed = !!userProgress.caseRevealed[mc.id];
    const draft = userProgress.caseDrafts[mc.id] || "";

    let html =
      '<div class="case-card">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
      '<span class="hero-cat-badge" style="margin:0;">🩺 ' +
      escapeHtml(lec.shortTitle) +
      " • " +
      escapeHtml(mc.title) +
      "</span>" +
      "</div>" +
      '<div class="md-content" style="background:var(--bg-elevated);padding:16px 18px;border-radius:12px;border:1px solid var(--border-color);margin-bottom:14px;">' +
      window.MedicalMarkdown.render(mc.scenarioMarkdown) +
      "</div>" +
      '<div style="margin-bottom:14px;">' +
      '<label style="display:block;font-size:0.82rem;font-weight:700;margin-bottom:6px;color:var(--text-muted);">✍️ Nháp chẩn đoán & hướng xử trí của bạn trước khi mở đáp án:</label>' +
      '<textarea rows="2" placeholder="Nhập chẩn đoán sơ bộ, cận lâm sàng cần đề nghị và thuốc điều trị..." style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-card);color:var(--text-main);font-family:inherit;font-size:0.86rem;" oninput="window.saveCaseDraft(\'' +
      mc.id +
      '\', this.value)">' +
      escapeHtml(draft) +
      "</textarea>" +
      "</div>" +
      '<button class="btn-primary" onclick="window.toggleCaseReveal(\'' +
      mc.id +
      "')\">" +
      (isRevealed
        ? "🙈 Ẩn Phân tích của BSCKII"
        : "🦊 Xem Phân tích & Phác đồ Xử trí của BSCKII") +
      "</button>";

    if (isRevealed) {
      html +=
        '<div style="margin-top:16px;padding:18px 20px;border-radius:14px;background:rgba(16,185,129,0.07);border:2px solid rgba(16,185,129,0.35);">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;font-weight:800;color:#059669;">' +
        '<img src="' +
        MASCOT_IMAGES.cheering +
        '" alt="Dr. Fox" style="width:44px;height:44px;background:transparent;object-fit:contain;" />' +
        "<span>PHÂN TÍCH BIỆN LUẬN & HƯỚNG DẪN XỬ TRÍ CHUẨN CỦA BSCKII:</span>" +
        "</div>" +
        '<div class="md-content">' +
        window.MedicalMarkdown.render(mc.analysisMarkdown) +
        "</div>" +
        "</div>";
    }

    html += "</div>";
    return html;
  }

  /* ==========================================================================
     MODE 3: CLINICAL FLASHCARDS (PHÒNG LUYỆN FLASHCARD 3D)
     ========================================================================== */
  function getFilteredFlashcards() {
    const lectures = getData().lectures || [];
    let all = [];
    lectures.forEach((l) => {
      if (appState.fcLectureFilter === "all" || appState.fcLectureFilter === l.id) {
        all = all.concat(l.flashcards || []);
      }
    });

    if (appState.fcCategoryFilter !== "all") {
      all = all.filter((c) => c.category === appState.fcCategoryFilter);
    }

    if (appState.fcStatusFilter !== "all") {
      all = all.filter((c) => {
        const st = userProgress.flashcardStatus[c.id] || "unseen";
        return st === appState.fcStatusFilter;
      });
    }

    if (appState.fcShuffledIds && appState.fcShuffledIds.length > 0) {
      const orderMap = {};
      appState.fcShuffledIds.forEach((id, idx) => {
        orderMap[id] = idx;
      });
      all.sort((a, b) => (orderMap[a.id] ?? 9999) - (orderMap[b.id] ?? 9999));
    }

    return all;
  }

  function renderFlashcardsView() {
    const lectures = getData().lectures || [];
    const cards = getFilteredFlashcards();

    if (appState.fcCurrentIdx >= cards.length) {
      appState.fcCurrentIdx = 0;
    }

    // Count stats
    let totalEasy = 0;
    let totalHard = 0;
    lectures.forEach((l) => {
      (l.flashcards || []).forEach((c) => {
        const st = userProgress.flashcardStatus[c.id];
        if (st === "easy") totalEasy++;
        if (st === "hard") totalHard++;
      });
    });

    let html = '<div style="max-width:1180px;margin:0 auto;">';

    // Header & Filter Controls
    html +=
      '<div class="classroom-header-card" style="margin-bottom:20px;">' +
      "<div>" +
      '<div class="classroom-part-badge">🗂️ HỆ THỐNG GHI NHỚ NGẮT QUÃNG (SPACED REPETITION)</div>' +
      '<h1 class="classroom-slide-title">Ngân Hàng 254 Thẻ Flashcard Lâm Sàng Da Liễu</h1>' +
      '<div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">' +
      "🟢 Đã thuộc lòng: <strong>" +
      totalEasy +
      "</strong> thẻ • 🔴 Cần ôn kỹ: <strong>" +
      totalHard +
      "</strong> thẻ • Đang lọc: <strong>" +
      cards.length +
      "</strong> thẻ" +
      "</div>" +
      "</div>" +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">' +
      '<select class="btn-secondary" onchange="window.setFcFilter(\'lecture\', this.value)">' +
      '<option value="all" ' +
      (appState.fcLectureFilter === "all" ? "selected" : "") +
      ">📚 Tất cả 9 Chuyên đề (254 thẻ)</option>";

    lectures.forEach((l) => {
      html +=
        '<option value="' +
        l.id +
        '" ' +
        (appState.fcLectureFilter === l.id ? "selected" : "") +
        ">" +
        escapeHtml(l.shortTitle) +
        " (" +
        l.flashcards.length +
        " thẻ)</option>";
    });

    html +=
      "</select>" +
      '<select class="btn-secondary" onchange="window.setFcFilter(\'category\', this.value)">' +
      '<option value="all" ' +
      (appState.fcCategoryFilter === "all" ? "selected" : "") +
      ">🏷️ Tất cả loại thẻ</option>" +
      '<option value="visual" ' +
      (appState.fcCategoryFilter === "visual" ? "selected" : "") +
      ">📸 Nhận diện Hình thái Lâm sàng</option>" +
      '<option value="golden" ' +
      (appState.fcCategoryFilter === "golden" ? "selected" : "") +
      ">🌟 10 Nguyên lý Vàng</option>" +
      '<option value="pearl" ' +
      (appState.fcCategoryFilter === "pearl" ? "selected" : "") +
      ">💡 Kinh nghiệm & Cảnh báo Đỏ</option>" +
      '<option value="case" ' +
      (appState.fcCategoryFilter === "case" ? "selected" : "") +
      ">🩺 Tình huống Lâm sàng</option>" +
      "</select>" +
      '<select class="btn-secondary" onchange="window.setFcFilter(\'status\', this.value)">' +
      '<option value="all" ' +
      (appState.fcStatusFilter === "all" ? "selected" : "") +
      ">📊 Mọi trạng thái</option>" +
      '<option value="unseen" ' +
      (appState.fcStatusFilter === "unseen" ? "selected" : "") +
      ">⚪ Chưa học</option>" +
      '<option value="hard" ' +
      (appState.fcStatusFilter === "hard" ? "selected" : "") +
      ">🔴 Cần ôn lại (Khó)</option>" +
      '<option value="easy" ' +
      (appState.fcStatusFilter === "easy" ? "selected" : "") +
      ">🟢 Đã thuộc lòng</option>" +
      "</select>" +
      '<button class="btn-secondary" onclick="window.shuffleFlashcards()">🔀 Xáo trộn</button>' +
      '<button class="btn-secondary" onclick="window.toggleFcViewMode()">' +
      (appState.fcViewMode === "deck" ? "🔲 Xem dạng Lưới" : "🎴 Xem dạng Lật 3D") +
      "</button>" +
      "</div></div>";

    if (cards.length === 0) {
      html +=
        '<div class="classroom-pane" style="text-align:center;padding:48px 20px;">' +
        '<img src="' +
        MASCOT_IMAGES.cheering +
        '" alt="Dr. Fox" style="width:110px;height:110px;border-radius:20px;margin-bottom:12px;" />' +
        "<h3>Không có thẻ Flashcard nào khớp với bộ lọc hiện tại!</h3>" +
        '<p style="color:var(--text-muted);margin:8px 0 16px;">Hãy đổi bộ lọc để tiếp tục ôn tập nhé.</p>' +
        '<button class="btn-primary" onclick="window.resetFcFilters()">Xem toàn bộ 254 thẻ</button>' +
        "</div></div>";
      return html;
    }

    if (appState.fcViewMode === "deck") {
      const card = cards[appState.fcCurrentIdx];
      const status = userProgress.flashcardStatus[card.id] || "unseen";
      const statusBadge =
        status === "easy"
          ? '<span style="color:#10b981;font-weight:800;">🟢 Đã thuộc lòng</span>'
          : status === "hard"
          ? '<span style="color:#ef4444;font-weight:800;">🔴 Cần ôn lại</span>'
          : '<span style="color:var(--text-muted);">⚪ Chưa đánh giá</span>';

      html +=
        '<div class="flashcard-stage-wrap">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:0.85rem;font-weight:700;">' +
        "<span>Thẻ " +
        (appState.fcCurrentIdx + 1) +
        " / " +
        cards.length +
        " • " +
        escapeHtml(card.lectureTitle) +
        "</span>" +
        "<span>" +
        statusBadge +
        "</span>" +
        "</div>" +
        '<div class="flashcard-3d-scene">' +
        '<div id="active-flashcard-3d" class="flashcard-3d-card ' +
        (appState.fcIsFlipped ? "is-flipped" : "") +
        '" onclick="window.flipFlashcard()">' +
        // FRONT FACE
        '<div class="flashcard-face flashcard-face-front">' +
        "<div>" +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
        '<span class="hero-cat-badge" style="margin:0;">' +
        escapeHtml(card.categoryLabel) +
        "</span>" +
        '<span style="font-size:0.78rem;font-weight:700;color:var(--text-muted);">' +
        escapeHtml(card.badge) +
        "</span>" +
        "</div>" +
        '<h2 style="font-size:1.25rem;font-weight:800;margin-bottom:14px;color:var(--text-main);">' +
        escapeHtml(card.frontTitle) +
        "</h2>";

      if (card.frontImage) {
        html +=
          '<div style="height:210px;background:#0f172a;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:14px;position:relative;" onclick="event.stopPropagation(); window.openLightbox(\'' +
          escapeHtml(card.frontImage).replace(/'/g, "\\'") +
          "', '" +
          escapeHtml(card.frontTitle).replace(/'/g, "\\'") +
          '\')">' +
          '<img src="' +
          escapeHtml(resolveImg(card.frontImage)) +
          '" alt="Clinical Lesion" style="max-width:100%;max-height:200px;object-fit:contain;" />' +
          '<span class="md-img-zoom-hint">🔍 Phóng to ảnh</span>' +
          "</div>";
      }

      html +=
        '<div class="md-content" style="font-size:1.02rem;">' +
        window.MedicalMarkdown.render(card.frontPrompt) +
        "</div>" +
        "</div>" +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px dashed var(--border-color);margin-top:16px;">' +
        '<div style="display:flex;align-items:center;gap:8px;font-size:0.82rem;color:var(--text-muted);">' +
        '<img src="' +
        MASCOT_IMAGES.thinking +
        '" alt="Dr. Fox" style="width:38px;height:38px;background:transparent;object-fit:contain;" />' +
        "<span>Hãy suy nghĩ câu trả lời trước khi lật thẻ nhé!</span>" +
        "</div>" +
        '<span style="font-size:0.82rem;font-weight:800;color:var(--primary);">🔄 Bấm vào thẻ hoặc phím Space để lật mặt sau ➡</span>' +
        "</div>" +
        "</div>" +
        // BACK FACE
        '<div class="flashcard-face flashcard-face-back">' +
        "<div>" +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<span class="hero-cat-badge" style="margin:0;background:rgba(16,185,129,0.15);color:#059669;">✅ ĐÁP ÁN & GIẢI THÍCH LÂM SÀNG</span>' +
        '<span style="font-size:0.78rem;font-weight:700;color:var(--text-muted);">' +
        escapeHtml(card.slideRef || "") +
        "</span>" +
        "</div>" +
        '<h3 style="font-size:1.15rem;font-weight:800;margin-bottom:12px;color:var(--primary);">' +
        escapeHtml(card.backTitle) +
        "</h3>" +
        '<div class="md-content" style="font-size:0.95rem;">' +
        window.MedicalMarkdown.render(card.backContent) +
        "</div>" +
        "</div>" +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--border-color);margin-top:16px;flex-wrap:wrap;gap:8px;">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
        '<img src="' +
        MASCOT_IMAGES.tip +
        '" alt="Dr. Fox" style="width:38px;height:38px;background:transparent;object-fit:contain;" />' +
        '<span style="font-size:0.82rem;font-weight:700;">Đánh giá mức độ nhớ của bạn ở thanh bên dưới!</span>' +
        "</div>" +
        (card.slideId
          ? '<button class="btn-secondary" style="padding:5px 10px;font-size:0.78rem;" onclick="event.stopPropagation(); window.jumpToSlideById(\'' +
            card.lectureId +
            "', '" +
            card.slideId +
            "')\">🔗 Mở tới Slide bài giảng gốc</button>"
          : "") +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      // Spaced Repetition Rating Bar & Navigation
      html +=
        '<div class="classroom-pane" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:16px 22px;">' +
        '<button class="btn-secondary" onclick="window.prevFlashcard()">⬅ Thẻ trước</button>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button class="btn-secondary" style="border-color:#ef4444;color:#dc2626;font-weight:700;" onclick="window.rateFlashcard(\'' +
        card.id +
        "', 'hard')\">🔴 Quên / Khó (Ôn lại)</button>" +
        '<button class="btn-secondary" style="border-color:#f59e0b;color:#d97706;font-weight:700;" onclick="window.flipFlashcard()">🔄 Lật thẻ (Space)</button>' +
        '<button class="btn-primary" style="background:#10b981;" onclick="window.rateFlashcard(\'' +
        card.id +
        "', 'easy')\">🟢 Đã thuộc lòng (Tiếp theo ➡)</button>" +
        "</div>" +
        '<button class="btn-secondary" onclick="window.nextFlashcard()">Thẻ tiếp ➡</button>' +
        "</div>" +
        "</div>";
    } else {
      // Grid View Mode
      html +=
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px;">';
      cards.forEach((c, idx) => {
        const st = userProgress.flashcardStatus[c.id] || "unseen";
        html +=
          '<div class="classroom-pane" style="display:flex;flex-direction:column;justify-content:space-between;">' +
          "<div>" +
          '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
          '<span class="hero-cat-badge" style="margin:0;">' +
          escapeHtml(c.lectureTitle) +
          " • " +
          escapeHtml(c.badge) +
          "</span>" +
          '<span style="font-size:0.75rem;font-weight:700;">' +
          (st === "easy" ? "🟢 Đã thuộc" : st === "hard" ? "🔴 Cần ôn" : "⚪") +
          "</span>" +
          "</div>" +
          '<h3 style="font-size:1rem;font-weight:800;margin-bottom:8px;">' +
          escapeHtml(c.frontTitle) +
          "</h3>";
        if (c.frontImage) {
          html +=
            '<div style="height:140px;background:#0f172a;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:8px;cursor:zoom-in;" onclick="window.openLightbox(\'' +
            escapeHtml(c.frontImage).replace(/'/g, "\\'") +
            "', '" +
            escapeHtml(c.frontTitle).replace(/'/g, "\\'") +
            '\')">' +
            '<img src="' +
            escapeHtml(resolveImg(c.frontImage)) +
            '" alt="Img" style="max-width:100%;max-height:140px;object-fit:contain;" loading="lazy" />' +
            "</div>";
        }
        html +=
          '<div class="md-content" style="font-size:0.86rem;padding-top:8px;border-top:1px dashed var(--border-color);">' +
          window.MedicalMarkdown.render(c.backContent) +
          "</div>" +
          "</div>" +
          '<div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px solid var(--border-color);">' +
          '<button class="btn-secondary" style="padding:4px 10px;font-size:0.75rem;" onclick="window.openCardInDeck(' +
          idx +
          ')">🎴 Mở thẻ 3D</button>' +
          '<div style="display:flex;gap:6px;">' +
          '<button class="btn-secondary" style="padding:4px 8px;font-size:0.75rem;color:#dc2626;" onclick="window.rateFlashcardGrid(\'' +
          c.id +
          "', 'hard')\">🔴 Khó</button>" +
          '<button class="btn-secondary" style="padding:4px 8px;font-size:0.75rem;color:#059669;" onclick="window.rateFlashcardGrid(\'' +
          c.id +
          "', 'easy')\">🟢 Thuộc</button>" +
          "</div>" +
          "</div>" +
          "</div>";
      });
      html += "</div>";
    }

    html += "</div>";
    return html;
  }

  /* ==========================================================================
     MODE 4: CLINICAL MINI-CASES & 90 GOLDEN PRINCIPLES HUB
     ========================================================================== */
  function renderCasesAndGoldenHub() {
    const lectures = getData().lectures || [];
    let html = '<div style="max-width:1220px;margin:0 auto;">';

    html +=
      '<div class="classroom-header-card" style="margin-bottom:20px;">' +
      "<div>" +
      '<div class="classroom-part-badge">🩺 TRUNG TÂM THỰC HÀNH LÂM SÀNG & NGUYÊN LÝ VÀNG</div>' +
      '<h1 class="classroom-slide-title">27 Tình Huống Lâm Sàng Thực Tế & 90 Nguyên Lý Vàng BSCKII</h1>' +
      "</div>" +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
      '<button class="mode-btn ' +
      (appState.casesSubTab === "cases" ? "active" : "") +
      '" onclick="window.setCasesSubTab(\'cases\')">🩺 27 Tình huống Lâm sàng (Mini-Cases)</button>' +
      '<button class="mode-btn ' +
      (appState.casesSubTab === "golden" ? "active" : "") +
      '" onclick="window.setCasesSubTab(\'golden\')">🌟 90 Nguyên lý Vàng Lâm sàng</button>' +
      '<select class="btn-secondary" onchange="window.setCasesLectureFilter(this.value)">' +
      '<option value="all" ' +
      (appState.casesLectureFilter === "all" ? "selected" : "") +
      ">📚 Tất cả 9 Chuyên đề</option>";

    lectures.forEach((l) => {
      html +=
        '<option value="' +
        l.id +
        '" ' +
        (appState.casesLectureFilter === l.id ? "selected" : "") +
        ">" +
        escapeHtml(l.shortTitle) +
        "</option>";
    });
    html += "</select></div></div>";

    const filteredLectures =
      appState.casesLectureFilter === "all"
        ? lectures
        : lectures.filter((l) => l.id === appState.casesLectureFilter);

    if (appState.casesSubTab === "cases") {
      filteredLectures.forEach((lec) => {
        (lec.miniCases || []).forEach((mc) => {
          html += renderSingleCaseCard(mc, lec);
        });
      });
    } else {
      filteredLectures.forEach((lec) => {
        html +=
          '<div class="classroom-pane" style="margin-bottom:22px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
          '<h2 style="font-size:1.15rem;font-weight:800;color:var(--primary);">' +
          lec.icon +
          " " +
          escapeHtml(lec.shortTitle) +
          ": 10 Nguyên lý Vàng Lâm Sàng</h2>" +
          '<button class="btn-secondary" style="padding:5px 12px;font-size:0.78rem;" onclick="window.openLectureInMode(\'' +
          lec.id +
          "', 'classroom')\">🦊 Học bài này</button>" +
          "</div>" +
          '<div class="golden-grid">';
        (lec.goldenPrinciples || []).forEach((gp) => {
          html +=
            '<div class="golden-card">' +
            '<div class="golden-num">' +
            gp.number +
            "</div>" +
            "<div>" +
            '<div style="font-weight:800;font-size:0.94rem;margin-bottom:4px;">' +
            escapeHtml(gp.title) +
            "</div>" +
            '<div class="md-content" style="font-size:0.86rem;">' +
            window.MedicalMarkdown.renderInline(gp.content) +
            "</div>" +
            "</div></div>";
        });
        html += "</div></div>";
      });
    }

    html += "</div>";
    return html;
  }

  /* ==========================================================================
     MODE 5: QUICK SEARCH, 429-IMAGE CLINICAL ATLAS, NOTEBOOK & THEME STUDIO
     ========================================================================== */
  function renderUtilityHubView() {
    const lectures = getData().lectures || [];
    let html = '<div style="max-width:1280px;margin:0 auto;">';

    html +=
      '<div class="classroom-header-card" style="margin-bottom:20px;">' +
      "<div>" +
      '<div class="classroom-part-badge">🔍 CÔNG CỤ TRA CỨU LÂM SÀNG, ATLAS HÌNH ẢNH & SỔ TAY</div>' +
      '<h1 class="classroom-slide-title">Tra Cứu Nhanh, Atlas 429 Ảnh Lâm Sàng, Sổ Tay & Giao Diện</h1>' +
      "</div>" +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
      '<button class="mode-btn ' +
      (appState.utilitySubTab === "search" ? "active" : "") +
      '" onclick="window.setUtilityTab(\'search\')">🔍 Tìm kiếm Toàn văn</button>' +
      '<button class="mode-btn ' +
      (appState.utilitySubTab === "atlas" ? "active" : "") +
      '" onclick="window.setUtilityTab(\'atlas\')">📸 Atlas 429 Ảnh Lâm sàng</button>' +
      '<button class="mode-btn ' +
      (appState.utilitySubTab === "notebook" ? "active" : "") +
      '" onclick="window.setUtilityTab(\'notebook\')">⭐ Sổ tay & Bookmark</button>' +
      '<button class="mode-btn ' +
      (appState.utilitySubTab === "themes" ? "active" : "") +
      '" onclick="window.setUtilityTab(\'themes\')">🎨 Bảng màu Color Hunt</button>' +
      "</div></div>";

    if (appState.utilitySubTab === "search") {
      html +=
        '<div class="classroom-pane" style="margin-bottom:20px;">' +
        '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">' +
        '<input id="global-search-input" type="text" value="' +
        escapeHtml(appState.searchQuery) +
        '" placeholder="Gõ tên bệnh, tên thuốc (Ceftriaxone, Penicillin, Dupilumab, Isotretinoin...), dấu hiệu (Auspitz, Nikolsky, Biett, Koebner...)..." style="flex:1;padding:12px 16px;border-radius:12px;border:2px solid var(--primary);background:var(--bg-elevated);color:var(--text-main);font-size:0.95rem;" oninput="window.handleSearchInput(this.value)" />' +
        '<button class="btn-secondary" onclick="window.handleSearchInput(\'\')">Xóa</button>' +
        "</div>" +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center;">' +
        '<span style="font-size:0.76rem;color:var(--text-muted);font-weight:700;">Từ khóa gợi ý nhanh:</span>';

      [
        "Auspitz",
        "Nikolsky",
        "Ceftriaxone",
        "Doxycycline",
        "Penicillin",
        "Filaggrin",
        "HLA-B*15:02",
        "SCORTEN",
        "PASI",
        "Gardasil 9",
        "Omalizumab",
        "Terbinafine",
        "Isotretinoin",
        "Biett"
      ].forEach((kw) => {
        html +=
          '<button class="btn-secondary" style="padding:3px 9px;font-size:0.74rem;" onclick="window.handleSearchInput(\'' +
          kw +
          "')\">" +
          kw +
          "</button>";
      });
      html += "</div></div>";

      html += '<div id="search-results-container">' + renderSearchResultsHTML() + "</div>";
    } else if (appState.utilitySubTab === "atlas") {
      html +=
        '<div class="classroom-pane" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<select class="btn-secondary" onchange="window.setAtlasFilter(this.value)">' +
        '<option value="all" ' +
        (appState.atlasLectureFilter === "all" ? "selected" : "") +
        ">📸 Tất cả 9 Chuyên đề (429 ảnh)</option>";
      lectures.forEach((l) => {
        html +=
          '<option value="' +
          l.id +
          '" ' +
          (appState.atlasLectureFilter === l.id ? "selected" : "") +
          ">" +
          escapeHtml(l.shortTitle) +
          " (" +
          l.imageCount +
          " ảnh)</option>";
      });
      html +=
        "</select>" +
        '<input type="text" value="' +
        escapeHtml(appState.atlasSearchQuery) +
        '" placeholder="Lọc mô tả hình ảnh (vd: móng, săng, mụn mủ, KOH...)" style="padding:8px 14px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-elevated);color:var(--text-main);min-width:260px;" oninput="window.setAtlasSearch(this.value)" />' +
        "</div>" +
        '<span style="font-size:0.8rem;color:var(--text-muted);">Bấm vào ảnh bất kỳ để soi phóng đại hoặc nhảy tới Slide bài giảng</span>' +
        "</div>";

      html +=
        '<div id="atlas-grid-container" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;">' +
        renderAtlasGridHTML() +
        "</div>";
    } else if (appState.utilitySubTab === "notebook") {
      html += renderNotebookHTML();
    } else if (appState.utilitySubTab === "themes") {
      html += renderThemeStudioHTML();
    }

    html += "</div>";
    return html;
  }

  function renderSearchResultsHTML() {
    const q = (appState.searchQuery || "").trim();
    if (q.length < 2) {
      return (
        '<div class="classroom-pane" style="text-align:center;padding:36px 20px;color:var(--text-muted);">' +
        '<img src="' +
        MASCOT_IMAGES.teaching +
        '" alt="Dr. Fox" style="width:96px;height:96px;border-radius:18px;margin-bottom:10px;" />' +
        "<h3>Nhập từ khóa bất kỳ để tra cứu tức thì trong 411 Slide bài giảng</h3>" +
        "<p>Tìm theo tên thuốc, liều lượng, triệu chứng, cơ chế bệnh sinh, tiêu chuẩn chẩn đoán...</p>" +
        "</div>"
      );
    }

    const qLower = q.toLowerCase();
    const lectures = getData().lectures || [];
    const matches = [];

    lectures.forEach((lec) => {
      lec.slides.forEach((s, sIdx) => {
        const hay = (s.title + "\n" + s.rawMarkdown).toLowerCase();
        const pos = hay.indexOf(qLower);
        if (pos !== -1) {
          // Extract snippet around match
          const rawClean = s.rawMarkdown.replace(/\!\[[^\]]*\]\([^)]+\)/g, "");
          const posRaw = rawClean.toLowerCase().indexOf(qLower);
          let snippet = "";
          if (posRaw !== -1) {
            const start = Math.max(0, posRaw - 90);
            const end = Math.min(rawClean.length, posRaw + q.length + 140);
            snippet =
              (start > 0 ? "..." : "") +
              rawClean.slice(start, end).replace(/\r?\n/g, " ") +
              (end < rawClean.length ? "..." : "");
          } else {
            snippet = rawClean.slice(0, 200).replace(/\r?\n/g, " ") + "...";
          }
          matches.push({
            lecture: lec,
            slide: s,
            slideIdx: sIdx,
            snippet: snippet
          });
        }
      });
    });

    if (matches.length === 0) {
      return (
        '<div class="classroom-pane" style="text-align:center;padding:32px;">Không tìm thấy kết quả nào cho từ khóa "<strong>' +
        escapeHtml(q) +
        '</strong>".</div>'
      );
    }

    let out =
      '<div style="margin-bottom:12px;font-weight:700;font-size:0.88rem;color:var(--primary);">Tìm thấy ' +
      matches.length +
      ' đơn vị bài giảng có chứa "' +
      escapeHtml(q) +
      '":</div>';

    matches.slice(0, 50).forEach((m) => {
      out +=
        '<div class="classroom-pane" style="margin-bottom:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">' +
        '<div style="flex:1;min-width:260px;">' +
        '<div style="font-size:0.75rem;font-weight:800;color:var(--primary);margin-bottom:4px;">' +
        m.lecture.icon +
        " " +
        escapeHtml(m.lecture.shortTitle) +
        " • " +
        escapeHtml(m.slide.slideLabel) +
        "</div>" +
        '<div style="font-size:1rem;font-weight:800;margin-bottom:6px;">' +
        window.MedicalMarkdown.renderInline(m.slide.title, q) +
        "</div>" +
        '<div style="font-size:0.85rem;color:var(--text-muted);">' +
        window.MedicalMarkdown.renderInline(m.snippet, q) +
        "</div>" +
        "</div>" +
        '<div style="display:flex;gap:8px;">' +
        '<button class="btn-primary" onclick="window.openSlideInClassroom(\'' +
        m.lecture.id +
        "', " +
        m.slideIdx +
        ')">🦊 Học Slide này</button>' +
        "</div>" +
        "</div>";
    });

    return out;
  }

  function renderAtlasGridHTML() {
    const lectures = getData().lectures || [];
    const q = (appState.atlasSearchQuery || "").trim().toLowerCase();
    let out = "";
    let count = 0;

    lectures.forEach((lec) => {
      if (
        appState.atlasLectureFilter !== "all" &&
        appState.atlasLectureFilter !== lec.id
      ) {
        return;
      }
      lec.slides.forEach((s, sIdx) => {
        (s.images || []).forEach((im) => {
          if (
            q &&
            !im.alt.toLowerCase().includes(q) &&
            !s.title.toLowerCase().includes(q)
          ) {
            return;
          }
          count++;
          out +=
            '<div class="classroom-pane" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;">' +
            '<div style="height:185px;background:#0f172a;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:zoom-in;margin-bottom:10px;" onclick="window.openLightbox(\'' +
            escapeHtml(im.src).replace(/'/g, "\\'") +
            "', '" +
            escapeHtml(im.alt).replace(/'/g, "\\'") +
            '\')">' +
            '<img src="' +
            escapeHtml(resolveImg(im.src)) +
            '" alt="' +
            escapeHtml(im.alt) +
            '" style="max-width:100%;max-height:180px;object-fit:contain;" loading="lazy" />' +
            "</div>" +
            "<div>" +
            '<div style="font-size:0.72rem;font-weight:800;color:var(--primary);margin-bottom:3px;">' +
            escapeHtml(lec.shortTitle) +
            " • " +
            escapeHtml(s.slideLabel) +
            "</div>" +
            '<div style="font-size:0.83rem;font-weight:700;margin-bottom:8px;">' +
            escapeHtml(im.alt) +
            "</div>" +
            '<button class="btn-secondary" style="width:100%;justify-content:center;padding:5px;font-size:0.76rem;" onclick="window.openSlideInClassroom(\'' +
            lec.id +
            "', " +
            sIdx +
            ')">🦊 Mở Slide giảng giải</button>' +
            "</div></div>";
        });
      });
    });

    if (count === 0) {
      return '<div class="classroom-pane" style="grid-column:1/-1;text-align:center;padding:32px;">Không tìm thấy hình ảnh phù hợp.</div>';
    }
    return out;
  }

  function renderNotebookHTML() {
    const lectures = getData().lectures || [];
    const items = [];

    lectures.forEach((lec) => {
      lec.slides.forEach((s, sIdx) => {
        const isBm = !!userProgress.bookmarks[s.id];
        const note = (userProgress.notes[s.id] || "").trim();
        if (isBm || note) {
          items.push({
            lecture: lec,
            slide: s,
            slideIdx: sIdx,
            isBookmarked: isBm,
            note: note
          });
        }
      });
    });

    let html =
      '<div class="classroom-pane" style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">' +
      "<div>" +
      '<h2 style="font-size:1.15rem;font-weight:800;">⭐ Sổ Tay Ghi Chú & Slide Đánh Dấu Của Bạn (' +
      items.length +
      " mục)</h2>" +
      '<p style="font-size:0.83rem;color:var(--text-muted);">Mọi ghi chú và dấu sao đều được lưu tự động trên trình duyệt của bạn.</p>' +
      "</div>" +
      '<button class="btn-primary" onclick="window.exportStudyNotebook()">📥 Xuất Sổ Tay ra file Markdown (.md)</button>' +
      "</div>";

    if (items.length === 0) {
      html +=
        '<div class="classroom-pane" style="text-align:center;padding:40px 20px;">' +
        '<img src="' +
        MASCOT_IMAGES.tip +
        '" alt="Dr. Fox" style="width:96px;height:96px;border-radius:18px;margin-bottom:10px;" />' +
        "<h3>Bạn chưa có Bookmark hoặc Ghi chú cá nhân nào</h3>" +
        '<p style="color:var(--text-muted);margin-top:6px;">Trong lúc học cùng Bác sĩ Cáo hoặc đọc giáo trình, hãy bấm nút <strong>"☆ Lưu Slide quan trọng"</strong> hoặc gõ vào ô Ghi chú nhé!</p>' +
        "</div>";
      return html;
    }

    items.forEach((it) => {
      html +=
        '<div class="classroom-pane" style="margin-bottom:14px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px;">' +
        '<div style="font-weight:800;color:var(--primary);">' +
        (it.isBookmarked ? "⭐ " : "📝 ") +
        escapeHtml(it.lecture.shortTitle) +
        " • " +
        escapeHtml(it.slide.title) +
        "</div>" +
        '<button class="btn-secondary" style="padding:4px 10px;font-size:0.78rem;" onclick="window.openSlideInClassroom(\'' +
        it.lecture.id +
        "', " +
        it.slideIdx +
        ')">🦊 Mở tới Slide này</button>' +
        "</div>" +
        (it.note
          ? '<div style="padding:12px 14px;border-radius:10px;background:var(--bg-elevated);border-left:4px solid var(--primary);font-size:0.9rem;">' +
            escapeHtml(it.note).replace(/\n/g, "<br>") +
            "</div>"
          : '<div style="font-size:0.82rem;color:var(--text-muted);font-style:italic;">Đã đánh dấu sao quan trọng</div>') +
        "</div>";
    });

    return html;
  }

  function renderThemeStudioHTML() {
    const palettes = window.ThemeEngine.palettes || [];
    const current = window.ThemeEngine.getState();

    let html =
      '<div class="classroom-pane" style="margin-bottom:20px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px;">' +
      "<div>" +
      '<h2 style="font-size:1.2rem;font-weight:800;">🎨 Bảng Màu Color Hunt & Tùy Biến Giao Diện Y Khoa</h2>' +
      '<p style="font-size:0.84rem;color:var(--text-muted);">Chọn bảng màu yêu thích từ bộ sưu tập Color Hunt, bấm Random ngẫu nhiên hoặc tự pha màu của riêng bạn!</p>' +
      "</div>" +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button class="btn-primary" onclick="window.ThemeEngine.randomize(); window.renderWorkspace();">🎲 Random Bảng Màu Color Hunt</button>' +
      '<button class="btn-secondary" onclick="window.ThemeEngine.toggleDarkMode(); window.renderWorkspace();">☀️ / 🌙 Đổi Sáng / Tối</button>' +
      "</div>" +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px;">';

    palettes.forEach((p) => {
      const isSelected = p.id === current.paletteId && !current.customPrimary;
      html +=
        '<div onclick="window.ThemeEngine.setPalette(\'' +
        p.id +
        "', true); window.renderWorkspace();\" style=\"cursor:pointer;padding:16px;border-radius:14px;background:var(--bg-elevated);border:2px solid " +
        (isSelected ? "var(--primary)" : "var(--border-color)") +
        ';transition:all 0.2s ease;">' +
        '<div style="display:flex;height:44px;border-radius:10px;overflow:hidden;margin-bottom:10px;border:1px solid rgba(0,0,0,0.1);">' +
        p.colors
          .map((c) => '<div style="flex:1;background:' + c + ';" title="' + c + '"></div>')
          .join("") +
        "</div>" +
        '<div style="font-weight:800;font-size:0.88rem;display:flex;justify-content:space-between;align-items:center;">' +
        "<span>" +
        escapeHtml(p.name) +
        "</span>" +
        (isSelected ? '<span style="color:var(--primary);">✓ Đang dùng</span>' : "") +
        "</div>" +
        '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px;font-family:monospace;">' +
        p.colors.join(" • ") +
        "</div>" +
        "</div>";
    });

    html +=
      "</div>" +
      '<div style="margin-top:24px;padding-top:18px;border-top:1px solid var(--border-color);display:flex;align-items:center;gap:16px;flex-wrap:wrap;">' +
      '<span style="font-weight:800;font-size:0.9rem;">🖌️ Tự chọn màu chủ đạo theo ý thích:</span>' +
      '<label style="display:flex;align-items:center;gap:6px;font-size:0.84rem;font-weight:600;">Màu chính: <input type="color" id="custom-primary-picker" value="' +
      (current.customPrimary || "#0d9488") +
      '" /></label>' +
      '<label style="display:flex;align-items:center;gap:6px;font-size:0.84rem;font-weight:600;">Màu nhấn: <input type="color" id="custom-accent-picker" value="' +
      (current.customAccent || "#0284c7") +
      '" /></label>' +
      '<button class="btn-secondary" onclick="window.applyCustomPickerColors()">Áp dụng màu tự chọn</button>' +
      "</div>" +
      "</div>";

    return html;
  }

  /* ==========================================================================
     MAIN RENDER DISPATCHER & EVENT HANDLERS
     ========================================================================== */
  window.renderWorkspace = function () {
    const container = document.getElementById("main-workspace");
    if (!container) return;

    // Update topbar mode button active state & scroll active button into view
    document.querySelectorAll(".mode-btn[data-mode]").forEach((btn) => {
      const m = btn.getAttribute("data-mode");
      if (m === appState.mode) {
        btn.classList.add("active");
        if (btn.scrollIntoView) {
          btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        }
      } else {
        btn.classList.remove("active");
      }
    });
    if (window.updateModeNavArrows) {
      setTimeout(window.updateModeNavArrows, 60);
    }

    if (appState.mode === "dashboard") {
      container.innerHTML = renderDashboardView();
    } else if (appState.mode === "classroom") {
      container.innerHTML = renderClassroomView();
    } else if (appState.mode === "reader") {
      container.innerHTML = renderReaderView();
    } else if (appState.mode === "flashcards") {
      container.innerHTML = renderFlashcardsView();
    } else if (appState.mode === "quiz") {
      container.innerHTML = window.QuizEngine ? window.QuizEngine.render() : "";
    } else if (appState.mode === "cases") {
      container.innerHTML = renderCasesAndGoldenHub();
    } else if (appState.mode === "search") {
      container.innerHTML = renderUtilityHubView();
    }

    renderSidebarLectures();
  };

  window.switchMode = function (mode) {
    appState.mode = mode;
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.selectLecture = function (lectureId) {
    appState.currentLectureId = lectureId;
    appState.currentSlideIdx = 0;
    appState.currentSlideImgIdx = 0;
    if (appState.mode === "quiz" && window.QuizEngine) {
      document.body.classList.remove("mobile-sidebar-open");
      window.QuizEngine.openLectureQuiz(lectureId);
      return;
    }
    if (appState.mode !== "classroom" && appState.mode !== "reader") {
      appState.mode = "classroom";
    }
    document.body.classList.remove("mobile-sidebar-open");
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.openLectureInMode = function (lectureId, mode) {
    appState.currentLectureId = lectureId;
    appState.currentSlideIdx = 0;
    appState.currentSlideImgIdx = 0;
    appState.mode = mode;
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.resumeLastStudy = function () {
    const last = userProgress.lastStudied || { lectureId: "01", slideIdx: 0 };
    appState.currentLectureId = last.lectureId || "01";
    appState.currentSlideIdx = last.slideIdx || 0;
    appState.currentSlideImgIdx = 0;
    appState.mode = "classroom";
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.prevSlide = function () {
    if (appState.currentSlideIdx > 0) {
      appState.currentSlideIdx--;
      appState.currentSlideImgIdx = 0;
      window.renderWorkspace();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  window.nextSlide = function () {
    const lec = getLecture(appState.currentLectureId);
    if (lec && appState.currentSlideIdx < lec.slides.length - 1) {
      appState.currentSlideIdx++;
      appState.currentSlideImgIdx = 0;
      window.renderWorkspace();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  window.goToSlide = function (idx) {
    appState.currentSlideIdx = idx;
    appState.currentSlideImgIdx = 0;
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.selectSlideImage = function (imgIdx) {
    appState.currentSlideImgIdx = imgIdx;
    window.renderWorkspace();
  };

  window.toggleClassroomLayout = function () {
    appState.classroomLayout =
      appState.classroomLayout === "dual" ? "single" : "dual";
    window.renderWorkspace();
  };

  window.openSlideInClassroom = function (lectureId, slideIdx) {
    appState.currentLectureId = lectureId;
    appState.currentSlideIdx = slideIdx;
    appState.currentSlideImgIdx = 0;
    appState.mode = "classroom";
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.jumpToSlideById = function (lectureId, slideId) {
    const lec = getLecture(lectureId);
    if (!lec) return;
    const idx = lec.slides.findIndex((s) => s.id === slideId);
    window.openSlideInClassroom(lectureId, idx >= 0 ? idx : 0);
  };

  window.completeLecture = function (lectureId) {
    userProgress.completedLectures[lectureId] = true;
    saveProgress();
    window.showToast(
      "🎉 Chúc mừng bạn đã hoàn thành toàn bộ Slide của chuyên đề này!"
    );
    window.openLectureCases(lectureId);
  };

  window.toggleBookmark = function (slideId) {
    userProgress.bookmarks[slideId] = !userProgress.bookmarks[slideId];
    saveProgress();
    window.renderWorkspace();
    window.showToast(
      userProgress.bookmarks[slideId]
        ? "⭐ Đã lưu Slide vào Sổ tay Bookmark!"
        : "Đã bỏ đánh dấu Bookmark."
    );
  };

  window.saveSlideNote = function (slideId, val) {
    userProgress.notes[slideId] = val;
    saveProgress();
  };

  window.setReaderFilter = function (f) {
    appState.readerFilter = f;
    window.renderWorkspace();
  };

  window.toggleToc = function () {
    appState.tocVisible = !appState.tocVisible;
    window.renderWorkspace();
  };

  window.scrollToReaderEl = function (elId) {
    const el = document.getElementById(elId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Flashcard handlers
  window.openLectureFlashcards = function (lectureId) {
    appState.fcLectureFilter = lectureId;
    appState.fcCategoryFilter = "all";
    appState.fcStatusFilter = "all";
    appState.fcCurrentIdx = 0;
    appState.fcIsFlipped = false;
    appState.mode = "flashcards";
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.setFcFilter = function (type, val) {
    if (type === "lecture") appState.fcLectureFilter = val;
    if (type === "category") appState.fcCategoryFilter = val;
    if (type === "status") appState.fcStatusFilter = val;
    appState.fcCurrentIdx = 0;
    appState.fcIsFlipped = false;
    window.renderWorkspace();
  };

  window.resetFcFilters = function () {
    appState.fcLectureFilter = "all";
    appState.fcCategoryFilter = "all";
    appState.fcStatusFilter = "all";
    appState.fcCurrentIdx = 0;
    appState.fcIsFlipped = false;
    window.renderWorkspace();
  };

  window.flipFlashcard = function () {
    appState.fcIsFlipped = !appState.fcIsFlipped;
    const cardEl = document.getElementById("active-flashcard-3d");
    if (cardEl) {
      cardEl.classList.toggle("is-flipped", appState.fcIsFlipped);
    }
  };

  window.prevFlashcard = function () {
    const cards = getFilteredFlashcards();
    if (!cards.length) return;
    appState.fcCurrentIdx =
      (appState.fcCurrentIdx - 1 + cards.length) % cards.length;
    appState.fcIsFlipped = false;
    window.renderWorkspace();
  };

  window.nextFlashcard = function () {
    const cards = getFilteredFlashcards();
    if (!cards.length) return;
    appState.fcCurrentIdx = (appState.fcCurrentIdx + 1) % cards.length;
    appState.fcIsFlipped = false;
    window.renderWorkspace();
  };

  window.rateFlashcard = function (cardId, rating) {
    userProgress.flashcardStatus[cardId] = rating;
    saveProgress();
    window.showToast(
      rating === "easy"
        ? "🟢 Tuyệt vời! Đã đánh dấu thuộc lòng thẻ này!"
        : "🔴 Đã đưa thẻ vào danh sách cần ôn tập kỹ!"
    );
    window.nextFlashcard();
  };

  window.rateFlashcardGrid = function (cardId, rating) {
    userProgress.flashcardStatus[cardId] = rating;
    saveProgress();
    window.renderWorkspace();
  };

  window.shuffleFlashcards = function () {
    const cards = getFilteredFlashcards();
    const ids = cards.map((c) => c.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = ids[i];
      ids[i] = ids[j];
      ids[j] = tmp;
    }
    appState.fcShuffledIds = ids;
    appState.fcCurrentIdx = 0;
    appState.fcIsFlipped = false;
    window.renderWorkspace();
    window.showToast("🔀 Đã xáo trộn ngẫu nhiên bộ thẻ Flashcard!");
  };

  window.toggleFcViewMode = function () {
    appState.fcViewMode = appState.fcViewMode === "deck" ? "grid" : "deck";
    window.renderWorkspace();
  };

  window.openCardInDeck = function (idx) {
    appState.fcCurrentIdx = idx;
    appState.fcIsFlipped = false;
    appState.fcViewMode = "deck";
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cases & Golden Principles handlers
  window.openLectureCases = function (lectureId) {
    appState.casesLectureFilter = lectureId;
    appState.casesSubTab = "cases";
    appState.mode = "cases";
    window.renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.setCasesSubTab = function (tab) {
    appState.casesSubTab = tab;
    window.renderWorkspace();
  };

  window.setCasesLectureFilter = function (val) {
    appState.casesLectureFilter = val;
    window.renderWorkspace();
  };

  window.saveCaseDraft = function (caseId, val) {
    userProgress.caseDrafts[caseId] = val;
    saveProgress();
  };

  window.toggleCaseReveal = function (caseId) {
    userProgress.caseRevealed[caseId] = !userProgress.caseRevealed[caseId];
    saveProgress();
    window.renderWorkspace();
  };

  // Utility Hub handlers
  window.setUtilityTab = function (tab) {
    appState.utilitySubTab = tab;
    window.renderWorkspace();
  };

  window.openNotebookTab = function () {
    appState.mode = "search";
    appState.utilitySubTab = "notebook";
    window.renderWorkspace();
  };

  window.openThemeStudio = function (e) {
    if (window.toggleThemePopover) {
      window.toggleThemePopover(e);
    }
  };

  window.handleSearchInput = function (val) {
    appState.searchQuery = val;
    const input = document.getElementById("global-search-input");
    if (input && input.value !== val) input.value = val;
    const container = document.getElementById("search-results-container");
    if (container) {
      container.innerHTML = renderSearchResultsHTML();
    }
  };

  window.setAtlasFilter = function (val) {
    appState.atlasLectureFilter = val;
    window.renderWorkspace();
  };

  window.setAtlasSearch = function (val) {
    appState.atlasSearchQuery = val;
    const grid = document.getElementById("atlas-grid-container");
    if (grid) {
      grid.innerHTML = renderAtlasGridHTML();
    }
  };

  window.applyCustomPickerColors = function () {
    const p = document.getElementById("custom-primary-picker");
    const a = document.getElementById("custom-accent-picker");
    if (p && a) {
      window.ThemeEngine.setCustomColors(p.value, a.value);
      window.renderWorkspace();
    }
  };

  window.exportStudyNotebook = function () {
    const lectures = getData().lectures || [];
    let md = "# SỔ TAY HỌC TẬP LÂM SÀNG DA LIỄU CỦA TÔI\n\n";
    lectures.forEach((lec) => {
      lec.slides.forEach((s) => {
        const isBm = !!userProgress.bookmarks[s.id];
        const note = (userProgress.notes[s.id] || "").trim();
        if (isBm || note) {
          md += "## " + lec.shortTitle + " — " + s.title + "\n";
          if (isBm) md += "- ⭐ **Đã đánh dấu quan trọng**\n";
          if (note) md += "- 📝 **Ghi chú:** " + note + "\n";
          md += "\n";
        }
      });
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "So_Tay_Da_Lieu_DrFox.md";
    a.click();
    URL.revokeObjectURL(url);
    window.showToast("📥 Đã tải xuống file So_Tay_Da_Lieu_DrFox.md!");
  };

  // Text-to-Speech for Dr. Fox
  window.speakCurrentSlide = function () {
    if (!("speechSynthesis" in window)) {
      window.showToast("Trình duyệt này không hỗ trợ đọc giọng nói tự động.");
      return;
    }
    window.speechSynthesis.cancel();
    const lec = getLecture(appState.currentLectureId);
    const slide = lec && lec.slides[appState.currentSlideIdx];
    if (!slide) return;

    const cleanText = (
      slide.title +
      ". " +
      (slide.drFox && slide.drFox.keyPoints
        ? slide.drFox.keyPoints.join(". ")
        : "")
    )
      .replace(/[*#`_~>]/g, "")
      .replace(/\$[^$]+\$/g, "");

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = "vi-VN";
    utter.rate = 1.02;
    window.speechSynthesis.speak(utter);
    window.showToast("🔊 Bác sĩ Cáo đang đọc tóm tắt trọng tâm Slide...");
  };

  // Sidebar & Zen Mode Toggles
  window.toggleSidebar = function () {
    if (window.innerWidth <= 820) {
      document.body.classList.toggle("mobile-sidebar-open");
    } else {
      appState.sidebarCollapsed = !appState.sidebarCollapsed;
      document.body.classList.toggle(
        "sidebar-collapsed",
        appState.sidebarCollapsed
      );
    }
  };

  window.toggleZenMode = function () {
    appState.zenMode = !appState.zenMode;
    document.body.classList.toggle("zen-mode", appState.zenMode);
    if (appState.zenMode) {
      window.showToast(
        "🧘 Đã bật Chế độ Tập trung Tối đa (Zen Mode) — Bấm nút góc trái trên hoặc phím Esc để hiện lại thanh điều hướng"
      );
    }
  };

  // Dr. Fox Peeking Widget
  const FOX_TIPS = [
    "🦊 **Mẹo nhớ nhanh:** Vảy nến ưa **Mặt duỗi** (cùi chỏ, đầu gối), còn Viêm da cơ địa người lớn ưa **Mặt gấp** (nếp khuỷu, nếp khoeo)!",
    "🦊 **Cảnh báo Đỏ:** Tuyệt đối KHÔNG dùng Corticoid uống/tiêm cho vảy nến thông thường vì nguy cơ bùng phát Vảy nến mủ toàn thân von Zumbusch!",
    "🦊 **Dược lý di truyền:** Trước khi kê Carbamazepine cho người Việt, nhớ tầm soát **HLA-B*15:02** để phòng ngừa hội chứng SJS/TEN!",
    "🦊 **Quy tắc 3 phút:** Trong Viêm da cơ địa, thoa dưỡng ẩm ngay trong vòng **3 phút sau khi tắm** giúp khóa ẩm tối ưu nhất!",
    "🦊 **Giang mai I:** Săng giang mai có 4 đặc điểm vàng: **Tròn/bầu dục, đáy sạch màu thịt đỏ, nền cộm cứng như bìa, và KHÔNG ĐAU**!",
    "🦊 **Chuẩn CDC 2021:** Liều chuẩn điều trị Lậu hiện nay là **Ceftriaxone 500mg tiêm bắp duy nhất** (1g nếu ≥ 150kg), phối hợp Doxycycline 100mg x 2 lần/ngày x 7 ngày nếu chưa loại trừ Chlamydia!",
    "🦊 **Phân biệt Sùi mào gà:** Sẩn hạt ngọc dương vật xếp hàng đều đặn quanh vành quy đầu; Gai âm hộ có từng gốc rời rạc nhau — cả hai đều là sinh lý bình thường!",
    "🦊 **Mày đay mạn tính:** Thuốc đầu tay là kháng Histamin H1 thế hệ 2 liều chuẩn; nếu không đáp ứng sau 2-4 tuần thì **tăng liều gấp 4 lần** trước khi chuyển sang Omalizumab!",
    "🦊 **Cạm bẫy Kerion de Celse:** Áp-xe nấm da đầu tổ ong mềm lùng nhùng nhưng **TUYỆT ĐỐI KHÔNG ĐƯỢC RẠCH THÁO MỦ** vì sẽ gây sẹo rụng tóc vĩnh viễn!"
  ];

  window.triggerFoxEncourage = function () {
    const pick = FOX_TIPS[Math.floor(Math.random() * FOX_TIPS.length)];
    const bubble = document.getElementById("peeking-fox-bubble");
    const textEl = document.getElementById("peeking-fox-text");
    if (bubble && textEl) {
      textEl.innerHTML = window.MedicalMarkdown.renderInline(pick);
      bubble.classList.add("visible");
    } else {
      window.showToast(window.MedicalMarkdown.renderInline(pick));
    }
  };

  window.togglePeekingFox = function () {
    const bubble = document.getElementById("peeking-fox-bubble");
    if (!bubble) return;
    if (bubble.classList.contains("visible")) {
      bubble.classList.remove("visible");
    } else {
      window.triggerFoxEncourage();
    }
  };

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (e.key === "Escape") {
      window.closeLightbox();
      window.closePdfModal();
      if (window.closeThemePopover) window.closeThemePopover();
      if (appState.zenMode) window.toggleZenMode();
    } else if (appState.mode === "classroom") {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        window.nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.prevSlide();
      }
    } else if (appState.mode === "flashcards" && appState.fcViewMode === "deck") {
      if (e.code === "Space") {
        e.preventDefault();
        window.flipFlashcard();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        window.nextFlashcard();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.prevFlashcard();
      }
    } else if (appState.mode === "quiz" && window.QuizEngine) {
      window.QuizEngine.handleKeyDown(e);
    }
  });

  // Top Navigation Bar (< / >) Scroll Arrows & Mouse-Wheel Horizontal Scroll
  window.scrollModeNav = function (dir) {
    const nav = document.getElementById("mode-nav");
    if (!nav) return;
    nav.scrollBy({ left: dir * 210, behavior: "smooth" });
    setTimeout(window.updateModeNavArrows, 240);
  };

  window.updateModeNavArrows = function () {
    const wrap = document.getElementById("mode-nav-wrapper");
    const nav = document.getElementById("mode-nav");
    const leftBtn = document.getElementById("mode-nav-left");
    const rightBtn = document.getElementById("mode-nav-right");
    if (!wrap || !nav || !leftBtn || !rightBtn) return;

    const maxScroll = nav.scrollWidth - nav.clientWidth;
    if (maxScroll > 3) {
      wrap.classList.add("is-overflowing");
      leftBtn.disabled = nav.scrollLeft <= 2;
      rightBtn.disabled = nav.scrollLeft >= maxScroll - 2;
    } else {
      wrap.classList.remove("is-overflowing");
      leftBtn.disabled = true;
      rightBtn.disabled = true;
    }
  };

  window.addEventListener("resize", function () {
    if (window.updateModeNavArrows) window.updateModeNavArrows();
  });

  // Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    loadProgress();
    if (window.ThemeEngine) {
      window.ThemeEngine.apply();
    }
    const modeNav = document.getElementById("mode-nav");
    if (modeNav) {
      modeNav.addEventListener(
        "wheel",
        function (e) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            modeNav.scrollLeft += e.deltaY;
            window.updateModeNavArrows();
          }
        },
        { passive: false }
      );
    }
    updateGlobalProgressUI();
    window.renderWorkspace();
    setTimeout(window.updateModeNavArrows, 100);
  });
})();
