/* ============================================================
   learning.js — 互动式学习模块
   · 单词记忆 (flashcard 翻转)
   · 语法练习 (多选 + 解释)
   · 口语跟读 (SpeechRecognition + SpeechSynthesis)
   · 听力训练 (SpeechSynthesis 朗读 + 选择题)
   ============================================================ */
(function (global) {
  "use strict";

  // 语种 -> BCP-47 语音标签
  const VOICE_LANG = {
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR"
  };

  const state = {
    lang: "en",          // 当前练习语种
    level: "A1",
    lessonId: null,
    type: "vocab",       // vocab | grammar | speak | listen
    queue: [],           // 当前题目队列
    idx: 0,
    correct: 0,
    total: 0,
    roundXp: 0,
    active: false
  };

  // ---------- 语音合成 (朗读) ----------
  function speak(text, lang) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = VOICE_LANG[lang] || "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  // ---------- 语音识别 (跟读) ----------
  const Recog = (function () {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    return {
      supported: !!SR,
      create(lang) {
        if (!SR) return null;
        const r = new SR();
        r.lang = VOICE_LANG[lang] || "en-US";
        r.interimResults = false;
        r.maxAlternatives = 1;
        return r;
      }
    };
  })();

  // 简易相似度 (基于字符重合)
  function similarity(a, b) {
    a = (a || "").toLowerCase().replace(/[\s.,!?，。！？]/g, "");
    b = (b || "").toLowerCase().replace(/[\s.,!?，。！？]/g, "");
    if (!a || !b) return 0;
    const set = (s) => new Set([...s]);
    const A = set(a), B = set(b);
    let inter = 0;
    A.forEach((c) => { if (B.has(c)) inter++; });
    return inter / Math.max(A.size, B.size);
  }

  // ---------- 数据准备 ----------
  function loadLessonContent(lang, level, lessonId, type) {
    const lesson = Courses.getLesson(lang, level, lessonId);
    if (!lesson) return [];
    const key = type; // vocab/grammar/speak/listen
    return (lesson[key] || []).slice();
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- 渲染主区 ----------
  const el = (sel) => document.querySelector(sel);
  const view = () => el("#view");

  function render(lang, level, lessonId, type) {
    state.lang = lang;
    state.level = level;
    state.lessonId = lessonId;
    state.type = type;

    const queue = loadLessonContent(lang, level, lessonId, type);
    if (!queue.length) {
      view().innerHTML = emptyState();
      return;
    }
    state.queue = shuffle(queue);
    state.idx = 0;
    state.correct = 0;
    state.total = queue.length;
    state.roundXp = 0;
    state.active = true;

    renderStage();
  }

  function emptyState() {
    return `<div class="empty"><div class="e-ico">📚</div>
      <p>${I18n.t("common.empty")}<br>该课此模块暂无内容，请选择其他课程或类型。</p></div>`;
  }

  function header() {
    const lesson = Courses.getLesson(state.lang, state.level, state.lessonId);
    const title = lesson ? lesson.title : "";
    return `
      <div class="section-head">
        <h2 class="section-title">${I18n.t("practice.title")}</h2>
        <p class="section-sub">${I18n.t("practice.sub")} · ${Courses.getLanguage(state.lang).native} · ${title}</p>
      </div>
      <div class="practice-tabs">
        ${["vocab","grammar","speak","listen"].map((t) =>
          `<button class="tab-btn ${state.type===t?'active':''}" data-practice-type="${t}">${I18n.t("practice."+t)}</button>`
        ).join("")}
      </div>`;
  }

  function progressBar() {
    const pct = state.total ? Math.round((state.idx / state.total) * 100) : 0;
    return `
      <div class="practice-bar">
        <div class="progress purple"><span style="width:${pct}%"></span></div>
        <span class="live-xp">+${state.roundXp} XP</span>
      </div>`;
  }

  function renderStage() {
    if (state.idx >= state.total) return renderComplete();

    const root = view();
    let body = "";
    if (state.type === "vocab") body = renderVocab();
    else if (state.type === "grammar") body = renderGrammar();
    else if (state.type === "speak") body = renderSpeak();
    else if (state.type === "listen") body = renderListen();

    root.innerHTML = `${header()}${progressBar()}<div class="practice-stage" id="practiceStage">${body}</div>`;
    bindStage();
  }

  function renderComplete() {
    const acc = state.total ? Math.round((state.correct / state.total) * 100) : 0;
    const root = view();
    root.innerHTML = `
      ${header()}
      <div class="practice-stage" style="text-align:center;padding:60px 20px;">
        <div style="font-size:56px;margin-bottom:14px;">🎉</div>
        <h3 style="font-size:24px;font-weight:800;margin-bottom:8px;">${I18n.t("practice.complete")}</h3>
        <p class="text-dim mb">正确 ${state.correct}/${state.total} · 正确率 ${acc}%</p>
        <p class="text-accent" style="font-size:20px;font-weight:800;margin-bottom:22px;">+${state.roundXp} XP</p>
        <div class="row center">
          <button class="btn btn-ghost" id="practiceAgain">再来一轮</button>
          <button class="btn btn-primary" id="practiceNextTab">换一种练习</button>
        </div>
      </div>`;
    document.getElementById("practiceAgain").onclick = () => render(state.lang, state.level, state.lessonId, state.type);
    document.getElementById("practiceNextTab").onclick = () => {
      const types = ["vocab","grammar","speak","listen"].filter((t) => t !== state.type);
      render(state.lang, state.level, state.lessonId, types[0]);
    };

    // 完成本轮：奖励 XP + 记录
    awardXp();
  }

  // ---------- 单词记忆 ----------
  function renderVocab() {
    const item = state.queue[state.idx];
    return `
      <div class="flashcard" id="flashcard">
        <div class="flashcard-inner">
          <div class="fc-face fc-front">
            <div class="fc-word">${item.word}</div>
            ${item.roman ? `<div class="fc-roman">${item.roman}</div>` : ""}
            <div class="fc-hint">${I18n.t("practice.flip")}</div>
          </div>
          <div class="fc-face fc-back">
            <div class="fc-meaning">${item.meaning}</div>
            ${item.example ? `<div class="fc-example">"${item.example}"</div>` : ""}
            <button class="btn btn-accent btn-sm mt" id="speakVocab">🔊 朗读</button>
          </div>
        </div>
      </div>
      <div class="practice-footer">
        <span class="small text-mute">${state.idx + 1} / ${state.total}</span>
        <button class="btn btn-primary" id="vocabNext">${I18n.t("practice.next")} →</button>
      </div>`;
  }

  // ---------- 语法练习 ----------
  function renderGrammar() {
    const item = state.queue[state.idx];
    return `
      <div style="max-width:480px;margin:0 auto;">
        <div class="choice-q">${item.q}</div>
        <div class="choices" id="choices">
          ${item.choices.map((c, i) => `<button class="choice" data-i="${i}">${c}</button>`).join("")}
        </div>
        <div id="grammarFeedback"></div>
      </div>
      <div class="practice-footer">
        <span class="small text-mute">${state.idx + 1} / ${state.total}</span>
        <button class="btn btn-primary" id="grammarNext" disabled>${I18n.t("practice.next")} →</button>
      </div>`;
  }

  // ---------- 口语跟读 ----------
  function renderSpeak() {
    const item = state.queue[state.idx];
    const supported = Recog.supported;
    return `
      <div class="speak-stage">
        <div class="speak-word">${item.word}</div>
        ${item.roman ? `<div class="speak-roman">${item.roman}</div>` : `<div class="speak-roman">${item.meaning}</div>`}
        <div class="speak-controls">
          <button class="btn btn-ghost btn-sm" id="speakDemo">🔊 听标准</button>
          <button class="mic-btn" id="micBtn" title="按住说话">🎙</button>
        </div>
        <div class="speak-result" id="speakResult" hidden></div>
        ${!supported ? `<p class="small text-mute mt">⚠️ 当前浏览器不支持语音识别，请使用 Chrome。可点击"听标准"练习。</p>` : ""}
      </div>
      <div class="practice-footer">
        <span class="small text-mute">${state.idx + 1} / ${state.total}</span>
        <button class="btn btn-primary" id="speakNext">${I18n.t("practice.next")} →</button>
      </div>`;
  }

  // ---------- 听力训练 ----------
  function renderListen() {
    const item = state.queue[state.idx];
    const bars = Array.from({length: 18}, () => `<div class="bar" style="height:${8+Math.random()*24}px"></div>`).join("");
    return `
      <div style="max-width:480px;margin:0 auto;">
        <div class="listen-audio-bar">
          <button class="play-btn" id="listenPlay">▶</button>
          <div class="waveform">${bars}</div>
        </div>
        <div class="choice-q" style="font-size:17px;text-align:center;">${item.question}</div>
        <div class="choices" id="choices">
          ${item.choices.map((c, i) => `<button class="choice" data-i="${i}">${c}</button>`).join("")}
        </div>
        <div id="listenFeedback"></div>
      </div>
      <div class="practice-footer">
        <span class="small text-mute">${state.idx + 1} / ${state.total}</span>
        <button class="btn btn-primary" id="listenNext" disabled>${I18n.t("practice.next")} →</button>
      </div>`;
  }

  // ---------- 事件绑定 ----------
  function bindStage() {
    // tab 切换
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.onclick = () => render(state.lang, state.level, state.lessonId, b.dataset.practiceType);
    });

    if (state.type === "vocab") bindVocab();
    else if (state.type === "grammar") bindGrammar();
    else if (state.type === "speak") bindSpeak();
    else if (state.type === "listen") bindListen();
  }

  function bindVocab() {
    const card = document.getElementById("flashcard");
    card.onclick = () => card.classList.toggle("flipped");
    const speakBtn = document.getElementById("speakVocab");
    if (speakBtn) speakBtn.onclick = (e) => { e.stopPropagation(); speak(state.queue[state.idx].word, state.lang); };
    document.getElementById("vocabNext").onclick = () => {
      // 记单词记一次 = 看过
      state.idx++;
      state.correct++;
      state.roundXp += 5;
      renderStage();
    };
  }

  function bindGrammar() {
    const item = state.queue[state.idx];
    const choices = document.querySelectorAll("#choices .choice");
    let answered = false;
    choices.forEach((c) => {
      c.onclick = () => {
        if (answered) return;
        answered = true;
        const i = +c.dataset.i;
        choices.forEach((cc, j) => {
          cc.disabled = true;
          if (j === item.answer) cc.classList.add("correct");
          else if (j === i) cc.classList.add("wrong");
        });
        const ok = (i === item.answer);
        if (ok) { state.correct++; state.roundXp += 10; }
        const fb = document.getElementById("grammarFeedback");
        fb.innerHTML = `<div class="feedback ${ok?'good':'bad'}">${ok?'✓ 正确':'✗ 正确答案：'+item.choices[item.answer]}<br><span class="small">${item.explain||''}</span></div>`;
        document.getElementById("grammarNext").disabled = false;
      };
    });
    document.getElementById("grammarNext").onclick = () => { state.idx++; renderStage(); };
  }

  function bindSpeak() {
    document.getElementById("speakDemo").onclick = () => speak(state.queue[state.idx].word, state.lang);
    const mic = document.getElementById("micBtn");
    const next = document.getElementById("speakNext");

    if (!Recog.supported) {
      mic.style.opacity = 0.4;
      mic.onclick = () => toast("当前浏览器不支持语音识别", "error");
      next.onclick = () => { state.idx++; state.roundXp += 5; renderStage(); };
      return;
    }

    let recog = null;
    mic.onclick = () => {
      if (mic.classList.contains("recording")) return;
      const target = state.queue[state.idx].word;
      recog = Recog.create(state.lang);
      mic.classList.add("recording");
      recog.onresult = (ev) => {
        const heard = ev.results[0][0].transcript;
        const sim = similarity(heard, target);
        const pass = sim >= 0.6;
        const box = document.getElementById("speakResult");
        box.hidden = false;
        box.innerHTML = `<div>你说了：<b>${heard}</b></div>
          <div class="small text-mute">相似度 ${Math.round(sim*100)}%</div>
          <div class="feedback ${pass?'good':'bad'}" style="margin-top:10px;">${pass?'✓ 发音不错！':'再试一次，目标：'+target}</div>`;
        if (pass) { state.correct++; state.roundXp += 15; }
      };
      recog.onerror = () => { toast("识别失败，请检查麦克风权限", "error"); };
      recog.onend = () => { mic.classList.remove("recording"); };
      try { recog.start(); } catch(e){ mic.classList.remove("recording"); }
    };

    next.onclick = () => { if (recog) try{ recog.stop(); }catch(e){} state.idx++; renderStage(); };
  }

  function bindListen() {
    const item = state.queue[state.idx];
    document.getElementById("listenPlay").onclick = () => speak(item.audio, state.lang);
    // 自动播放一次
    setTimeout(() => speak(item.audio, state.lang), 300);

    const choices = document.querySelectorAll("#choices .choice");
    let answered = false;
    choices.forEach((c) => {
      c.onclick = () => {
        if (answered) return;
        answered = true;
        const i = +c.dataset.i;
        choices.forEach((cc, j) => {
          cc.disabled = true;
          if (j === item.answer) cc.classList.add("correct");
          else if (j === i) cc.classList.add("wrong");
        });
        const ok = (i === item.answer);
        if (ok) { state.correct++; state.roundXp += 12; }
        const fb = document.getElementById("listenFeedback");
        fb.innerHTML = `<div class="feedback ${ok?'good':'bad'}">${ok?'✓ 正确':'✗ 正确答案：'+item.choices[item.answer]}</div>`;
        document.getElementById("listenNext").disabled = false;
      };
    });
    document.getElementById("listenNext").onclick = () => { state.idx++; renderStage(); };
  }

  // ---------- 奖励 XP + 进度 ----------
  function awardXp() {
    if (!state.roundXp) return;
    const user = Auth.currentUser;
    if (!user) return;
    const prog = Store.getUserProgress(user.id);
    prog.xp += state.roundXp;
    prog.langXp[state.lang] = (prog.langXp[state.lang] || 0) + state.roundXp;
    // 模块正确率统计
    const ms = prog.moduleStats[state.type] || { c: 0, t: 0 };
    ms.t += state.total;
    ms.c += state.correct;
    prog.moduleStats[state.type] = ms;

    // 连续打卡
    const today = new Date().toDateString();
    if (prog.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 864e5).toDateString();
      prog.streak = (prog.lastActiveDate === yesterday) ? prog.streak + 1 : 1;
      prog.lastActiveDate = today;
    }

    Store.saveUserProgress(user.id, prog);

    // 更新用户侧栏
    if (global.App && App.renderUserChip) App.renderUserChip();
    // 成就检测
    if (global.Achievements && Achievements.check) Achievements.check();
    toast(`+${state.roundXp} XP · ${I18n.t("toast.xp.gain")}`, "success");
  }

  function toast(msg, type) {
    if (global.App && App.toast) App.toast(msg, type);
  }

  const Learning = {
    state,
    render,
    speak,
    awardXp
  };

  global.Learning = Learning;
})(window);
