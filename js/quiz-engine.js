/**
 * DALIEU-EDU: PHASE 2 — INSTANT QUIZ ROOM, MOCK EXAM SIMULATOR & QUESTION BANK ENGINE
 * Integrates 270 Clinical Multiple-Choice Questions (MCQs) across all 9 Dermatology Lectures
 * with Dr. Fox interactive feedback, keyboard shortcuts, exam timer, and slide jump links.
 */

(function () {
  "use strict";

  const QUIZ_STORAGE_KEY = "dalieu_quiz_progress_v1";

  const MASCOT_IMAGES = {
    teaching: "assets/mascot/dr_fox_teaching.png",
    tip: "assets/mascot/dr_fox_tip.png",
    warning: "assets/mascot/dr_fox_warning.png",
    thinking: "assets/mascot/dr_fox_thinking.png",
    cheering: "assets/mascot/dr_fox_cheering.png"
  };

  let quizState = {
    subTab: "practice", // 'practice' | 'exam' | 'bank'
    // Practice Mode Filters
    lectureFilter: "all",
    categoryFilter: "all",
    statusFilter: "all", // 'all' | 'unanswered' | 'wrong' | 'correct' | 'bookmarked'
    viewStyle: "card", // 'card' | 'list'
    currentIdx: 0,
    shuffledIds: null,
    currentStreak: 0,
    // Mock Exam State
    examStatus: "setup", // 'setup' | 'running' | 'finished'
    examPreset: 15, // 15 | 30 | 50 | 'wrong'
    examLectureFilter: "all",
    examFeedbackMode: "deferred", // 'deferred' (chấm khi nộp) | 'instant' (biết ngay)
    examQuestions: [],
    examAnswers: {}, // { [qId]: selectedIndex }
    examFlags: {}, // { [qId]: true }
    examCurrentIdx: 0,
    examTimeLeftSec: 0,
    examTotalSec: 0,
    examTimerId: null,
    // Question Bank Explorer State
    bankSearchQuery: "",
    bankLectureFilter: "all",
    bankCategoryFilter: "all",
    bankShowAllAnswers: false
  };

  let quizProgress = {
    answers: {}, // { [qId]: { selected: number, isCorrect: boolean, timestamp: number } }
    bookmarks: {}, // { [qId]: true }
    examHistory: [], // [ { date, score10, correctCount, totalCount, durationSec, scopeLabel } ]
    bestStreak: 0
  };

  function loadQuizProgress() {
    try {
      const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        quizProgress = Object.assign({}, quizProgress, parsed);
      }
    } catch (e) {
      console.warn("Could not load quiz progress", e);
    }
  }

  function saveQuizProgress() {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizProgress));
    } catch (e) {}
  }

  function getBank() {
    return window.DALIEU_QUIZ_BANK || { stats: { totalQuestions: 0 }, categories: [], questions: [] };
  }

  function getLectures() {
    return (window.DALIEU_DATA && window.DALIEU_DATA.lectures) || [];
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderMdInline(text) {
    if (window.MedicalMarkdown && window.MedicalMarkdown.renderInline) {
      return window.MedicalMarkdown.renderInline(text);
    }
    return escapeHtml(text);
  }

  function renderMdBlock(text) {
    if (window.MedicalMarkdown && window.MedicalMarkdown.render) {
      return window.MedicalMarkdown.render(text);
    }
    return "<p>" + escapeHtml(text) + "</p>";
  }

  function getCategoryBadge(catId) {
    const map = {
      "nhan-biet": { label: "🧠 Nhận biết & Cơ chế", color: "#0284c7" },
      "chan-doan": { label: "🔬 Chẩn đoán & CLS", color: "#0d9488" },
      "dieu-tri": { label: "💊 Phác đồ Điều trị", color: "#7c3aed" },
      "ca-lam-sang": { label: "🩺 Ca lâm sàng & Bẫy", color: "#d97706" },
      "hinh-anh": { label: "📸 Nhận diện Hình ảnh", color: "#e11d48" }
    };
    return map[catId] || { label: "📚 Lâm sàng", color: "#0d9488" };
  }

  function getFilteredPracticeQuestions() {
    const allQ = getBank().questions || [];
    let filtered = allQ.filter((q) => {
      if (quizState.lectureFilter !== "all" && q.lectureId !== quizState.lectureFilter) {
        return false;
      }
      if (quizState.categoryFilter !== "all" && q.category !== quizState.categoryFilter) {
        return false;
      }
      const ans = quizProgress.answers[q.id];
      if (quizState.statusFilter === "unanswered" && ans) return false;
      if (quizState.statusFilter === "wrong" && (!ans || ans.isCorrect)) return false;
      if (quizState.statusFilter === "correct" && (!ans || !ans.isCorrect)) return false;
      if (quizState.statusFilter === "bookmarked" && !quizProgress.bookmarks[q.id]) return false;
      return true;
    });

    if (quizState.shuffledIds && quizState.shuffledIds.length) {
      const orderMap = {};
      quizState.shuffledIds.forEach((id, i) => {
        orderMap[id] = i;
      });
      filtered.sort((a, b) => (orderMap[a.id] ?? 9999) - (orderMap[b.id] ?? 9999));
    }
    return filtered;
  }

  function computeGlobalStats() {
    const allQ = getBank().questions || [];
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    let bookmarked = 0;

    allQ.forEach((q) => {
      const a = quizProgress.answers[q.id];
      if (a) {
        answered++;
        if (a.isCorrect) correct++;
        else wrong++;
      }
      if (quizProgress.bookmarks[q.id]) bookmarked++;
    });

    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return {
      total: allQ.length,
      answered,
      correct,
      wrong,
      bookmarked,
      accuracy
    };
  }

  /* ==========================================================================
     MAIN ENTRY POINT RENDERER FOR MODE: 'quiz'
     ========================================================================== */
  function renderQuizView() {
    const gStats = computeGlobalStats();

    let html = '<div class="classroom-container">';

    // Top Header Card with Sub-Tab Switcher & Global Quiz Stats
    html +=
      '<div class="classroom-header-card">' +
      '<div class="classroom-title-wrap">' +
      '<div class="classroom-part-badge">📝 GIAI ĐOẠN 2 • PHÒNG ÔN TẬP TRẮC NGHIỆM & NGÂN HÀNG CÂU HỎI LÂM SÀNG</div>' +
      '<h1 class="classroom-slide-title">Luyện Trắc Nghiệm Tức Thì & Thi Thử Cùng Bác Sĩ Cáo</h1>' +
      "</div>" +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '<button class="' +
      (quizState.subTab === "practice" ? "btn-primary" : "btn-secondary") +
      '" onclick="window.QuizEngine.setSubTab(\'practice\')">⚡ Luyện tập tức thì (' +
      gStats.total +
      " câu)</button>" +
      '<button class="' +
      (quizState.subTab === "exam" ? "btn-primary" : "btn-secondary") +
      '" onclick="window.QuizEngine.setSubTab(\'exam\')">🏆 Phòng Thi thử tính giờ</button>' +
      '<button class="' +
      (quizState.subTab === "bank" ? "btn-primary" : "btn-secondary") +
      '" onclick="window.QuizEngine.setSubTab(\'bank\')">📚 Kho Ngân hàng & Thống kê (' +
      gStats.answered +
      "/" +
      gStats.total +
      ")</button>" +
      "</div>" +
      "</div>";

    if (quizState.subTab === "practice") {
      html += renderPracticeSubView(gStats);
    } else if (quizState.subTab === "exam") {
      html += renderExamSubView(gStats);
    } else {
      html += renderBankExplorerSubView(gStats);
    }

    html += "</div>";
    return html;
  }

  /* ==========================================================================
     SUB-TAB 1: INSTANT FEEDBACK QUIZ PRACTICE (LUYỆN TẬP TỨC THÌ)
     ========================================================================== */
  function renderPracticeSubView(gStats) {
    const lectures = getLectures();
    const categories = getBank().categories || [];
    const filtered = getFilteredPracticeQuestions();

    if (quizState.currentIdx >= filtered.length) {
      quizState.currentIdx = 0;
    }

    let html = "";

    // Filter & Control Toolbar
    html +=
      '<div class="classroom-pane" style="padding:16px 20px;">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">' +
      // Lecture Filter
      '<select class="btn-secondary" style="font-weight:700;" onchange="window.QuizEngine.setPracticeFilter(\'lecture\', this.value)">' +
      '<option value="all" ' +
      (quizState.lectureFilter === "all" ? "selected" : "") +
      ">📚 Tất cả 9 chuyên đề (" +
      gStats.total +
      " câu)</option>";

    lectures.forEach((l) => {
      const count = (getBank().stats.byLecture && getBank().stats.byLecture[l.id]) || 30;
      html +=
        '<option value="' +
        l.id +
        '" ' +
        (quizState.lectureFilter === l.id ? "selected" : "") +
        ">" +
        escapeHtml(l.shortTitle) +
        " (" +
        count +
        " câu)</option>";
    });

    html +=
      "</select>" +
      // Category Filter
      '<select class="btn-secondary" onchange="window.QuizEngine.setPracticeFilter(\'category\', this.value)">';

    categories.forEach((c) => {
      html +=
        '<option value="' +
        c.id +
        '" ' +
        (quizState.categoryFilter === c.id ? "selected" : "") +
        ">" +
        c.icon +
        " " +
        escapeHtml(c.name) +
        "</option>";
    });

    html +=
      "</select>" +
      // Status Filter
      '<select class="btn-secondary" onchange="window.QuizEngine.setPracticeFilter(\'status\', this.value)">' +
      '<option value="all" ' +
      (quizState.statusFilter === "all" ? "selected" : "") +
      ">🎯 Mọi trạng thái (" +
      gStats.total +
      ")</option>" +
      '<option value="unanswered" ' +
      (quizState.statusFilter === "unanswered" ? "selected" : "") +
      ">⏳ Chưa làm (" +
      (gStats.total - gStats.answered) +
      ")</option>" +
      '<option value="wrong" ' +
      (quizState.statusFilter === "wrong" ? "selected" : "") +
      ">❌ Câu làm sai cần ôn lại (" +
      gStats.wrong +
      ")</option>" +
      '<option value="correct" ' +
      (quizState.statusFilter === "correct" ? "selected" : "") +
      ">✅ Đã trả lời đúng (" +
      gStats.correct +
      ")</option>" +
      '<option value="bookmarked" ' +
      (quizState.statusFilter === "bookmarked" ? "selected" : "") +
      ">⭐ Câu đã gắn sao (" +
      gStats.bookmarked +
      ")</option>" +
      "</select>" +
      "</div>" +
      // Right Action Buttons
      '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">' +
      '<button class="btn-secondary" onclick="window.QuizEngine.shufflePractice()" title="Trộn thứ tự câu hỏi">🔀 Trộn đề</button>' +
      '<button class="btn-secondary" onclick="window.QuizEngine.resetFilteredAnswers()" title="Xóa lựa chọn các câu đang lọc để làm lại từ đầu">🔄 Làm lại mục này</button>' +
      '<button class="btn-secondary" onclick="window.QuizEngine.toggleViewStyle()">' +
      (quizState.viewStyle === "card" ? "📋 Xem danh sách" : "🎯 Xem từng câu") +
      "</button>" +
      "</div>" +
      "</div>" +
      // Mini Score Summary Bar
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border-color);font-size:0.82rem;">' +
      '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;">' +
      '<span>📊 <strong>Đang lọc:</strong> <strong style="color:var(--primary)">' +
      filtered.length +
      " câu</strong></span>" +
      '<span>✅ <strong>Đúng:</strong> <strong style="color:#10b981">' +
      gStats.correct +
      "</strong></span>" +
      '<span>❌ <strong>Sai:</strong> <strong style="color:#ef4444">' +
      gStats.wrong +
      "</strong></span>" +
      '<span>🎯 <strong>Độ chính xác:</strong> <strong style="color:var(--primary)">' +
      gStats.accuracy +
      "%</strong></span>" +
      '<span>🔥 <strong>Chuỗi đúng liên tiếp:</strong> <strong style="color:#f59e0b">' +
      quizState.currentStreak +
      " (Kỷ lục: " +
      (quizProgress.bestStreak || 0) +
      ")</strong></span>" +
      "</div>" +
      '<span style="color:var(--text-muted);font-size:0.76rem;">⌨️ Phím tắt: Bấm <strong>1–4</strong> hoặc <strong>A–D</strong> để chọn đáp án • <strong>← / →</strong> để chuyển câu</span>' +
      "</div>" +
      "</div>";

    if (filtered.length === 0) {
      html +=
        '<div class="classroom-pane" style="text-align:center;padding:48px 20px;">' +
        '<img src="' +
        MASCOT_IMAGES.cheering +
        '" alt="Dr. Fox" style="width:110px;height:110px;object-fit:contain;margin-bottom:12px;" />' +
        "<h3>Không có câu hỏi nào trong bộ lọc hiện tại!</h3>" +
        '<p style="color:var(--text-muted);margin:8px 0 16px;">Nếu bạn đang lọc "Câu làm sai", xin chúc mừng bạn đã trả lời đúng hết các câu hỏi!</p>' +
        '<button class="btn-primary" onclick="window.QuizEngine.resetFilters()">Xem toàn bộ 270 câu hỏi</button>' +
        "</div>";
      return html;
    }

    if (quizState.viewStyle === "list") {
      html += '<div style="display:flex;flex-direction:column;gap:16px;">';
      filtered.forEach((q, idx) => {
        html += renderSingleQuestionCard(q, idx, filtered.length, false);
      });
      html += "</div>";
      return html;
    }

    // INTERACTIVE SINGLE QUESTION CARD + RIGHT QUESTION NAVIGATOR PALETTE
    const currentQ = filtered[quizState.currentIdx];

    html +=
      '<div class="quiz-split-layout">' +
      '<div class="quiz-main-col">' +
      renderSingleQuestionCard(currentQ, quizState.currentIdx, filtered.length, true) +
      "</div>" +
      // Right Question Palette Card
      '<aside class="quiz-palette-card">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border-color);">' +
      '<span style="font-weight:800;font-size:0.88rem;color:var(--primary);">🧭 BẢN ĐỒ CÂU HỎI</span>' +
      '<span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);">Câu ' +
      (quizState.currentIdx + 1) +
      "/" +
      filtered.length +
      "</span>" +
      "</div>" +
      '<div class="quiz-palette-grid">';

    filtered.forEach((q, i) => {
      const a = quizProgress.answers[q.id];
      const isBm = !!quizProgress.bookmarks[q.id];
      let cls = "quiz-nav-num";
      if (i === quizState.currentIdx) cls += " current";
      if (a) {
        cls += a.isCorrect ? " answered-correct" : " answered-wrong";
      }
      if (isBm) cls += " bookmarked";

      html +=
        '<button class="' +
        cls +
        '" onclick="window.QuizEngine.goToQuestion(' +
        i +
        ')" title="Câu ' +
        (i + 1) +
        ": " +
        escapeHtml(q.lectureTitle) +
        '">' +
        (i + 1) +
        "</button>";
    });

    html +=
      "</div>" +
      '<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border-color);font-size:0.73rem;color:var(--text-muted);display:flex;flex-wrap:wrap;gap:10px;">' +
      '<span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;background:#10b981;display:inline-block;"></span> Đúng</span>' +
      '<span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;background:#ef4444;display:inline-block;"></span> Sai</span>' +
      '<span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:3px;border:2px solid #f59e0b;display:inline-block;"></span> Gắn sao</span>' +
      "</div>" +
      "</aside>" +
      "</div>";

    return html;
  }

  function renderSingleQuestionCard(q, idx, totalCount, showNavFooter) {
    const ans = quizProgress.answers[q.id];
    const isAnswered = !!ans;
    const isBookmarked = !!quizProgress.bookmarks[q.id];
    const catInfo = getCategoryBadge(q.category);
    const letters = ["A", "B", "C", "D"];

    // Determine Dr. Fox mood & speech based on answer state
    let foxImg = MASCOT_IMAGES.thinking;
    let foxTitle = "🦊 Bác sĩ Cáo gợi ý tư duy:";
    let foxMessage =
      "Hãy đọc kỹ các dữ kiện lâm sàng và chọn đáp án đúng nhất nhé! Ngay khi bạn bấm chọn, mình sẽ giải thích chi tiết từng phương án.";

    if (isAnswered) {
      if (ans.isCorrect) {
        foxImg = MASCOT_IMAGES.cheering;
        foxTitle = "🎉 Chính xác tuyệt đối! Bác sĩ Cáo khen ngợi bạn:";
        foxMessage =
          "Tuyệt vời! Bạn đã nắm rất chắc kiến thức lâm sàng ở câu hỏi này. Cùng điểm lại giải thích của BSCKII bên dưới để khắc sâu hơn nhé!";
      } else {
        foxImg = q.category === "dieu-tri" || q.category === "ca-lam-sang" ? MASCOT_IMAGES.warning : MASCOT_IMAGES.tip;
        foxTitle = "💡 Đừng buồn nhé! Bác sĩ Cáo chỉ ra bẫy lâm sàng giúp bạn:";
        foxMessage =
          "Bạn vừa chọn phương án <strong>" +
          letters[ans.selected] +
          "</strong>, nhưng đáp án chuẩn xác là <strong>" +
          letters[q.correctIndex] +
          "</strong>. Hãy đọc kỹ phần phân tích bên dưới để không bao giờ mắc lại bẫy này khi đi thi và thực hành nhé!";
      }
    }

    let html = '<div class="classroom-pane quiz-question-card">';

    // Question Meta Header
    html +=
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border-color);">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
      '<span class="quiz-q-number">CÂU ' +
      (idx + 1) +
      " / " +
      totalCount +
      "</span>" +
      '<span class="hero-cat-badge" style="margin:0;">' +
      escapeHtml(q.lectureTitle) +
      "</span>" +
      '<span class="hero-cat-badge" style="margin:0;background:rgba(var(--primary-rgb),0.1);color:' +
      catInfo.color +
      ';">' +
      catInfo.label +
      "</span>" +
      '<span style="font-size:0.74rem;font-weight:700;padding:3px 9px;border-radius:99px;background:var(--bg-elevated);border:1px solid var(--border-color);color:var(--text-muted);">Độ khó: ' +
      escapeHtml(q.difficulty || "Trung bình") +
      "</span>" +
      "</div>" +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<button class="btn-secondary" style="padding:5px 10px;font-size:0.78rem;' +
      (isBookmarked
        ? "background:rgba(245,158,11,0.18);border-color:#f59e0b;color:#d97706;"
        : "") +
      '" onclick="window.QuizEngine.toggleBookmark(\'' +
      q.id +
      "')\">" +
      (isBookmarked ? "⭐ Đã gắn sao" : "☆ Gắn sao câu khó") +
      "</button>" +
      (isAnswered
        ? '<button class="btn-secondary" style="padding:5px 10px;font-size:0.78rem;" onclick="window.QuizEngine.retrySingleQuestion(\'' +
          q.id +
          "')\">🔄 Làm lại câu này</button>"
        : "") +
      "</div>" +
      "</div>";

    // Question Stem
    html +=
      '<div class="quiz-question-stem">' +
      renderMdInline(q.question) +
      "</div>";

    // Optional Clinical Image (for Visual Atlas questions)
    if (q.image) {
      html +=
        '<div class="slide-gallery-box" style="margin:14px 0 18px;">' +
        '<div class="slide-main-image-wrap" style="max-height:360px;" onclick="window.openLightbox(\'' +
        escapeHtml(q.image).replace(/'/g, "\\'") +
        "', 'Hình ảnh câu hỏi trắc nghiệm lâm sàng')\">" +
        '<img src="' +
        escapeHtml(window.resolveAtlasImage ? window.resolveAtlasImage(q.image) : q.image) +
        '" alt="Clinical Quiz Image" style="max-height:340px;" />' +
        '<span class="md-img-zoom-hint">🔍 Bấm để phóng to soi kỹ thương tổn</span>' +
        "</div>" +
        "</div>";
    }

    // 4 Options List (A, B, C, D)
    html += '<div class="quiz-options-list">';
    (q.options || []).forEach((optText, optIdx) => {
      let optCls = "quiz-option-btn";
      let statusBadge = "";

      if (isAnswered) {
        if (optIdx === q.correctIndex) {
          optCls += " is-correct";
          statusBadge = '<span class="quiz-opt-status correct">✓ Đáp án đúng</span>';
        } else if (optIdx === ans.selected && !ans.isCorrect) {
          optCls += " is-wrong";
          statusBadge = '<span class="quiz-opt-status wrong">✕ Bạn đã chọn</span>';
        } else {
          optCls += " is-dimmed";
        }
      }

      html +=
        '<button class="' +
        optCls +
        '" onclick="window.QuizEngine.selectPracticeAnswer(\'' +
        q.id +
        "', " +
        optIdx +
        ')">' +
        '<span class="quiz-opt-letter">' +
        letters[optIdx] +
        "</span>" +
        '<span class="quiz-opt-text">' +
        renderMdInline(optText) +
        "</span>" +
        statusBadge +
        "</button>";
    });
    html += "</div>";

    // Instant Feedback Box + Dr. Fox Reaction + BSCKII Explanation
    if (isAnswered) {
      html +=
        '<div class="quiz-feedback-box ' +
        (ans.isCorrect ? "feedback-correct" : "feedback-wrong") +
        '">' +
        '<div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">' +
        '<img src="' +
        foxImg +
        '" alt="Dr. Fox" style="width:64px;height:64px;object-fit:contain;flex-shrink:0;" />' +
        '<div style="flex:1;">' +
        '<div style="font-weight:800;font-size:0.95rem;margin-bottom:3px;">' +
        foxTitle +
        "</div>" +
        '<div style="font-size:0.86rem;opacity:0.95;">' +
        foxMessage +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="quiz-explanation-content">' +
        '<div style="font-weight:800;font-size:0.84rem;text-transform:uppercase;color:var(--primary);margin-bottom:6px;">🩺 GIẢI THÍCH LÂM SÀNG CHI TIẾT & TRÍCH DẪN Y VĂN:</div>' +
        '<div class="md-content" style="font-size:0.92rem;">' +
        renderMdBlock(q.explanation) +
        "</div>" +
        '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:12px;padding-top:10px;border-top:1px dashed var(--border-color);">' +
        '<span style="font-size:0.78rem;color:var(--text-muted);font-weight:600;">📌 Nguồn trích dẫn: ' +
        escapeHtml(q.slideRef || "Slide bài giảng") +
        "</span>" +
        '<button class="btn-secondary" style="padding:5px 12px;font-size:0.78rem;" onclick="window.jumpToSlideById(\'' +
        q.lectureId +
        "', '" +
        q.slideId +
        "')\">🔗 Xem ngay Slide gốc trong Phòng học Dr. Fox</button>" +
        "</div>" +
        "</div>" +
        "</div>";
    }

    // Navigation Footer for Card Mode
    if (showNavFooter) {
      html +=
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:14px;border-top:1px solid var(--border-color);flex-wrap:wrap;gap:10px;">' +
        '<button class="btn-secondary" onclick="window.QuizEngine.prevQuestion()" ' +
        (idx === 0 ? "disabled" : "") +
        ">⬅ Câu trước</button>" +
        '<div style="font-size:0.82rem;color:var(--text-muted);font-weight:600;">' +
        (isAnswered
          ? "Đã trả lời • Bấm mũi tên Phải (→) để sang câu kế tiếp"
          : "Hãy bấm chọn 1 trong 4 phương án A, B, C, D") +
        "</div>" +
        '<button class="btn-primary" onclick="window.QuizEngine.nextQuestion()" ' +
        (idx >= totalCount - 1 ? "disabled" : "") +
        ">Câu tiếp theo ➡</button>" +
        "</div>";
    }

    html += "</div>";
    return html;
  }

  /* ==========================================================================
     SUB-TAB 2: TIMED CLINICAL MOCK EXAM SIMULATOR (PHÒNG THI THỬ LÂM SÀNG)
     ========================================================================== */
  function renderExamSubView(gStats) {
    if (quizState.examStatus === "running") {
      return renderRunningExamView();
    }
    if (quizState.examStatus === "finished") {
      return renderFinishedExamResultView();
    }

    const lectures = getLectures();

    let html =
      '<div class="dr-fox-stage" style="margin-bottom:20px;">' +
      '<div class="dr-fox-mascot-box">' +
      '<div class="dr-fox-frame">' +
      '<img src="' +
      MASCOT_IMAGES.teaching +
      '" alt="Dr. Fox" />' +
      "</div>" +
      '<span class="dr-fox-mood-tag">🏆 Giám khảo Bác sĩ Cáo</span>' +
      "</div>" +
      '<div class="dr-fox-speech-bubble">' +
      '<h2 style="font-size:1.2rem;font-weight:800;margin-bottom:6px;">Phòng Thi Thử Lâm Sàng Da Liễu (Y5 • BSNT • CKI • CKII)</h2>' +
      '<p style="font-size:0.9rem;color:var(--text-muted);">' +
      "Hệ thống sẽ rút ngẫu nhiên câu hỏi từ Ngân hàng 270 câu hỏi chuẩn Y khoa có bấm giờ tự động. Sau khi nộp bài, Bác sĩ Cáo sẽ chấm điểm thang 10, phân tích điểm mạnh/yếu theo từng chuyên đề và giải thích chi tiết từng câu!" +
      "</p>" +
      "</div>" +
      "</div>";

    // Exam Configuration Card
    html +=
      '<div class="classroom-pane" style="max-width:920px;margin:0 auto 24px;">' +
      '<h3 style="font-size:1.1rem;font-weight:800;margin-bottom:16px;color:var(--primary);">⚙️ Thiết lập Đề thi thử của bạn</h3>' +
      // 1. Choose Preset Size
      '<div style="margin-bottom:18px;">' +
      '<label style="display:block;font-weight:700;font-size:0.86rem;margin-bottom:8px;">1. Chọn cấu trúc & thời lượng đề thi:</label>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">' +
      renderExamPresetBtn(15, "⚡ Đề Ôn Nhanh", "15 câu • 10 phút") +
      renderExamPresetBtn(30, "🎓 Đề Chuẩn Hết Môn Y5", "30 câu • 20 phút") +
      renderExamPresetBtn(50, "🏅 Đề Chuyên Sâu CKII/BSNT", "50 câu • 35 phút") +
      renderExamPresetBtn("wrong", "🩹 Đề Xoáy Sâu Câu Sai & Sao", "Ôn lại câu sai/gắn sao (" + (gStats.wrong + gStats.bookmarked) + " câu)") +
      "</div>" +
      "</div>" +
      // 2. Choose Scope
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-bottom:20px;">' +
      "<div>" +
      '<label style="display:block;font-weight:700;font-size:0.86rem;margin-bottom:6px;">2. Phạm vi Chuyên đề:</label>' +
      '<select class="btn-secondary" style="width:100%;padding:10px 12px;font-weight:700;" onchange="window.QuizEngine.setExamConfig(\'lecture\', this.value)">' +
      '<option value="all" ' +
      (quizState.examLectureFilter === "all" ? "selected" : "") +
      ">🌐 Tổng hợp cả 9 chuyên đề Da liễu</option>";

    lectures.forEach((l) => {
      html +=
        '<option value="' +
        l.id +
        '" ' +
        (quizState.examLectureFilter === l.id ? "selected" : "") +
        ">" +
        escapeHtml(l.shortTitle) +
        " (30 câu)</option>";
    });

    html +=
      "</select>" +
      "</div>" +
      "<div>" +
      '<label style="display:block;font-weight:700;font-size:0.86rem;margin-bottom:6px;">3. Chế độ hiển thị đáp án khi làm bài:</label>' +
      '<select class="btn-secondary" style="width:100%;padding:10px 12px;font-weight:700;" onchange="window.QuizEngine.setExamConfig(\'feedback\', this.value)">' +
      '<option value="deferred" ' +
      (quizState.examFeedbackMode === "deferred" ? "selected" : "") +
      ">📝 Thi nghiêm túc (Nộp bài mới hiện điểm & đáp án)</option>" +
      '<option value="instant" ' +
      (quizState.examFeedbackMode === "instant" ? "selected" : "") +
      ">⚡ Vừa thi vừa xem đáp án ngay sau mỗi câu</option>" +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div style="text-align:center;padding-top:10px;border-top:1px solid var(--border-color);">' +
      '<button class="btn-primary" style="padding:12px 28px;font-size:1rem;" onclick="window.QuizEngine.startMockExam()">🚀 Bắt đầu Làm Bài Thi Ngay</button>' +
      "</div>" +
      "</div>";

    // Past Exam History Table
    if (quizProgress.examHistory && quizProgress.examHistory.length > 0) {
      html +=
        '<div class="classroom-pane" style="max-width:920px;margin:0 auto;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
        '<h3 style="font-size:1rem;font-weight:800;">📜 Lịch sử các lần Thi thử gần đây của bạn</h3>' +
        '<button class="btn-secondary" style="font-size:0.75rem;padding:4px 10px;" onclick="window.QuizEngine.clearExamHistory()">🗑️ Xóa lịch sử</button>' +
        "</div>" +
        '<div class="md-table-wrapper"><table class="md-table">' +
        "<thead><tr><th>Thời gian</th><th>Phạm vi đề thi</th><th>Điểm hệ 10</th><th>Số câu đúng</th><th>Thời gian làm</th></tr></thead><tbody>";

      quizProgress.examHistory.slice(0, 10).forEach((h) => {
        const badgeColor = h.score10 >= 8 ? "#10b981" : h.score10 >= 6.5 ? "#0284c7" : "#ef4444";
        html +=
          "<tr>" +
          "<td>" +
          escapeHtml(h.date) +
          "</td>" +
          "<td><strong>" +
          escapeHtml(h.scopeLabel) +
          "</strong></td>" +
          '<td><span style="font-weight:800;color:' +
          badgeColor +
          ';font-size:0.95rem;">' +
          h.score10.toFixed(1) +
          " / 10</span></td>" +
          "<td>" +
          h.correctCount +
          " / " +
          h.totalCount +
          " (" +
          Math.round((h.correctCount / h.totalCount) * 100) +
          "%)</td>" +
          "<td>" +
          formatSeconds(h.durationSec) +
          "</td>" +
          "</tr>";
      });

      html += "</tbody></table></div></div>";
    }

    return html;
  }

  function renderExamPresetBtn(val, title, sub) {
    const active = quizState.examPreset === val;
    return (
      '<button class="classroom-pane" style="padding:14px;text-align:left;cursor:pointer;border:2px solid ' +
      (active ? "var(--primary)" : "var(--border-color)") +
      ";background:" +
      (active ? "rgba(var(--primary-rgb),0.1)" : "var(--bg-elevated)") +
      ';" onclick="window.QuizEngine.setExamConfig(\'preset\', ' +
      (typeof val === "string" ? "'" + val + "'" : val) +
      ')">' +
      '<div style="font-weight:800;font-size:0.9rem;color:var(--text-main);margin-bottom:4px;">' +
      title +
      "</div>" +
      '<div style="font-size:0.76rem;color:var(--text-muted);font-weight:600;">' +
      sub +
      "</div>" +
      "</button>"
    );
  }

  function formatSeconds(sec) {
    const s = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return (m < 10 ? "0" + m : m) + ":" + (rem < 10 ? "0" + rem : rem);
  }

  function renderRunningExamView() {
    const questions = quizState.examQuestions || [];
    const total = questions.length;
    const idx = Math.min(total - 1, Math.max(0, quizState.examCurrentIdx));
    const q = questions[idx];
    const answeredCount = Object.keys(quizState.examAnswers).length;
    const selectedOpt = quizState.examAnswers[q.id];
    const isAnswered = selectedOpt !== undefined;
    const showInstant = quizState.examFeedbackMode === "instant" && isAnswered;
    const isFlagged = !!quizState.examFlags[q.id];
    const letters = ["A", "B", "C", "D"];

    let html = "";

    // Sticky Exam Top Bar with Timer & Submit
    html +=
      '<div class="classroom-pane" style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border:2px solid var(--primary);">' +
      '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">' +
      '<div class="exam-timer-pill" id="exam-timer-display">⏱️ ' +
      formatSeconds(quizState.examTimeLeftSec) +
      "</div>" +
      '<span style="font-weight:800;font-size:0.9rem;">Đã khoanh: <span style="color:var(--primary)">' +
      answeredCount +
      " / " +
      total +
      "</span> câu</span>" +
      "</div>" +
      '<div style="display:flex;gap:8px;">' +
      '<button class="btn-secondary" onclick="window.QuizEngine.cancelExam()">✕ Hủy đề</button>' +
      '<button class="btn-primary" style="background:#10b981;" onclick="window.QuizEngine.submitMockExam()">📤 Nộp bài & Chấm điểm (' +
      answeredCount +
      "/" +
      total +
      ")</button>" +
      "</div>" +
      "</div>";

    html +=
      '<div class="quiz-split-layout">' +
      '<div class="quiz-main-col">' +
      '<div class="classroom-pane quiz-question-card">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border-color);">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<span class="quiz-q-number">CÂU THI ' +
      (idx + 1) +
      " / " +
      total +
      "</span>" +
      '<span class="hero-cat-badge" style="margin:0;">' +
      escapeHtml(q.lectureTitle) +
      "</span>" +
      "</div>" +
      '<button class="btn-secondary" style="padding:5px 10px;font-size:0.78rem;' +
      (isFlagged ? "background:rgba(245,158,11,0.2);border-color:#f59e0b;color:#d97706;" : "") +
      '" onclick="window.QuizEngine.toggleExamFlag(\'' +
      q.id +
      "')\">" +
      (isFlagged ? "🚩 Đã đặt cờ xem lại" : "🏳️ Đặt cờ phân vân") +
      "</button>" +
      "</div>" +
      '<div class="quiz-question-stem">' +
      renderMdInline(q.question) +
      "</div>";

    if (q.image) {
      html +=
        '<div class="slide-gallery-box" style="margin:14px 0 18px;">' +
        '<div class="slide-main-image-wrap" style="max-height:340px;" onclick="window.openLightbox(\'' +
        escapeHtml(q.image).replace(/'/g, "\\'") +
        "', 'Hình ảnh đề thi lâm sàng')\">" +
        '<img src="' +
        escapeHtml(window.resolveAtlasImage ? window.resolveAtlasImage(q.image) : q.image) +
        '" alt="Exam Image" style="max-height:320px;" />' +
        "</div></div>";
    }

    html += '<div class="quiz-options-list">';
    (q.options || []).forEach((optText, optIdx) => {
      let optCls = "quiz-option-btn";
      if (showInstant) {
        if (optIdx === q.correctIndex) optCls += " is-correct";
        else if (optIdx === selectedOpt) optCls += " is-wrong";
      } else if (optIdx === selectedOpt) {
        optCls += " is-selected";
      }

      html +=
        '<button class="' +
        optCls +
        '" onclick="window.QuizEngine.selectExamAnswer(\'' +
        q.id +
        "', " +
        optIdx +
        ')">' +
        '<span class="quiz-opt-letter">' +
        letters[optIdx] +
        "</span>" +
        '<span class="quiz-opt-text">' +
        renderMdInline(optText) +
        "</span>" +
        "</button>";
    });
    html += "</div>";

    if (showInstant) {
      html +=
        '<div class="quiz-feedback-box ' +
        (selectedOpt === q.correctIndex ? "feedback-correct" : "feedback-wrong") +
        '" style="margin-top:14px;">' +
        '<div class="md-content" style="font-size:0.9rem;">' +
        renderMdBlock(q.explanation) +
        "</div></div>";
    }

    html +=
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:14px;border-top:1px solid var(--border-color);">' +
      '<button class="btn-secondary" onclick="window.QuizEngine.goToExamQuestion(' +
      (idx - 1) +
      ')" ' +
      (idx === 0 ? "disabled" : "") +
      ">⬅ Câu trước</button>" +
      (idx < total - 1
        ? '<button class="btn-primary" onclick="window.QuizEngine.goToExamQuestion(' +
          (idx + 1) +
          ')">Câu tiếp theo ➡</button>'
        : '<button class="btn-primary" style="background:#10b981;" onclick="window.QuizEngine.submitMockExam()">📤 Hoàn thành & Nộp bài</button>') +
      "</div>" +
      "</div></div>" +
      // Exam Palette
      '<aside class="quiz-palette-card">' +
      '<div style="font-weight:800;font-size:0.88rem;color:var(--primary);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border-color);">📋 PHIẾU TRẢ LỜI TRẮC NGHIỆM</div>' +
      '<div class="quiz-palette-grid">';

    questions.forEach((eq, i) => {
      const hasAns = quizState.examAnswers[eq.id] !== undefined;
      const flg = !!quizState.examFlags[eq.id];
      let cls = "quiz-nav-num";
      if (i === idx) cls += " current";
      if (hasAns) cls += " answered-selected";
      if (flg) cls += " bookmarked";

      html +=
        '<button class="' +
        cls +
        '" onclick="window.QuizEngine.goToExamQuestion(' +
        i +
        ')">' +
        (i + 1) +
        "</button>";
    });

    html += "</div></aside></div>";
    return html;
  }

  function renderFinishedExamResultView() {
    const questions = quizState.examQuestions || [];
    const total = questions.length || 1;
    let correctCount = 0;
    const byLecStats = {};

    questions.forEach((q) => {
      const sel = quizState.examAnswers[q.id];
      const isOk = sel === q.correctIndex;
      if (isOk) correctCount++;
      if (!byLecStats[q.lectureId]) {
        byLecStats[q.lectureId] = { title: q.lectureTitle, total: 0, correct: 0 };
      }
      byLecStats[q.lectureId].total++;
      if (isOk) byLecStats[q.lectureId].correct++;
    });

    const score10 = (correctCount / total) * 10;
    const pct = Math.round((correctCount / total) * 100);
    const usedSec = Math.max(1, quizState.examTotalSec - quizState.examTimeLeftSec);

    let foxMoodImg = MASCOT_IMAGES.cheering;
    let rankLabel = "🌟 XUẤT SẮC (Đạt chuẩn Bác sĩ Nội trú / Chuyên khoa)";
    if (score10 < 5) {
      foxMoodImg = MASCOT_IMAGES.warning;
      rankLabel = "💪 CẦN ÔN TẬP THÊM (Hãy xem kỹ giải thích các câu sai bên dưới nhé!)";
    } else if (score10 < 7) {
      foxMoodImg = MASCOT_IMAGES.tip;
      rankLabel = "👍 KHÁ TỐT (Nắm được nền tảng, cần rèn thêm các bẫy lâm sàng)";
    } else if (score10 < 8.5) {
      foxMoodImg = MASCOT_IMAGES.teaching;
      rankLabel = "🏅 GIỎI (Tư duy lâm sàng vững vàng)";
    }

    let html =
      '<div class="dr-fox-stage" style="margin-bottom:22px;">' +
      '<div class="dr-fox-mascot-box">' +
      '<div class="dr-fox-frame">' +
      '<img src="' +
      foxMoodImg +
      '" alt="Dr. Fox" />' +
      "</div>" +
      '<span class="dr-fox-mood-tag">Kết quả Bài thi</span>' +
      "</div>" +
      '<div class="dr-fox-speech-bubble">' +
      '<div style="font-size:0.8rem;font-weight:800;color:var(--primary);text-transform:uppercase;">' +
      rankLabel +
      "</div>" +
      '<h2 style="font-size:1.6rem;font-weight:800;margin:4px 0 8px;">Điểm số của bạn: <span style="color:var(--primary)">' +
      score10.toFixed(1) +
      " / 10</span> (" +
      correctCount +
      "/" +
      total +
      " câu đúng – " +
      pct +
      "%)</h2>" +
      '<div style="font-size:0.86rem;color:var(--text-muted);margin-bottom:14px;">⏱️ Thời gian hoàn thành: <strong>' +
      formatSeconds(usedSec) +
      "</strong> • Mọi câu làm sai trong đề thi đã được tự động lưu vào mục <strong>❌ Câu làm sai</strong> để bạn ôn lại!</div>" +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button class="btn-primary" onclick="window.QuizEngine.resetExamToSetup()">🔄 Tạo Đề Thi Thử Mới</button>' +
      '<button class="btn-secondary" onclick="window.QuizEngine.practiceWrongQuestions()">🩹 Ôn tập ngay các câu làm sai</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    // Breakdown by Lecture
    html +=
      '<div class="classroom-pane" style="margin-bottom:20px;">' +
      '<h3 style="font-size:1rem;font-weight:800;margin-bottom:12px;">📊 Phân tích năng lực theo Chuyên đề trong bài thi</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;">';

    Object.keys(byLecStats).forEach((lid) => {
      const st = byLecStats[lid];
      const lPct = Math.round((st.correct / st.total) * 100);
      html +=
        '<div style="padding:10px 14px;border-radius:10px;background:var(--bg-elevated);border:1px solid var(--border-color);">' +
        '<div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:700;margin-bottom:6px;">' +
        "<span>" +
        escapeHtml(st.title) +
        "</span>" +
        '<span style="color:var(--primary)">' +
        st.correct +
        "/" +
        st.total +
        " (" +
        lPct +
        "%)</span>" +
        "</div>" +
        '<div class="progress-track"><div class="progress-fill" style="width:' +
        lPct +
        '%"></div></div>' +
        "</div>";
    });

    html += "</div></div>";

    // Detailed Question-by-Question Review
    html +=
      '<h3 style="font-size:1.15rem;font-weight:800;margin-bottom:12px;">🩺 Chi tiết Đáp án & Giải thích từng câu trong Đề thi</h3>' +
      '<div style="display:flex;flex-direction:column;gap:16px;">';

    questions.forEach((q, i) => {
      html += renderSingleQuestionCard(q, i, total, false);
    });

    html += "</div>";
    return html;
  }

  /* ==========================================================================
     SUB-TAB 3: QUESTION BANK EXPLORER & MASTERY ANALYTICS (KHO NGÂN HÀNG)
     ========================================================================== */
  function renderBankExplorerSubView(gStats) {
    const lectures = getLectures();
    const allQ = getBank().questions || [];
    const categories = getBank().categories || [];

    let html = "";

    // 1. 9-Lecture Mastery Matrix
    html +=
      '<div class="classroom-pane" style="margin-bottom:22px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px;">' +
      "<div>" +
      '<h2 style="font-size:1.15rem;font-weight:800;">📈 Bản Đồ Thông Thạo Trắc Nghiệm 9 Chuyên Đề (Mastery Matrix)</h2>' +
      '<p style="font-size:0.83rem;color:var(--text-muted);">Theo dõi tỷ lệ câu trả lời đúng và số câu đang sai cần khắc phục ở từng bài giảng</p>' +
      "</div>" +
      '<button class="btn-secondary" style="font-size:0.78rem;color:#ef4444;" onclick="window.QuizEngine.resetAllQuizProgress()">🗑️ Xóa toàn bộ lịch sử làm bài</button>' +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px;">';

    lectures.forEach((lec) => {
      const lecQs = allQ.filter((q) => q.lectureId === lec.id);
      let done = 0;
      let corr = 0;
      let wrg = 0;
      lecQs.forEach((q) => {
        const a = quizProgress.answers[q.id];
        if (a) {
          done++;
          if (a.isCorrect) corr++;
          else wrg++;
        }
      });
      const pct = lecQs.length > 0 ? Math.round((corr / lecQs.length) * 100) : 0;

      html +=
        '<div style="padding:16px;border-radius:14px;background:var(--bg-elevated);border:1px solid var(--border-color);display:flex;flex-direction:column;justify-content:space-between;gap:10px;">' +
        "<div>" +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
        '<span style="font-weight:800;font-size:0.9rem;">' +
        lec.icon +
        " " +
        escapeHtml(lec.shortTitle) +
        "</span>" +
        '<span style="font-size:0.78rem;font-weight:800;color:var(--primary);">' +
        pct +
        "% thuộc</span>" +
        "</div>" +
        '<div class="progress-track" style="margin-bottom:8px;"><div class="progress-fill" style="width:' +
        pct +
        '%"></div></div>' +
        '<div style="font-size:0.76rem;color:var(--text-muted);display:flex;gap:10px;">' +
        "<span>Tổng: <strong>" +
        lecQs.length +
        " câu</strong></span>" +
        '<span style="color:#10b981;">✓ Đúng: <strong>' +
        corr +
        "</strong></span>" +
        '<span style="color:#ef4444;">✕ Sai: <strong>' +
        wrg +
        "</strong></span>" +
        "</div>" +
        "</div>" +
        '<div style="display:flex;gap:6px;padding-top:8px;border-top:1px solid var(--border-color);">' +
        '<button class="btn-primary" style="flex:1;justify-content:center;padding:6px 10px;font-size:0.78rem;" onclick="window.QuizEngine.openLectureQuiz(\'' +
        lec.id +
        "')\">⚡ Luyện 30 câu bài này</button>" +
        '<button class="btn-secondary" style="padding:6px 10px;font-size:0.78rem;" onclick="window.QuizEngine.startSingleLectureExam(\'' +
        lec.id +
        '\')" title="Thi thử nhanh 15 câu chuyên đề này">🏆 Thi thử</button>' +
        "</div>" +
        "</div>";
    });

    html += "</div></div>";

    // 2. Question Bank Search & Answer Key Reader
    const qLower = (quizState.bankSearchQuery || "").trim().toLowerCase();
    const bankFiltered = allQ.filter((q) => {
      if (quizState.bankLectureFilter !== "all" && q.lectureId !== quizState.bankLectureFilter) {
        return false;
      }
      if (quizState.bankCategoryFilter !== "all" && q.category !== quizState.bankCategoryFilter) {
        return false;
      }
      if (qLower) {
        const hay = (
          q.question +
          " " +
          q.options.join(" ") +
          " " +
          q.explanation +
          " " +
          q.slideRef
        ).toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    });

    html +=
      '<div class="classroom-pane" style="margin-bottom:18px;">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">' +
      '<input type="search" placeholder="🔍 Tìm kiếm từ khóa trong 270 câu hỏi & giải thích (VD: Auspitz, SCORTEN, HLA-B*15:02, Ceftriaxone, Isotretinoin...)" value="' +
      escapeHtml(quizState.bankSearchQuery) +
      '" oninput="window.QuizEngine.setBankSearch(this.value)" style="flex:1;min-width:260px;padding:10px 14px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-elevated);color:var(--text-main);font-size:0.88rem;" />' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
      '<select class="btn-secondary" onchange="window.QuizEngine.setBankFilter(\'lecture\', this.value)">' +
      '<option value="all" ' +
      (quizState.bankLectureFilter === "all" ? "selected" : "") +
      ">Tất cả chuyên đề</option>";

    lectures.forEach((l) => {
      html +=
        '<option value="' +
        l.id +
        '" ' +
        (quizState.bankLectureFilter === l.id ? "selected" : "") +
        ">" +
        escapeHtml(l.shortTitle) +
        "</option>";
    });

    html +=
      "</select>" +
      '<select class="btn-secondary" onchange="window.QuizEngine.setBankFilter(\'category\', this.value)">';

    categories.forEach((c) => {
      html +=
        '<option value="' +
        c.id +
        '" ' +
        (quizState.bankCategoryFilter === c.id ? "selected" : "") +
        ">" +
        c.icon +
        " " +
        escapeHtml(c.name) +
        "</option>";
    });

    html +=
      "</select>" +
      '<button class="' +
      (quizState.bankShowAllAnswers ? "btn-primary" : "btn-secondary") +
      '" onclick="window.QuizEngine.toggleBankShowAnswers()">' +
      (quizState.bankShowAllAnswers ? "🙈 Ẩn đáp án đề cương" : "👁️ Hiện toàn bộ Đáp án & Giải thích") +
      "</button>" +
      "</div>" +
      "</div>" +
      '<div style="margin-top:10px;font-size:0.8rem;color:var(--text-muted);">Hiển thị <strong>' +
      bankFiltered.length +
      " / " +
      allQ.length +
      "</strong> câu hỏi trong Ngân hàng</div>" +
      "</div>";

    html += '<div id="bank-questions-list" style="display:flex;flex-direction:column;gap:14px;">';
    bankFiltered.slice(0, 60).forEach((q, idx) => {
      if (quizState.bankShowAllAnswers) {
        const letters = ["A", "B", "C", "D"];
        html +=
          '<div class="classroom-pane">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.78rem;font-weight:700;color:var(--primary);">' +
          "<span>#" +
          (idx + 1) +
          " • " +
          escapeHtml(q.lectureTitle) +
          " • " +
          escapeHtml(q.slideRef) +
          "</span>" +
          "<span>Độ khó: " +
          escapeHtml(q.difficulty) +
          "</span>" +
          "</div>" +
          '<div style="font-weight:800;font-size:0.98rem;margin-bottom:10px;">' +
          renderMdInline(q.question) +
          "</div>" +
          '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">';
        q.options.forEach((opt, oi) => {
          const isC = oi === q.correctIndex;
          html +=
            '<div style="padding:8px 12px;border-radius:8px;font-size:0.88rem;border:1px solid ' +
            (isC ? "#10b981" : "var(--border-color)") +
            ";background:" +
            (isC ? "rgba(16,185,129,0.12)" : "var(--bg-elevated)") +
            ";font-weight:" +
            (isC ? "700" : "500") +
            ';">' +
            letters[oi] +
            ". " +
            renderMdInline(opt) +
            (isC ? ' <strong style="color:#10b981;margin-left:6px;">✓ ĐÁP ÁN ĐÚNG</strong>' : "") +
            "</div>";
        });
        html +=
          "</div>" +
          '<div style="padding:12px 14px;border-radius:10px;background:rgba(var(--primary-rgb),0.06);border-left:4px solid var(--primary);font-size:0.88rem;">' +
          renderMdBlock(q.explanation) +
          "</div>" +
          "</div>";
      } else {
        html += renderSingleQuestionCard(q, idx, bankFiltered.length, false);
      }
    });
    if (bankFiltered.length > 60) {
      html +=
        '<div class="classroom-pane" style="text-align:center;color:var(--text-muted);font-size:0.86rem;">Đang hiển thị 60 câu đầu tiên để tối ưu tốc độ cuộn — hãy chọn lọc theo Chuyên đề hoặc gõ từ khóa để xem chi tiết từng nhóm câu hỏi nhé!</div>';
    }
    html += "</div>";

    return html;
  }

  /* ==========================================================================
     PUBLIC ACTIONS & CONTROLLERS ON window.QuizEngine
     ========================================================================== */
  loadQuizProgress();

  window.QuizEngine = {
    render: renderQuizView,
    getGlobalStats: computeGlobalStats,

    setSubTab: function (tab) {
      quizState.subTab = tab;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    openLectureQuiz: function (lectureId) {
      quizState.subTab = "practice";
      quizState.lectureFilter = lectureId || "all";
      quizState.categoryFilter = "all";
      quizState.statusFilter = "all";
      quizState.currentIdx = 0;
      quizState.shuffledIds = null;
      if (window.switchMode) {
        window.switchMode("quiz");
      }
    },

    practiceWrongQuestions: function () {
      quizState.subTab = "practice";
      quizState.lectureFilter = "all";
      quizState.categoryFilter = "all";
      quizState.statusFilter = "wrong";
      quizState.currentIdx = 0;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    setPracticeFilter: function (type, val) {
      if (type === "lecture") quizState.lectureFilter = val;
      if (type === "category") quizState.categoryFilter = val;
      if (type === "status") quizState.statusFilter = val;
      quizState.currentIdx = 0;
      quizState.shuffledIds = null;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    resetFilters: function () {
      quizState.lectureFilter = "all";
      quizState.categoryFilter = "all";
      quizState.statusFilter = "all";
      quizState.currentIdx = 0;
      quizState.shuffledIds = null;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    shufflePractice: function () {
      const list = getFilteredPracticeQuestions().map((q) => q.id);
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
      quizState.shuffledIds = list;
      quizState.currentIdx = 0;
      if (window.renderWorkspace) window.renderWorkspace();
      if (window.showToast) window.showToast("🔀 Đã trộn ngẫu nhiên thứ tự bộ câu hỏi!");
    },

    toggleViewStyle: function () {
      quizState.viewStyle = quizState.viewStyle === "card" ? "list" : "card";
      if (window.renderWorkspace) window.renderWorkspace();
    },

    selectPracticeAnswer: function (qId, optIdx) {
      const allQ = getBank().questions || [];
      const q = allQ.find((item) => item.id === qId);
      if (!q) return;

      const isCorrect = optIdx === q.correctIndex;
      quizProgress.answers[qId] = {
        selected: optIdx,
        isCorrect: isCorrect,
        timestamp: Date.now()
      };

      if (isCorrect) {
        quizState.currentStreak++;
        if (quizState.currentStreak > (quizProgress.bestStreak || 0)) {
          quizProgress.bestStreak = quizState.currentStreak;
        }
      } else {
        quizState.currentStreak = 0;
      }

      saveQuizProgress();
      if (window.renderWorkspace) window.renderWorkspace();
    },

    retrySingleQuestion: function (qId) {
      delete quizProgress.answers[qId];
      saveQuizProgress();
      if (window.renderWorkspace) window.renderWorkspace();
    },

    resetFilteredAnswers: function () {
      const filtered = getFilteredPracticeQuestions();
      filtered.forEach((q) => {
        delete quizProgress.answers[q.id];
      });
      quizState.currentIdx = 0;
      saveQuizProgress();
      if (window.renderWorkspace) window.renderWorkspace();
      if (window.showToast) window.showToast("🔄 Đã làm mới các câu hỏi trong bộ lọc hiện tại!");
    },

    toggleBookmark: function (qId) {
      if (quizProgress.bookmarks[qId]) {
        delete quizProgress.bookmarks[qId];
      } else {
        quizProgress.bookmarks[qId] = true;
      }
      saveQuizProgress();
      if (window.renderWorkspace) window.renderWorkspace();
    },

    goToQuestion: function (idx) {
      const filtered = getFilteredPracticeQuestions();
      if (idx >= 0 && idx < filtered.length) {
        quizState.currentIdx = idx;
        if (window.renderWorkspace) window.renderWorkspace();
      }
    },

    nextQuestion: function () {
      const filtered = getFilteredPracticeQuestions();
      if (quizState.currentIdx < filtered.length - 1) {
        quizState.currentIdx++;
        if (window.renderWorkspace) window.renderWorkspace();
      }
    },

    prevQuestion: function () {
      if (quizState.currentIdx > 0) {
        quizState.currentIdx--;
        if (window.renderWorkspace) window.renderWorkspace();
      }
    },

    // Mock Exam Actions
    setExamConfig: function (key, val) {
      if (key === "preset") quizState.examPreset = val;
      if (key === "lecture") quizState.examLectureFilter = val;
      if (key === "feedback") quizState.examFeedbackMode = val;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    startSingleLectureExam: function (lectureId) {
      quizState.subTab = "exam";
      quizState.examPreset = 15;
      quizState.examLectureFilter = lectureId;
      quizState.examFeedbackMode = "deferred";
      this.startMockExam();
    },

    startMockExam: function () {
      const allQ = getBank().questions || [];
      let pool = allQ.slice();

      if (quizState.examPreset === "wrong") {
        pool = allQ.filter((q) => {
          const a = quizProgress.answers[q.id];
          return (a && !a.isCorrect) || quizProgress.bookmarks[q.id];
        });
        if (pool.length === 0) {
          if (window.showToast) {
            window.showToast("🎉 Bạn chưa có câu làm sai hoặc gắn sao nào! Hệ thống sẽ tạo đề ngẫu nhiên 15 câu.");
          }
          pool = allQ.slice();
        }
      } else if (quizState.examLectureFilter !== "all") {
        pool = allQ.filter((q) => q.lectureId === quizState.examLectureFilter);
      }

      // Shuffle pool
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pool[i];
        pool[i] = pool[j];
        pool[j] = t;
      }

      const targetCount =
        quizState.examPreset === "wrong"
          ? Math.min(30, pool.length)
          : Math.min(Number(quizState.examPreset) || 15, pool.length);

      quizState.examQuestions = pool.slice(0, targetCount);
      quizState.examAnswers = {};
      quizState.examFlags = {};
      quizState.examCurrentIdx = 0;
      quizState.examStatus = "running";
      quizState.examTotalSec = targetCount * 42; // ~42 sec per question (15q = ~10m, 30q = ~21m, 50q = 35m)
      quizState.examTimeLeftSec = quizState.examTotalSec;

      if (quizState.examTimerId) clearInterval(quizState.examTimerId);
      quizState.examTimerId = setInterval(function () {
        if (quizState.examStatus !== "running") {
          clearInterval(quizState.examTimerId);
          return;
        }
        quizState.examTimeLeftSec--;
        const timerEl = document.getElementById("exam-timer-display");
        if (timerEl) {
          timerEl.textContent = "⏱️ " + formatSeconds(quizState.examTimeLeftSec);
        }
        if (quizState.examTimeLeftSec <= 0) {
          clearInterval(quizState.examTimerId);
          window.QuizEngine.submitMockExam();
          if (window.showToast) window.showToast("⏰ Đã hết giờ làm bài! Hệ thống tự động nộp bài và chấm điểm.");
        }
      }, 1000);

      if (window.renderWorkspace) window.renderWorkspace();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    selectExamAnswer: function (qId, optIdx) {
      quizState.examAnswers[qId] = optIdx;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    toggleExamFlag: function (qId) {
      if (quizState.examFlags[qId]) delete quizState.examFlags[qId];
      else quizState.examFlags[qId] = true;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    goToExamQuestion: function (idx) {
      if (idx >= 0 && idx < quizState.examQuestions.length) {
        quizState.examCurrentIdx = idx;
        if (window.renderWorkspace) window.renderWorkspace();
      }
    },

    cancelExam: function () {
      if (quizState.examTimerId) clearInterval(quizState.examTimerId);
      quizState.examStatus = "setup";
      if (window.renderWorkspace) window.renderWorkspace();
    },

    submitMockExam: function () {
      if (quizState.examTimerId) clearInterval(quizState.examTimerId);
      quizState.examStatus = "finished";

      const questions = quizState.examQuestions || [];
      let correctCount = 0;

      questions.forEach((q) => {
        const sel = quizState.examAnswers[q.id];
        const isOk = sel === q.correctIndex;
        if (isOk) correctCount++;
        if (sel !== undefined) {
          quizProgress.answers[q.id] = {
            selected: sel,
            isCorrect: isOk,
            timestamp: Date.now()
          };
        }
      });

      const total = questions.length || 1;
      const score10 = (correctCount / total) * 10;
      const usedSec = Math.max(1, quizState.examTotalSec - quizState.examTimeLeftSec);
      const now = new Date();
      const dateStr =
        now.toLocaleDateString("vi-VN") +
        " " +
        now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

      const lectures = getLectures();
      const foundLec = lectures.find((l) => l.id === quizState.examLectureFilter);
      const scopeLabel =
        quizState.examPreset === "wrong"
          ? "Đề Ôn Câu Sai (" + total + " câu)"
          : foundLec
          ? foundLec.shortTitle + " (" + total + " câu)"
          : "Tổng hợp 9 chuyên đề (" + total + " câu)";

      quizProgress.examHistory = quizProgress.examHistory || [];
      quizProgress.examHistory.unshift({
        date: dateStr,
        score10: score10,
        correctCount: correctCount,
        totalCount: total,
        durationSec: usedSec,
        scopeLabel: scopeLabel
      });

      saveQuizProgress();
      if (window.renderWorkspace) window.renderWorkspace();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    resetExamToSetup: function () {
      quizState.examStatus = "setup";
      if (window.renderWorkspace) window.renderWorkspace();
    },

    clearExamHistory: function () {
      quizProgress.examHistory = [];
      saveQuizProgress();
      if (window.renderWorkspace) window.renderWorkspace();
    },

    // Bank Explorer Actions
    setBankSearch: function (val) {
      quizState.bankSearchQuery = val;
      if (window.renderWorkspace) window.renderWorkspace();
      const input = document.querySelector('input[type="search"]');
      if (input) {
        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    },

    setBankFilter: function (type, val) {
      if (type === "lecture") quizState.bankLectureFilter = val;
      if (type === "category") quizState.bankCategoryFilter = val;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    toggleBankShowAnswers: function () {
      quizState.bankShowAllAnswers = !quizState.bankShowAllAnswers;
      if (window.renderWorkspace) window.renderWorkspace();
    },

    resetAllQuizProgress: function () {
      quizProgress.answers = {};
      quizProgress.examHistory = [];
      quizState.currentStreak = 0;
      saveQuizProgress();
      if (window.renderWorkspace) window.renderWorkspace();
      if (window.showToast) window.showToast("🗑️ Đã xóa lịch sử làm trắc nghiệm để bạn luyện tập lại từ đầu!");
    },

    handleKeyDown: function (e) {
      if (quizState.subTab === "practice" && quizState.viewStyle === "card") {
        const filtered = getFilteredPracticeQuestions();
        const curQ = filtered[quizState.currentIdx];
        if (!curQ) return;

        const keyMap = {
          "1": 0,
          "2": 1,
          "3": 2,
          "4": 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          A: 0,
          B: 1,
          C: 2,
          D: 3
        };
        if (keyMap[e.key] !== undefined) {
          e.preventDefault();
          this.selectPracticeAnswer(curQ.id, keyMap[e.key]);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          this.nextQuestion();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.prevQuestion();
        }
      } else if (quizState.subTab === "exam" && quizState.examStatus === "running") {
        const curQ = quizState.examQuestions[quizState.examCurrentIdx];
        if (!curQ) return;
        const keyMap = {
          "1": 0,
          "2": 1,
          "3": 2,
          "4": 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          A: 0,
          B: 1,
          C: 2,
          D: 3
        };
        if (keyMap[e.key] !== undefined) {
          e.preventDefault();
          this.selectExamAnswer(curQ.id, keyMap[e.key]);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          this.goToExamQuestion(quizState.examCurrentIdx + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.goToExamQuestion(quizState.examCurrentIdx - 1);
        }
      }
    }
  };
})();
