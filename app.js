(function () {
  "use strict";

  // ---- 데이터 평탄화 ----
  const FLAT_WORDS = [];
  ROOT_GROUPS.forEach((group) => {
    group.words.forEach((w) => {
      FLAT_WORDS.push({
        word: w.word,
        meaning: w.meaning,
        difficulty: w.difficulty,
        parts: w.parts,
        root: group.root,
        rootMeaning: group.rootMeaning,
      });
    });
  });

  const DIFFICULTY_LABEL = { easy: "쉬움", medium: "보통", hard: "어려움" };

  // ---- DOM refs ----
  const rootSelect = document.getElementById("filter-root");
  const prefixSelect = document.getElementById("filter-prefix");
  const suffixSelect = document.getElementById("filter-suffix");
  const difficultySelect = document.getElementById("filter-difficulty");
  const searchInput = document.getElementById("filter-search");
  const resultsEl = document.getElementById("results");
  const resultCountEl = document.getElementById("result-count");
  const totalCountEl = document.getElementById("total-count");
  const totalRootsEl = document.getElementById("total-roots");
  const btnRandom = document.getElementById("btn-random");
  const btnAll = document.getElementById("btn-all");
  const btnReset = document.getElementById("btn-reset");

  let mode = "all"; // "all" | "random"
  let randomPicks = [];

  // ---- 필터 옵션 채우기 ----
  function fillSelect(select, values) {
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  const rootValues = ROOT_GROUPS.map((g) => g.root);

  const prefixSet = new Map();
  const suffixSet = new Map();
  FLAT_WORDS.forEach((w) => {
    w.parts.forEach((p) => {
      if (p.type === "prefix" && !prefixSet.has(p.t)) prefixSet.set(p.t, p.m);
      if (p.type === "suffix" && !suffixSet.has(p.t)) suffixSet.set(p.t, p.m);
    });
  });

  fillSelect(rootSelect, rootValues);
  fillSelect(prefixSelect, [...prefixSet.keys()].sort());
  fillSelect(suffixSelect, [...suffixSet.keys()].sort());

  totalCountEl.textContent = FLAT_WORDS.length;
  totalRootsEl.textContent = ROOT_GROUPS.length;

  // ---- 필터링 ----
  function getFiltered() {
    const rootVal = rootSelect.value;
    const prefixVal = prefixSelect.value;
    const suffixVal = suffixSelect.value;
    const diffVal = difficultySelect.value;
    const searchVal = searchInput.value.trim().toLowerCase();

    return FLAT_WORDS.filter((w) => {
      if (rootVal && w.root !== rootVal) return false;
      if (diffVal && w.difficulty !== diffVal) return false;
      if (prefixVal && !w.parts.some((p) => p.type === "prefix" && p.t === prefixVal)) return false;
      if (suffixVal && !w.parts.some((p) => p.type === "suffix" && p.t === suffixVal)) return false;
      if (searchVal) {
        const hay = w.word.toLowerCase() + " " + w.meaning.toLowerCase();
        if (!hay.includes(searchVal)) return false;
      }
      return true;
    });
  }

  // ---- 카드 DOM 생성 ----
  function buildBreakdown(word) {
    const wrap = document.createElement("span");
    wrap.className = "breakdown";

    word.parts.forEach((p, idx) => {
      if (idx > 0) {
        const plus = document.createElement("span");
        plus.className = "arrow";
        plus.textContent = "+";
        wrap.appendChild(plus);
      }
      const partSpan = document.createElement("span");
      partSpan.className = "part " + p.type;
      partSpan.textContent = p.t;
      wrap.appendChild(partSpan);

      const meaningSpan = document.createElement("span");
      meaningSpan.className = "part-meaning";
      meaningSpan.textContent = " " + p.m + " ";
      wrap.appendChild(meaningSpan);
    });

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "→";
    wrap.appendChild(arrow);

    const meaning = document.createElement("span");
    meaning.className = "word-meaning";
    meaning.textContent = " " + word.meaning;
    wrap.appendChild(meaning);

    return wrap;
  }

  function buildWordCard(word, { standalone } = {}) {
    const card = document.createElement("div");
    card.className = "word-card" + (standalone ? " standalone" : "");

    const top = document.createElement("div");
    top.className = "word-top";

    const title = document.createElement("span");
    title.className = "word-title";
    title.textContent = word.word;
    top.appendChild(title);

    const badge = document.createElement("span");
    badge.className = "badge " + word.difficulty;
    badge.textContent = DIFFICULTY_LABEL[word.difficulty] || word.difficulty;
    top.appendChild(badge);

    if (standalone) {
      const rootTag = document.createElement("span");
      rootTag.className = "word-root-tag";
      rootTag.textContent = word.root + " · " + word.rootMeaning;
      top.appendChild(rootTag);
    }

    card.appendChild(top);
    card.appendChild(buildBreakdown(word));
    return card;
  }

  function buildRootSection(root, rootMeaning, words) {
    const section = document.createElement("div");
    section.className = "root-section";

    const header = document.createElement("div");
    header.className = "root-section-header";
    const name = document.createElement("span");
    name.className = "root-name";
    name.textContent = root;
    const meaning = document.createElement("span");
    meaning.className = "root-meaning";
    meaning.textContent = rootMeaning;
    header.appendChild(name);
    header.appendChild(meaning);
    section.appendChild(header);

    const list = document.createElement("div");
    list.className = "word-list";
    words.forEach((w) => list.appendChild(buildWordCard(w)));
    section.appendChild(list);

    return section;
  }

  function renderEmpty(message) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = message;
    resultsEl.appendChild(div);
  }

  function renderGrouped(words) {
    resultsEl.innerHTML = "";
    if (words.length === 0) {
      renderEmpty("조건에 맞는 단어가 없어요. 필터를 조정해보세요.");
      return;
    }
    ROOT_GROUPS.forEach((group) => {
      const inGroup = words.filter((w) => w.root === group.root);
      if (inGroup.length > 0) {
        resultsEl.appendChild(buildRootSection(group.root, group.rootMeaning, inGroup));
      }
    });
  }

  function renderFlatList(words) {
    resultsEl.innerHTML = "";
    if (words.length === 0) {
      renderEmpty("조건에 맞는 단어가 없어요. 필터를 조정해보세요.");
      return;
    }
    words.forEach((w) => resultsEl.appendChild(buildWordCard(w, { standalone: true })));
  }

  function pickRandom(list, n) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  // ---- 메인 렌더 ----
  function render() {
    const filtered = getFiltered();

    if (mode === "random") {
      renderFlatList(randomPicks);
      resultCountEl.textContent =
        "랜덤 " + randomPicks.length + "개 표시 중 (전체 조건 일치: " + filtered.length + "개)";
    } else {
      renderGrouped(filtered);
      resultCountEl.textContent = filtered.length + "개 단어 표시 중";
    }
  }

  function refreshRandom() {
    const filtered = getFiltered();
    randomPicks = pickRandom(filtered, Math.min(5, filtered.length));
    mode = "random";
    render();
  }

  // ---- 이벤트 ----
  [rootSelect, prefixSelect, suffixSelect, difficultySelect].forEach((el) => {
    el.addEventListener("change", () => {
      if (mode === "random") refreshRandom();
      else render();
    });
  });

  searchInput.addEventListener("input", () => {
    if (mode === "random") refreshRandom();
    else render();
  });

  btnRandom.addEventListener("click", refreshRandom);

  btnAll.addEventListener("click", () => {
    mode = "all";
    render();
  });

  btnReset.addEventListener("click", () => {
    rootSelect.value = "";
    prefixSelect.value = "";
    suffixSelect.value = "";
    difficultySelect.value = "";
    searchInput.value = "";
    mode = "all";
    render();
  });

  // ---- 초기 렌더 ----
  render();
})();
