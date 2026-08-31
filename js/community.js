/* ============================================================
   community.js — 学习社区 + 成就激励系统
   · 社区帖子 (发帖 / 点赞 / 评论数)
   · 成就徽章 (XP/打卡/课程/多语种里程碑)
   · 排行榜 (按 XP)
   ============================================================ */
(function (global) {
  "use strict";

  const el = (s) => document.querySelector(s);

  // 成就定义
  const BADGES = [
    { id: "first_step", name: "初学之路", desc: "完成首次练习", icon: "🌱", cls: "b2", check: (p) => p.xp > 0 },
    { id: "xp_100", name: "百点学者", desc: "累计 100 XP", icon: "⚡", cls: "b2", check: (p) => p.xp >= 100 },
    { id: "xp_500", name: "语言达人", desc: "累计 500 XP", icon: "🏅", cls: "", check: (p) => p.xp >= 500 },
    { id: "streak_3", name: "坚持三天", desc: "连续打卡 3 天", icon: "🔥", cls: "b3", check: (p) => p.streak >= 3 },
    { id: "streak_7", name: "一周不辍", desc: "连续打卡 7 天", icon: "🌟", cls: "b4", check: (p) => p.streak >= 7 },
    { id: "lessons_3", name: "勤奋学员", desc: "完成 3 节课", icon: "📚", cls: "b2", check: (p) => Progress.countDoneLessons(p) >= 3 },
    { id: "lessons_10", name: "课程收割机", desc: "完成 10 节课", icon: "🎓", cls: "", check: (p) => Progress.countDoneLessons(p) >= 10 },
    { id: "bilingual", name: "双语通", desc: "学习 2 种语言", icon: "🌍", cls: "b3", check: (p) => Object.values(p.langXp).filter((x)=>x>0).length >= 2 },
    { id: "trilingual", name: "三语通", desc: "学习 3 种语言", icon: "🌐", cls: "b4", check: (p) => Object.values(p.langXp).filter((x)=>x>0).length >= 3 },
    { id: "speak_50", name: "口齿伶俐", desc: "口语正确 50 次", icon: "🎙", cls: "b3", check: (p) => (p.moduleStats.speak||{}).c >= 50 },
    { id: "listen_50", name: "耳聪目明", desc: "听力正确 50 次", icon: "👂", cls: "b3", check: (p) => (p.moduleStats.listen||{}).c >= 50 }
  ];

  const Achievements = {
    BADGES,
    check() {
      const user = Auth.currentUser;
      if (!user) return [];
      const prog = Store.getUserProgress(user.id);
      const unlocked = Store.getBadges(user.id);
      const newly = [];
      BADGES.forEach((b) => {
        if (!unlocked.includes(b.id) && b.check(prog)) {
          newly.push(b);
          unlocked.push(b.id);
        }
      });
      if (newly.length) {
        Store.saveBadges(user.id, unlocked);
        newly.forEach((b) => toast(`${I18n.t("toast.badge.unlocked")}: ${b.name} ${b.icon}`, "success"));
      }
      return newly;
    },
    list() {
      const user = Auth.currentUser;
      if (!user) return [];
      const prog = Store.getUserProgress(user.id);
      const unlocked = Store.getBadges(user.id);
      return BADGES.map((b) => ({ ...b, unlocked: unlocked.includes(b.id), achieved: b.check(prog) }));
    }
  };

  // ---------- 社区 ----------
  function formatTime(ts) {
    const diff = Date.now() - ts;
    const h = Math.floor(diff / 3600e3);
    if (h < 1) return "刚刚";
    if (h < 24) return h + " 小时前";
    const d = Math.floor(h / 24);
    return d + " 天前";
  }

  function render() {
    const view = el("#view");
    const user = Auth.currentUser;

    const posts = Store.getPosts();
    const postsHtml = posts.map((p) => postCard(p)).join("");

    const badges = Achievements.list();
    const unlockedBadges = badges.filter((b) => b.unlocked);
    const lockedBadges = badges.filter((b) => !b.unlocked);
    const badgesHtml = [...unlockedBadges, ...lockedBadges].map((b) => `
      <div class="badge ${b.cls} ${b.unlocked?'':'locked'}">
        <div class="b-ico">${b.icon}</div>
        <div class="b-name">${b.name}</div>
        <div class="b-desc">${b.desc}</div>
        ${b.unlocked ? '<div class="tag accent mt-sm">已解锁</div>' : '<div class="tag mt-sm">未解锁</div>'}
      </div>
    `).join("");

    const board = buildLeaderboard(user);

    const composer = user ? `
      <div class="post-composer">
        <span class="avatar">${user.avatar}</span>
        <div style="flex:1;">
          <textarea id="postText" placeholder="${I18n.t("community.placeholder")}" maxlength="500"></textarea>
          <div class="composer-actions">
            <button class="btn btn-primary btn-sm" id="postBtn">${I18n.t("community.post")}</button>
          </div>
        </div>
      </div>` : `
      <div class="card mb" style="text-align:center;">
        <p class="text-dim">${I18n.t("toast.needLogin")}</p>
        <button class="btn btn-primary btn-sm mt" onclick="App.openAuth()">${I18n.t("auth.login")}</button>
      </div>`;

    view.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">${I18n.t("community.title")}</h2>
        <p class="section-sub">${I18n.t("community.sub")}</p>
      </div>

      <div class="grid grid-2" style="align-items:start;">
        <div>
          ${composer}
          <div id="postList">${postsHtml}</div>
        </div>
        <div>
          <h3 class="mb" style="font-size:17px;font-weight:700;">${I18n.t("lb.title")}</h3>
          <div id="leaderboard" class="mb">${board}</div>

          <h3 class="mb mt-lg" style="font-size:17px;font-weight:700;">${I18n.t("ach.title")}</h3>
          <p class="small text-mute mb">${I18n.t("ach.sub")} · 已解锁 ${unlockedBadges.length}/${badges.length}</p>
          <div class="grid grid-3" style="gap:12px;">${badgesHtml}</div>
        </div>
      </div>
    `;

    bind();
  }

  function postCard(p) {
    return `
      <div class="post" data-id="${p.id}">
        <div class="post-head">
          <span class="avatar">${p.avatar}</span>
          <div>
            <div class="post-author">${p.author}</div>
            <div class="post-time">${formatTime(p.time)}</div>
          </div>
        </div>
        <div class="post-body">${escapeHtml(p.body)}</div>
        <div class="post-actions">
          <button class="post-action ${p.liked?'liked':''}" data-act="like">${p.liked?'❤️':'🤍'} ${I18n.t("community.like")} · <span class="like-n">${p.likes}</span></button>
          <button class="post-action" data-act="reply">💬 ${I18n.t("community.reply")} · ${p.replies}</button>
        </div>
      </div>`;
  }

  function buildLeaderboard(currentUser) {
    // 从所有用户进度生成
    const users = Store.getUsers();
    const rows = users.map((u) => {
      const prog = Store.getUserProgress(u.id);
      return { name: u.name, avatar: u.avatar, xp: prog.xp, self: currentUser && u.id === currentUser.id };
    });
    // 加几位虚拟榜主保证有内容
    const seed = [
      { name: "Luna", avatar: "L", xp: 1280 },
      { name: "Hiro", avatar: "H", xp: 960 },
      { name: "소라", avatar: "S", xp: 720 }
    ];
    seed.forEach((s) => { if (!rows.find((r) => r.name === s.name)) rows.push(s); });
    rows.sort((a, b) => b.xp - a.xp);
    const top = rows.slice(0, 8);
    return top.map((r, i) => {
      const rk = i + 1;
      const cls = rk <= 3 ? `r${rk}` : "";
      return `<div class="leaderboard-row" style="${r.self?'border-color:var(--primary);background:rgba(108,92,231,0.12);':''}">
        <span class="lb-rank ${cls}">${rk}</span>
        <span class="avatar" style="width:30px;height:30px;font-size:13px;">${r.avatar}</span>
        <span class="lb-name">${r.name}${r.self?' (你)':''}</span>
        <span class="lb-xp">${r.xp} XP</span>
      </div>`;
    }).join("");
  }

  function bind() {
    const btn = document.getElementById("postBtn");
    if (btn) btn.onclick = () => {
      const ta = document.getElementById("postText");
      const text = ta.value.trim();
      if (!text) { toast("请输入内容", "error"); return; }
      const user = Auth.currentUser;
      const posts = Store.getPosts();
      posts.unshift({
        id: "p" + Date.now(),
        author: user.name,
        avatar: user.avatar,
        body: text,
        time: Date.now(),
        likes: 0, liked: false, replies: 0
      });
      Store.savePosts(posts);
      toast("发布成功 +5 XP", "success");
      // 发帖奖励
      const prog = Store.getUserProgress(user.id);
      prog.xp += 5;
      Store.saveUserProgress(user.id, prog);
      if (global.App && App.renderUserChip) App.renderUserChip();
      Achievements.check();
      render();
    };

    document.querySelectorAll(".post").forEach((card) => {
      const id = card.dataset.id;
      card.querySelector('[data-act="like"]').onclick = () => {
        if (!Auth.currentUser) { App.openAuth(); return; }
        const posts = Store.getPosts();
        const p = posts.find((x) => x.id === id);
        if (!p) return;
        p.liked = !p.liked;
        p.likes += p.liked ? 1 : -1;
        Store.savePosts(posts);
        render();
      };
      card.querySelector('[data-act="reply"]').onclick = () => {
        toast("评论功能即将上线，先给帖子点个赞吧 💬", "info");
      };
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function toast(msg, type) {
    if (global.App && App.toast) App.toast(msg, type);
  }

  global.Achievements = Achievements;
  global.Community = { render };
})(window);
