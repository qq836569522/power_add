/* ============================================================
   recommend.js — 个性化学习路径推荐
   策略:
   1) 未选定语种 → 推荐体验入门
   2) 当前语种有未完成课程 → 推荐下一课
   3) 某模块正确率低 → 推荐该模块强化练习
   4) 已完成一阶段 → 推荐升级
   ============================================================ */
(function (global) {
  "use strict";

  const el = (s) => document.querySelector(s);

  function build() {
    const user = Auth.currentUser;
    if (!user) return { needLogin: true, items: [] };

    const prog = Store.getUserProgress(user.id);
    const items = [];

    // 找到每个语种的"下一课"
    Courses.LANGUAGES.forEach((lang) => {
      const lessons = Courses.getAllLessons(lang.code);
      const next = lessons.find((ls) => !Progress.lessonDone(prog, ls.id));
      if (next) {
        // 是否该语种有进度
        const started = lessons.some((ls) => Progress.lessonDone(prog, ls.id));
        const stage = started ? "continue" : "start";
        items.push({
          tag: stage === "start" ? "新语种" : "继续学习",
          title: `${lang.native} · ${next.title}`,
          desc: next.desc + " · " + next.level,
          icon: lang.flag,
          action: () => Learning.render(lang.code, next.level, next.id, "vocab")
        });
      } else if (lessons.length) {
        // 全部完成 → 推荐升级（若更高等级有内容）
        items.push({
          tag: "进阶",
          title: `${lang.native} 当前等级已学完`,
          desc: "复习巩固或等待新课程上线，挑战更高难度练习",
          icon: lang.flag,
          action: () => Learning.render(lang.code, "A1", lessons[0].id, "grammar")
        });
      }
    });

    // 薄弱模块强化
    const weak = findWeakestModule(prog);
    if (weak) {
      // 找当前主语种(进度最高的)的一节课来强化
      const mainLang = mainLanguage(prog) || "en";
      const lessons = Courses.getAllLessons(mainLang);
      if (lessons.length) {
        const target = lessons[0];
        items.unshift({
          tag: "薄弱强化",
          title: `${I18n.t("practice."+weak)} 专项训练`,
          desc: `该模块正确率偏低，建议多做练习巩固 · ${Courses.getLanguage(mainLang).native}`,
          icon: ({vocab:"📖",grammar:"🔤",speak:"🎙",listen:"👂"})[weak],
          action: () => Learning.render(mainLang, target.level, target.id, weak)
        });
      }
    }

    // 下一等级升级提示
    const upgradable = findUpgradeCandidate(prog);
    if (upgradable) {
      items.push({
        tag: "升级建议",
        title: `${Courses.getLanguage(upgradable.lang).native} 升级到 ${upgradable.nextLevel}`,
        desc: `你已完成 ${upgradable.langName} 部分课程，尝试更高难度`,
        icon: "🚀",
        action: () => App.go("courses")
      });
    }

    // 连续打卡激励
    if (prog.streak >= 3) {
      items.push({
        tag: "习惯养成",
        title: `已连续打卡 ${prog.streak} 天 🔥`,
        desc: "坚持就是胜利，今天再完成一次练习吧",
        icon: "⭐",
        action: () => App.go("practice")
      });
    } else {
      items.push({
        tag: "每日目标",
        title: "完成今日 30 XP",
        desc: `今日已得 ${todayXp(prog)} XP，继续加油`,
        icon: "🎯",
        action: () => App.go("practice")
      });
    }

    return { needLogin: false, items };
  }

  function todayXp(prog) {
    // 简化：用当日是否有活动判断
    return prog.lastActiveDate === new Date().toDateString() ? prog.xp % 100 : 0;
  }

  function findWeakestModule(prog) {
    let weakest = null;
    let lowAcc = 1;
    Object.entries(prog.moduleStats).forEach(([k, m]) => {
      if (m.t >= 3) { // 有足够样本
        const acc = m.c / m.t;
        if (acc < 0.75 && acc < lowAcc) { lowAcc = acc; weakest = k; }
      }
    });
    return weakest;
  }

  function mainLanguage(prog) {
    let best = null, max = -1;
    Object.entries(prog.langXp).forEach(([l, xp]) => {
      if (xp > max) { max = xp; best = l; }
    });
    return best;
  }

  function findUpgradeCandidate(prog) {
    for (const lang of Courses.LANGUAGES) {
      const lessons = Courses.getAllLessons(lang.code);
      if (!lessons.length) continue;
      const done = lessons.filter((ls) => Progress.lessonDone(prog, ls.id)).length;
      if (done >= lessons.length * 0.5 && done < lessons.length) {
        // 已过半但未完成，找下一未完成等级
        const levels = Courses.LEVELS;
        for (let i = 0; i < levels.length; i++) {
          const lvData = Courses.getLevelData(lang.code, levels[i].code);
          if (!lvData || !lvData.lessons.length) continue;
          const lvDone = lvData.lessons.every((ls) => Progress.lessonDone(prog, ls.id));
          if (lvDone && i + 1 < levels.length) {
            const nextLv = levels[i + 1];
            const nextData = Courses.getLevelData(lang.code, nextLv.code);
            if (nextData && nextData.lessons.length) {
              return { lang: lang.code, langName: lang.name, nextLevel: nextLv.code, nextName: nextLv.name };
            }
          }
        }
      }
    }
    return null;
  }

  function render() {
    const view = el("#view");
    const { needLogin, items } = build();
    if (needLogin) {
      view.innerHTML = `<div class="empty"><div class="e-ico">🧭</div>
        <p>${I18n.t("toast.needLogin")}</p>
        <button class="btn btn-primary mt" onclick="App.openAuth()">${I18n.t("auth.login")}</button></div>`;
      return;
    }

    if (!items.length) {
      view.innerHTML = `
        <div class="section-head">
          <h2 class="section-title">${I18n.t("path.title")}</h2>
          <p class="section-sub">${I18n.t("path.sub")}</p>
        </div>
        <div class="empty"><div class="e-ico">🧭</div><p>暂无推荐，先去课程体系选择一门语言吧</p>
        <button class="btn btn-primary mt" onclick="App.go('courses')">浏览课程</button></div>`;
      return;
    }

    view.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">${I18n.t("path.title")}</h2>
        <p class="section-sub">${I18n.t("path.sub")}</p>
      </div>
      <div class="grid" style="gap:12px;">
        ${items.map((it, i) => `
          <div class="reco-card" data-idx="${i}">
            <div class="reco-icon">${it.icon}</div>
            <div style="flex:1;min-width:0;">
              <div class="row" style="gap:8px;">
                <span class="reco-tag">${it.tag}</span>
              </div>
              <div style="font-weight:700;margin-top:4px;">${it.title}</div>
              <div class="small text-mute">${it.desc}</div>
            </div>
            <button class="btn btn-primary btn-sm">${I18n.t("common.start")}</button>
          </div>
        `).join("")}
      </div>`;

    view.querySelectorAll(".reco-card").forEach((card) => {
      const idx = +card.dataset.idx;
      card.querySelector("button").onclick = () => items[idx].action();
    });
  }

  const Recommend = { render, build };

  global.Recommend = Recommend;
})(window);
