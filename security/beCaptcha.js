(function () {
  /* -------------------------
     Tiny obfuscation + traps
     ------------------------- */
  const _0x = (s) => atob(s);
  const cfg = {
    capKey: 'c2Vzc2lvbl9jYXBf', // "session_cap_"
    captchaSolvedVal: 'dHJ1ZQ==', // "true"
    maxSignals: 3,
    integrityFreq: 2500,
    devtoolsWindowDelta: 160,
    mouseStraightThreshold: 220,
    speedThreshold: 1.4,
    honeypotName: 'hp_' + Math.random().toString(36).slice(2, 8),
  };

  // small internal state
  let state = {
    signals: 0,
    solved: sessionStorage.getItem(atob(cfg.capKey)) === atob(cfg.captchaSolvedVal),
    lastMove: null,
    moveStreak: 0,
    integritySeed: null,
  };

  // gentle UI overlay challenge (not spammy)
  function showChallenge(msg = 'Please confirm you are human') {
    if (state.solved) return;
    if (document.getElementById('__hum_chk')) return;
    const div = document.createElement('div');
    div.id = '__hum_chk';
    Object.assign(div.style, {
      position: 'fixed', inset: '0', display: 'flex',
      'align-items': 'center', 'justify-content': 'center',
      'background': 'rgba(0,0,0,0.45)', 'z-index': '999999',
      'backdrop-filter': 'blur(2px)'
    });
    div.innerHTML = `
      <div style="background:#fff;border-radius:12px;padding:18px;min-width:320px;box-shadow:0 6px 30px rgba(0,0,0,.35);font-family:system-ui;">
        <div style="font-weight:600;margin-bottom:8px">Verification required</div>
        <div style="margin-bottom:12px;color:#333">${msg}</div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button id="__hum_skip" style="padding:8px 10px;border-radius:8px;border:1px solid #ddd;background:#fff;cursor:pointer">Cancel</button>
          <button id="__hum_ok" style="padding:8px 10px;border-radius:8px;border:0;background:#0066ff;color:#fff;cursor:pointer">Verify</button>
        </div>
      </div>`;
    document.body.appendChild(div);
    document.getElementById('__hum_ok').addEventListener('click', () => runMiniCaptcha());
    document.getElementById('__hum_skip').addEventListener('click', () => {
      div.remove();
      recordSignal('user_cancelled');
    });
  }

  function runMiniCaptcha() {
    const q = 'Which is largest?\n1) 42\n2) 101\n3) 1000';
    const a = prompt(q);
    const ok = String(a).trim() === '3';
    if (ok) {
      sessionStorage.setItem(atob(cfg.capKey), atob(cfg.captchaSolvedVal));
      state.solved = true;
      const el = document.getElementById('__hum_chk'); if (el) el.remove();
      showFeedback('Verification successful — thanks!');
    } else {
      showFeedback('Verification failed. If you believe this is an error, reload and try again.');
      recordSignal('captcha_fail');
    }
  }

  function showFeedback(txt) {
    let f = document.getElementById('__hum_fb');
    if (!f) {
      f = document.createElement('div'); f.id = '__hum_fb';
      Object.assign(f.style, { position: 'fixed', right: '14px', bottom: '14px', background: '#222', color: '#fff', padding: '10px 14px', borderRadius: '10px', zIndex: 999999 });
      document.body.appendChild(f);
    }
    f.textContent = txt;
    setTimeout(() => { try { f.remove(); } catch (e) {} }, 3500);
  }

  /* -------------------------
     Honeypot (hidden input)
     ------------------------- */
  function addHoneypot() {
    try {
      const hp = document.createElement('input');
      hp.type = 'text'; hp.name = cfg.honeypotName; hp.autocomplete = 'off';
      Object.assign(hp.style, {
        position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none'
      });
      hp.tabIndex = -1;
      hp.dataset.honeypot = '1';
      document.body.appendChild(hp);
      hp.addEventListener('input', () => recordSignal('honeypot_filled'));
    } catch (e) { /* ignore */ }
  }

  /* -------------------------
     Proxy console & trap props
     ------------------------- */
  function hardenConsole() {
    try {
      if (!window.console) window.console = {};
      const realConsole = window.console;
      const proxy = new Proxy(realConsole, {
        get(target, k) {
          if (k === 'warn' || k === 'error') return target[k].bind(target);
          // hide most console methods to deter casual debugging
          return function () {};
        },
        set() { return true; }
      });
      Object.defineProperty(window, 'console', { value: proxy, configurable: false, writable: false });
    } catch (e) { /* ignore */ }
  }

  /* -------------------------
     MutationObserver for DOM tampering
     ------------------------- */
  function observeDOM() {
    try {
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'childList' && m.removedNodes.length) {
            // if our honeypot or overlay removed unexpectedly, that's suspicious
            m.removedNodes.forEach(n => {
              if (n && n.dataset && n.dataset.honeypot) recordSignal('honeypot_removed');
            });
          }
          if (m.type === 'attributes' && m.target && m.target.id === '__hum_chk') {
            recordSignal('overlay_tamped');
          }
        }
      });
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true, attributes: true });
    } catch (e) {}
  }

  /* -------------------------
     Integrity: checksum of core function
     ------------------------- */
  function computeIntegrity() {
    // compute a tiny "fingerprint" from key functions' toString outputs
    try {
      const seed = [
        showChallenge.toString(),
        runMiniCaptcha.toString(),
        addHoneypot.toString()
      ].join('|');
      // djb2-like hash
      let h = 5381;
      for (let i = 0; i < seed.length; i++) h = ((h << 5) + h) + seed.charCodeAt(i);
      return String(h >>> 0);
    } catch (e) { return '0'; }
  }

  /* -------------------------
     detect DevTools (quietly)
     ------------------------- */
  function devToolsWatch() {
    let consecutive = 0;
    setInterval(() => {
      const open = (window.outerWidth - window.innerWidth > cfg.devtoolsWindowDelta) ||
                   (window.outerHeight - window.innerHeight > cfg.devtoolsWindowDelta);
      if (open) {
        consecutive++;
        if (consecutive > 2) recordSignal('devtools_persist');
      } else consecutive = Math.max(0, consecutive - 1);
    }, 1200);
  }

  /* -------------------------
     Mouse heuristics
     ------------------------- */
  function mouseWatch() {
    document.addEventListener('mousemove', (ev) => {
      if (state.solved) return;
      const now = Date.now();
      if (state.lastMove) {
        const dx = Math.abs(ev.clientX - state.lastMove.x);
        const dy = Math.abs(ev.clientY - state.lastMove.y);
        const dt = Math.max(1, now - state.lastMove.t) / 1000;
        const speed = (dx + dy) / dt;
        if (dx > dy && dx > cfg.mouseStraightThreshold) state.moveStreak++; else state.moveStreak = 0;
        if (speed > cfg.speedThreshold) recordSignal('fast_mouse');
        if (state.moveStreak >= 3) recordSignal('straight_mouse');
      }
      state.lastMove = { x: ev.clientX, y: ev.clientY, t: now };
    }, { passive: true });
  }

  /* -------------------------
     Trap: detect toString tampering / Function.prototype manipulation
     ------------------------- */
  function trapFunctionTamper() {
    const originalToString = Function.prototype.toString;
    try {
      const p = new Proxy(Function.prototype.toString, {
        apply(target, thisArg, args) {
          // if someone tries to read function source too often, it's suspicious
          recordSignal('func_tostring_read');
          return Reflect.apply(target, thisArg, args);
        }
      });
      Object.defineProperty(Function.prototype, 'toString', { value: p, configurable: false, writable: false });
    } catch (e) {
      // cannot redefine in some environments - still ok
      recordSignal('toString_lock_failed');
    }
  }

  /* -------------------------
     Record signals and escalate
     ------------------------- */
  function recordSignal(name) {
    state.signals++;
    try { console.warn && console.warn('signal', name); } catch (e) {}
    // when multiple different signals happen, show challenge
    if (state.signals >= cfg.maxSignals && !state.solved) {
      showChallenge('We noticed unusual activity on your session. Please verify to continue.');
    } else {
      // small feedback for developers/admins
      // don't spam real users
      if (!state.solved) showFeedback('Security check: ' + name);
    }
  }

  /* -------------------------
     Init everything
     ------------------------- */
  function init() {
    try {
      addHoneypot();
      hardenConsole();
      observeDOM();
      mouseWatch();
      devToolsWatch();
      trapFunctionTamper();
      state.integritySeed = computeIntegrity();
      // periodic integrity checks
      setInterval(() => {
        const cur = computeIntegrity();
        if (cur !== state.integritySeed) {
          recordSignal('integrity_mismatch');
        }
      }, cfg.integrityFreq);
      // gentle prevention of navigation until solved
      window.addEventListener('beforeunload', (e) => {
        if (!state.solved) {
          e.preventDefault();
          try { e.returnValue = ''; } catch (x) {}
          return '';
        }
      });
      // expose submit for your button
      window.submitCaptcha = function () {
        if (!state.solved) showChallenge('Please verify to proceed.');
        else window.location.href = 'nextpage.html';
      };
      // final developer hint: do not call this script name in console
      Object.defineProperty(window, '__SEC_HOOK__', { value: true, configurable: false, writable: false });
    } catch (err) {
      try { console.error && console.error(err); } catch (e) {}
    }
  }

  // run after DOM ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

