/**
 * MEDICAL MARKDOWN, LATEX MATH & MERMAID FLOWCHART RENDERER
 * 100% Offline-Capable, Zero-Dependency Renderer for Dermatology Curriculum
 */

(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Convert inline LaTeX expression ($...$) to crisp semantic HTML
   */
  function renderLatexInline(tex) {
    if (!tex) return "";
    let s = tex.trim();

    // Handle \textbf{...}, \mathbf{...} and \text{...} first (allows nested inside \frac)
    for (let pass = 0; pass < 2; pass++) {
      s = s.replace(/\\textbf\{([^{}]*)\}/g, "<strong>$1</strong>");
      s = s.replace(/\\mathbf\{([^{}]*)\}/g, "<strong>$1</strong>");
      s = s.replace(/\\text\{([^{}]*)\}/g, '<span class="math-text">$1</span>');
    }

    // Handle \frac{a}{b}
    for (let pass = 0; pass < 2; pass++) {
      s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, function (_, num, den) {
        return (
          '<span class="math-frac"><span class="frac-num">' +
          renderLatexInline(num) +
          '</span><span class="frac-den">' +
          renderLatexInline(den) +
          "</span></span>"
        );
      });
    }

    // Greek letters & math operators
    const replacements = [
      [/\\rightarrow/g, " → "],
      [/\\leftarrow/g, " ← "],
      [/\\leftrightarrow/g, " ↔ "],
      [/\\Rightarrow/g, " ⇒ "],
      [/\\ge\b/g, "≥"],
      [/\\geq\b/g, "≥"],
      [/\\le\b/g, "≤"],
      [/\\leq\b/g, "≤"],
      [/\\approx\b/g, "≈"],
      [/\\sim\b/g, "~"],
      [/\\pm\b/g, "±"],
      [/\\times\b/g, "×"],
      [/\\cdot\b/g, "·"],
      [/\\div\b/g, "÷"],
      [/\\alpha\b/g, "α"],
      [/\\beta\b/g, "β"],
      [/\\gamma\b/g, "γ"],
      [/\\delta\b/g, "δ"],
      [/\\varepsilon\b/g, "ε"],
      [/\\epsilon\b/g, "ε"],
      [/\\mu\b/g, "μ"],
      [/\\lambda\b/g, "λ"],
      [/\^\{\\circ\}/g, "°"],
      [/\^\\circ/g, "°"],
      [/\\%/g, "%"],
      [/\\ /g, " "]
    ];

    for (let i = 0; i < replacements.length; i++) {
      s = s.replace(replacements[i][0], replacements[i][1]);
    }

    // Superscripts and subscripts: ^{...}, ^x, _{...}, _x
    s = s.replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>");
    s = s.replace(/\^([0-9+\-a-zA-Z])/g, "<sup>$1</sup>");
    s = s.replace(/_\{([^{}]+)\}/g, "<sub>$1</sub>");
    s = s.replace(/_([0-9+\-a-zA-Z])/g, "<sub>$1</sub>");

    return '<span class="math-inline">' + s + "</span>";
  }

  /**
   * Render Display Math Block ($$ ... $$), including LaTeX \begin{array} tables
   * (such as the SCORTEN Mortality Table) and Clinical Formulas (PASI, SCORAD)
   */
  function renderDisplayMathBlock(texBlock, highlightKeyword) {
    if (!texBlock) return "";
    const trimmed = texBlock.trim().replace(/^\$\$|\$\$$/g, "").trim();

    // Check if this is a \begin{array} table (e.g., SCORTEN mortality table)
    const arrayMatch = trimmed.match(
      /\\begin\{array\}\{[^}]*\}([\s\S]*?)\\end\{array\}/i
    );
    if (arrayMatch) {
      const body = arrayMatch[1];
      const rawRows = body
        .split(/\\\\/)
        .map((r) => r.replace(/\\hline/g, "").trim())
        .filter((r) => r.length > 0);

      if (rawRows.length > 0) {
        const parsedRows = rawRows.map((r) =>
          r.split("&").map((cell) => {
            let c = cell.trim();
            // Convert \textbf{...} and \text{...} cleanly
            c = c.replace(/\\textbf\{([^{}]*)\}/g, "**$1**");
            c = c.replace(/\\mathbf\{([^{}]*)\}/g, "**$1**");
            c = c.replace(/\\text\{([^{}]*)\}/g, "$1");
            c = c
              .replace(/\\%/g, "%")
              .replace(/\\ge\b/g, "≥")
              .replace(/\\geq\b/g, "≥")
              .replace(/\\le\b/g, "≤")
              .replace(/\\leq\b/g, "≤")
              .replace(/\\pm\b/g, "±")
              .replace(/\\times\b/g, "×");
            return c.trim();
          })
        );

        const headers = parsedRows[0];
        let html = '<div class="md-table-wrapper"><table class="md-table">';
        html += "<thead><tr>";
        headers.forEach((h) => {
          html += "<th>" + formatInlineMarkdown(h, highlightKeyword) + "</th>";
        });
        html += "</tr></thead><tbody>";

        for (let rIdx = 1; rIdx < parsedRows.length; rIdx++) {
          const cells = parsedRows[rIdx];
          html += "<tr>";
          for (let cIdx = 0; cIdx < headers.length; cIdx++) {
            html +=
              "<td>" +
              formatInlineMarkdown(cells[cIdx] || "", highlightKeyword) +
              "</td>";
          }
          html += "</tr>";
        }
        html += "</tbody></table></div>";
        return html;
      }
    }

    // Standard display formula block (e.g., PASI, SCORAD)
    return (
      '<div class="math-display-block">' +
      '<span class="math-formula-badge">📐 CÔNG THỨC LÂM SÀNG</span>' +
      '<div class="math-display-content">' +
      renderLatexInline(trimmed) +
      "</div></div>"
    );
  }

  /**
   * Render Mermaid Gantt Timeline Chart (e.g., Drug Allergy Latency Timeline in Lecture 02)
   */
  function renderMermaidGantt(lines) {
    let title = "Sơ đồ Dòng thời gian khởi phát lâm sàng";
    const sections = [];
    let currentSection = { name: "Dòng thời gian", tasks: [] };

    for (let i = 1; i < lines.length; i++) {
      const ln = lines[i].trim();
      if (!ln) continue;
      if (/^title\s+/i.test(ln)) {
        title = ln.replace(/^title\s+/i, "").trim();
        continue;
      }
      if (/^(dateFormat|axisFormat|tickInterval)\s+/i.test(ln)) {
        continue;
      }
      if (/^section\s+/i.test(ln)) {
        if (currentSection.tasks.length > 0) {
          sections.push(currentSection);
        }
        currentSection = {
          name: ln.replace(/^section\s+/i, "").trim(),
          tasks: []
        };
        continue;
      }
      // Parse task line: Name :crit, 4, 28
      const colonIdx = ln.lastIndexOf(":");
      if (colonIdx !== -1) {
        const taskName = ln.slice(0, colonIdx).trim();
        const metaStr = ln.slice(colonIdx + 1).trim();
        const parts = metaStr.split(",").map((p) => p.trim());
        const nums = parts
          .map((p) => parseFloat(p))
          .filter((n) => !isNaN(n));
        const startVal = nums.length >= 1 ? nums[0] : 0;
        const endVal = nums.length >= 2 ? nums[1] : startVal + 1;
        const isCrit = metaStr.toLowerCase().includes("crit");
        const isActive = metaStr.toLowerCase().includes("active");
        currentSection.tasks.push({
          name: taskName,
          start: startVal,
          end: endVal,
          isCrit: isCrit,
          isActive: isActive
        });
      }
    }
    if (currentSection.tasks.length > 0) {
      sections.push(currentSection);
    }

    let maxEnd = 56;
    sections.forEach((sec) => {
      sec.tasks.forEach((t) => {
        if (t.end > maxEnd) maxEnd = t.end;
      });
    });
    if (maxEnd <= 0) maxEnd = 10;

    let html = '<div class="mermaid-flowchart mermaid-gantt">';
    html +=
      '<div class="mermaid-header">' +
      '<span class="mermaid-badge">⏱️ ' +
      escapeHtml(title.toUpperCase()) +
      "</span></div>";

    html += '<div class="gantt-container">';
    // Scale header
    html +=
      '<div class="gantt-axis-row">' +
      '<div class="gantt-label-col"><strong>Thể bệnh / Hội chứng</strong></div>' +
      '<div class="gantt-bar-col gantt-ticks">' +
      "<span>Ngày 0</span><span>Ngày 7</span><span>Ngày 14</span><span>Ngày 28</span><span>Ngày " +
      maxEnd +
      "</span>" +
      "</div>" +
      '<div class="gantt-range-col"><strong>Cửa sổ khởi phát</strong></div>' +
      "</div>";

    sections.forEach((sec) => {
      html +=
        '<div class="gantt-section-title">📌 ' +
        escapeHtml(sec.name) +
        "</div>";
      sec.tasks.forEach((t) => {
        const leftPct = Math.max(0, Math.min(92, (t.start / maxEnd) * 100));
        const widthPct = Math.max(
          7,
          Math.min(100 - leftPct, ((t.end - t.start) / maxEnd) * 100)
        );
        const barClass = t.isCrit
          ? "gantt-bar-crit"
          : t.isActive
          ? "gantt-bar-active"
          : "gantt-bar-normal";
        const rangeLabel =
          t.start === 0 && t.end <= 2
            ? "1 giờ – 24 giờ"
            : t.start + " – " + t.end + " ngày";

        html +=
          '<div class="gantt-row">' +
          '<div class="gantt-label-col">' +
          formatInlineMarkdown(t.name) +
          "</div>" +
          '<div class="gantt-bar-col">' +
          '<div class="gantt-bar-track">' +
          '<div class="gantt-bar-fill ' +
          barClass +
          '" style="left:' +
          leftPct.toFixed(1) +
          "%;width:" +
          widthPct.toFixed(1) +
          '%"></div>' +
          "</div></div>" +
          '<div class="gantt-range-col"><span class="gantt-range-badge ' +
          barClass +
          '">' +
          escapeHtml(rangeLabel) +
          "</span></div>" +
          "</div>";
      });
    });

    html += "</div></div>";
    return html;
  }

  /**
   * Split a single Mermaid line into a chain of nodes and arrow operators,
   * respecting brackets [], (), {} and quotes "" so inner arrows/dashes are untouched.
   */
  function parseMermaidLineStatements(line) {
    let sq = 0;
    let rd = 0;
    let cu = 0;
    let inQuotes = false;
    let quoteChar = "";
    const segments = [];
    let lastIdx = 0;
    let i = 0;

    while (i < line.length) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === quoteChar && line[i - 1] !== "\\") {
          inQuotes = false;
        }
        i++;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inQuotes = true;
        quoteChar = ch;
        i++;
        continue;
      }
      if (ch === "[") {
        sq++;
        i++;
        continue;
      }
      if (ch === "]") {
        sq = Math.max(0, sq - 1);
        i++;
        continue;
      }
      if (ch === "(") {
        rd++;
        i++;
        continue;
      }
      if (ch === ")") {
        rd = Math.max(0, rd - 1);
        i++;
        continue;
      }
      if (ch === "{") {
        cu++;
        i++;
        continue;
      }
      if (ch === "}") {
        cu = Math.max(0, cu - 1);
        i++;
        continue;
      }

      // Only look for arrow operators at depth 0
      if (sq === 0 && rd === 0 && cu === 0) {
        const rest = line.slice(i);

        // 1. Bidirectional arrow: <-->
        const biMatch = rest.match(/^<-->\s*(?:\|([^|]+)\|\s*)?/);
        if (biMatch) {
          segments.push({
            nodeToken: line.slice(lastIdx, i).trim(),
            edgeLabel: biMatch[1] ? biMatch[1].trim() : "",
            bi: true
          });
          i += biMatch[0].length;
          lastIdx = i;
          continue;
        }

        // 2. Middle-labeled arrow: -- "label" --> or -- label -->
        const midMatch = rest.match(
          /^--\s*(?:"([^"]+)"|'([^']+)'|([^>\-|]+?))\s*-->/
        );
        if (midMatch) {
          const lbl = (midMatch[1] || midMatch[2] || midMatch[3] || "").trim();
          segments.push({
            nodeToken: line.slice(lastIdx, i).trim(),
            edgeLabel: lbl,
            bi: false
          });
          i += midMatch[0].length;
          lastIdx = i;
          continue;
        }

        // 3. Standard arrow with optional |label|: -->, ---, -.->, ==>
        const stdMatch = rest.match(
          /^(?:-->|-\.->|==>|--+)(?:\s*\|([^|]+)\|)?\s*/
        );
        if (stdMatch) {
          segments.push({
            nodeToken: line.slice(lastIdx, i).trim(),
            edgeLabel: stdMatch[1] ? stdMatch[1].trim() : "",
            bi: false
          });
          i += stdMatch[0].length;
          lastIdx = i;
          continue;
        }
      }
      i++;
    }

    const tail = line.slice(lastIdx).trim();
    if (tail) {
      segments.push({
        nodeToken: tail,
        edgeLabel: null,
        bi: false
      });
    }
    return segments;
  }

  /**
   * Render Mermaid flowchart code into an aligned, structured visual diagram
   */
  function renderMermaidDiagram(code) {
    const lines = code
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("%%"));

    if (!lines.length) return "";

    const header = lines[0].toLowerCase();
    if (header.startsWith("gantt")) {
      return renderMermaidGantt(lines);
    }

    const isHorizontal = header.includes("lr");

    const nodes = {};
    const nodeShapes = {}; // 'rect', 'round', 'diamond', 'circle'
    const edges = [];

    function cleanNodeLabel(raw) {
      if (!raw) return "";
      let s = raw.trim();
      if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
      ) {
        s = s.slice(1, -1);
      }
      return s;
    }

    function registerNode(token) {
      if (!token) return null;
      const t = token.trim().replace(/;$/, "").trim();
      if (!t) return null;

      // Match ID["Label"], ID((Label)), ID(Label), ID{Label}
      const m = t.match(
        /^([A-Za-z0-9_]+)\s*(?:\[\s*([\s\S]*?)\s*\]|\(\(\s*([\s\S]*?)\s*\)\)|\(\s*([\s\S]*?)\s*\)|\{\s*([\s\S]*?)\s*\})$/
      );
      if (m) {
        const id = m[1];
        const lbl = cleanNodeLabel(m[2] || m[3] || m[4] || m[5] || id);
        nodes[id] = lbl;
        if (m[5] !== undefined) nodeShapes[id] = "diamond";
        else if (m[3] !== undefined) nodeShapes[id] = "circle";
        else if (m[4] !== undefined) nodeShapes[id] = "round";
        else nodeShapes[id] = "rect";
        return id;
      }

      // Bare ID
      const mBare = t.match(/^([A-Za-z0-9_]+)$/);
      if (mBare) {
        const id = mBare[1];
        if (!nodes[id]) nodes[id] = id;
        if (!nodeShapes[id]) nodeShapes[id] = "rect";
        return id;
      }
      return null;
    }

    for (let i = 1; i < lines.length; i++) {
      const ln = lines[i];
      if (
        ln.startsWith("style ") ||
        ln.startsWith("classDef ") ||
        ln.startsWith("class ") ||
        ln.startsWith("subgraph ") ||
        ln === "end"
      ) {
        continue;
      }

      const chain = parseMermaidLineStatements(ln);
      if (chain.length >= 2) {
        for (let cIdx = 0; cIdx < chain.length - 1; cIdx++) {
          const fromId = registerNode(chain[cIdx].nodeToken);
          const toId = registerNode(chain[cIdx + 1].nodeToken);
          const lbl = chain[cIdx].edgeLabel || "";
          const isBi = !!chain[cIdx].bi;
          if (fromId && toId) {
            edges.push({ from: fromId, to: toId, label: lbl, bi: isBi });
          }
        }
      } else if (chain.length === 1) {
        registerNode(chain[0].nodeToken);
      }
    }

    const nodeIds = Object.keys(nodes);
    if (nodeIds.length === 0) {
      return '<pre class="code-block"><code>' + escapeHtml(code) + "</code></pre>";
    }

    // Build adjacency and in-degree maps
    const incomingCount = {};
    const childrenMap = {};
    const incomingEdgesMap = {};
    nodeIds.forEach((id) => {
      incomingCount[id] = 0;
      childrenMap[id] = [];
      incomingEdgesMap[id] = [];
    });

    const hasBidirectional = edges.some((e) => e.bi);

    edges.forEach((e) => {
      if (incomingCount[e.to] !== undefined) incomingCount[e.to]++;
      if (childrenMap[e.from]) childrenMap[e.from].push(e);
      if (incomingEdgesMap[e.to]) incomingEdgesMap[e.to].push(e);
    });

    function renderSingleNodeBox(nodeId, isRoot, incomingEdgeLabel) {
      const rawLbl = nodes[nodeId] || nodeId;
      const formattedLbl = formatInlineMarkdown(
        rawLbl.replace(/<br\s*\/?>/gi, "\n")
      ).replace(/\n/g, "<br>");
      const shapeCls =
        nodeShapes[nodeId] === "diamond" ? " node-decision" : "";
      const rootCls = isRoot ? " node-root" : "";
      const edgeBadge = incomingEdgeLabel
        ? '<div class="mermaid-edge-label">' +
          formatInlineMarkdown(incomingEdgeLabel) +
          "</div>"
        : "";

      return (
        '<div class="mermaid-node-wrap">' +
        edgeBadge +
        '<div class="mermaid-node' +
        rootCls +
        shapeCls +
        '">' +
        formattedLbl +
        "</div></div>"
      );
    }

    // Case 1: Bidirectional cycle / triad (e.g., A <--> B <--> C <--> A in Atopic Dermatitis)
    if (hasBidirectional) {
      let html = '<div class="mermaid-flowchart flow-cycle">';
      html +=
        '<div class="mermaid-header"><span class="mermaid-badge">🔄 VÒNG XOẮN BỆNH SINH TƯƠNG TÁC ĐA CHIỀU</span></div>';
      html += '<div class="mermaid-cycle-row">';
      nodeIds.forEach((id, idx) => {
        html += renderSingleNodeBox(id, true, "");
        if (idx < nodeIds.length - 1) {
          html += '<div class="mermaid-bi-arrow">⇄</div>';
        }
      });
      html += "</div>";
      if (nodeIds.length >= 3) {
        html +=
          '<div class="mermaid-cycle-loop-note">🔁 Tương tác hai chiều khép kín giữa ' +
          nodeIds.length +
          " trụ cột bệnh sinh</div>";
      }
      html += "</div>";
      return html;
    }

    // Check if the graph is a pure Tree / Forest (every node has incomingCount <= 1)
    const isTreeForest = nodeIds.every((id) => incomingCount[id] <= 1);
    const roots = nodeIds.filter((id) => incomingCount[id] === 0);

    // Case 2: Pure Tree or Forest (12 of 15 clinical diagrams, including Nail Psoriasis, Serology, Algorithms, Step Ladders)
    if (isTreeForest && roots.length > 0) {
      const renderedSet = new Set();

      function renderSubtree(nodeId, depth, edgeLabel) {
        if (renderedSet.has(nodeId)) return "";
        renderedSet.add(nodeId);

        const outEdges = childrenMap[nodeId] || [];
        const nodeHtml = renderSingleNodeBox(nodeId, depth === 0, edgeLabel);

        if (outEdges.length === 0) {
          return '<div class="mermaid-tree-unit">' + nodeHtml + "</div>";
        }

        // Single child: linear vertical chain
        if (outEdges.length === 1) {
          const childEdge = outEdges[0];
          return (
            '<div class="mermaid-tree-unit">' +
            nodeHtml +
            '<div class="mermaid-connector">⬇</div>' +
            renderSubtree(childEdge.to, depth + 1, childEdge.label) +
            "</div>"
          );
        }

        // Multiple children: check if all children are leaves (e.g., B1..B4 under Nail Matrix B)
        const allChildrenAreLeaves = outEdges.every(
          (e) => (childrenMap[e.to] || []).length === 0
        );

        if (allChildrenAreLeaves && depth >= 1 && outEdges.length >= 2) {
          let leavesHtml = '<div class="mermaid-leaf-stack">';
          outEdges.forEach((e) => {
            renderedSet.add(e.to);
            leavesHtml += renderSingleNodeBox(e.to, false, e.label);
          });
          leavesHtml += "</div>";

          return (
            '<div class="mermaid-tree-unit mermaid-category-group">' +
            nodeHtml +
            '<div class="mermaid-connector">⬇</div>' +
            leavesHtml +
            "</div>"
          );
        }

        // General multi-branch split: render side-by-side branch columns under parent
        let colsHtml =
          '<div class="mermaid-branches-row cols-' +
          Math.min(outEdges.length, 4) +
          '">';
        outEdges.forEach((e) => {
          colsHtml +=
            '<div class="mermaid-branch-col">' +
            '<div class="mermaid-connector">⬇</div>' +
            renderSubtree(e.to, depth + 1, e.label) +
            "</div>";
        });
        colsHtml += "</div>";

        return (
          '<div class="mermaid-tree-unit">' + nodeHtml + colsHtml + "</div>"
        );
      }

      let html =
        '<div class="mermaid-flowchart ' +
        (isHorizontal ? "flow-lr" : "flow-td") +
        '">';
      html +=
        '<div class="mermaid-header"><span class="mermaid-badge">📊 SƠ ĐỒ CƠ CHẾ / PHÁC ĐỒ LÂM SÀNG</span></div>';

      if (roots.length === 1) {
        html +=
          '<div class="mermaid-tree-root">' +
          renderSubtree(roots[0], 0, "") +
          "</div>";
      } else {
        // Multiple independent roots (e.g., HLA-B*15:02, HLA-B*58:01, HLA-A*31:01 columns)
        html +=
          '<div class="mermaid-branches-row cols-' +
          Math.min(roots.length, 4) +
          '">';
        roots.forEach((rId) => {
          html +=
            '<div class="mermaid-branch-col">' +
            renderSubtree(rId, 0, "") +
            "</div>";
        });
        html += "</div>";
      }

      html += "</div>";
      return html;
    }

    // Case 3: Reconverging DAG (e.g., Diamond flowcharts where branches merge back into a common node)
    if (roots.length === 0 && nodeIds.length > 0) roots.push(nodeIds[0]);

    const visited = new Set();
    const levels = [];
    let currentLayer = roots;

    while (currentLayer.length > 0) {
      const validLayer = currentLayer.filter((id) => !visited.has(id));
      if (validLayer.length === 0) break;
      validLayer.forEach((id) => visited.add(id));
      levels.push(validLayer);

      const nextLayer = [];
      validLayer.forEach((u) => {
        (childrenMap[u] || []).forEach((edge) => {
          if (!visited.has(edge.to) && !nextLayer.includes(edge.to)) {
            nextLayer.push(edge.to);
          }
        });
      });
      currentLayer = nextLayer;
    }

    const remaining = nodeIds.filter((id) => !visited.has(id));
    if (remaining.length > 0) levels.push(remaining);

    let html =
      '<div class="mermaid-flowchart ' +
      (isHorizontal ? "flow-lr" : "flow-td") +
      '">';
    html +=
      '<div class="mermaid-header"><span class="mermaid-badge">📊 SƠ ĐỒ CƠ CHẾ / PHÂN LOẠI LÂM SÀNG</span></div>';
    html += '<div class="mermaid-levels">';

    levels.forEach((layer, lIdx) => {
      html += '<div class="mermaid-level">';
      layer.forEach((nodeId) => {
        const inEdges = incomingEdgesMap[nodeId] || [];
        const edgeLabels = inEdges
          .map((e) => e.label)
          .filter((l) => l && l.length > 0);
        const combinedLabel = edgeLabels.join(" / ");
        html += renderSingleNodeBox(nodeId, lIdx === 0, combinedLabel);
      });
      html += "</div>";
      if (lIdx < levels.length - 1) {
        html += '<div class="mermaid-connector">⬇</div>';
      }
    });

    html += "</div></div>";
    return html;
  }

  /**
   * Format inline markdown (bold, italic, code, math, links, images)
   */
  function formatInlineMarkdown(text, highlightKeyword) {
    if (!text) return "";
    let s = String(text);

    // 1. Extract inline code `...` first to protect it
    const codeTokens = [];
    s = s.replace(/`([^`]+)`/g, function (_, c) {
      const idx = codeTokens.length;
      codeTokens.push('<code class="inline-code">' + escapeHtml(c) + "</code>");
      return "%%CODE_TOKEN_" + idx + "%%";
    });

    // 2. Extract inline display math $$...$$ and inline math $...$
    const mathTokens = [];
    s = s.replace(/\$\$([^$\n]+)\$\$/g, function (_, tex) {
      const idx = mathTokens.length;
      mathTokens.push(renderDisplayMathBlock(tex, highlightKeyword));
      return "%%MATH_TOKEN_" + idx + "%%";
    });
    s = s.replace(/\$([^$\n]+)\$/g, function (_, tex) {
      const idx = mathTokens.length;
      mathTokens.push(renderLatexInline(tex));
      return "%%MATH_TOKEN_" + idx + "%%";
    });

    // 3. Extract inline images ![alt](src)
    const imgTokens = [];
    s = s.replace(/\!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, src) {
      const idx = imgTokens.length;
      const cleanAlt = escapeHtml(alt || "Hình ảnh lâm sàng");
      const rawSrc = src.trim();
      const cleanSrc = escapeHtml(rawSrc);
      const resolvedSrc = escapeHtml(
        window.resolveAtlasImage ? window.resolveAtlasImage(rawSrc) : rawSrc
      );
      imgTokens.push(
        '<figure class="md-inline-figure" onclick="window.openLightbox(\'' +
          cleanSrc.replace(/'/g, "\\'") +
          "', '" +
          cleanAlt.replace(/'/g, "\\'") +
          '\')">' +
          '<div class="md-img-wrapper">' +
          '<img src="' +
          resolvedSrc +
          '" alt="' +
          cleanAlt +
          '" loading="lazy" />' +
          '<span class="md-img-zoom-hint">🔍 Bấm để phóng to soi sang thương</span>' +
          "</div>" +
          (cleanAlt
            ? '<figcaption class="md-figcaption">📸 ' + cleanAlt + "</figcaption>"
            : "") +
          "</figure>"
      );
      return "%%IMG_TOKEN_" + idx + "%%";
    });

    // 4. Extract markdown links [text](url)
    const linkTokens = [];
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, url) {
      const idx = linkTokens.length;
      linkTokens.push(
        '<a href="' +
          escapeHtml(url) +
          '" class="md-link" target="_blank" rel="noopener">' +
          escapeHtml(label) +
          "</a>"
      );
      return "%%LINK_TOKEN_" + idx + "%%";
    });

    // 5. Protect escaped asterisks (\*) and allele/gene nomenclature asterisks (e.g., HLA-C*06:02, HLA-B*15:02, HLA-B*58:01)
    s = s.replace(/\\\*/g, "%%ASTERISK_TOKEN%%");
    s = s.replace(/\\\|/g, "%%PIPE_TOKEN%%");
    s = s.replace(/([A-Za-z0-9])\*(?=[0-9])/g, "$1%%ASTERISK_TOKEN%%");

    // Escape remaining HTML except safe <br>
    s = s.replace(/<br\s*\/?>/gi, "%%BR_TOKEN%%");
    s = escapeHtml(s);
    s = s.replace(/%%BR_TOKEN%%/g, "<br>");

    // Bold + Italic ***...***
    s = s.replace(/\*\*\*([\s\S]+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    // Bold **...** (non-greedy so it never breaks even if an inner * is present)
    s = s.replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>");
    // Italic *...*
    s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

    // Restore protected literal asterisks & pipes
    s = s.replace(/%%ASTERISK_TOKEN%%/g, "&#42;");
    s = s.replace(/%%PIPE_TOKEN%%/g, "&#124;");

    // Arrow shorthands
    s = s.replace(/--&gt;/g, "→").replace(/-&gt;/g, "→");

    // Optional keyword highlighting for search results
    if (highlightKeyword && highlightKeyword.trim().length >= 2) {
      const kw = highlightKeyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp("(" + kw + ")", "gi");
      s = s.replace(rx, '<mark class="search-highlight">$1</mark>');
    }

    // Restore tokens
    s = s.replace(/%%LINK_TOKEN_(\d+)%%/g, (_, i) => linkTokens[Number(i)]);
    s = s.replace(/%%IMG_TOKEN_(\d+)%%/g, (_, i) => imgTokens[Number(i)]);
    s = s.replace(/%%MATH_TOKEN_(\d+)%%/g, (_, i) => mathTokens[Number(i)]);
    s = s.replace(/%%CODE_TOKEN_(\d+)%%/g, (_, i) => codeTokens[Number(i)]);

    return s;
  }

  /**
   * Check whether a line is a standalone block element (table, alert/blockquote,
   * fenced code, display math, heading, hr, or image) even when indented inside a list.
   */
  function isStandaloneBlockLine(rawLine) {
    const t = String(rawLine || "").trim();
    if (!t) return true;
    if (t.startsWith("|") && t.endsWith("|")) return true;
    if (t.startsWith(">")) return true;
    if (t.startsWith("```")) return true;
    if (t.startsWith("$$")) return true;
    if (/^#{1,6}\s+/.test(t)) return true;
    if (/^---+$/.test(t) || /^\*\*\*+$/.test(t)) return true;
    if (/^\!\[([^\]]*)\]\(([^)]+)\)$/.test(t)) return true;
    return false;
  }

  /**
   * Render Curriculum Tree Outline Blocks (├── PHẦN... │ ├── Slide...) as a sleek roadmap card
   */
  function renderOutlineTreeBlock(codeLines, highlightKeyword) {
    let html = '<div class="md-outline-tree">';
    html +=
      '<div class="md-outline-header"><span class="mermaid-badge">🗺️ CẤU TRÚC & LỘ TRÌNH BÀI GIẢNG</span></div>';
    html += '<div class="md-outline-list">';

    codeLines.forEach((rawLine) => {
      const cleaned = rawLine.replace(/^[│\s├└─]+/, "").trim();
      if (!cleaned) return;
      const isPart = /^(PHẦN|NHÓM)\s+/i.test(cleaned);
      const isSubGroup =
        !isPart && rawLine.indexOf("──") > 0 && rawLine.indexOf("──") <= 6;
      const rowCls =
        isPart || isSubGroup ? "outline-item-part" : "outline-item-sub";
      const icon = isPart || isSubGroup ? "📂 " : "🔹 ";
      html +=
        '<div class="md-outline-item ' +
        rowCls +
        '">' +
        '<span class="outline-icon">' +
        icon +
        "</span>" +
        '<span class="outline-text">' +
        formatInlineMarkdown(cleaned, highlightKeyword) +
        "</span></div>";
    });

    html += "</div></div>";
    return html;
  }

  /**
   * Parse and render full Markdown block to rich Medical HTML
   */
  function renderMarkdown(md, options) {
    if (!md) return "";
    const opts = options || {};
    const hideImages = !!opts.hideImages;
    const highlightKeyword = opts.highlightKeyword || "";

    const lines = String(md).split(/\r?\n/);
    let html = "";
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        i++;
        continue;
      }

      // Horizontal rule
      if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
        html += '<hr class="md-hr" />';
        i++;
        continue;
      }

      // Fenced code block ```...```
      if (trimmed.startsWith("```")) {
        const lang = trimmed.slice(3).trim().toLowerCase();
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        const codeContent = codeLines.join("\n");
        if (lang === "mermaid") {
          html += renderMermaidDiagram(codeContent);
        } else if (/[├└]──/.test(codeContent)) {
          html += renderOutlineTreeBlock(codeLines, highlightKeyword);
        } else {
          html +=
            '<pre class="md-code-block"><code>' +
            escapeHtml(codeContent) +
            "</code></pre>";
        }
        continue;
      }

      // Display Math block $$ ... $$ (single-line or multi-line \begin{array}...\end{array}$$)
      if (trimmed.startsWith("$$")) {
        if (trimmed.endsWith("$$") && trimmed.length > 4) {
          html += renderDisplayMathBlock(trimmed, highlightKeyword);
          i++;
          continue;
        }
        const mathLines = [trimmed.slice(2)];
        i++;
        while (i < lines.length && !lines[i].trim().endsWith("$$")) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          mathLines.push(lines[i].trim().replace(/\$\$$/, ""));
          i++;
        }
        html += renderDisplayMathBlock(mathLines.join("\n"), highlightKeyword);
        continue;
      }

      // Standalone image line
      if (/^\!\[([^\]]*)\]\(([^)]+)\)$/.test(trimmed)) {
        if (!hideImages) {
          html += formatInlineMarkdown(trimmed, highlightKeyword);
        }
        i++;
        continue;
      }

      // Headings # to ######
      const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (hMatch) {
        const level = hMatch[1].length;
        const hText = hMatch[2].trim();
        const slugId =
          "sec-" +
          hText
            .toLowerCase()
            .replace(/[^a-z0-9\u00C0-\u1EF9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        html +=
          "<h" +
          level +
          ' id="' +
          slugId +
          '" class="md-heading md-h' +
          level +
          '">' +
          formatInlineMarkdown(hText, highlightKeyword) +
          "</h" +
          level +
          ">";
        i++;
        continue;
      }

      // GitHub Alerts & Blockquotes (> ...)
      if (trimmed.startsWith(">")) {
        const quoteLines = [];
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
          i++;
        }
        const firstLine = (quoteLines[0] || "").trim();
        const alertMatch = firstLine.match(
          /^\[!(TIP|WARNING|IMPORTANT|CAUTION|NOTE)\]\s*(.*)/i
        );
        if (alertMatch) {
          const alertType = alertMatch[1].toUpperCase();
          const restFirst = alertMatch[2].trim();
          const bodyLines = restFirst
            ? [restFirst].concat(quoteLines.slice(1))
            : quoteLines.slice(1);

          const alertMeta = {
            TIP: {
              icon: "💡",
              title: "Kinh nghiệm Lâm sàng (Clinical Pearl)",
              cls: "alert-tip"
            },
            WARNING: {
              icon: "⚠️",
              title: "Cảnh báo Lâm sàng (Clinical Warning)",
              cls: "alert-warning"
            },
            CAUTION: {
              icon: "🚨",
              title: "Cấm kỵ / Báo động Đỏ (Critical Caution)",
              cls: "alert-caution"
            },
            IMPORTANT: {
              icon: "📌",
              title: "Nguyên tắc Trọng tâm (Key Principle)",
              cls: "alert-important"
            },
            NOTE: {
              icon: "📝",
              title: "Ghi chú Chuyên khoa (Clinical Note)",
              cls: "alert-note"
            }
          }[alertType] || {
            icon: "💡",
            title: "Lưu ý Lâm sàng",
            cls: "alert-note"
          };

          html +=
            '<div class="clinical-alert ' +
            alertMeta.cls +
            '">' +
            '<div class="clinical-alert-header">' +
            '<span class="clinical-alert-icon">' +
            alertMeta.icon +
            "</span>" +
            '<span class="clinical-alert-title">' +
            alertMeta.title +
            "</span>" +
            "</div>" +
            '<div class="clinical-alert-body">' +
            renderMarkdown(bodyLines.join("\n"), opts) +
            "</div></div>";
        } else {
          html +=
            '<blockquote class="md-blockquote">' +
            renderMarkdown(quoteLines.join("\n"), opts) +
            "</blockquote>";
        }
        continue;
      }

      // Markdown Table (| ... |)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const tableLines = [];
        while (
          i < lines.length &&
          lines[i].trim().startsWith("|") &&
          lines[i].trim().endsWith("|")
        ) {
          tableLines.push(lines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          const splitTableRow = (r) =>
            r
              .slice(1, -1)
              .replace(/\\\|/g, "%%ESCAPED_PIPE%%")
              .split("|")
              .map((c) => c.replace(/%%ESCAPED_PIPE%%/g, "\\|").trim());
          const headers = splitTableRow(tableLines[0]);
          const isSeparator = /^[\s|:\-]+$/.test(tableLines[1]);
          const startBodyIdx = isSeparator ? 2 : 1;

          html += '<div class="md-table-wrapper"><table class="md-table">';
          html += "<thead><tr>";
          headers.forEach((h) => {
            html +=
              "<th>" + formatInlineMarkdown(h, highlightKeyword) + "</th>";
          });
          html += "</tr></thead><tbody>";

          for (let rIdx = startBodyIdx; rIdx < tableLines.length; rIdx++) {
            const cells = splitTableRow(tableLines[rIdx]);
            html += "<tr>";
            for (let cIdx = 0; cIdx < headers.length; cIdx++) {
              html +=
                "<td>" +
                formatInlineMarkdown(cells[cIdx] || "", highlightKeyword) +
                "</td>";
            }
            html += "</tr>";
          }
          html += "</tbody></table></div>";
          continue;
        }
      }

      // Lists (unordered - / * or ordered 1. 2.)
      // Stop immediately if an indented line is a table (|...|), alert (>), code block (```), or math ($$)
      if (/^(\s*)([-*]|\d+\.)\s+/.test(line)) {
        const listBlocks = [];
        while (i < lines.length) {
          const curLine = lines[i];
          if (/^(\s*)([-*]|\d+\.)\s+/.test(curLine)) {
            listBlocks.push(curLine);
            i++;
          } else if (
            curLine.trim() &&
            /^\s{2,}/.test(curLine) &&
            !isStandaloneBlockLine(curLine)
          ) {
            listBlocks.push(curLine);
            i++;
          } else {
            break;
          }
        }
        html += renderListBlock(listBlocks, opts);
        continue;
      }

      // Regular paragraph
      const paraLines = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !isStandaloneBlockLine(lines[i]) &&
        !/^(\s*)([-*]|\d+\.)\s+/.test(lines[i])
      ) {
        if (hideImages && /^\!\[([^\]]*)\]\(([^)]+)\)$/.test(lines[i].trim())) {
          i++;
          continue;
        }
        paraLines.push(lines[i].trim());
        i++;
      }
      if (paraLines.length > 0) {
        html +=
          '<p class="md-p">' +
          formatInlineMarkdown(paraLines.join(" "), highlightKeyword) +
          "</p>";
      }
    }

    return html;
  }

  /**
   * Render nested markdown lists cleanly
   */
  function renderListBlock(lines, opts) {
    const highlightKeyword = (opts && opts.highlightKeyword) || "";
    const items = [];
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (m) {
        const indent = m[1].replace(/\t/g, "    ").length;
        const isOrdered = /^\d+\./.test(m[2]);
        items.push({
          indent: indent,
          ordered: isOrdered,
          text: m[3].trim(),
          subItems: []
        });
      } else if (items.length > 0) {
        items[items.length - 1].text += " " + lines[i].trim();
      }
    }

    if (items.length === 0) return "";

    // Build hierarchy up to 3 levels based on indentation
    const rootList = [];
    let currentL1 = null;
    let currentL2 = null;
    const baseIndent = items[0].indent;

    items.forEach((it) => {
      const relIndent = it.indent - baseIndent;
      if (relIndent <= 1) {
        currentL1 = it;
        currentL2 = null;
        rootList.push(it);
      } else if (relIndent <= 5) {
        if (currentL1) {
          currentL2 = it;
          currentL1.subItems.push(it);
        } else {
          rootList.push(it);
        }
      } else {
        if (currentL2) {
          currentL2.subItems.push(it);
        } else if (currentL1) {
          currentL1.subItems.push(it);
        } else {
          rootList.push(it);
        }
      }
    });

    function renderItemsList(arr, depth) {
      if (!arr || !arr.length) return "";
      const tag = arr[0].ordered ? "ol" : "ul";
      let out = "<" + tag + ' class="md-list md-list-d' + depth + '">';
      arr.forEach((item) => {
        out +=
          '<li class="md-li">' +
          formatInlineMarkdown(item.text, highlightKeyword);
        if (item.subItems && item.subItems.length > 0) {
          out += renderItemsList(item.subItems, depth + 1);
        }
        out += "</li>";
      });
      out += "</" + tag + ">";
      return out;
    }

    return renderItemsList(rootList, 1);
  }

  window.MedicalMarkdown = {
    render: renderMarkdown,
    renderInline: formatInlineMarkdown,
    renderLatex: renderLatexInline
  };
})();
