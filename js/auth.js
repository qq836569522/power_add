/* ============================================================
   auth.js — 用户注册 / 登录 / 会话管理
   ============================================================ */
(function (global) {
  "use strict";

  function uid() {
    return "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  // 简易哈希（非安全用途，仅避免明文存储密码）
  function hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return "h" + Math.abs(h).toString(36);
  }
  function validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  const Auth = {
    currentUser: null,

    init() {
      const session = Store.getSession();
      if (session && session.userId) {
        const u = Store.findUserById(session.userId);
        if (u) this.currentUser = u;
      }
    },

    isLoggedIn() { return !!this.currentUser; },

    register({ name, email, password }) {
      if (!name || name.trim().length < 2) return { ok: false, error: "昵称至少 2 个字符" };
      if (!validEmail(email)) return { ok: false, error: "邮箱格式不正确" };
      if (!password || password.length < 6) return { ok: false, error: "密码至少 6 位" };
      if (Store.findUserByEmail(email)) return { ok: false, error: "该邮箱已注册" };

      const user = {
        id: uid(),
        name: name.trim(),
        email: email.trim(),
        pwd: hash(password),
        avatar: name.trim().charAt(0).toUpperCase(),
        createdAt: Date.now()
      };
      Store.addUser(user);
      Store.setSession(user.id);
      // 初始化进度
      Store.getUserProgress(user.id);
      this.currentUser = user;
      return { ok: true, user };
    },

    login({ email, password }) {
      const user = Store.findUserByEmail(email);
      if (!user) return { ok: false, error: "账户不存在，请先注册" };
      if (user.pwd !== hash(password)) return { ok: false, error: "密码不正确" };
      Store.setSession(user.id);
      this.currentUser = user;
      return { ok: true, user };
    },

    logout() {
      Store.clearSession();
      this.currentUser = null;
    },

    // 刷新当前用户对象（更新后调用）
    refresh() {
      if (this.currentUser) {
        const u = Store.findUserById(this.currentUser.id);
        if (u) this.currentUser = u;
      }
      return this.currentUser;
    }
  };

  global.Auth = Auth;
})(window);
