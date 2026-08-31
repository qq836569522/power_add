/* ============================================================
   store.js — 本地数据持久化层 (localStorage 封装)
   ============================================================ */
(function (global) {
  "use strict";

  const KEYS = {
    users: "lv_users",
    session: "lv_session",
    progress: "lv_progress",   // { userId: { ... } }
    posts: "lv_posts",
    badges: "lv_badges"        // { userId: [badgeId,...] }
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("storage write failed", e);
    }
  }

  // ---- 用户 ----
  function getUsers() { return read(KEYS.users, []); }
  function saveUsers(u) { write(KEYS.users, u); }

  function findUserByEmail(email) {
    return getUsers().find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  }
  function findUserById(id) {
    return getUsers().find((u) => u.id === id);
  }
  function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
  }
  function updateUser(id, patch) {
    const users = getUsers();
    const i = users.findIndex((u) => u.id === id);
    if (i >= 0) {
      users[i] = { ...users[i], ...patch };
      saveUsers(users);
      return users[i];
    }
    return null;
  }

  // ---- 会话 ----
  function getSession() { return read(KEYS.session, null); }
  function setSession(userId) { write(KEYS.session, { userId, at: Date.now() }); }
  function clearSession() { localStorage.removeItem(KEYS.session); }

  // ---- 学习进度 (per user) ----
  function getAllProgress() { return read(KEYS.progress, {}); }
  function getUserProgress(userId) {
    const all = getAllProgress();
    if (!all[userId]) {
      all[userId] = {
        xp: 0,
        streak: 0,
        lastActiveDate: null,
        lessons: {},          // { lessonKey: { done, bestScore, attempts } }
        moduleStats: {        // 各模块正确次数 / 总次数
          vocab: { c: 0, t: 0 },
          grammar: { c: 0, t: 0 },
          speak: { c: 0, t: 0 },
          listen: { c: 0, t: 0 }
        },
        langXp: { en: 0, ja: 0, ko: 0 },
        goals: { lang: null, level: null, target: 30 } // 每日目标XP
      };
      write(KEYS.progress, all);
    }
    return all[userId];
  }
  function saveUserProgress(userId, progress) {
    const all = getAllProgress();
    all[userId] = progress;
    write(KEYS.progress, all);
  }

  // ---- 社区帖子 ----
  function getPosts() {
    const posts = read(KEYS.posts, null);
    if (posts) return posts;
    // 默认示例帖
    const seed = [
      { id: "p1", author: "Yuki", avatar: "Y", body: "今天用口语跟读练了 30 分钟，感觉发音清晰多了！大家有什么练口语的技巧吗？", time: Date.now() - 3600e3 * 5, likes: 12, liked: false, replies: 3 },
      { id: "p2", author: "Alex", avatar: "A", body: "日语 N3 的语法练习好难…助词总是搞混。坚持每天打卡，共勉！", time: Date.now() - 3600e3 * 26, likes: 8, liked: false, replies: 1 },
      { id: "p3", author: "민지", avatar: "M", body: "韩语初学者报到！한국어 너무 재미있어요. 다 같이 화이팅!", time: Date.now() - 3600e3 * 50, likes: 21, liked: false, replies: 5 }
    ];
    write(KEYS.posts, seed);
    return seed;
  }
  function savePosts(posts) { write(KEYS.posts, posts); }

  // ---- 徽章 ----
  function getBadges(userId) {
    const all = read(KEYS.badges, {});
    return all[userId] || [];
  }
  function saveBadges(userId, list) {
    const all = read(KEYS.badges, {});
    all[userId] = list;
    write(KEYS.badges, all);
  }

  global.Store = {
    KEYS,
    read, write,
    getUsers, saveUsers, findUserByEmail, findUserById, addUser, updateUser,
    getSession, setSession, clearSession,
    getUserProgress, saveUserProgress,
    getPosts, savePosts,
    getBadges, saveBadges
  };
})(window);
