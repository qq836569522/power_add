/* ============================================================
   app.js — 主控制器
   路由 / 视图渲染 / 认证弹窗 / Toast / 全局状态
   ============================================================ */
(function (global) {
  "use strict";

  const el = (s) => document.querySelector(s);
  const $ = (id) => document.getElementById(id);

  const VIEWS = ["home", "dashboard", "courses", "practice", "progress", "path", "community"];

  const App = {
    currentView: "home",
    // 课程体系内部状态
    courseState: { lang: null, level: null },

    init() {
      Auth.init();
      this.bindNav();
      this.bindAuth();
      this.bindLangSwitch();
      I18n.apply();
      this.renderUserChip();
      this.go(this.currentView);
    },

    // ---------- 导航 ----------
    bindNav() {
      document.querySelectorAll("[data-nav]").forEach((a) => {
        a.onclick = (e) => { e.preventDefault(); this.go(a.dataset.nav); };
      });
    },
    go(view) {
      if (!VIEWS.includes(view)) view = "home";
      this.currentView = view;
      // 高亮导航
      document.querySelectorAll(".nav-link").forEach((n) => {
        n.classList.toggle("active", n.dataset.nav === view);
      });
      const map = {
        home: () => this.renderHome(),
        dashboard: () => this.renderDashboard(),
        courses: () => this.renderCourses(),
        practice: () => this.renderPractice(),
        progress: () => Progress.render(),
        path: () => Recommend.render(),
        community: () => Community.render()
      };
      (map[view] || map.home)();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // ---------- 认证 ----------
    bindAuth() {
      $("authBtn").onclick = () => this.openAuth();
      $("logoutBtn").onclick = () => {
        Auth.logout();
        this.renderUserChip();
        this.toast(I18n.t("toast.logout"), "info");
        this.go("home");
      };
      $("modalOverlay").onclick = (e) => {
        if (e.target.id === "modalOverlay") this.closeAuth();
      };
    },
    openAuth(mode) {
      this.showAuthModal(mode === "register" ? "register" : "login");
    },
    showAuthModal(mode) {
      const isReg = mode === "register";
      const m = $("modal");
      m.innerHTML = `
        <div class="modal-head">
          <span class="modal-title">${isReg ? I18n.t("auth.regT") : I18n.t("auth.loginT")}</span>
          <button class="modal-close" id="modalClose">×</button>
        </div>
        <p class="text-dim small mb">${I18n.t("auth.welcome")}</p>
        <form class="auth-form" id="authForm">
          ${isReg ? `<div class="field">
            <label>${I18n.t("auth.name")}</label>
            <input type="text" id="authName" autocomplete="name" required />
            <span class="err" id="errName"></span>
          </div>` : ""}
          <div class="field">
            <label>${I18n.t("auth.email")}</label>
            <input type="email" id="authEmail" autocomplete="email" required />
            <span class="err" id="errEmail"></span>
          </div>
          <div class="field">
            <label>${I18n.t("auth.pwd")}</label>
            <input type="password" id="authPwd" autocomplete="current-password" required />
            <span class="err" id="errPwd"></span>
          </div>
          <button type="submit" class="btn btn-primary btn-block">
            ${isReg ? I18n.t("auth.submit.reg") : I18n.t("auth.submit.login")}
          </button>
        </form>
        <p class="form-switch">
          <a id="switchMode">${isReg ? I18n.t("auth.toLogin") : I18n.t("auth.toReg")}</a>
        </p>`;
      $("modalOverlay").hidden = false;

      $("modalClose").onclick = () => this.closeAuth();
      $("switchMode").onclick = () => this.showAuthModal(isReg ? "login" : "register");
      $("authForm").onsubmit = (e) => {
        e.preventDefault();
        this.handleAuth(isReg ? "register" : "login");
      };
    },
    closeAuth() { $("modalOverlay").hidden = true; },
    handleAuth(mode) {
      const get = (id) => $(id).value.trim();
      const data = {
        name: $("authName") ? get("authName") : undefined,
        email: get("authEmail"),
        password: get("authPwd")
      };
      const res = mode === "register" ? Auth.register(data) : Auth.login(data);
      if (!res.ok) {
        // 显示错误到对应字段
        const err = res.error || "操作失败";
        if (/邮箱|账户|注册/.test(err)) $("errEmail").textContent = err;
        else if (/密码/.test(err)) $("errPwd").textContent = err;
        else if (/昵称|名字/.test(err)) $("errName").textContent = err;
        else this.toast(err, "error");
        return;
      }
      this.closeAuth();
      this.renderUserChip();
      this.toast(mode === "register" ? I18n.t("toast.reg.ok") : I18n.t("toast.login.ok"), "success");
      if (mode === "register") {
        // 新用户引导到课程
        this.go("courses");
      } else {
        this.go("dashboard");
      }
    },

    renderUserChip() {
      const chip = $("userChip");
      const btn = $("authBtn");
      if (Auth.isLoggedIn()) {
        const u = Auth.currentUser;
        const prog = Store.getUserProgress(u.id);
        chip.hidden = false;
        btn.hidden = true;
        $("userAvatar").textContent = u.avatar;
        $("userName").textContent = u.name;
        $("userXp").textContent = prog.xp;
      } else {
        chip.hidden = true;
        btn.hidden = false;
      }
    },

    // ---------- 界面语言切换 ----------
    bindLangSwitch() {
      const btns = document.querySelectorAll(".lang-btn");
      const sync = () => btns.forEach((b) => b.classList.toggle("active", b.dataset.lang === I18n.get()));
      sync();
      btns.forEach((b) => {
        b.onclick = () => {
          I18n.set(b.dataset.lang);
          sync();
          this.toast(I18n.get() === "zh" ? "已切换为中文" : "Switched to English", "info");
          this.go(this.currentView);
        };
      });
    },

    // ---------- 首页 ----------
    renderHome() {
      const view = el("#view");
      view.innerHTML = `
        <section class="hero">
          <div class="hero-content">
            <span class="hero-badge">✨ ${I18n.t("hero.badge")}</span>
            <h1>${I18n.t("hero.title1")} <span class="grad">${I18n.t("hero.title2")}</span></h1>
            <p>${I18n.t("hero.desc")}</p>
            <div class="hero-cta">
              <button class="btn btn-primary" id="heroPrimary">
                ${Auth.isLoggedIn() ? I18n.t("hero.cta.explore") : I18n.t("hero.cta.start")}
              </button>
              <button class="btn btn-ghost" id="heroExplore">${I18n.t("hero.cta.explore")}</button>
            </div>
            <div class="hero-stats">
              <div class="hero-stat"><div class="num">3</div><div class="lbl">${I18n.t("hero.stat.langs")}</div></div>
              <div class="hero-stat"><div class="num">5</div><div class="lbl">${I18n.t("hero.stat.levels")}</div></div>
              <div class="hero-stat"><div class="num">${this.totalLessons()}</div><div class="lbl">${I18n.t("hero.stat.lessons")}</div></div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="globe"></div>
            <div class="lang-orb en">EN</div>
            <div class="lang-orb jp">JP</div>
            <div class="lang-orb ko">KO</div>
          </div>
        </section>

        <div class="section-head mt-lg">
          <h2 class="section-title">${I18n.t("features.title")}</h2>
          <p class="section-sub">${I18n.t("features.sub")}</p>
        </div>
        <div class="grid grid-3">
          <div class="card feature">
            <div class="ico">📊</div>
            <div class="card-title">${I18n.t("feat.graded")}</div>
            <div class="card-text">${I18n.t("feat.graded.d")}</div>
          </div>
          <div class="card feature f2">
            <div class="ico">🎮</div>
            <div class="card-title">${I18n.t("feat.interactive")}</div>
            <div class="card-text">${I18n.t("feat.interactive.d")}</div>
          </div>
          <div class="card feature f3">
            <div class="ico">📈</div>
            <div class="card-title">${I18n.t("feat.progress")}</div>
            <div class="card-text">${I18n.t("feat.progress.d")}</div>
          </div>
          <div class="card feature f4">
            <div class="ico">🔐</div>
            <div class="card-title">${I18n.t("feat.auth")}</div>
            <div class="card-text">${I18n.t("feat.auth.d")}</div>
          </div>
          <div class="card feature f5">
            <div class="ico">🧭</div>
            <div class="card-title">${I18n.t("feat.path")}</div>
            <div class="card-text">${I18n.t("feat.path.d")}</div>
          </div>
          <div class="card feature f6">
            <div class="ico">🏆</div>
            <div class="card-title">${I18n.t("feat.community")}</div>
            <div class="card-text">${I18n.t("feat.community.d")}</div>
          </div>
        </div>

        <div class="section-head mt-lg">
          <h2 class="section-title">${I18n.t("lang.pick")}</h2>
          <p class="section-sub">${I18n.t("lang.sub")}</p>
        </div>
        <div class="grid grid-3">
          ${Courses.LANGUAGES.map((l) => `
            <div class="lang-card ${l.color}" onclick="App.pickLang('${l.code}')">
              <div>
                <div class="flag">${l.flag}</div>
                <div class="lname">${l.name}</div>
                <div class="lnative">${l.native}</div>
              </div>
              <div class="meta">${Courses.countLessons(l.code)} ${I18n.t("course.lessons")} · A1–C1</div>
            </div>
          `).join("")}
        </div>
      `;
      // 绑定 hero 按钮
      const hp = $("heroPrimary");
      if (hp) hp.onclick = () => Auth.isLoggedIn() ? this.go("courses") : this.openAuth();
      const he = $("heroExplore");
      if (he) he.onclick = () => this.go("courses");
    },

    pickLang(code) {
      this.courseState.lang = code;
      this.go("courses");
    },

    totalLessons() {
      return Courses.LANGUAGES.reduce((s, l) => s + Courses.countLessons(l.code), 0);
    },

    // ---------- 学习中心 (仪表盘) ----------
    renderDashboard() {
      const view = el("#view");
      if (!Auth.isLoggedIn()) {
        view.innerHTML = this.loginGate();
        return;
      }
      const prog = Store.getUserProgress(Auth.currentUser.id);
      const done = Progress.countDoneLessons(prog);
      const acc = Progress.accuracy(prog);

      // 各语种进度小结
      const langSummary = Courses.LANGUAGES.map((l) => {
        const pct = Progress.langProgressPct(prog, l.code);
        return `<div class="card">
          <div class="row between mb"><strong>${l.name}</strong><span class="tag accent">${pct}%</span></div>
          <div class="progress ${l.code==='en'?'purple':(l.code==='ko'?'':'pink')}"><span style="width:${pct}%"></span></div>
        </div>`;
      }).join("");

      view.innerHTML = `
        <div class="section-head">
          <h2 class="section-title">${I18n.t("nav.dashboard")}</h2>
          <p class="section-sub">欢迎回来，${Auth.currentUser.name} 👋</p>
        </div>
        <div class="grid grid-4 mb">
          <div class="stat-card card"><div class="ico" style="background:var(--grad-2);color:#06231f;">⚡</div><div><div class="num">${prog.xp}</div><div class="lbl">${I18n.t("progress.xp")}</div></div></div>
          <div class="stat-card card"><div class="ico" style="background:var(--grad-3);">🔥</div><div><div class="num">${prog.streak}</div><div class="lbl">${I18n.t("progress.streak")}</div></div></div>
          <div class="stat-card card"><div class="ico" style="background:var(--grad-1);">✅</div><div><div class="num">${done}</div><div class="lbl">${I18n.t("progress.lessons")}</div></div></div>
          <div class="stat-card card"><div class="ico" style="background:linear-gradient(135deg,#00b894,#55efc4);color:#06231f;">🎯</div><div><div class="num">${acc}%</div><div class="lbl">${I18n.t("progress.accuracy")}</div></div></div>
        </div>

        <div class="grid grid-2" style="align-items:start;">
          <div>
            <h3 class="mb" style="font-size:17px;font-weight:700;">快速继续</h3>
            <div id="dashReco"></div>
            <button class="btn btn-primary btn-block mt" onclick="App.go('path')">${I18n.t("nav.path")} →</button>
            <button class="btn btn-ghost btn-block mt-sm" onclick="App.go('practice')">${I18n.t("nav.practice")} →</button>
          </div>
          <div>
            <h3 class="mb" style="font-size:17px;font-weight:700;">${I18n.t("progress.byLang")}</h3>
            <div class="grid" style="gap:10px;">${langSummary}</div>
            <button class="btn btn-accent btn-block mt" onclick="App.go('courses')">${I18n.t("nav.courses")} →</button>
          </div>
        </div>
      `;
      // 渲染推荐前3条
      const reco = Recommend.build();
      const list = el("#dashReco");
      if (reco.needLogin) { list.innerHTML = ""; return; }
      list.innerHTML = reco.items.slice(0, 3).map((it, i) => `
        <div class="reco-card" data-idx="${i}">
          <div class="reco-icon">${it.icon}</div>
          <div style="flex:1;min-width:0;">
            <span class="reco-tag">${it.tag}</span>
            <div style="font-weight:700;margin-top:4px;">${it.title}</div>
            <div class="small text-mute">${it.desc}</div>
          </div>
          <button class="btn btn-ghost btn-sm">→</button>
        </div>
      `).join("");
      list.querySelectorAll(".reco-card").forEach((c) => {
        const idx = +c.dataset.idx;
        c.querySelector("button").onclick = () => reco.items[idx].action();
      });
    },

    loginGate() {
      return `<div class="empty"><div class="e-ico">🔒</div>
        <p>${I18n.t("toast.needLogin")}</p>
        <button class="btn btn-primary mt" onclick="App.openAuth()">${I18n.t("auth.login")}</button></div>`;
    },

    // ---------- 课程体系 ----------
    renderCourses() {
      const view = el("#view");
      const lang = this.courseState.lang;
      const allLangs = Courses.LANGUAGES.map((l) => `
        <button class="level-pill ${lang===l.code?'active':''}" data-langcode="${l.code}">
          ${l.flag} ${l.name}
        </button>
      `).join("");

      view.innerHTML = `
        <div class="section-head">
          <h2 class="section-title">${I18n.t("course.title")}</h2>
          <p class="section-sub">${I18n.t("lang.sub")}</p>
        </div>
        <div class="level-track">${allLangs}</div>
        <div id="courseBody"></div>
      `;

      view.querySelectorAll("[data-langcode]").forEach((b) => {
        b.onclick = () => { this.courseState.lang = b.dataset.langcode; this.courseState.level = null; this.renderCourses(); };
      });

      this.renderCourseBody();
    },

    renderCourseBody() {
      const body = el("#courseBody");
      const lang = this.courseState.lang;
      if (!lang) {
        body.innerHTML = `<div class="empty"><div class="e-ico">🌐</div><p>${I18n.t("course.pickLang")}</p></div>`;
        return;
      }
      const langObj = Courses.getLanguage(lang);
      // 等级选择
      const levels = Courses.LEVELS.map((lv) => {
        const data = Courses.getLevelData(lang, lv.code);
        const hasContent = data && data.lessons.length;
        return `<button class="level-pill ${this.courseState.level===lv.code?'active':''} ${!hasContent?'':''}" data-level="${lv.code}" ${!hasContent?'disabled style="opacity:0.4;cursor:not-allowed"':''}>
          ${lv.code} ${lv.name}
        </button>`;
      }).join("");

      const level = this.courseState.level || (Courses.getLevelData(lang,"A1") && Courses.getLevelData(lang,"A1").lessons.length ? "A1" : null);
      const levelData = level ? Courses.getLevelData(lang, level) : null;

      let lessonsHtml = "";
      if (levelData && levelData.lessons.length) {
        const prog = Auth.isLoggedIn() ? Store.getUserProgress(Auth.currentUser.id) : null;
        lessonsHtml = `<div class="grid" style="gap:10px;">
          ${levelData.lessons.map((ls, i) => {
            const done = prog && Progress.lessonDone(prog, ls.id);
            return `<div class="lesson-item" data-lesson="${ls.id}" data-level="${level}">
              <div class="lesson-num">${i+1}</div>
              <div class="lesson-info">
                <div class="t">${ls.title}</div>
                <div class="d">${ls.desc} · ${ls.vocab.length}词 · ${ls.grammar.length}语法</div>
              </div>
              <span class="lesson-status ${done?'done':''}">${done?'✓':(i===0|| (prog && Progress.lessonDone(prog, levelData.lessons[i-1].id))?'▶':'🔒')}</span>
            </div>`;
          }).join("")}
        </div>`;
      } else {
        lessonsHtml = `<div class="empty"><div class="e-ico">📦</div><p>该等级课程正在制作中，敬请期待</p></div>`;
      }

      body.innerHTML = `
        <div class="level-track">${levels}</div>
        <div class="card mb" style="background:linear-gradient(135deg,rgba(108,92,231,0.14),rgba(0,206,201,0.08));">
          <div class="row between">
            <div>
              <strong style="font-size:17px;">${langObj.name} · ${langObj.native}</strong>
              <p class="small text-mute mt-sm">${level ? Courses.LEVELS.find(l=>l.code===level).desc : ''}</p>
            </div>
            <span class="tag accent">${Courses.countLessons(lang)} ${I18n.t("course.lessons")}</span>
          </div>
        </div>
        ${lessonsHtml}
      `;

      body.querySelectorAll("[data-level]").forEach((b) => {
        b.onclick = () => { if (!b.disabled) { this.courseState.level = b.dataset.level; this.renderCourseBody(); } };
      });
      body.querySelectorAll(".lesson-item").forEach((li) => {
        li.onclick = () => {
          if (!Auth.isLoggedIn()) { this.openAuth(); return; }
          this.courseState.level = li.dataset.level;
          // 进入该课的单词练习
          Learning.render(lang, li.dataset.level, li.dataset.lesson, "vocab");
          this.currentView = "practice";
          document.querySelectorAll(".nav-link").forEach((n) => n.classList.toggle("active", n.dataset.nav === "practice"));
          window.scrollTo({ top: 0 });
        };
      });
    },

    // ---------- 互动练习入口 ----------
    renderPractice() {
      const view = el("#view");
      if (!Auth.isLoggedIn()) {
        view.innerHTML = this.loginGate();
        return;
      }
      // 选择语种 + 等级 + 课程 + 类型
      const lang = this.courseState.lang || "en";
      const lessons = Courses.getAllLessons(lang);
      if (!lessons.length) {
        view.innerHTML = `<div class="empty"><div class="e-ico">📚</div><p>该语种暂无课程</p></div>`;
        return;
      }
      const prog = Store.getUserProgress(Auth.currentUser.id);
      // 默认选第一个未完成，否则第一个
      let target = lessons.find((ls) => !Progress.lessonDone(prog, ls.id));
      if (!target) target = lessons[0];

      view.innerHTML = `
        <div class="section-head">
          <h2 class="section-title">${I18n.t("practice.title")}</h2>
          <p class="section-sub">${I18n.t("practice.sub")}</p>
        </div>
        <div class="card mb">
          <div class="row between" style="flex-wrap:wrap;gap:10px;">
            <div>
              <select id="prLang" class="lang-pill-select" style="padding:8px 12px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid var(--border-strong);color:var(--text);">
                ${Courses.LANGUAGES.map((l) => `<option value="${l.code}" ${l.code===lang?'selected':''}>${l.name} · ${l.native}</option>`).join("")}
              </select>
              <select id="prLesson" style="padding:8px 12px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid var(--border-strong);color:var(--text);margin-left:8px;">
                ${lessons.map((ls) => `<option value="${ls.id}" data-level="${ls.level}" ${ls.id===target.id?'selected':''}>${ls.level} · ${ls.title}</option>`).join("")}
              </select>
            </div>
            <button class="btn btn-primary" id="prStart">${I18n.t("common.start")} →</button>
          </div>
        </div>
        <div id="practiceArea">
          <div class="empty"><div class="e-ico">🎮</div><p>选择课程后点击"开始"进入沉浸式练习</p></div>
        </div>
      `;
      const langSel = $("prLang");
      const lessonSel = $("prLesson");
      langSel.onchange = () => { this.courseState.lang = langSel.value; this.renderPractice(); };
      $("prStart").onclick = () => {
        const lid = lessonSel.value;
        const opt = lessonSel.options[lessonSel.selectedIndex];
        const level = opt.dataset.level;
        // 默认从单词记忆开始
        Learning.render(langSel.value, level, lid, "vocab");
      };
    },

    // ---------- Toast ----------
    toast(msg, type) {
      type = type || "info";
      const wrap = $("toastWrap");
      const t = document.createElement("div");
      t.className = "toast " + type;
      t.textContent = msg;
      wrap.appendChild(t);
      setTimeout(() => {
        t.style.opacity = "0";
        t.style.transform = "translateX(40px)";
        t.style.transition = "0.3s";
        setTimeout(() => t.remove(), 300);
      }, 3200);
    }
  };

  // 等待 DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => App.init());
  } else {
    App.init();
  }

  global.App = App;
})(window);
