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
  const FAVORITES_KEY = "root-word-app:favorites";

  // ---- DOM refs ----
  const rootSelect = document.getElementById("filter-root");
  const prefixSelect = document.getElementById("filter-prefix");
  const suffixSelect = document.getElementById("filter-suffix");
  const difficultySelect = document.getElementById("filter-difficulty");
  const searchInput = document.getElementById("filter-search");
  const favoritesOnlyCheckbox = document.getElementById("filter-favorites");
  const resultsEl = document.getElementById("results");
  const resultCountEl = document.getElementById("result-count");
  const totalCountEl = document.getElementById("total-count");
  const totalRootsEl = document.getElementById("total-roots");
  const btnRandom = document.getElementById("btn-random");
  const btnAll = document.getElementById("btn-all");
  const btnFlashcard = document.getElementById("btn-flashcard");
  const btnQuiz = document.getElementById("btn-quiz");
  const btnReset = document.getElementById("btn-reset");

  const flashcardView = document.getElementById("flashcard-view");
  const flashcardEl = document.getElementById("flashcard");
  const flashcardWordEl = document.getElementById("flashcard-word");
  const flashcardRootTagEl = document.getElementById("flashcard-root-tag");
  const flashcardBreakdownEl = document.getElementById("flashcard-breakdown");
  const flashcardPositionEl = document.getElementById("flashcard-position");
  const btnFlashcardFlip = document.getElementById("btn-flashcard-flip");
  const btnFlashcardPrev = document.getElementById("btn-flashcard-prev");
  const btnFlashcardNext = document.getElementById("btn-flashcard-next");
  const btnFlashcardShuffle = document.getElementById("btn-flashcard-shuffle");

  const quizView = document.getElementById("quiz-view");
  const quizWordEl = document.getElementById("quiz-word");
  const quizOptionsEl = document.getElementById("quiz-options");
  const quizFeedbackEl = document.getElementById("quiz-feedback");
  const quizProgressEl = document.getElementById("quiz-progress");
  const quizScoreEl = document.getElementById("quiz-score");
  const btnQuizNext = document.getElementById("btn-quiz-next");
  const btnQuizRestart = document.getElementById("btn-quiz-restart");

  let mode = "all"; // "all" | "random" | "flashcard" | "quiz"
  let randomPicks = [];
  let favorites = loadFavorites();

  const flashcardState = { deck: [], index: 0, flipped: false };
  const quizState = { questions: [], index: 0, score: 0, answered: false };

  // ---- 즐겨찾기 ----
  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch (e) {
      /* localStorage 사용 불가 시 무시 */
    }
  }

  function isFavorite(word) {
    return favorites.has(word);
  }

  function toggleFavorite(word) {
    if (favorites.has(word)) favorites.delete(word);
    else favorites.add(word);
    saveFavorites();
  }

  // ---- 발음 듣기 ----
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      /* TTS 미지원 브라우저는 무시 */
    }
  }

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
    const favOnly = favoritesOnlyCheckbox.checked;

    return FLAT_WORDS.filter((w) => {
      if (rootVal && w.root !== rootVal) return false;
      if (diffVal && w.difficulty !== diffVal) return false;
      if (favOnly && !isFavorite(w.word)) return false;
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

    const speakBtn = document.createElement("button");
    speakBtn.type = "button";
    speakBtn.className = "icon-btn speak-btn";
    speakBtn.textContent = "🔊";
    speakBtn.setAttribute("aria-label", word.word + " 발음 듣기");
    speakBtn.addEventListener("click", () => speak(word.word));
    top.appendChild(speakBtn);

    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "icon-btn fav-btn" + (isFavorite(word.word) ? " active" : "");
    favBtn.textContent = isFavorite(word.word) ? "★" : "☆";
    favBtn.setAttribute("aria-label", word.word + " 즐겨찾기 토글");
    favBtn.addEventListener("click", () => {
      toggleFavorite(word.word);
      render();
    });
    top.appendChild(favBtn);

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

  // ---- 화면 전환 ----
  function setActiveModeButton() {
    [btnAll, btnRandom, btnFlashcard, btnQuiz].forEach((b) => b.classList.remove("btn-active"));
    if (mode === "all") btnAll.classList.add("btn-active");
    if (mode === "random") btnRandom.classList.add("btn-active");
    if (mode === "flashcard") btnFlashcard.classList.add("btn-active");
    if (mode === "quiz") btnQuiz.classList.add("btn-active");
  }

  function showView() {
    const isList = mode === "all" || mode === "random";
    resultsEl.hidden = !isList;
    document.querySelector(".status-bar").hidden = !isList;
    flashcardView.hidden = mode !== "flashcard";
    quizView.hidden = mode !== "quiz";
    setActiveModeButton();
  }

  // ---- 메인(전체/랜덤) 렌더 ----
  function render() {
    if (mode === "flashcard") {
      renderFlashcard();
      showView();
      return;
    }
    if (mode === "quiz") {
      showView();
      return;
    }

    const filtered = getFiltered();

    if (mode === "random") {
      renderFlatList(randomPicks);
      resultCountEl.textContent =
        "랜덤 " + randomPicks.length + "개 표시 중 (전체 조건 일치: " + filtered.length + "개)";
    } else {
      renderGrouped(filtered);
      resultCountEl.textContent = filtered.length + "개 단어 표시 중";
    }
    showView();
  }

  function refreshRandom() {
    const filtered = getFiltered();
    randomPicks = pickRandom(filtered, Math.min(5, filtered.length));
    mode = "random";
    render();
  }

  // ---- 플래시카드 ----
  function buildFlashcardDeck() {
    flashcardState.deck = pickRandom(getFiltered(), getFiltered().length);
    flashcardState.index = 0;
    flashcardState.flipped = false;
  }

  function renderFlashcard() {
    const deck = flashcardState.deck;
    flashcardEl.classList.toggle("flipped", flashcardState.flipped);

    if (deck.length === 0) {
      flashcardWordEl.textContent = "표시할 단어가 없어요";
      flashcardRootTagEl.textContent = "";
      flashcardBreakdownEl.innerHTML = "";
      flashcardPositionEl.textContent = "0 / 0";
      btnFlashcardPrev.disabled = true;
      btnFlashcardNext.disabled = true;
      btnFlashcardFlip.disabled = true;
      return;
    }

    btnFlashcardPrev.disabled = false;
    btnFlashcardNext.disabled = false;
    btnFlashcardFlip.disabled = false;

    const word = deck[flashcardState.index];
    flashcardWordEl.textContent = word.word;
    flashcardRootTagEl.textContent = word.root + " · " + word.rootMeaning;
    flashcardBreakdownEl.innerHTML = "";
    flashcardBreakdownEl.appendChild(buildBreakdown(word));
    flashcardPositionEl.textContent = (flashcardState.index + 1) + " / " + deck.length;
  }

  function flashcardGo(delta) {
    if (flashcardState.deck.length === 0) return;
    flashcardState.index =
      (flashcardState.index + delta + flashcardState.deck.length) % flashcardState.deck.length;
    flashcardState.flipped = false;
    renderFlashcard();
  }

  // ---- 퀴즈 ----
  function buildQuizQuestions() {
    const pool = getFiltered();
    const source = pool.length >= 4 ? pool : FLAT_WORDS;
    const questionWords = pickRandom(pool.length > 0 ? pool : FLAT_WORDS, Math.min(10, (pool.length > 0 ? pool : FLAT_WORDS).length));

    quizState.questions = questionWords.map((w) => {
      const wrongPool = source.filter((x) => x.word !== w.word);
      const wrongs = pickRandom(wrongPool, Math.min(3, wrongPool.length));
      const options = pickRandom([w, ...wrongs], 1 + wrongs.length);
      return { word: w, options };
    });
    quizState.index = 0;
    quizState.score = 0;
    quizState.answered = false;
  }

  function renderQuiz() {
    const q = quizState.questions[quizState.index];
    quizFeedbackEl.textContent = "";
    quizFeedbackEl.className = "quiz-feedback";
    btnQuizNext.disabled = true;

    if (!q) {
      quizWordEl.textContent = "퀴즈를 만들 단어가 부족해요";
      quizOptionsEl.innerHTML = "";
      quizProgressEl.textContent = "";
      quizScoreEl.textContent = "";
      return;
    }

    quizWordEl.textContent = q.word.word;
    quizProgressEl.textContent = (quizState.index + 1) + " / " + quizState.questions.length + " 문제";
    quizScoreEl.textContent = "점수: " + quizState.score;

    quizOptionsEl.innerHTML = "";
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt.meaning;
      btn.addEventListener("click", () => answerQuiz(opt, btn, q));
      quizOptionsEl.appendChild(btn);
    });
  }

  function answerQuiz(selected, selectedBtn, question) {
    if (quizState.answered) return;
    quizState.answered = true;

    const correct = selected.word === question.word.word;
    if (correct) quizState.score += 1;

    [...quizOptionsEl.children].forEach((btn) => {
      btn.disabled = true;
      if (btn.textContent === question.word.meaning) btn.classList.add("correct");
    });
    if (!correct) selectedBtn.classList.add("incorrect");

    quizFeedbackEl.textContent = correct ? "정답이에요! 🎉" : "아쉬워요. 정답은 \"" + question.word.meaning + "\"";
    quizFeedbackEl.className = "quiz-feedback " + (correct ? "correct" : "incorrect");
    quizScoreEl.textContent = "점수: " + quizState.score;
    btnQuizNext.disabled = false;
  }

  function quizNext() {
    if (quizState.index >= quizState.questions.length - 1) {
      quizWordEl.textContent = "퀴즈 완료! 🎉";
      quizOptionsEl.innerHTML = "";
      quizProgressEl.textContent = "";
      quizFeedbackEl.textContent =
        "최종 점수: " + quizState.score + " / " + quizState.questions.length;
      quizFeedbackEl.className = "quiz-feedback correct";
      btnQuizNext.disabled = true;
      return;
    }
    quizState.index += 1;
    quizState.answered = false;
    renderQuiz();
  }

  function startQuiz() {
    buildQuizQuestions();
    mode = "quiz";
    renderQuiz();
    showView();
  }

  // ---- 이벤트 ----
  [rootSelect, prefixSelect, suffixSelect, difficultySelect].forEach((el) => {
    el.addEventListener("change", () => {
      if (mode === "random") refreshRandom();
      else if (mode === "flashcard") {
        buildFlashcardDeck();
        render();
      } else render();
    });
  });

  favoritesOnlyCheckbox.addEventListener("change", () => {
    if (mode === "random") refreshRandom();
    else if (mode === "flashcard") {
      buildFlashcardDeck();
      render();
    } else render();
  });

  searchInput.addEventListener("input", () => {
    if (mode === "random") refreshRandom();
    else if (mode === "flashcard") {
      buildFlashcardDeck();
      render();
    } else render();
  });

  btnRandom.addEventListener("click", refreshRandom);

  btnAll.addEventListener("click", () => {
    mode = "all";
    render();
  });

  btnFlashcard.addEventListener("click", () => {
    mode = "flashcard";
    buildFlashcardDeck();
    render();
  });

  btnQuiz.addEventListener("click", startQuiz);

  btnReset.addEventListener("click", () => {
    rootSelect.value = "";
    prefixSelect.value = "";
    suffixSelect.value = "";
    difficultySelect.value = "";
    searchInput.value = "";
    favoritesOnlyCheckbox.checked = false;
    mode = "all";
    render();
  });

  flashcardEl.addEventListener("click", () => {
    flashcardState.flipped = !flashcardState.flipped;
    renderFlashcard();
  });
  btnFlashcardFlip.addEventListener("click", (e) => {
    e.stopPropagation();
    flashcardState.flipped = !flashcardState.flipped;
    renderFlashcard();
  });
  btnFlashcardPrev.addEventListener("click", () => flashcardGo(-1));
  btnFlashcardNext.addEventListener("click", () => flashcardGo(1));
  btnFlashcardShuffle.addEventListener("click", () => {
    flashcardState.deck = pickRandom(flashcardState.deck, flashcardState.deck.length);
    flashcardState.index = 0;
    flashcardState.flipped = false;
    renderFlashcard();
  });

  btnQuizNext.addEventListener("click", quizNext);
  btnQuizRestart.addEventListener("click", startQuiz);

  // ---- 초기 렌더 ----
  render();
})();
