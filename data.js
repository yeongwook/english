// 어근 학습 데이터
// 구조: 어근 그룹(root) 단위로 묶고, 각 그룹 안에 파생 단어들을 나열한다.
// 각 단어는 prefix / root / suffix 로 분해된 parts 배열을 가진다.
// difficulty: "easy" | "medium" | "hard"

const ROOT_GROUPS = [
  {
    root: "spect / spic",
    rootMeaning: "보다 (look)",
    words: [
      { word: "inspect", parts: [{ t: "in", type: "prefix", m: "안을" }, { t: "spect", type: "root", m: "보다" }], meaning: "검사하다, 사찰하다", difficulty: "easy" },
      { word: "prospect", parts: [{ t: "pro", type: "prefix", m: "앞을" }, { t: "spect", type: "root", m: "보다" }], meaning: "전망, 가망", difficulty: "medium" },
      { word: "retrospect", parts: [{ t: "retro", type: "prefix", m: "뒤를" }, { t: "spect", type: "root", m: "보다" }], meaning: "회고, 회고하다", difficulty: "medium" },
      { word: "conspicuous", parts: [{ t: "con", type: "prefix", m: "완전히" }, { t: "spic", type: "root", m: "보이다" }, { t: "uous", type: "suffix", m: "~한" }], meaning: "눈에 띄는, 뚜렷한", difficulty: "hard" },
      { word: "circumspect", parts: [{ t: "circum", type: "prefix", m: "주위를" }, { t: "spect", type: "root", m: "보다" }], meaning: "신중한", difficulty: "hard" },
      { word: "spectator", parts: [{ t: "spect", type: "root", m: "보다" }, { t: "ator", type: "suffix", m: "~하는 사람" }], meaning: "관중, 구경꾼", difficulty: "easy" },
    ],
  },
  {
    root: "port",
    rootMeaning: "나르다 (carry)",
    words: [
      { word: "transport", parts: [{ t: "trans", type: "prefix", m: "가로질러" }, { t: "port", type: "root", m: "나르다" }], meaning: "수송하다, 운송", difficulty: "easy" },
      { word: "export", parts: [{ t: "ex", type: "prefix", m: "밖으로" }, { t: "port", type: "root", m: "나르다" }], meaning: "수출하다", difficulty: "easy" },
      { word: "import", parts: [{ t: "im", type: "prefix", m: "안으로" }, { t: "port", type: "root", m: "나르다" }], meaning: "수입하다", difficulty: "easy" },
      { word: "portable", parts: [{ t: "port", type: "root", m: "나르다" }, { t: "able", type: "suffix", m: "~할 수 있는" }], meaning: "휴대용의", difficulty: "easy" },
      { word: "report", parts: [{ t: "re", type: "prefix", m: "다시" }, { t: "port", type: "root", m: "나르다" }], meaning: "보고하다, 보고서", difficulty: "easy" },
      { word: "support", parts: [{ t: "sup", type: "prefix", m: "아래에서" }, { t: "port", type: "root", m: "나르다" }], meaning: "지지하다, 지원하다", difficulty: "easy" },
    ],
  },
  {
    root: "dict",
    rootMeaning: "말하다 (say)",
    words: [
      { word: "predict", parts: [{ t: "pre", type: "prefix", m: "미리" }, { t: "dict", type: "root", m: "말하다" }], meaning: "예측하다", difficulty: "easy" },
      { word: "contradict", parts: [{ t: "contra", type: "prefix", m: "반대로" }, { t: "dict", type: "root", m: "말하다" }], meaning: "반박하다, 모순되다", difficulty: "medium" },
      { word: "dictate", parts: [{ t: "dict", type: "root", m: "말하다" }, { t: "ate", type: "suffix", m: "~하게 하다" }], meaning: "받아쓰게 하다, 명령하다", difficulty: "medium" },
      { word: "verdict", parts: [{ t: "ver", type: "prefix", m: "진실을" }, { t: "dict", type: "root", m: "말하다" }], meaning: "평결, 판단", difficulty: "medium" },
      { word: "dictionary", parts: [{ t: "dict", type: "root", m: "말하다" }, { t: "ionary", type: "suffix", m: "~하는 것(모음집)" }], meaning: "사전", difficulty: "easy" },
    ],
  },
  {
    root: "duc / duct",
    rootMeaning: "이끌다 (lead)",
    words: [
      { word: "conduct", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "duct", type: "root", m: "이끌다" }], meaning: "지휘하다, 행동", difficulty: "medium" },
      { word: "produce", parts: [{ t: "pro", type: "prefix", m: "앞으로" }, { t: "duce", type: "root", m: "이끌다" }], meaning: "생산하다", difficulty: "easy" },
      { word: "induce", parts: [{ t: "in", type: "prefix", m: "안으로" }, { t: "duce", type: "root", m: "이끌다" }], meaning: "유도하다, 설득하다", difficulty: "medium" },
      { word: "reduce", parts: [{ t: "re", type: "prefix", m: "뒤로" }, { t: "duce", type: "root", m: "이끌다" }], meaning: "줄이다", difficulty: "easy" },
      { word: "introduce", parts: [{ t: "intro", type: "prefix", m: "안으로" }, { t: "duce", type: "root", m: "이끌다" }], meaning: "소개하다, 도입하다", difficulty: "easy" },
    ],
  },
  {
    root: "scrib / script",
    rootMeaning: "쓰다 (write)",
    words: [
      { word: "describe", parts: [{ t: "de", type: "prefix", m: "아래로" }, { t: "scribe", type: "root", m: "쓰다" }], meaning: "묘사하다, 설명하다", difficulty: "easy" },
      { word: "subscribe", parts: [{ t: "sub", type: "prefix", m: "아래에" }, { t: "scribe", type: "root", m: "쓰다" }], meaning: "구독하다, 서명하다", difficulty: "easy" },
      { word: "manuscript", parts: [{ t: "manu", type: "prefix", m: "손으로" }, { t: "script", type: "root", m: "쓰다" }], meaning: "원고", difficulty: "medium" },
      { word: "transcript", parts: [{ t: "trans", type: "prefix", m: "가로질러" }, { t: "script", type: "root", m: "쓰다" }], meaning: "성적증명서, 필기록", difficulty: "medium" },
      { word: "prescribe", parts: [{ t: "pre", type: "prefix", m: "미리" }, { t: "scribe", type: "root", m: "쓰다" }], meaning: "처방하다, 규정하다", difficulty: "medium" },
    ],
  },
  {
    root: "vert / vers",
    rootMeaning: "돌리다 (turn)",
    words: [
      { word: "convert", parts: [{ t: "con", type: "prefix", m: "완전히" }, { t: "vert", type: "root", m: "돌리다" }], meaning: "전환하다, 개종시키다", difficulty: "easy" },
      { word: "revert", parts: [{ t: "re", type: "prefix", m: "다시" }, { t: "vert", type: "root", m: "돌리다" }], meaning: "되돌아가다", difficulty: "medium" },
      { word: "divert", parts: [{ t: "di", type: "prefix", m: "다른 곳으로" }, { t: "vert", type: "root", m: "돌리다" }], meaning: "전환시키다, 즐겁게 하다", difficulty: "medium" },
      { word: "universe", parts: [{ t: "uni", type: "prefix", m: "하나로" }, { t: "verse", type: "root", m: "돌리다" }], meaning: "우주", difficulty: "easy" },
      { word: "reverse", parts: [{ t: "re", type: "prefix", m: "뒤로" }, { t: "verse", type: "root", m: "돌리다" }], meaning: "반대의, 뒤바꾸다", difficulty: "easy" },
      { word: "introvert", parts: [{ t: "intro", type: "prefix", m: "안으로" }, { t: "vert", type: "root", m: "돌리다" }], meaning: "내향적인 사람", difficulty: "medium" },
    ],
  },
  {
    root: "tract",
    rootMeaning: "끌다 (draw, pull)",
    words: [
      { word: "attract", parts: [{ t: "at", type: "prefix", m: "~쪽으로" }, { t: "tract", type: "root", m: "끌다" }], meaning: "끌어당기다, 매혹하다", difficulty: "easy" },
      { word: "extract", parts: [{ t: "ex", type: "prefix", m: "밖으로" }, { t: "tract", type: "root", m: "끌다" }], meaning: "추출하다, 발췌", difficulty: "medium" },
      { word: "contract", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "tract", type: "root", m: "끌다" }], meaning: "계약, 수축하다", difficulty: "easy" },
      { word: "distract", parts: [{ t: "dis", type: "prefix", m: "멀리" }, { t: "tract", type: "root", m: "끌다" }], meaning: "산만하게 하다", difficulty: "medium" },
      { word: "subtract", parts: [{ t: "sub", type: "prefix", m: "아래로" }, { t: "tract", type: "root", m: "끌다" }], meaning: "빼다, 공제하다", difficulty: "easy" },
    ],
  },
  {
    root: "pos / pon",
    rootMeaning: "놓다 (put, place)",
    words: [
      { word: "compose", parts: [{ t: "com", type: "prefix", m: "함께" }, { t: "pose", type: "root", m: "놓다" }], meaning: "구성하다, 작곡하다", difficulty: "easy" },
      { word: "propose", parts: [{ t: "pro", type: "prefix", m: "앞에" }, { t: "pose", type: "root", m: "놓다" }], meaning: "제안하다", difficulty: "easy" },
      { word: "oppose", parts: [{ t: "op", type: "prefix", m: "반대로" }, { t: "pose", type: "root", m: "놓다" }], meaning: "반대하다", difficulty: "easy" },
      { word: "postpone", parts: [{ t: "post", type: "prefix", m: "뒤에" }, { t: "pone", type: "root", m: "놓다" }], meaning: "연기하다", difficulty: "medium" },
      { word: "component", parts: [{ t: "com", type: "prefix", m: "함께" }, { t: "pon", type: "root", m: "놓다" }, { t: "ent", type: "suffix", m: "~것" }], meaning: "구성요소", difficulty: "medium" },
    ],
  },
  {
    root: "mit / miss",
    rootMeaning: "보내다 (send)",
    words: [
      { word: "transmit", parts: [{ t: "trans", type: "prefix", m: "가로질러" }, { t: "mit", type: "root", m: "보내다" }], meaning: "전송하다, 전달하다", difficulty: "medium" },
      { word: "permit", parts: [{ t: "per", type: "prefix", m: "완전히" }, { t: "mit", type: "root", m: "보내다" }], meaning: "허락하다, 허가증", difficulty: "easy" },
      { word: "submit", parts: [{ t: "sub", type: "prefix", m: "아래로" }, { t: "mit", type: "root", m: "보내다" }], meaning: "제출하다, 굴복하다", difficulty: "easy" },
      { word: "dismiss", parts: [{ t: "dis", type: "prefix", m: "멀리" }, { t: "miss", type: "root", m: "보내다" }], meaning: "해고하다, 묵살하다", difficulty: "medium" },
      { word: "mission", parts: [{ t: "miss", type: "root", m: "보내다" }, { t: "ion", type: "suffix", m: "~하는 것" }], meaning: "임무, 사명", difficulty: "easy" },
    ],
  },
  {
    root: "cred",
    rootMeaning: "믿다 (believe)",
    words: [
      { word: "credit", parts: [{ t: "cred", type: "root", m: "믿다" }, { t: "it", type: "suffix", m: "~것" }], meaning: "신용, 학점", difficulty: "easy" },
      { word: "credible", parts: [{ t: "cred", type: "root", m: "믿다" }, { t: "ible", type: "suffix", m: "~할 수 있는" }], meaning: "믿을 수 있는", difficulty: "medium" },
      { word: "incredible", parts: [{ t: "in", type: "prefix", m: "부정" }, { t: "cred", type: "root", m: "믿다" }, { t: "ible", type: "suffix", m: "~할 수 있는" }], meaning: "믿을 수 없는", difficulty: "easy" },
      { word: "credential", parts: [{ t: "cred", type: "root", m: "믿다" }, { t: "ential", type: "suffix", m: "~하는" }], meaning: "자격증명, 신임장", difficulty: "hard" },
    ],
  },
  {
    root: "bene",
    rootMeaning: "좋은 (good)",
    words: [
      { word: "benefit", parts: [{ t: "bene", type: "prefix", m: "좋은" }, { t: "fit", type: "root", m: "만들다" }], meaning: "이익, 혜택", difficulty: "easy" },
      { word: "benevolent", parts: [{ t: "bene", type: "prefix", m: "좋은" }, { t: "vol", type: "root", m: "원하다" }, { t: "ent", type: "suffix", m: "~한" }], meaning: "자애로운, 인자한", difficulty: "hard" },
      { word: "benefactor", parts: [{ t: "bene", type: "prefix", m: "좋은" }, { t: "fact", type: "root", m: "행하다" }, { t: "or", type: "suffix", m: "~하는 사람" }], meaning: "후원자, 은인", difficulty: "hard" },
      { word: "benign", parts: [{ t: "bene", type: "prefix", m: "좋은" }, { t: "ign", type: "root", m: "태어난" }], meaning: "온화한, 양성의", difficulty: "hard" },
    ],
  },
  {
    root: "mal",
    rootMeaning: "나쁜 (bad)",
    words: [
      { word: "malfunction", parts: [{ t: "mal", type: "prefix", m: "나쁜" }, { t: "function", type: "root", m: "작동" }], meaning: "오작동하다", difficulty: "easy" },
      { word: "malicious", parts: [{ t: "mal", type: "prefix", m: "나쁜" }, { t: "icious", type: "suffix", m: "~한" }], meaning: "악의적인", difficulty: "medium" },
      { word: "malnutrition", parts: [{ t: "mal", type: "prefix", m: "나쁜" }, { t: "nutrition", type: "root", m: "영양" }], meaning: "영양실조", difficulty: "medium" },
      { word: "malpractice", parts: [{ t: "mal", type: "prefix", m: "나쁜" }, { t: "practice", type: "root", m: "행위" }], meaning: "위법 행위, 의료 과실", difficulty: "hard" },
    ],
  },
  {
    root: "ject",
    rootMeaning: "던지다 (throw)",
    words: [
      { word: "inject", parts: [{ t: "in", type: "prefix", m: "안으로" }, { t: "ject", type: "root", m: "던지다" }], meaning: "주입하다, 주사하다", difficulty: "easy" },
      { word: "reject", parts: [{ t: "re", type: "prefix", m: "뒤로" }, { t: "ject", type: "root", m: "던지다" }], meaning: "거절하다", difficulty: "easy" },
      { word: "project", parts: [{ t: "pro", type: "prefix", m: "앞으로" }, { t: "ject", type: "root", m: "던지다" }], meaning: "계획, 투영하다", difficulty: "easy" },
      { word: "eject", parts: [{ t: "e", type: "prefix", m: "밖으로" }, { t: "ject", type: "root", m: "던지다" }], meaning: "방출하다, 튀어나오다", difficulty: "medium" },
      { word: "object", parts: [{ t: "ob", type: "prefix", m: "맞서서" }, { t: "ject", type: "root", m: "던지다" }], meaning: "반대하다, 물체", difficulty: "easy" },
    ],
  },
  {
    root: "flect / flex",
    rootMeaning: "구부리다 (bend)",
    words: [
      { word: "reflect", parts: [{ t: "re", type: "prefix", m: "다시" }, { t: "flect", type: "root", m: "구부리다" }], meaning: "반사하다, 반영하다", difficulty: "easy" },
      { word: "deflect", parts: [{ t: "de", type: "prefix", m: "벗어나서" }, { t: "flect", type: "root", m: "구부리다" }], meaning: "굴절시키다, 피하다", difficulty: "medium" },
      { word: "flexible", parts: [{ t: "flex", type: "root", m: "구부리다" }, { t: "ible", type: "suffix", m: "~할 수 있는" }], meaning: "유연한", difficulty: "easy" },
      { word: "inflect", parts: [{ t: "in", type: "prefix", m: "안으로" }, { t: "flect", type: "root", m: "구부리다" }], meaning: "굴절하다, 어조를 바꾸다", difficulty: "hard" },
    ],
  },
  {
    root: "cede / ceed / cess",
    rootMeaning: "가다 (go)",
    words: [
      { word: "proceed", parts: [{ t: "pro", type: "prefix", m: "앞으로" }, { t: "ceed", type: "root", m: "가다" }], meaning: "진행하다, 나아가다", difficulty: "easy" },
      { word: "exceed", parts: [{ t: "ex", type: "prefix", m: "밖으로" }, { t: "ceed", type: "root", m: "가다" }], meaning: "초과하다", difficulty: "medium" },
      { word: "succeed", parts: [{ t: "suc", type: "prefix", m: "아래에서 위로" }, { t: "ceed", type: "root", m: "가다" }], meaning: "성공하다, 뒤를 잇다", difficulty: "easy" },
      { word: "recede", parts: [{ t: "re", type: "prefix", m: "뒤로" }, { t: "cede", type: "root", m: "가다" }], meaning: "물러나다, 후퇴하다", difficulty: "medium" },
      { word: "access", parts: [{ t: "ac", type: "prefix", m: "~쪽으로" }, { t: "cess", type: "root", m: "가다" }], meaning: "접근, 접근하다", difficulty: "easy" },
    ],
  },
  {
    root: "voc / vok",
    rootMeaning: "부르다 (call)",
    words: [
      { word: "vocal", parts: [{ t: "voc", type: "root", m: "부르다" }, { t: "al", type: "suffix", m: "~의" }], meaning: "목소리의, 발성의", difficulty: "easy" },
      { word: "evoke", parts: [{ t: "e", type: "prefix", m: "밖으로" }, { t: "voke", type: "root", m: "부르다" }], meaning: "불러일으키다", difficulty: "medium" },
      { word: "invoke", parts: [{ t: "in", type: "prefix", m: "안으로" }, { t: "voke", type: "root", m: "부르다" }], meaning: "호소하다, 기원하다", difficulty: "medium" },
      { word: "provoke", parts: [{ t: "pro", type: "prefix", m: "앞으로" }, { t: "voke", type: "root", m: "부르다" }], meaning: "도발하다, 유발하다", difficulty: "medium" },
      { word: "advocate", parts: [{ t: "ad", type: "prefix", m: "~쪽으로" }, { t: "voc", type: "root", m: "부르다" }, { t: "ate", type: "suffix", m: "~하는 사람" }], meaning: "옹호하다, 지지자", difficulty: "hard" },
    ],
  },
  {
    root: "vid / vis",
    rootMeaning: "보다 (see)",
    words: [
      { word: "visible", parts: [{ t: "vis", type: "root", m: "보다" }, { t: "ible", type: "suffix", m: "~할 수 있는" }], meaning: "보이는", difficulty: "easy" },
      { word: "vision", parts: [{ t: "vis", type: "root", m: "보다" }, { t: "ion", type: "suffix", m: "~하는 것" }], meaning: "시력, 비전", difficulty: "easy" },
      { word: "supervise", parts: [{ t: "super", type: "prefix", m: "위에서" }, { t: "vise", type: "root", m: "보다" }], meaning: "감독하다", difficulty: "medium" },
      { word: "evidence", parts: [{ t: "e", type: "prefix", m: "밖으로" }, { t: "vid", type: "root", m: "보다" }, { t: "ence", type: "suffix", m: "~것" }], meaning: "증거", difficulty: "medium" },
      { word: "television", parts: [{ t: "tele", type: "prefix", m: "멀리" }, { t: "vis", type: "root", m: "보다" }, { t: "ion", type: "suffix", m: "~하는 것" }], meaning: "텔레비전", difficulty: "easy" },
    ],
  },
  {
    root: "sci",
    rootMeaning: "알다 (know)",
    words: [
      { word: "science", parts: [{ t: "sci", type: "root", m: "알다" }, { t: "ence", type: "suffix", m: "~하는 것" }], meaning: "과학", difficulty: "easy" },
      { word: "conscious", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "sci", type: "root", m: "알다" }, { t: "ous", type: "suffix", m: "~한" }], meaning: "의식이 있는", difficulty: "medium" },
      { word: "omniscient", parts: [{ t: "omni", type: "prefix", m: "모든" }, { t: "sci", type: "root", m: "알다" }, { t: "ent", type: "suffix", m: "~한" }], meaning: "전지전능한", difficulty: "hard" },
      { word: "prescient", parts: [{ t: "pre", type: "prefix", m: "미리" }, { t: "sci", type: "root", m: "알다" }, { t: "ent", type: "suffix", m: "~한" }], meaning: "선견지명이 있는", difficulty: "hard" },
    ],
  },
  {
    root: "gen",
    rootMeaning: "태어나다, 생기다 (birth, produce)",
    words: [
      { word: "generate", parts: [{ t: "gen", type: "root", m: "생기다" }, { t: "erate", type: "suffix", m: "~하게 하다" }], meaning: "생성하다, 발생시키다", difficulty: "easy" },
      { word: "genetic", parts: [{ t: "gen", type: "root", m: "태어나다" }, { t: "etic", type: "suffix", m: "~의" }], meaning: "유전의", difficulty: "medium" },
      { word: "congenital", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "gen", type: "root", m: "태어나다" }, { t: "ital", type: "suffix", m: "~한" }], meaning: "선천적인", difficulty: "hard" },
      { word: "progeny", parts: [{ t: "pro", type: "prefix", m: "앞으로" }, { t: "gen", type: "root", m: "태어나다" }, { t: "y", type: "suffix", m: "~것" }], meaning: "자손, 후손", difficulty: "hard" },
    ],
  },
  {
    root: "path",
    rootMeaning: "느낌, 고통 (feeling, suffering)",
    words: [
      { word: "sympathy", parts: [{ t: "sym", type: "prefix", m: "함께" }, { t: "path", type: "root", m: "느낌" }, { t: "y", type: "suffix", m: "~것" }], meaning: "동정, 공감", difficulty: "easy" },
      { word: "empathy", parts: [{ t: "em", type: "prefix", m: "안에" }, { t: "path", type: "root", m: "느낌" }, { t: "y", type: "suffix", m: "~것" }], meaning: "감정이입, 공감", difficulty: "medium" },
      { word: "pathetic", parts: [{ t: "path", type: "root", m: "느낌" }, { t: "etic", type: "suffix", m: "~한" }], meaning: "애처로운, 한심한", difficulty: "medium" },
      { word: "apathy", parts: [{ t: "a", type: "prefix", m: "없는" }, { t: "path", type: "root", m: "느낌" }, { t: "y", type: "suffix", m: "~것" }], meaning: "무관심", difficulty: "hard" },
    ],
  },
  {
    root: "fac / fact / fic",
    rootMeaning: "만들다, 하다 (make, do)",
    words: [
      { word: "factory", parts: [{ t: "fact", type: "root", m: "만들다" }, { t: "ory", type: "suffix", m: "~하는 곳" }], meaning: "공장", difficulty: "easy" },
      { word: "manufacture", parts: [{ t: "manu", type: "prefix", m: "손으로" }, { t: "fact", type: "root", m: "만들다" }, { t: "ure", type: "suffix", m: "~것" }], meaning: "제조하다", difficulty: "medium" },
      { word: "effect", parts: [{ t: "ef", type: "prefix", m: "밖으로" }, { t: "fect", type: "root", m: "만들다" }], meaning: "효과, 결과", difficulty: "easy" },
      { word: "defect", parts: [{ t: "de", type: "prefix", m: "떨어져" }, { t: "fect", type: "root", m: "만들다" }], meaning: "결함", difficulty: "medium" },
      { word: "artificial", parts: [{ t: "arti", type: "prefix", m: "기술로" }, { t: "fic", type: "root", m: "만들다" }, { t: "ial", type: "suffix", m: "~한" }], meaning: "인공적인", difficulty: "medium" },
    ],
  },
  {
    root: "form",
    rootMeaning: "형태 (shape, form)",
    words: [
      { word: "transform", parts: [{ t: "trans", type: "prefix", m: "가로질러" }, { t: "form", type: "root", m: "형태" }], meaning: "변형시키다", difficulty: "easy" },
      { word: "reform", parts: [{ t: "re", type: "prefix", m: "다시" }, { t: "form", type: "root", m: "형태" }], meaning: "개혁하다", difficulty: "easy" },
      { word: "conform", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "form", type: "root", m: "형태" }], meaning: "순응하다", difficulty: "medium" },
      { word: "deform", parts: [{ t: "de", type: "prefix", m: "나쁘게" }, { t: "form", type: "root", m: "형태" }], meaning: "변형시키다, 기형으로 만들다", difficulty: "medium" },
      { word: "uniform", parts: [{ t: "uni", type: "prefix", m: "하나의" }, { t: "form", type: "root", m: "형태" }], meaning: "획일적인, 제복", difficulty: "easy" },
    ],
  },
  {
    root: "gress / grad",
    rootMeaning: "걷다, 나아가다 (step, go)",
    words: [
      { word: "progress", parts: [{ t: "pro", type: "prefix", m: "앞으로" }, { t: "gress", type: "root", m: "걷다" }], meaning: "진전, 진행하다", difficulty: "easy" },
      { word: "regress", parts: [{ t: "re", type: "prefix", m: "뒤로" }, { t: "gress", type: "root", m: "걷다" }], meaning: "퇴보하다", difficulty: "medium" },
      { word: "aggressive", parts: [{ t: "ag", type: "prefix", m: "~쪽으로" }, { t: "gress", type: "root", m: "걷다" }, { t: "ive", type: "suffix", m: "~한" }], meaning: "공격적인", difficulty: "easy" },
      { word: "graduate", parts: [{ t: "grad", type: "root", m: "걷다" }, { t: "uate", type: "suffix", m: "~하게 하다" }], meaning: "졸업하다", difficulty: "easy" },
      { word: "degrade", parts: [{ t: "de", type: "prefix", m: "아래로" }, { t: "grade", type: "root", m: "걷다" }], meaning: "저하시키다, 비하하다", difficulty: "medium" },
    ],
  },
  {
    root: "greg",
    rootMeaning: "무리 (flock, group)",
    words: [
      { word: "congregate", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "greg", type: "root", m: "무리" }, { t: "ate", type: "suffix", m: "~하게 하다" }], meaning: "모이다", difficulty: "hard" },
      { word: "segregate", parts: [{ t: "se", type: "prefix", m: "떨어져" }, { t: "greg", type: "root", m: "무리" }, { t: "ate", type: "suffix", m: "~하게 하다" }], meaning: "분리하다, 차별하다", difficulty: "hard" },
      { word: "aggregate", parts: [{ t: "ag", type: "prefix", m: "~쪽으로" }, { t: "greg", type: "root", m: "무리" }, { t: "ate", type: "suffix", m: "~하게 하다" }], meaning: "합계, 모으다", difficulty: "hard" },
      { word: "gregarious", parts: [{ t: "greg", type: "root", m: "무리" }, { t: "arious", type: "suffix", m: "~하는" }], meaning: "사교적인", difficulty: "hard" },
    ],
  },
  {
    root: "chron",
    rootMeaning: "시간 (time)",
    words: [
      { word: "chronology", parts: [{ t: "chron", type: "root", m: "시간" }, { t: "ology", type: "suffix", m: "~학" }], meaning: "연대기, 연대순", difficulty: "medium" },
      { word: "synchronize", parts: [{ t: "syn", type: "prefix", m: "함께" }, { t: "chron", type: "root", m: "시간" }, { t: "ize", type: "suffix", m: "~하게 하다" }], meaning: "동시에 발생하게 하다", difficulty: "medium" },
      { word: "chronic", parts: [{ t: "chron", type: "root", m: "시간" }, { t: "ic", type: "suffix", m: "~적인" }], meaning: "만성적인", difficulty: "medium" },
      { word: "anachronism", parts: [{ t: "ana", type: "prefix", m: "거슬러" }, { t: "chron", type: "root", m: "시간" }, { t: "ism", type: "suffix", m: "~것" }], meaning: "시대착오", difficulty: "hard" },
    ],
  },
  {
    root: "fer",
    rootMeaning: "나르다, 옮기다 (carry, bear)",
    words: [
      { word: "transfer", parts: [{ t: "trans", type: "prefix", m: "가로질러" }, { t: "fer", type: "root", m: "나르다" }], meaning: "이동하다, 이전하다", difficulty: "easy" },
      { word: "refer", parts: [{ t: "re", type: "prefix", m: "다시" }, { t: "fer", type: "root", m: "나르다" }], meaning: "참조하다, 언급하다", difficulty: "easy" },
      { word: "confer", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "fer", type: "root", m: "나르다" }], meaning: "상의하다, 수여하다", difficulty: "medium" },
      { word: "fertile", parts: [{ t: "fer", type: "root", m: "나르다" }, { t: "tile", type: "suffix", m: "~할 수 있는" }], meaning: "비옥한", difficulty: "medium" },
      { word: "offer", parts: [{ t: "of", type: "prefix", m: "~쪽으로" }, { t: "fer", type: "root", m: "나르다" }], meaning: "제안하다", difficulty: "easy" },
    ],
  },
  {
    root: "flu / flux",
    rootMeaning: "흐르다 (flow)",
    words: [
      { word: "influence", parts: [{ t: "in", type: "prefix", m: "안으로" }, { t: "flu", type: "root", m: "흐르다" }, { t: "ence", type: "suffix", m: "~것" }], meaning: "영향", difficulty: "easy" },
      { word: "fluent", parts: [{ t: "flu", type: "root", m: "흐르다" }, { t: "ent", type: "suffix", m: "~한" }], meaning: "유창한", difficulty: "medium" },
      { word: "fluctuate", parts: [{ t: "flu", type: "root", m: "흐르다" }, { t: "ctuate", type: "suffix", m: "~하다" }], meaning: "변동하다", difficulty: "hard" },
      { word: "influx", parts: [{ t: "in", type: "prefix", m: "안으로" }, { t: "flux", type: "root", m: "흐르다" }], meaning: "유입", difficulty: "hard" },
    ],
  },
  {
    root: "magn",
    rootMeaning: "큰 (great)",
    words: [
      { word: "magnify", parts: [{ t: "magn", type: "root", m: "큰" }, { t: "ify", type: "suffix", m: "~하게 만들다" }], meaning: "확대하다", difficulty: "easy" },
      { word: "magnitude", parts: [{ t: "magn", type: "root", m: "큰" }, { t: "itude", type: "suffix", m: "~정도" }], meaning: "규모, 중요도", difficulty: "medium" },
      { word: "magnificent", parts: [{ t: "magn", type: "root", m: "큰" }, { t: "ificent", type: "suffix", m: "~한" }], meaning: "웅장한", difficulty: "medium" },
      { word: "magnate", parts: [{ t: "magn", type: "root", m: "큰" }, { t: "ate", type: "suffix", m: "~하는 사람" }], meaning: "거물", difficulty: "hard" },
    ],
  },
  {
    root: "mov / mot / mob",
    rootMeaning: "움직이다 (move)",
    words: [
      { word: "motivate", parts: [{ t: "mot", type: "root", m: "움직이다" }, { t: "ivate", type: "suffix", m: "~하게 하다" }], meaning: "동기를 부여하다", difficulty: "easy" },
      { word: "remove", parts: [{ t: "re", type: "prefix", m: "다시" }, { t: "move", type: "root", m: "움직이다" }], meaning: "제거하다", difficulty: "easy" },
      { word: "promote", parts: [{ t: "pro", type: "prefix", m: "앞으로" }, { t: "mote", type: "root", m: "움직이다" }], meaning: "촉진하다, 승진시키다", difficulty: "easy" },
      { word: "mobile", parts: [{ t: "mob", type: "root", m: "움직이다" }, { t: "ile", type: "suffix", m: "~할 수 있는" }], meaning: "이동하는, 휴대용의", difficulty: "easy" },
      { word: "emotion", parts: [{ t: "e", type: "prefix", m: "밖으로" }, { t: "mot", type: "root", m: "움직이다" }, { t: "ion", type: "suffix", m: "~것" }], meaning: "감정", difficulty: "easy" },
    ],
  },
  {
    root: "spir",
    rootMeaning: "숨쉬다 (breathe)",
    words: [
      { word: "inspire", parts: [{ t: "in", type: "prefix", m: "안으로" }, { t: "spire", type: "root", m: "숨쉬다" }], meaning: "영감을 주다", difficulty: "easy" },
      { word: "expire", parts: [{ t: "ex", type: "prefix", m: "밖으로" }, { t: "spire", type: "root", m: "숨쉬다" }], meaning: "만료되다, 숨을 거두다", difficulty: "medium" },
      { word: "conspire", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "spire", type: "root", m: "숨쉬다" }], meaning: "공모하다", difficulty: "medium" },
      { word: "aspire", parts: [{ t: "a", type: "prefix", m: "~쪽으로" }, { t: "spire", type: "root", m: "숨쉬다" }], meaning: "열망하다", difficulty: "medium" },
      { word: "spirit", parts: [{ t: "spir", type: "root", m: "숨쉬다" }, { t: "it", type: "suffix", m: "~것" }], meaning: "정신, 영혼", difficulty: "easy" },
    ],
  },
  {
    root: "struct",
    rootMeaning: "짓다, 세우다 (build)",
    words: [
      { word: "construct", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "struct", type: "root", m: "짓다" }], meaning: "건설하다", difficulty: "easy" },
      { word: "destroy", parts: [{ t: "de", type: "prefix", m: "반대로" }, { t: "stroy", type: "root", m: "짓다" }], meaning: "파괴하다", difficulty: "easy" },
      { word: "instruct", parts: [{ t: "in", type: "prefix", m: "안에" }, { t: "struct", type: "root", m: "짓다" }], meaning: "가르치다, 지시하다", difficulty: "easy" },
      { word: "structure", parts: [{ t: "struct", type: "root", m: "짓다" }, { t: "ure", type: "suffix", m: "~것" }], meaning: "구조", difficulty: "easy" },
      { word: "obstruct", parts: [{ t: "ob", type: "prefix", m: "막아서서" }, { t: "struct", type: "root", m: "짓다" }], meaning: "막다, 방해하다", difficulty: "medium" },
    ],
  },
  {
    root: "tempo / tempor",
    rootMeaning: "시간 (time)",
    words: [
      { word: "temporary", parts: [{ t: "tempor", type: "root", m: "시간" }, { t: "ary", type: "suffix", m: "~적인" }], meaning: "일시적인", difficulty: "easy" },
      { word: "contemporary", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "tempor", type: "root", m: "시간" }, { t: "ary", type: "suffix", m: "~적인" }], meaning: "동시대의", difficulty: "medium" },
      { word: "temporal", parts: [{ t: "tempor", type: "root", m: "시간" }, { t: "al", type: "suffix", m: "~의" }], meaning: "시간의, 속세의", difficulty: "hard" },
      { word: "extemporaneous", parts: [{ t: "ex", type: "prefix", m: "밖으로" }, { t: "tempor", type: "root", m: "시간" }, { t: "aneous", type: "suffix", m: "~한" }], meaning: "즉흥적인", difficulty: "hard" },
    ],
  },
  {
    root: "vac",
    rootMeaning: "비다 (empty)",
    words: [
      { word: "vacant", parts: [{ t: "vac", type: "root", m: "비다" }, { t: "ant", type: "suffix", m: "~한" }], meaning: "비어 있는", difficulty: "easy" },
      { word: "vacuum", parts: [{ t: "vac", type: "root", m: "비다" }, { t: "uum", type: "suffix", m: "~것" }], meaning: "진공", difficulty: "easy" },
      { word: "evacuate", parts: [{ t: "e", type: "prefix", m: "밖으로" }, { t: "vacu", type: "root", m: "비다" }, { t: "ate", type: "suffix", m: "~하게 하다" }], meaning: "대피시키다, 비우다", difficulty: "medium" },
      { word: "vacation", parts: [{ t: "vac", type: "root", m: "비다" }, { t: "ation", type: "suffix", m: "~것" }], meaning: "방학, 휴가", difficulty: "easy" },
    ],
  },
  {
    root: "ven / vent",
    rootMeaning: "오다 (come)",
    words: [
      { word: "convene", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "vene", type: "root", m: "오다" }], meaning: "소집하다, 모이다", difficulty: "medium" },
      { word: "prevent", parts: [{ t: "pre", type: "prefix", m: "미리" }, { t: "vent", type: "root", m: "오다" }], meaning: "막다, 예방하다", difficulty: "easy" },
      { word: "intervene", parts: [{ t: "inter", type: "prefix", m: "사이에" }, { t: "vene", type: "root", m: "오다" }], meaning: "개입하다", difficulty: "medium" },
      { word: "convention", parts: [{ t: "con", type: "prefix", m: "함께" }, { t: "vent", type: "root", m: "오다" }, { t: "ion", type: "suffix", m: "~것" }], meaning: "회의, 관습", difficulty: "medium" },
      { word: "venue", parts: [{ t: "ven", type: "root", m: "오다" }, { t: "ue", type: "suffix", m: "~것" }], meaning: "장소, 개최지", difficulty: "easy" },
    ],
  },
  {
    root: "vinc / vict",
    rootMeaning: "정복하다 (conquer)",
    words: [
      { word: "convince", parts: [{ t: "con", type: "prefix", m: "완전히" }, { t: "vince", type: "root", m: "정복하다" }], meaning: "설득하다", difficulty: "easy" },
      { word: "victory", parts: [{ t: "vict", type: "root", m: "정복하다" }, { t: "ory", type: "suffix", m: "~것" }], meaning: "승리", difficulty: "easy" },
      { word: "invincible", parts: [{ t: "in", type: "prefix", m: "부정" }, { t: "vinc", type: "root", m: "정복하다" }, { t: "ible", type: "suffix", m: "~할 수 있는" }], meaning: "무적의", difficulty: "hard" },
      { word: "convict", parts: [{ t: "con", type: "prefix", m: "완전히" }, { t: "vict", type: "root", m: "정복하다" }], meaning: "유죄를 선고하다, 죄수", difficulty: "medium" },
    ],
  },
  {
    root: "viv / vit",
    rootMeaning: "살다 (live)",
    words: [
      { word: "survive", parts: [{ t: "sur", type: "prefix", m: "넘어서" }, { t: "vive", type: "root", m: "살다" }], meaning: "살아남다", difficulty: "easy" },
      { word: "revive", parts: [{ t: "re", type: "prefix", m: "다시" }, { t: "vive", type: "root", m: "살다" }], meaning: "소생시키다", difficulty: "medium" },
      { word: "vivid", parts: [{ t: "viv", type: "root", m: "살다" }, { t: "id", type: "suffix", m: "~한" }], meaning: "생생한", difficulty: "easy" },
      { word: "vital", parts: [{ t: "vit", type: "root", m: "살다" }, { t: "al", type: "suffix", m: "~의" }], meaning: "필수적인, 생명의", difficulty: "easy" },
    ],
  },
];
