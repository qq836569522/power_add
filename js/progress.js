/* ============================================================
   progress.js — 学习进度追踪
   统计: XP · 连续打卡 · 完成课程数 · 各模块正确率 · 各语种进度
   ============================================================ */
(function (global) {
  "use strict";

  const el = (s) => document.querySelector(s);

  function getUserProgress() {
    const user = Auth.currentUser;
    if (!user) return null;
    return Store.getUserProgress(user.id);
  }

  function lessonDone(prog, lessonKey) {
    return prog.lessons[lessonKey] && prog.lessons[lessonKey].done;
  }
  function countDoneLessons(prog) {
    return Object.values(prog.lessons).filter((l) => l.done).length;
  }
  function accuracy(prog) {
    const ms = prog.moduleStats;
    let c = 0, t = 0;
    Object.values(ms).forEach((m) => { c += m.c; t += m.t; });
    return t ? Math.round((c / t) * 100) : 0;
  }
  function langProgressPct(prog, lang) {
    const total = Courses.countLessons(lang);
    if (!total) return 0;
    let done = 0;
    Courses.getAllLessons(lang).forEach((ls) => {
      if (lessonDone(prog, ls.id)) done++;
    });
    return Math.round((done / total) * 100);
  }

  // 记录课程完成（外部调用）
  function markLessonDone(lang, level, lessonId, score) {
    const user = Auth.currentUser;
    if (!user) return;
    const prog = Store.getUserProgress(user.id);
    const key = lessonId;
    const prev = prog.lessons[key] || { done: false, bestScore: 0, attempts: 0 };
    prev.attempts += 1;
    prev.bestScore = Math.max(prev.bestScore, score || 0);
    prev.done = true;
    prog.lessons[key] = prev;
    Store.saveUserProgress(user.id, prog);
  }

  function render() {
    const view = el("#view");
    const prog = getUserProgress();
    if (!prog) {
      view.innerHTML = needLoginView();
      return;
    }

    const totalLessonsAll = Courses.LANGUAGES.reduce((s, l) => s + Courses.countLessons(l.code), 0);
    const doneAll = countDoneLessons(prog);
    const acc = accuracy(prog);
    const xp = prog.xp;
    const streak = prog.streak;

    const langCards = Courses.LANGUAGES.map((l) => {
      const pct = langProgressPct(prog, l.code);
      const doneLessons = Courses.getAllLessons(l.code).filter((ls) => lessonDone(prog, ls.id)).length;
      const total = Courses.countLessons(l.code);
      return `
        <div class="card">
          <div class="row between mb">
            <strong>${l.name} · ${l.native}</strong>
            <span class="tag accent">${pct}%</span>
          </div>
          <div class="progress ${l.code==='en'?'purple':(l.code==='ko'?'':'pink')}"><span style="width:${pct}%"></span></div>
          <p class="small text-mute mt-sm">${doneLessons} / ${total} ${I18n.t("course.lessons")} · ${prog.langXp[l.code]||0} XP</p>
        </div>`;
    }).join("");

    const moduleStats = ["vocab","grammar","speak","listen"].map((t) => {
      const m = prog.moduleStats[t] || { c: 0, t: 0 };
      const accT = m.t ? Math.round((m.c/m.t)*100) : 0;
      return `<div class="stat-card card">
        <div class="ico">${({vocab:'📖',grammar:'🔤',speak:'🎙',listen:'👂'})[t]}</div>
        <div>
          <div class="num">${accT}%</div>
          <div class="lbl">${I18n.t("practice."+t)}</div>
        </div>
        <div class="small text-mute" style="margin-left:auto;">${m.c}/${m.t}</div>
      </div>`;
    }).join("");

    view.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">${I18n.t("progress.title")}</h2>
        <p class="section-sub">${I18n.t("progress.sub")}</p>
      </div>

      <div class="grid grid-4 mb">
        <div class="stat-card card">
          <div class="ico" style="background:var(--grad-2);color:#06231f;">⚡</div>
          <div><div class="num">${xp}</div><div class="lbl">${I18n.t("progress.xp")}</div></div>
        </div>
        <div class="stat-card card">
          <div class="ico" style="background:var(--grad-3);">🔥</div>
          <div><div class="num">${streak}</div><div class="lbl">${I18n.t("progress.streak")}</div></div>
        </div>
        <div class="stat-card card">
          <div class="ico" style="background:var(--grad-1);">✅</div>
          <div><div class="num">${doneAll}</div><div class="lbl">${I18n.t("progress.lessons")}</div></div>
        </div>
        <div class="stat-card card">
          <div class="ico" style="background:linear-gradient(135deg,#00b894,#55efc4);color:#06231f;">🎯</div>
          <div><div class="num">${acc}%</div><div class="lbl">${I18n.t("progress.accuracy")}</div></div>
        </div>
      </div>

      <h3 class="section-sub mb" style="color:var(--text);font-size:18px;font-weight:700;">${I18n.t("progress.byLang")}</h3>
      <div class="grid grid-3 mb">${langCards}</div>

      <h3 class="section-sub mb" style="color:var(--text);font-size:18px;font-weight:700;">各模块表现</h3>
      <div class="grid grid-2">${moduleStats}</div>

      <p class="small text-mute mt-lg" style="text-align:center;">总课程 ${doneAll}/${totalLessonsAll} · 坚持每日打卡，连续 ${streak} 天 🔥</p>
    `;
  }

  function needLoginView() {
    return `<div class="empty"><div class="e-ico">📊</div>
      <p>${I18n.t("toast.needLogin")}</p>
      <button class="btn btn-primary mt" onclick="App.openAuth()">${I18n.t("auth.login")}</button></div>`;
  }

  const Progress = {
    render,
    markLessonDone,
    getUserProgress,
    countDoneLessons,
    accuracy,
    langProgressPct,
    lessonDone
  };

  global.Progress = Progress;
})(window);
