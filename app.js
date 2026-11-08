/* Kwacha Envelopes — local-first personal budget. Amounts are stored as ngwee (integers). */
(() => {
  "use strict";
  const KEY = "kwacha-envelopes:v1";
  const ACCOUNTS = [
    { id: "airtel", name: "Airtel Money", short: "Airtel", color: "#e4002b", mark: "A" },
    { id: "mtn", name: "MTN MoMo", short: "MoMo", color: "#f2b705", mark: "M", ink: "#111" },
    { id: "zanaco", name: "Zanaco", short: "Zanaco", color: "#0b5aa6", mark: "Z" },
    { id: "fnb", name: "FNB", short: "FNB", color: "#009aa3", mark: "F" },
    { id: "stanbic", name: "Stanbic", short: "Stanbic", color: "#1f3fa8", mark: "S" },
    { id: "absa", name: "Absa", short: "Absa", color: "#af144b", mark: "a" },
    { id: "cash", name: "Cash", short: "Cash", color: "#111113", mark: "K" }
  ];
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
    fuel: '<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M7 8h5"/><path d="M15 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    drop: '<path d="M12 2.5s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/>',
    heart: '<path d="M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 9-3 4.5 4.5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
    glass: '<path d="M8 22h8M12 15v7M5 3h14l-1.5 7a5.6 5.6 0 0 1-11 0z"/>',
    coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3M20 4v15h-7"/>',
    plus: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>',
    church: '<path d="M12 2v6M9 5h6M5 21V12l7-4 7 4v9zM10 21v-4h4v4"/>',
    car: '<path d="M5 17h14M3 13l2-6h14l2 6v5h-3M3 13v5h3M3 13h18"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    minus: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>', income: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    sms: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 13h5"/>'
  };
  const ICON_RULES = [
    [/rent|house|home|lodg/i, "home"], [/grocer|food|shoprite|meal/i, "cart"], [/fuel|transport|bus|taxi|uber|yango/i, "fuel"],
    [/car|vehicle|service|wash/i, "car"], [/airtime|data|phone|bundle/i, "phone"], [/zesco|electric|power|units/i, "bolt"],
    [/water/i, "drop"], [/family|support|mum|dad|kid|child/i, "heart"], [/out|fun|night|drink|entertain/i, "glass"],
    [/sav|invest|emergency/i, "coins"], [/school|fees|course|book|educ/i, "book"], [/health|medic|clinic|pharm/i, "plus"],
    [/dstv|gotv|netflix|subscr|showmax/i, "tv"], [/church|tith|giv|offering/i, "church"]
  ];
  const svg = k => `<svg viewBox="0 0 24 24">${ICONS[k] || ICONS.tag}</svg>`;
  const iconFor = name => (ICON_RULES.find(([re]) => re.test(name)) || [, "tag"])[1];
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }, del(k) { try { localStorage.removeItem(k); } catch (e) {} } };

  // ---------- dates ----------
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => ymd(new Date());
  const ym = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  const curMonth = () => ym(new Date());
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const monthsBetween = (a, b) => { const [ya, ma] = a.split("-").map(Number), [yb, mb] = b.split("-").map(Number); return (yb - ya) * 12 + (mb - ma); };
  const shiftMonth = (m, by) => { const [y, mo] = m.split("-").map(Number); return ym(new Date(y, mo - 1 + by, 1)); };
  const daysIn = m => { const [y, mo] = m.split("-").map(Number); return new Date(y, mo, 0).getDate(); };
  const monthName = (m, style) => { const [y, mo] = m.split("-").map(Number); const d = new Date(y, mo - 1, 1);
    return style === "s" ? d.toLocaleDateString("en-GB", { month: "short" }) : d.toLocaleDateString("en-GB", style ? { month: "short", year: "numeric" } : { month: "long", year: "numeric" }); };
  const yesterday = () => { const y = new Date(); y.setDate(y.getDate() - 1); return ymd(y); };
  const dayLabel = d => d === today() ? "Today" : d === yesterday() ? "Yesterday" : new Date(d + "T12:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  const shortDate = d => new Date(d + "T12:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const timeOf = t => t.created > 1e12 ? new Date(t.created).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
  const daysUntil = d => Math.round((new Date(d + "T12:00") - new Date(today() + "T12:00")) / 864e5);

  // ---------- money ----------
  const toNgwee = s => { const c = String(s ?? "").replace(/[^\d.]/g, ""); if (!c) return NaN; const n = Math.round(parseFloat(c) * 100); return Number.isFinite(n) ? n : NaN; };
  const fmt = (n, whole) => (n < 0 ? "−" : "") + "K" + (Math.abs(n) / 100).toLocaleString("en-ZM", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
  let hideAmounts = store.get("ke-hide", "0") === "1";
  const priv = (n, whole) => hideAmounts ? "K ••••" : fmt(n, whole);

  // ---------- data ----------
  function seed(){
    const m = curMonth();
    const e = (id, name, budget, order) => ({ id, name, budget, budgets: { [m]: budget }, since: m, rollover: false, order, example: true });
    const t = (id, kind, amount, account, day, note, env, fee) => ({ id, kind, amount, account, date: `${m}-${pad(day)}`, month: m, note, env, created: day, example: true, ...(fee ? { fee } : {}) });
    const d = Math.min(new Date().getDate(), 28);
    return {
      v: 3, adj: [],
      envs: [e("rent", "Rent", 450000, 0), e("groceries", "Groceries & food", 250000, 1), e("fuel", "Fuel & transport", 180000, 2),
        e("airtime", "Airtime & data", 50000, 3), e("zesco", "ZESCO electricity", 60000, 4), e("water", "Water", 25000, 5),
        e("family", "Family support", 100000, 6), e("fun", "Going out", 80000, 7), e("savings", "Savings", 200000, 8)],
      txs: [t("x1", "in", 1500000, "zanaco", 1, "Example income", ""), t("x2", "out", 38550, "airtel", Math.min(3, d), "Shoprite", "groceries", 250),
        t("x3", "out", 25000, "mtn", Math.min(4, d), "ZESCO units", "zesco", 150), t("x4", "out", 60000, "cash", Math.min(5, d), "Puma fuel", "fuel"),
        t("x5", "out", 10000, "airtel", Math.min(6, d), "Data bundle", "airtime")],
      bills: [{ id: "b1", name: "Rent", amount: 450000, day: 1, env: "rent", account: "zanaco", paid: {}, example: true },
        { id: "b2", name: "DStv", amount: 34900, day: 25, env: "fun", account: "airtel", paid: {}, example: true }],
      goals: [{ id: "g1", name: "Emergency fund", target: 1000000, by: shiftMonth(m, 10), log: [{ d: `${m}-01`, a: 150000 }], example: true }]
    };
  }
  function migrate(d){
    d.bills = Array.isArray(d.bills) ? d.bills : [];
    d.goals = Array.isArray(d.goals) ? d.goals : [];
    const first = d.txs.reduce((a, t) => t.month && t.month < a ? t.month : a, curMonth());
    d.envs.forEach(e => {
      if (!e.since) e.since = first;
      if (!e.budgets || typeof e.budgets !== "object") e.budgets = { [e.since]: e.budget || 0 };
      if (e.rollover === undefined) e.rollover = false;
    });
    d.bills.forEach(b => { if (!b.paid || typeof b.paid !== "object") b.paid = {}; });
    d.goals.forEach(g => { if (!Array.isArray(g.log)) g.log = []; });
    d.adj = Array.isArray(d.adj) ? d.adj : [];
    // v3: wallet balances are plain arithmetic (in − out − fees + corrections).
    // Before v3 the latest SMS balance silently replaced the running total, so an
    // expense could make a balance go up. Keep every wallet showing exactly what
    // it showed before by adding a one-off correction for the difference.
    if (!(d.v >= 3)) {
      const order = (a, b) => a.date.localeCompare(b.date) || (a.created || 0) - (b.created || 0);
      for (const a of ACCOUNTS) {
        const list = d.txs.filter(t => t.account === a.id).sort(order);
        let start = 0, old = 0;
        for (let i = list.length - 1; i >= 0; i--) if (Number.isFinite(list[i].bal)) { start = i + 1; old = list[i].bal; break; }
        for (const t of list.slice(start)) old += (t.kind === "in" ? t.amount : -t.amount) - (t.fee || 0);
        const plain = list.reduce((s, t) => s + (t.kind === "in" ? t.amount : -t.amount) - (t.fee || 0), 0);
        if (old !== plain) {
          const last = list[list.length - 1];
          d.adj.push({ id: "m" + a.id, account: a.id, date: last ? last.date : today(), created: (last && last.created || 0) + 0.5,
            delta: old - plain, note: "Balance carried over from your SMS" });
        }
      }
    }
    d.v = 3;
    return d;
  }
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { db = null; }
  db = (!db || !Array.isArray(db.envs) || !Array.isArray(db.txs)) ? seed() : migrate(db);
  let persisted = false;
  function save(){
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { toast("Couldn't save. Your phone may be out of storage."); }
    if (!persisted && navigator.storage && navigator.storage.persist) { persisted = true; navigator.storage.persist().catch(() => {}); }
  }

  // ---------- budget maths ----------
  const ui = { view: "home", month: curMonth(), filter: "all", q: "" };
  const acct = id => ACCOUNTS.find(a => a.id === id) || ACCOUNTS[6];
  const envById = id => db.envs.find(e => e.id === id);
  const sortedEnvs = () => [...db.envs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
  const hasExamples = () => db.envs.some(e => e.example) || db.txs.some(t => t.example) || db.bills.some(b => b.example) || db.goals.some(g => g.example);
  const byNewest = (a, b) => b.date.localeCompare(a.date) || (b.created || 0) - (a.created || 0);
  const fee = t => t.fee || 0;
  /** Last 9 digits of a Zambian number, so 0971…, 971… and +260 971… all match. */
  const last9 = s => String(s).replace(/\D/g, "").slice(-9);
  const parseNums = s => [...new Set(String(s || "").split(/[,;\n]+/).map(last9).filter(n => n.length === 9))];

  function budgetFor(e, m){
    if (m < (e.since || m)) return 0;
    const keys = Object.keys(e.budgets || {}).filter(k => k <= m).sort();
    return keys.length ? e.budgets[keys[keys.length - 1]] : (e.budget || 0);
  }
  function buildIndex(){
    const idx = {};
    for (const t of db.txs) {
      const m = idx[t.month] || (idx[t.month] = { env: {}, income: 0, out: 0, fees: 0 });
      m.fees += fee(t);
      if (t.kind === "in") m.income += t.amount;
      else { m.out += t.amount; const k = t.env && envById(t.env) ? t.env : "_none"; m.env[k] = (m.env[k] || 0) + t.amount; }
    }
    return idx;
  }
  function envMonth(e, m, idx, memo = {}){
    const key = e.id + m; if (memo[key]) return memo[key];
    const budget = budgetFor(e, m);
    let carry = 0;
    if (e.rollover && m > (e.since || m) && monthsBetween(e.since, m) <= 36) {
      const p = envMonth(e, shiftMonth(m, -1), idx, memo); carry = p.avail - p.spent;
    }
    const spent = (idx[m] && idx[m].env[e.id]) || 0;
    return (memo[key] = { budget, carry, avail: budget + carry, spent, left: budget + carry - spent });
  }
  function totals(m = ui.month){
    const idx = buildIndex(), memo = {};
    const mi = idx[m] || { env: {}, income: 0, out: 0, fees: 0 };
    const envs = {}; let budget = 0, avail = 0;
    for (const e of db.envs) { const r = envMonth(e, m, idx, memo); envs[e.id] = r; budget += r.budget; avail += r.avail; }
    const spent = mi.out + mi.fees;
    return { m, idx, tx: db.txs.filter(t => t.month === m), income: mi.income, out: mi.out, fees: mi.fees, spent, budget, avail,
      envs, none: mi.env._none || 0, left: avail - spent };
  }

  // Wallet balance = income − spending − fees + balance corrections. Always plain
  // arithmetic, so an expense can only ever take money off. SMS balances never
  // overwrite it; a mismatch is shown as a check the user confirms (see smsCheck).
  const txDelta = t => (t.kind === "in" ? t.amount : -t.amount) - fee(t);
  const orderKey = (a, b) => a.date.localeCompare(b.date) || (a.created || 0) - (b.created || 0);
  function walletBalances(){
    const out = {};
    for (const a of ACCOUNTS) {
      const mine = db.txs.filter(t => t.account === a.id), adj = db.adj.filter(x => x.account === a.id);
      const corr = adj.reduce((s, x) => s + x.delta, 0);
      out[a.id] = { bal: mine.reduce((s, t) => s + txDelta(t), 0) + corr, corr, used: mine.length > 0 || adj.length > 0 };
    }
    out._total = ACCOUNTS.reduce((s, a) => s + out[a.id].bal, 0);
    return out;
  }
  /** Wallet balance straight after transaction t (entries and corrections up to it). */
  function balanceAfter(t){
    const upTo = x => orderKey(x, t) <= 0;
    return db.txs.filter(x => x.account === t.account && (x.id === t.id || upTo(x))).reduce((s, x) => s + txDelta(x), 0)
      + db.adj.filter(x => x.account === t.account && upTo(x)).reduce((s, x) => s + x.delta, 0);
  }
  /** The open SMS balance check, if the SMS balance disagrees with the entries. */
  function smsCheck(){
    const c = db.check; if (!c) return null;
    const t = db.txs.find(x => x.id === c.tx);
    if (!t || !Number.isFinite(t.bal)) { delete db.check; return null; }
    const app = balanceAfter(t);
    return app === t.bal ? null : { t, app, sms: t.bal, diff: t.bal - app };
  }

  // ---------- bills ----------
  const billDue = (b, m) => `${m}-${pad(Math.min(b.day, daysIn(m)))}`;
  function billState(b, m){
    const tid = b.paid && b.paid[m];
    if (tid && db.txs.some(t => t.id === tid)) return { paid: true, due: billDue(b, m) };
    const due = billDue(b, m), n = daysUntil(due);
    return { paid: false, due, days: n };
  }
  function billChip(st){
    if (st.paid) return '<span class="mini green">Paid</span>';
    if (st.days < 0) return `<span class="mini red">${-st.days === 1 ? "1 day" : -st.days + " days"} overdue</span>`;
    if (st.days === 0) return '<span class="mini red">Due today</span>';
    if (st.days <= 3) return `<span class="mini amber">Due in ${st.days} day${st.days > 1 ? "s" : ""}</span>`;
    return `<span class="mini">Due ${esc(new Date(st.due + "T12:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }))}</span>`;
  }
  function billRow(b, m){
    const st = billState(b, m);
    const d = new Date(st.due + "T12:00");
    return `<div class="bill tile" data-bill="${esc(b.id)}">
      <span class="cal"><small>${esc(d.toLocaleDateString("en-GB", { month: "short" }))}</small><b>${d.getDate()}</b></span>
      <div class="mid"><div class="t">${esc(b.name)}${b.example ? '<span class="tag">Example</span>' : ""}</div><div class="s">${billChip(st)}</div></div>
      <div class="r"><span class="a">${fmt(b.amount)}</span>${st.paid ? '<span class="paybtn done">✓ Recorded</span>' : `<button class="paybtn" data-pay="${esc(b.id)}">Mark paid</button>`}</div>
    </div>`;
  }
  function markPaid(b, m = ui.month){
    const date = m === curMonth() ? today() : billDue(b, m);
    const t = { id: uid(), kind: "out", amount: b.amount, account: b.account || "cash", date, month: date.slice(0, 7), note: b.name, env: envById(b.env) ? b.env : "", created: Date.now(), bill: b.id };
    db.txs.push(t); b.paid = b.paid || {}; b.paid[m] = t.id; save(); render(); toast(`${b.name}: −${fmt(b.amount)} recorded`);
  }
  function icsFor(b){
    const next = (() => { const m = curMonth(); const due = billDue(b, m); return daysUntil(due) >= 0 ? due : billDue(b, shiftMonth(m, 1)); })();
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const day = b.day >= 29 ? "-1" : String(b.day);
    const text = `Pay ${b.name} (${fmt(b.amount)})`;
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Kwacha Envelopes//EN", "BEGIN:VEVENT", `UID:${b.id}@kwacha-envelopes`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${next.replace(/-/g, "")}`, `RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}`, `SUMMARY:${text}`,
      "DESCRIPTION:Monthly bill from Kwacha Envelopes. Mark it paid in the app when done.", "BEGIN:VALARM", "TRIGGER:-PT15H", "ACTION:DISPLAY",
      `DESCRIPTION:${text} is due tomorrow`, "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }
  function download(name, text, type){
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }

  // ---------- goals ----------
  const saved = g => g.log.reduce((s, x) => s + x.a, 0);
  function goalPlan(g){
    const s = saved(g), left = Math.max(0, g.target - s);
    if (!left) return "Goal reached";
    if (!g.by) return `${fmt(left, true)} to go`;
    const months = Math.max(1, monthsBetween(curMonth(), g.by));
    if (g.by < curMonth()) return `${fmt(left, true)} to go · target date passed`;
    return `Save ${fmt(Math.ceil(left / months / 100) * 100, true)} a month to reach it by ${monthName(g.by, true)}`;
  }
  function ring(pct, size){
    const r = size === 72 ? 30 : 23, c = size === 72 ? 36 : 28, C = 2 * Math.PI * r;
    return `<span class="gring"><svg viewBox="0 0 ${size} ${size}"><circle class="bg" cx="${c}" cy="${c}" r="${r}"/><circle class="fg" cx="${c}" cy="${c}" r="${r}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, pct))}"/></svg><b>${Math.round(pct * 100)}%</b></span>`;
  }
  function goalRow(g){
    const s = saved(g);
    return `<button class="goal tile" data-goal="${esc(g.id)}">${ring(g.target ? s / g.target : 0, 56)}
      <div class="mid"><div class="t">${esc(g.name)}${g.example ? '<span class="tag">Example</span>' : ""}</div><div class="s"><b>${priv(s, true)}</b> of ${fmt(g.target, true)}</div><div class="s">${esc(goalPlan(g))}</div></div></button>`;
  }

  // ---------- pieces ----------
  const monthSwitch = (cls = "mswitch") => `<div class="${cls}"><button data-act="prev" aria-label="Previous month">${svg("left")}</button><span>${esc(monthName(ui.month, true))}</span><button data-act="next" aria-label="Next month">${svg("right")}</button></div>`;
  function limitBar(used, budget){
    const pct = budget > 0 ? Math.min(100, used / budget * 100) : (used ? 100 : 0);
    const st = used > budget ? "over" : pct >= 85 ? "warn" : "";
    const w = Math.max(pct, 3);
    return `<div class="lbar ${st}"><span class="stripes"></span><span class="done" style="width:calc(${w}% - 8px)"></span><span class="knob" style="left:calc(${w}% - 6px)"></span></div>`;
  }
  const logo = a => `<span class="logo" style="background:${a.color};color:${a.ink || "#fff"}">${esc(a.mark)}</span>`;
  function envCard(e, r){
    const carry = r.carry ? `<span class="mini ${r.carry > 0 ? "green" : "red"}">${r.carry > 0 ? "+" : "−"}${fmt(Math.abs(r.carry), true)} ${r.carry > 0 ? "rolled over" : "overspent last month"}</span>` : (e.rollover ? '<span class="mini">Rolls over</span>' : "");
    return `<button class="env tile" data-env="${esc(e.id)}">
      <div class="env-top"><span class="ico">${svg(iconFor(e.name))}</span><span class="n">${esc(e.name)}${e.example ? '<span class="tag">Example</span>' : ""}</span><span class="l ${r.left < 0 ? "over" : ""}">${fmt(r.left)} left</span></div>
      ${limitBar(r.spent, r.avail)}
      <div class="lmeta"><span>${carry || "Spent this month"}</span><span><b>${fmt(r.spent)}</b> / ${fmt(r.avail)}</span></div>
    </button>`;
  }
  function payRow(t){
    const a = acct(t.account), e = envById(t.env);
    const title = t.note || (t.kind === "in" ? "Money in" : e ? e.name : "Spending");
    return `<button class="pay tile" data-tx="${esc(t.id)}">
      <div class="pay-main">${logo(a)}<div class="mid"><div class="t">${esc(title)}${t.example ? '<span class="tag">Example</span>' : ""}</div><div class="s">${esc(a.name)}</div></div>
        <div class="r"><div class="a ${t.kind === "in" ? "in" : ""}">${t.kind === "in" ? "+" : "−"}${fmt(t.amount)}</div><div class="d">${esc(shortDate(t.date))}</div></div></div>
      <div class="pay-foot"><span>${t.kind === "in" ? "Income" : esc(e ? e.name : "No envelope")}${fee(t) ? ` · fee ${fmt(fee(t))}` : ""}</span><span class="st ${t.kind === "in" ? "in" : ""}">${t.kind === "in" ? "Received" : t.bill ? "Bill paid" : "Paid"}</span></div>
    </button>`;
  }
  function txLine(t){
    const a = acct(t.account), e = envById(t.env);
    const title = t.note || (t.kind === "in" ? "Money in" : e ? e.name : "Spending");
    const sub = (t.kind === "in" ? a.name : `${e ? e.name : "No envelope"} · ${a.short}`) + (fee(t) ? ` · fee ${fmt(fee(t))}` : "");
    return `<button class="trow" data-tx="${esc(t.id)}">${logo(a)}<div class="mid"><div class="t">${esc(title)}${t.example ? '<span class="tag">Example</span>' : ""}</div><div class="s">${esc(sub)}</div></div>
      <div class="r"><div class="a ${t.kind === "in" ? "in" : ""}">${t.kind === "in" ? "+" : "−"}${fmt(t.amount)}</div><div class="d">${esc(timeOf(t) || shortDate(t.date).replace(/ \d{4}$/, ""))}</div></div></button>`;
  }

  // ---------- views ----------
  const TITLES = { home: "Home", envelopes: "Budget", insights: "Insights", activity: "Activity", accounts: "Wallet" };
  function render(){
    $("pageTitle").textContent = TITLES[ui.view];
    document.querySelectorAll(".dock-btn").forEach(a => { if (a.dataset.v === ui.view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    Object.keys(TITLES).forEach(v => $("v-" + v).hidden = v !== ui.view);
    $("exBadge").hidden = !hasExamples();
    const T = totals();
    ({ home: renderHome, envelopes: renderEnvelopes, insights: renderInsights, activity: renderActivity, accounts: renderAccounts })[ui.view](T);
  }

  function renderHome(T){
    const isNow = ui.month === curMonth();
    const daysLeft = isNow ? daysIn(ui.month) - new Date().getDate() + 1 : 0;
    const perDay = daysLeft && T.left > 0 ? Math.floor(T.left / daysLeft) : null;
    const toAssign = T.income - T.budget;
    let banner = "";
    if (hasExamples()) banner += `<div class="banner"><span class="dot"></span><span>These are example figures. Clear them and set your own limits.</span><button data-act="clearex">Clear</button></div>`;
    if (T.left < 0) banner += `<div class="banner bad"><span class="dot"></span><span>You've spent ${fmt(-T.left)} more than your limits this month.</span></div>`;
    if (T.income === 0) banner += `<div class="banner"><span class="dot"></span><span>Record this month's income to see what's left to assign.</span><button data-act="income">Add</button></div>`;
    else if (toAssign > 0) banner += `<div class="banner"><span class="dot"></span><span>${fmt(toAssign)} of your ${fmt(T.income, true)} income isn't in an envelope yet.</span><button data-act="envelopes">Assign</button></div>`;
    else if (toAssign < 0) banner += `<div class="banner bad"><span class="dot"></span><span>Limits total ${fmt(-toAssign)} more than the ${fmt(T.income, true)} you've received.</span><button data-act="envelopes">Review</button></div>`;
    const W = walletBalances();
    const chk = smsCheck();
    if (chk) banner = `<div class="banner bad"><span class="dot"></span><span>Your ${esc(acct(chk.t.account).short)} SMS says the balance is ${fmt(chk.sms)}, but your entries add up to ${fmt(chk.app)} (${chk.diff > 0 ? "+" : "−"}${fmt(Math.abs(chk.diff))}). Usually a payment wasn't recorded.</span><button data-act="matchsms">Match SMS</button><button data-act="keepmine">Keep mine</button></div>` + banner;
    const recent = [...T.tx].sort(byNewest).slice(0, 4);
    const due = db.bills.map(b => ({ b, st: billState(b, ui.month) })).filter(x => !x.st.paid && (!isNow || x.st.days <= 7)).sort((a, b) => a.st.due.localeCompare(b.st.due)).slice(0, 3);
    const goals = db.goals.slice(0, 2);

    $("v-home").innerHTML = `
      <div class="wallet-card">
        <div class="slot">
          <div class="slot-row"><span class="brand"><span class="chip-k">K</span>Kwacha Envelopes</span>${monthSwitch()}</div>
        </div>
        <div class="pocket">
          <svg class="shape" viewBox="0 0 340 150" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="leather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2b2d"/><stop offset="1" stop-color="#121213"/></linearGradient></defs>
            <path class="fill" d="M0 26 Q0 6 20 6 H112 C132 6 134 32 156 32 H184 C206 32 208 6 228 6 H320 Q340 6 340 26 V150 H0 Z"/>
            <path class="stitch" d="M9 30 Q9 15 24 15 H110 C128 15 132 41 156 41 H184 C208 41 212 15 230 15 H316 Q331 15 331 30 V141 H9 Z"/>
          </svg>
          <span class="rivet l"></span><span class="rivet r"></span>
          <div class="pocket-in">
            <div><div class="lbl">Total balance</div><div class="big">${priv(W._total)}<button class="eye" data-act="eye" aria-label="${hideAmounts ? "Show" : "Hide"} amounts">${svg(hideAmounts ? "eyeOff" : "eye")}</button></div></div>
            <div class="sub">Left to spend<b>${priv(T.left, true)}</b>${perDay !== null ? `<small>${priv(perDay, true)} a day</small>` : ""}</div>
          </div>
        </div>
      </div>
      <div class="quick">
        <button data-act="expense">${svg("minus")}Add expense</button>
        <button data-act="sms">${svg("sms")}Paste SMS</button>
        <button data-act="income">${svg("income")}Add income</button>
      </div>
      ${installCard()}${banner}
      ${due.length ? `<div class="card"><div class="card-h"><h2>Bills ${isNow ? "due soon" : "for " + esc(monthName(ui.month, "s"))}</h2><a href="#envelopes">All bills</a></div>${due.map(x => billRow(x.b, ui.month)).join("")}</div>` : ""}
      <div class="card">
        <div class="card-h"><h2>Monthly limits</h2>${T.fees ? `<span class="mini">Fees ${fmt(T.fees)}</span>` : ""}</div>
        <div class="tile limit">${limitBar(T.spent, T.avail)}<div class="lmeta"><span>Spent, including fees</span><span><b>${fmt(T.spent)}</b> / ${fmt(T.avail)}</span></div></div>
        <a class="go tile" href="#envelopes">Set envelope limits ${svg("arrow")}</a>
      </div>
      ${goals.length ? `<div class="card"><div class="card-h"><h2>Savings goals</h2><a href="#accounts">All goals</a></div>${goals.map(goalRow).join("")}</div>` : ""}
      <div class="card">
        <div class="card-h"><h2>Payment history</h2>${recent.length ? '<a href="#activity">See all</a>' : ""}</div>
        ${recent.length ? recent.map(payRow).join("") : `<div class="empty"><b>No transactions in ${esc(monthName(ui.month))}</b>Add one, or paste an SMS from Airtel Money or MoMo.</div>`}
      </div>`;
  }

  function renderEnvelopes(T){
    const envs = sortedEnvs();
    const extra = (T.none ? `<div class="tile limit" style="margin-top:10px"><div class="lmeta" style="margin:0"><span>Not in an envelope</span><b>${fmt(T.none)}</b></div></div>` : "")
      + (T.fees ? `<div class="tile limit" style="margin-top:10px"><div class="lmeta" style="margin:0"><span>Mobile money and bank fees</span><b>${fmt(T.fees)}</b></div></div>` : "");
    const bills = [...db.bills].sort((a, b) => a.day - b.day);
    const unpaid = bills.filter(b => !billState(b, ui.month).paid).reduce((s, b) => s + b.amount, 0);
    $("v-envelopes").innerHTML = `
      <div class="card">
        <div class="bal-h"><div><div class="lbl">Available · ${esc(monthName(ui.month))}</div><div class="big">${priv(T.avail)}</div></div>${monthSwitch("mswitch light")}</div>
        <div class="duo"><div class="tile"><span>Spent</span><b>${priv(T.spent)}</b></div><div class="tile"><span>Left</span><b style="${T.left < 0 ? "color:var(--red)" : ""}">${priv(T.left)}</b></div></div>
      </div>
      <div class="card">
        <div class="card-h"><h2>Envelope limits</h2><button data-act="newenv">New</button></div>
        ${envs.length ? envs.map(e => envCard(e, T.envs[e.id])).join("") : `<div class="empty"><b>No envelopes yet</b>Make one for each thing you spend on: rent, groceries, fuel, airtime.</div>`}
        ${extra}
        <button class="go tile" data-act="newenv">Add an envelope ${svg("arrow")}</button>
      </div>
      <div class="card">
        <div class="card-h"><h2>Recurring bills</h2><button data-act="newbill">New</button></div>
        ${bills.length ? bills.map(b => billRow(b, ui.month)).join("") + `<div class="lmeta" style="margin-top:12px"><span>Still to pay in ${esc(monthName(ui.month, "s"))}</span><b>${fmt(unpaid)}</b></div>`
          : `<div class="empty"><b>No bills yet</b>Add rent, ZESCO, water, DStv or school fees and mark them paid each month.</div>`}
      </div>`;
  }

  function renderInsights(T){
    const prev = totals(shiftMonth(ui.month, -1));
    const isNow = ui.month === curMonth();
    const elapsed = isNow ? new Date().getDate() : daysIn(ui.month);
    const delta = prev.spent ? Math.round((T.spent - prev.spent) / prev.spent * 100) : null;
    const savedAmt = T.income - T.spent, rate = T.income ? Math.round(savedAmt / T.income * 100) : null;
    // last 6 months chart
    const months = [...Array(6)].map((_, i) => shiftMonth(ui.month, i - 5));
    const series = months.map(m => { const x = T.idx[m] || { income: 0, out: 0, fees: 0 }; return { m, inc: x.income, spd: x.out + x.fees }; });
    const max = Math.max(1, ...series.map(s => Math.max(s.inc, s.spd)));
    const X0 = 8, W = 304, B = 128, H = 104, gw = W / 6;
    const bars = series.map((s, i) => {
      const x = X0 + i * gw, hi = s.inc / max * H, hs = s.spd / max * H, cur = s.m === ui.month;
      return `<rect class="inc" x="${(x + gw / 2 - 15).toFixed(1)}" y="${(B - hi).toFixed(1)}" width="14" height="${hi.toFixed(1)}" rx="4"/>
        <rect class="spd ${cur ? "cur" : ""}" x="${(x + gw / 2 + 1).toFixed(1)}" y="${(B - hs).toFixed(1)}" width="14" height="${hs.toFixed(1)}" rx="4"/>
        <text x="${(x + gw / 2).toFixed(1)}" y="146" text-anchor="middle">${esc(monthName(s.m, "s"))}</text>
        ${cur && s.spd ? `<text class="val" x="${(x + gw / 2 + 8).toFixed(1)}" y="${Math.max(10, B - hs - 5).toFixed(1)}" text-anchor="middle">${esc(fmt(s.spd, true))}</text>` : ""}`;
    }).join("");
    // breakdowns
    const parts = sortedEnvs().map(e => ({ n: e.name, v: T.envs[e.id].spent })).filter(p => p.v);
    if (T.none) parts.push({ n: "Not in an envelope", v: T.none });
    if (T.fees) parts.push({ n: "Fees", v: T.fees });
    parts.sort((a, b) => b.v - a.v);
    const places = {}; T.tx.filter(t => t.kind === "out" && t.note).forEach(t => { const k = t.note.trim().toLowerCase(); const p = places[k] || (places[k] = { n: t.note.trim(), v: 0, c: 0 }); p.v += t.amount; p.c++; });
    const top = Object.values(places).sort((a, b) => b.v - a.v).slice(0, 5);
    const feeBy = ACCOUNTS.map(a => ({ n: a.name, v: T.tx.filter(t => t.account === a.id).reduce((s, t) => s + fee(t), 0) })).filter(x => x.v).sort((a, b) => b.v - a.v);
    const fees6 = series.reduce((s, x) => s + ((T.idx[x.m] || {}).fees || 0), 0);
    const hbars = (list, total) => list.map(p => `<div class="hbar"><span class="n">${esc(p.n)}${p.c ? `<span class="p">${p.c}×</span>` : ""}</span><span class="v">${fmt(p.v)}<span class="p">${total ? Math.round(p.v / total * 100) + "%" : ""}</span></span><span class="track"><i style="width:${total ? Math.max(2, p.v / total * 100) : 0}%"></i></span></div>`).join("");

    $("v-insights").innerHTML = `
      <div class="card">
        <div class="card-h"><h2>${esc(monthName(ui.month))}</h2>${monthSwitch("mswitch light")}</div>
        <div class="kpis">
          <div class="tile"><span>Spent</span><b>${priv(T.spent, true)}</b> ${delta !== null ? `<em class="${delta > 0 ? "up" : "down"}">${delta > 0 ? "▲" : "▼"} ${Math.abs(delta)}%</em>` : ""}<span>vs ${esc(monthName(shiftMonth(ui.month, -1), "s"))}: ${fmt(prev.spent, true)}</span></div>
          <div class="tile"><span>Saved</span><b style="${savedAmt < 0 ? "color:var(--red)" : ""}">${priv(savedAmt, true)}</b><span>${rate !== null ? rate + "% of income" : "No income recorded"}</span></div>
          <div class="tile"><span>Average a day</span><b>${fmt(Math.round(T.spent / Math.max(1, elapsed)), true)}</b><span>over ${elapsed} day${elapsed > 1 ? "s" : ""}</span></div>
          <div class="tile"><span>Fees paid</span><b>${fmt(T.fees)}</b><span>${fmt(fees6, true)} in 6 months</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h2>Last 6 months</h2></div>
        <svg class="chart" viewBox="0 0 320 152" role="img" aria-label="Income and spending for the last six months">
          <line class="grid" x1="8" x2="312" y1="${B}" y2="${B}"/><line class="grid" x1="8" x2="312" y1="${B - H / 2}" y2="${B - H / 2}" stroke-dasharray="3 4"/>
          ${bars}
        </svg>
        <div class="legend"><span><i style="background:var(--blue-soft)"></i>Income</span><span><i style="background:var(--fg)"></i>Spent</span><span><i style="background:var(--blue)"></i>${esc(monthName(ui.month, "s"))}</span></div>
      </div>
      <div class="card">
        <div class="card-h"><h2>Where it went</h2></div>
        ${parts.length ? hbars(parts, T.spent) : '<div class="empty">No spending recorded this month.</div>'}
      </div>
      <div class="card">
        <div class="card-h"><h2>Top places</h2></div>
        ${top.length ? hbars(top, T.out) : '<div class="empty">Add notes to transactions, or paste SMS messages, to see where you spend most.</div>'}
      </div>
      <div class="card">
        <div class="card-h"><h2>Fees by wallet</h2><span class="mini">${fmt(T.fees)}</span></div>
        ${feeBy.length ? hbars(feeBy, T.fees) : '<div class="empty">No fees this month. Fees are read from your SMS, or you can type them in when adding a transaction.</div>'}
      </div>`;
  }

  function renderActivity(T){
    const q = ui.q.trim().toLowerCase();
    let list = [...T.tx].sort(byNewest);
    if (ui.filter !== "all") list = list.filter(t => t.kind === ui.filter);
    if (q) list = list.filter(t => [t.note, acct(t.account).name, (envById(t.env) || {}).name].join(" ").toLowerCase().includes(q));
    const groups = []; list.forEach(t => { const g = groups[groups.length - 1]; if (g && g.d === t.date) g.items.push(t); else groups.push({ d: t.date, items: [t] }); });
    const hadFocus = document.activeElement && document.activeElement.id === "q";
    $("v-activity").innerHTML = `
      <label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="q" type="search" placeholder="Search transactions" value="${esc(ui.q)}" autocomplete="off"></label>
      <div class="filters" role="group" aria-label="Filter">
        <button data-f="all" aria-pressed="${ui.filter === "all"}">All</button>
        <button data-f="out" aria-pressed="${ui.filter === "out"}">Spent</button>
        <button data-f="in" aria-pressed="${ui.filter === "in"}">Received</button>
      </div>
      <div class="card">
        <div class="card-h"><h2>Transactions</h2>${monthSwitch("mswitch light")}</div>
        ${groups.length ? groups.map((g, i) => `<div class="divider ${i === 0 ? "first" : ""} ${g.d === today() ? "today" : ""}">${esc(dayLabel(g.d))}</div>${g.items.map(txLine).join("")}`).join("")
          : `<div class="empty"><b>${q || ui.filter !== "all" ? "No matches" : "Nothing recorded yet"}</b>${q || ui.filter !== "all" ? "Try a different search or filter." : "Add a transaction or paste an SMS."}</div>`}
      </div>`;
    if (hadFocus) { const i = $("q"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }

  function renderAccounts(T){
    const Wb = walletBalances();
    const rows = ACCOUNTS.map(a => {
      const mine = T.tx.filter(t => t.account === a.id);
      const inn = mine.filter(t => t.kind === "in").reduce((s, t) => s + t.amount, 0);
      const out = mine.reduce((s, t) => s + (t.kind === "out" ? t.amount : 0) + fee(t), 0);
      const w = Wb[a.id];
      return { a, inn, out, n: mine.length, w };
    }).filter(r => r.n || r.w.used);
    const goalsTotal = db.goals.reduce((s, g) => s + saved(g), 0);
    $("v-accounts").innerHTML = `
      <div class="card">
        <div class="bal-h"><div><div class="lbl">Total balance</div><div class="big">${priv(Wb._total)}</div></div>
          <button class="eye-btn" data-act="eye" aria-label="${hideAmounts ? "Show" : "Hide"} amounts">${svg(hideAmounts ? "eyeOff" : "eye")}</button></div>
        <div class="duo"><div class="tile"><span>Received</span><b>${priv(T.income)}</b></div><div class="tile"><span>Spent</span><b>${priv(T.spent)}</b></div></div>
      </div>
      <div class="card">
        <div class="card-h"><h2>Savings goals</h2><button data-act="newgoal">New</button></div>
        ${db.goals.length ? db.goals.map(goalRow).join("") + `<div class="lmeta" style="margin-top:12px"><span>Saved across goals</span><b>${priv(goalsTotal)}</b></div>`
          : `<div class="empty"><b>No goals yet</b>Set a target, like a laptop or an emergency fund, and track what you put aside.</div>`}
      </div>
      <div class="card">
        <div class="card-h"><h2>Wallets</h2>${monthSwitch("mswitch light")}</div>
        ${rows.length ? rows.map(({ a, inn, out, w }) => `
          <div class="trow">${logo(a)}<div class="mid"><div class="t">${esc(a.name)}</div><div class="s">In ${fmt(inn, true)} · Out ${fmt(out, true)} this month</div></div>
            <div class="r"><div class="a" style="${w.bal < 0 ? "color:var(--red)" : ""}">${priv(w.bal)}</div><div class="d">${w.corr ? `incl. ${w.corr > 0 ? "+" : "−"}${fmt(Math.abs(w.corr), true)} correction` : "From your entries"}</div></div></div>`).join("")
          : `<div class="empty"><b>No wallet activity yet</b>Add income or paste an SMS and your balances show here.</div>`}
        <p class="hint" style="margin-top:10px">Each wallet adds your income and takes off spending and fees. If a pasted SMS shows a different balance, you'll be asked whether to match it.</p>
      </div>`;
  }

  // ---------- install ----------
  let deferredPrompt = null;
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let installDismissed = store.get("ke-install-x", "0") === "1";
  const isAndroid = /android/i.test(navigator.userAgent);
  const inAppBrowser = /; wv\)|FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|GSA\//i.test(navigator.userAgent);
  const androidSteps = () => inAppBrowser
    ? "This screen can't install apps. Copy the link, open Chrome, paste it, then tap ⋮ → Install app."
    : "Tap ⋮ at the top right of Chrome, then “Install app” (or “Add to Home screen” → Install). Opened from another app? Copy the link into Chrome first.";
  function installCard(){
    if (standalone() || installDismissed) return "";
    if (deferredPrompt) return `<div class="install"><img src="/icons/icon-192.png" alt=""><div><b>Install Kwacha</b><small>Open it from your home screen, even offline</small></div><button class="btn small" data-act="install">Install</button></div>`;
    if (isIOS) return `<div class="install"><img src="/icons/icon-192.png" alt=""><div><b>Add to Home Screen</b><small>Tap Share, then “Add to Home Screen”</small></div><button class="pill-link" data-act="hideinstall">Hide</button></div>`;
    if (isAndroid) return `<div class="install"><img src="/icons/icon-192.png" alt=""><div><b>Install Kwacha</b><small>${androidSteps()}</small></div><div style="display:flex;flex-direction:column;gap:6px"><button class="btn small" data-act="copylink">Copy link</button><button class="pill-link" data-act="hideinstall">Hide</button></div></div>`;
    return "";
  }
  // Keep Chrome's own install banner, and keep the event so the Install button works too.
  addEventListener("beforeinstallprompt", e => { deferredPrompt = e; $("installRow").hidden = false; if (ui.view === "home") render(); });
  addEventListener("appinstalled", () => { deferredPrompt = null; $("installRow").hidden = true; toast("Installed. Open Kwacha from your home screen."); render(); });
  async function doInstall(){
    if (!deferredPrompt) { toast(isAndroid ? "Tap ⋮ in Chrome, then Install app" : "Use your browser menu to install"); return; }
    try { await deferredPrompt.prompt(); await deferredPrompt.userChoice; } catch (e) {}
    deferredPrompt = null; render();
  }
  if (isIOS && !standalone()) $("iosRow").hidden = false;
  if (isAndroid && !standalone()) { $("installRow").hidden = false; $("installRow").querySelector("small").textContent = androidSteps(); }
  async function copyLink(){
    const url = location.origin + "/";
    try { await navigator.clipboard.writeText(url); toast("Link copied. Paste it into Chrome."); }
    catch (e) { toast(url); }
  }

  // ---------- sheets ----------
  let openSheet = null;
  function show(id){ hide(); $("scrim").hidden = false; $(id).hidden = false; openSheet = id; document.body.style.overflow = "hidden"; }
  function hide(){ if (!openSheet) return; $(openSheet).hidden = true; $("scrim").hidden = true; openSheet = null; document.body.style.overflow = ""; }
  $("scrim").onclick = hide;
  document.addEventListener("keydown", e => { if (e.key === "Escape" && $("lock").hidden) hide(); });
  document.querySelectorAll("[data-close]").forEach(b => b.onclick = hide);
  const envChipsHtml = sel => sortedEnvs().map(e => `<button type="button" class="chip" data-e="${esc(e.id)}" aria-pressed="${sel === e.id}">${svg(iconFor(e.name))}${esc(e.name)}</button>`).join("")
    + `<button type="button" class="chip" data-e="" aria-pressed="${sel === ""}">None</button>`;
  const acctChipsHtml = sel => ACCOUNTS.map(a => `<button type="button" class="chip" data-a="${a.id}" aria-pressed="${sel === a.id}"><i style="background:${a.color}"></i>${esc(a.name)}</button>`).join("");
  const armed = (btn, label) => { if (!btn.classList.contains("arm")) { btn.classList.add("arm"); btn.textContent = label || "Tap again"; return false; } return true; };
  const disarm = (btn, text) => { btn.classList.remove("arm"); btn.textContent = text; };

  // Transaction sheet
  const tx = { kind: "out", env: "", account: "airtel", editing: null, bal: null };
  function setKind(k){ tx.kind = k; $("kindSeg").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.k === k)); $("envField").hidden = k === "in"; }
  $("kindSeg").querySelectorAll("button").forEach(b => b.onclick = () => setKind(b.dataset.k));
  function drawChips(){ $("envChips").innerHTML = envChipsHtml(tx.env); $("acctChips").innerHTML = acctChipsHtml(tx.account); }
  $("envChips").onclick = e => { const b = e.target.closest("[data-e]"); if (!b) return; tx.env = b.dataset.e; drawChips(); };
  $("acctChips").onclick = e => { const b = e.target.closest("[data-a]"); if (!b) return; tx.account = b.dataset.a; drawChips(); };
  function lastAccount(){ const t = [...db.txs].sort(byNewest).find(t => !t.example); return t ? t.account : "airtel"; }

  function openTx(existing, preset = {}){
    tx.editing = existing || null; tx.bal = existing && Number.isFinite(existing.bal) ? existing.bal : null;
    setKind(existing ? existing.kind : preset.kind || "out");
    tx.env = existing ? existing.env || "" : (sortedEnvs()[0] || {}).id || "";
    tx.account = existing ? existing.account : lastAccount();
    $("txTitle").textContent = existing ? "Edit transaction" : preset.kind === "in" ? "New income" : "New transaction";
    $("fAmt").value = existing ? (existing.amount / 100).toFixed(2) : "";
    $("fFee").value = existing && existing.fee ? (existing.fee / 100).toFixed(2) : "";
    $("fDate").value = existing ? existing.date : (curMonth() === ui.month ? today() : ui.month + "-01");
    $("fNote").value = existing ? existing.note || "" : "";
    $("txErr").textContent = ""; $("smsBox").hidden = true; $("smsText").value = "";
    $("smsHint").textContent = "Copy the SMS in your messages app, then paste it here.";
    $("txDel").hidden = !existing; disarm($("txDel"), "Delete");
    drawChips(); show("txSheet");
    if (!existing && !preset.sms && !preset.paste && matchMedia("(pointer:fine)").matches) setTimeout(() => $("fAmt").focus(), 60);
    if (preset.sms) { $("smsBox").hidden = false; $("smsText").value = preset.sms; applySms(); }
    if (preset.paste) pasteSms();
  }
  async function pasteSms(){
    $("smsBox").hidden = false;
    if (navigator.clipboard && navigator.clipboard.readText) {
      try { const t = await navigator.clipboard.readText(); if (t && /\d/.test(t)) { $("smsText").value = t; applySms(); return; } } catch (e) {}
    }
    $("smsText").focus();
  }
  $("smsToggle").onclick = pasteSms;
  $("smsTop").onclick = () => openTx(null, { paste: true });
  $("avatarBtn").onclick = () => { location.hash = "home"; };
  $("smsText").addEventListener("paste", () => setTimeout(applySms, 0));
  $("smsParse").onclick = applySms;
  $("txDel").onclick = () => {
    if (!armed($("txDel"))) return;
    db.txs = db.txs.filter(t => t.id !== tx.editing.id); if (db.check && db.check.tx === tx.editing.id) delete db.check; save(); hide(); render(); toast("Transaction deleted");
  };
  $("txForm").onsubmit = e => {
    e.preventDefault();
    const amount = toNgwee($("fAmt").value);
    if (!(amount > 0)) { $("txErr").textContent = "Enter an amount above K0."; return; }
    const feeRaw = $("fFee").value.trim(), feeVal = feeRaw ? toNgwee(feeRaw) : 0;
    if (!(feeVal >= 0)) { $("txErr").textContent = "Enter the fee as a number, like 2.50, or leave it empty."; return; }
    const date = $("fDate").value || today();
    const rec = { ...(tx.editing || {}), id: tx.editing ? tx.editing.id : uid(), kind: tx.kind, amount, account: tx.account, date, month: date.slice(0, 7),
      note: $("fNote").value.trim(), env: tx.kind === "out" ? tx.env : "", created: tx.editing ? tx.editing.created : Date.now() };
    if (feeVal) rec.fee = feeVal; else delete rec.fee;
    if (Number.isFinite(tx.bal)) rec.bal = tx.bal; else delete rec.bal;
    if (tx.editing) db.txs = db.txs.map(t => t.id === rec.id ? rec : t); else db.txs.push(rec);
    if (Number.isFinite(rec.bal) && balanceAfter(rec) !== rec.bal) db.check = { tx: rec.id };
    else if (db.check && db.check.tx === rec.id) delete db.check;
    save(); hide(); ui.month = rec.month; render();
    toast(tx.editing ? "Saved" : (rec.kind === "in" ? "+" : "−") + fmt(rec.amount) + (feeVal ? ` (+${fmt(feeVal)} fee)` : "") + ` · ${acct(rec.account).short} balance ${fmt(walletBalances()[rec.account].bal)}`);
  };

  // Envelope sheet
  let editingEnv = null;
  function openEnv(e){
    editingEnv = e;
    $("envTitle").textContent = e ? e.name : "New envelope";
    $("eAmtLbl").textContent = e ? `Monthly limit from ${monthName(ui.month)}` : "Monthly limit";
    $("eName").value = e ? e.name : ""; $("eAmt").value = e ? (budgetFor(e, ui.month) / 100).toFixed(2) : "";
    $("eRoll").checked = e ? !!e.rollover : false;
    $("eNums").value = e && e.numbers ? e.numbers.map(n => "0" + n).join(", ") : "";
    $("eDel").hidden = !e; disarm($("eDel"), "Delete"); $("envErr").textContent = "";
    const T = totals();
    if (e) {
      const r = T.envs[e.id];
      $("envSummary").hidden = false;
      $("envSummary").innerHTML = `<div><span>Available</span><b>${fmt(r.avail, true)}</b></div><div><span>Spent</span><b>${fmt(r.spent, true)}</b></div><div class="${r.left < 0 ? "over" : ""}"><span>Left</span><b>${fmt(r.left, true)}</b></div>`;
      $("envTx").innerHTML = T.tx.filter(t => t.env === e.id).sort(byNewest).map(txLine).join("");
    } else { $("envSummary").hidden = true; $("envTx").innerHTML = ""; }
    show("envSheet");
    if (!e && matchMedia("(pointer:fine)").matches) setTimeout(() => $("eName").focus(), 60);
  }
  $("envTx").onclick = ev => { const b = ev.target.closest("[data-tx]"); if (b) openTx(db.txs.find(t => t.id === b.dataset.tx)); };
  $("eDel").onclick = () => {
    if (!armed($("eDel"))) return;
    const id = editingEnv.id; db.envs = db.envs.filter(x => x.id !== id); db.txs.forEach(t => { if (t.env === id) t.env = ""; });
    db.bills.forEach(b => { if (b.env === id) b.env = ""; });
    save(); hide(); render(); toast("Envelope deleted. Its transactions are kept.");
  };
  $("envForm").onsubmit = ev => {
    ev.preventDefault();
    const name = $("eName").value.trim(); const raw = $("eAmt").value.trim(); const budget = raw === "" ? 0 : toNgwee(raw);
    if (!name) { $("envErr").textContent = "Give the envelope a name."; return; }
    if (!(budget >= 0)) { $("envErr").textContent = "Enter the monthly limit as a number, like 1500."; return; }
    const roll = $("eRoll").checked;
    const numbers = parseNums($("eNums").value);
    const taken = numbers.find(n => db.envs.some(x => x !== editingEnv && (x.numbers || []).includes(n)));
    if (taken) { $("envErr").textContent = `0${taken} is already set on another envelope.`; return; }
    if (editingEnv) {
      const e = editingEnv; e.name = name; e.rollover = roll; e.example = false; e.budget = budget; e.numbers = numbers;
      e.budgets = e.budgets || {}; Object.keys(e.budgets).forEach(k => { if (k > ui.month) delete e.budgets[k]; });
      if (ui.month < e.since) e.since = ui.month;
      e.budgets[ui.month] = budget;
    } else db.envs.push({ id: uid(), name, budget, budgets: { [ui.month]: budget }, since: ui.month, rollover: roll, order: db.envs.length, numbers });
    save(); hide(); render(); toast("Envelope saved");
  };

  // Bill sheet
  const bill = { editing: null, env: "", account: "airtel" };
  function drawBillChips(){ $("bEnvChips").innerHTML = envChipsHtml(bill.env); $("bAcctChips").innerHTML = acctChipsHtml(bill.account); }
  $("bEnvChips").onclick = e => { const b = e.target.closest("[data-e]"); if (!b) return; bill.env = b.dataset.e; drawBillChips(); };
  $("bAcctChips").onclick = e => { const b = e.target.closest("[data-a]"); if (!b) return; bill.account = b.dataset.a; drawBillChips(); };
  function openBill(b){
    bill.editing = b || null;
    bill.env = b ? b.env || "" : ""; bill.account = b ? b.account || "airtel" : lastAccount();
    $("billTitle").textContent = b ? b.name : "New recurring bill";
    $("bName").value = b ? b.name : ""; $("bAmt").value = b ? (b.amount / 100).toFixed(2) : ""; $("bDay").value = b ? b.day : "";
    $("bDel").hidden = !b; disarm($("bDel"), "Delete"); $("bCal").hidden = !b; $("billErr").textContent = "";
    drawBillChips(); show("billSheet");
  }
  $("bDel").onclick = () => { if (!armed($("bDel"))) return; db.bills = db.bills.filter(x => x !== bill.editing); save(); hide(); render(); toast("Bill deleted"); };
  $("bCal").onclick = () => { const b = bill.editing; if (!b) return; download(`${b.name.replace(/[^\w-]+/g, "-")}-reminder.ics`, icsFor(b), "text/calendar"); toast("Open the file to add a monthly reminder"); };
  $("billForm").onsubmit = ev => {
    ev.preventDefault();
    const name = $("bName").value.trim(), amount = toNgwee($("bAmt").value), day = parseInt($("bDay").value, 10);
    if (!name) { $("billErr").textContent = "Give the bill a name."; return; }
    if (!(amount > 0)) { $("billErr").textContent = "Enter the usual amount, like 450."; return; }
    if (!(day >= 1 && day <= 31)) { $("billErr").textContent = "Enter the day of the month it's due, from 1 to 31."; return; }
    if (bill.editing) Object.assign(bill.editing, { name, amount, day, env: bill.env, account: bill.account, example: false });
    else db.bills.push({ id: uid(), name, amount, day, env: bill.env, account: bill.account, paid: {} });
    save(); hide(); render(); toast("Bill saved");
    if ("Notification" in window && Notification.permission === "default" && !store.get("ke-notif-asked", "")) { store.set("ke-notif-asked", "1"); setTimeout(() => toast("Tip: allow bill reminders in Settings"), 2800); }
  };

  // Goal sheet
  let editingGoal = null;
  function drawGoal(){
    const g = editingGoal;
    $("goalAddRow").hidden = !g; $("gStartWrap").hidden = !!g; $("gDel").hidden = !g;
    if (!g) { $("goalProgress").innerHTML = ""; $("goalLog").innerHTML = ""; return; }
    const s = saved(g);
    $("goalProgress").innerHTML = `<div class="goal-hero">${ring(g.target ? s / g.target : 0, 72)}<div><div class="big">${fmt(s)}</div><small>of ${fmt(g.target)} · ${esc(goalPlan(g))}</small></div></div>`;
    $("goalLog").innerHTML = [...g.log].reverse().slice(0, 12).map(x => `<div class="logline"><span>${esc(shortDate(x.d))}</span><b class="${x.a < 0 ? "neg" : ""}">${x.a < 0 ? "−" : "+"}${fmt(Math.abs(x.a))}</b></div>`).join("");
  }
  function openGoal(g){
    editingGoal = g || null;
    $("goalTitle").textContent = g ? g.name : "New savings goal";
    $("gName").value = g ? g.name : ""; $("gTarget").value = g ? (g.target / 100).toFixed(2) : ""; $("gBy").value = g ? g.by || "" : "";
    $("gStart").value = ""; $("gAdd").value = ""; $("goalErr").textContent = ""; disarm($("gDel"), "Delete");
    drawGoal(); show("goalSheet");
  }
  function moveGoal(sign){
    const g = editingGoal, a = toNgwee($("gAdd").value);
    if (!(a > 0)) { $("goalErr").textContent = "Enter an amount above K0."; return; }
    const before = saved(g);
    if (sign < 0 && a > before) { $("goalErr").textContent = `You can take out at most ${fmt(before)}.`; return; }
    g.log.push({ d: today(), a: sign * a }); g.example = false; $("gAdd").value = ""; $("goalErr").textContent = "";
    save(); drawGoal(); render();
    toast(before < g.target && saved(g) >= g.target ? `${g.name} reached! 🎉` : sign > 0 ? `+${fmt(a)} added to ${g.name}` : `${fmt(a)} taken out of ${g.name}`);
  }
  $("gPlus").onclick = () => moveGoal(1);
  $("gMinus").onclick = () => moveGoal(-1);
  $("gDel").onclick = () => { if (!armed($("gDel"))) return; db.goals = db.goals.filter(x => x !== editingGoal); save(); hide(); render(); toast("Goal deleted"); };
  $("goalForm").onsubmit = ev => {
    ev.preventDefault();
    const name = $("gName").value.trim(), target = toNgwee($("gTarget").value), by = $("gBy").value || "";
    if (!name) { $("goalErr").textContent = "Give the goal a name."; return; }
    if (!(target > 0)) { $("goalErr").textContent = "Enter the target amount, like 10000."; return; }
    if (editingGoal) Object.assign(editingGoal, { name, target, by, example: false });
    else { const start = toNgwee($("gStart").value); db.goals.push({ id: uid(), name, target, by, log: start > 0 ? [{ d: today(), a: start }] : [] }); }
    save(); hide(); render(); toast("Goal saved");
  };

  // ---------- settings ----------
  function applyTheme(t){ if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme");
    $("themeSeg").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === (t || "system"))); }
  let theme = store.get("ke-theme", "system"); applyTheme(theme);
  $("themeSeg").querySelectorAll("button").forEach(b => b.onclick = () => { theme = b.dataset.t; store.set("ke-theme", theme); applyTheme(theme); });
  let clearArm = false, resetArm = false;
  function drawSettings(){
    const on = !!store.get("ke-pin", "");
    $("pinRowT").textContent = on ? "Change PIN" : "Turn on app lock";
    $("pinRowS").textContent = on ? "App lock is on. Locks after 1 minute away." : "Ask for a 4-digit PIN when the app opens";
    pinOffArm = false; $("pinOff").querySelector("span").textContent = "Turn off app lock";
    $("pinOff").hidden = !on; $("bioRow").hidden = !(on && bioAvailable); $("bioSw").checked = !!store.get("ke-bio", "");
    const N = "Notification" in window ? Notification.permission : "unsupported";
    $("notifT").textContent = N === "granted" ? "Bill reminders are on" : N === "denied" ? "Bill reminders are blocked" : N === "unsupported" ? "Reminders aren't supported here" : "Allow bill reminders";
    $("notifS").textContent = N === "denied" ? "Allow notifications for this app in your phone's settings" : N === "unsupported" ? "Use “Add reminder to my calendar” on each bill instead" : "Shows a notification when a bill is due within 2 days and you open the app";
    $("clearExBtn").hidden = !hasExamples();
  }
  $("openSettings").onclick = () => { resetArm = false; clearArm = false; $("resetBtn").querySelector("span").textContent = "Erase everything";
    $("clearExBtn").querySelector("span").textContent = "Clear example data"; $("setMsg").textContent = "Your budget is stored on this phone only. Back it up now and then."; drawSettings(); show("setSheet"); };
  $("installRow").onclick = doInstall;
  $("notifRow").onclick = async () => {
    if (!("Notification" in window) || Notification.permission !== "default") return;
    try { await Notification.requestPermission(); } catch (e) {}
    drawSettings(); if (Notification.permission === "granted") { toast("Bill reminders on"); remindBills(true); }
  };
  $("backupBtn").onclick = () => { download(`kwacha-backup-${today()}.json`, JSON.stringify({ app: "kwacha-envelopes", exported: new Date().toISOString(), ...db }, null, 2), "application/json"); toast("Backup saved to your downloads"); };
  $("restoreFile").onchange = async e => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (!Array.isArray(d.envs) || !Array.isArray(d.txs)) throw new Error("shape");
      db = migrate({ v: d.v, envs: d.envs, txs: d.txs, bills: d.bills, goals: d.goals, adj: d.adj }); save(); hide(); render(); toast(`Restored ${d.txs.length} transactions`);
    } catch (err) { $("setMsg").textContent = "That file isn't a Kwacha backup. Pick the .json file you saved from Back up data."; }
  };
  function clearExamples(){
    db.txs = db.txs.filter(t => !t.example); db.bills = db.bills.filter(b => !b.example); db.goals = db.goals.filter(g => !g.example);
    db.envs.forEach(e => { if (e.example) { e.budget = 0; e.budgets = { [e.since]: 0 }; e.example = false; } });
    save(); render(); toast("Examples cleared. Tap an envelope to set its limit.");
  }
  $("clearExBtn").onclick = () => { if (!clearArm) { clearArm = true; $("clearExBtn").querySelector("span").textContent = "Tap again to clear"; return; } clearExamples(); hide(); };
  $("resetBtn").onclick = () => {
    if (!resetArm) { resetArm = true; $("resetBtn").querySelector("span").textContent = "Tap again to erase everything"; return; }
    db = { v: 3, envs: [], txs: [], bills: [], goals: [], adj: [] }; save(); hide(); render(); toast("All data erased");
  };

  // ---------- bill reminders ----------
  async function remindBills(force){
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (!force && store.get("ke-notified", "") === today()) return;
    const m = curMonth();
    const soon = db.bills.filter(b => !b.example).map(b => ({ b, st: billState(b, m) })).filter(x => !x.st.paid && x.st.days <= 2);
    if (!soon.length) return;
    store.set("ke-notified", today());
    const body = soon.map(x => `${x.b.name} ${fmt(x.b.amount, true)} · ${x.st.days < 0 ? "overdue" : x.st.days === 0 ? "due today" : "due in " + x.st.days + " day" + (x.st.days > 1 ? "s" : "")}`).join("\n");
    const opts = { body, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", tag: "kwacha-bills" };
    try { const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration(); if (reg) reg.showNotification("Bills due", opts); else new Notification("Bills due", opts); } catch (e) {}
  }

  // ---------- app lock ----------
  const bioAvailable = !!(window.PublicKeyCredential && navigator.credentials && window.isSecureContext);
  const lockS = { mode: "unlock", entry: "", first: "", tries: 0, until: 0, forgot: false, hiddenAt: 0 };
  const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))), unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function hashPin(pin, salt){
    if (window.crypto && crypto.subtle) { const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + ":" + pin)); return [...new Uint8Array(h)].map(x => x.toString(16).padStart(2, "0")).join(""); }
    let h = 2166136261; for (const c of salt + ":" + pin) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16);
  }
  function lockDots(){ $("pinDots").querySelectorAll("i").forEach((d, i) => d.classList.toggle("on", i < lockS.entry.length)); }
  function lockMsg(t, err){ const m = $("lockMsg"); m.textContent = t; m.classList.toggle("err", !!err); }
  function showLock(mode){
    lockS.mode = mode; lockS.entry = ""; lockS.forgot = false; lockDots();
    $("lock").hidden = false;
    $("lockTitle").textContent = mode === "unlock" ? "Enter your PIN" : mode === "set1" ? "Choose a 4-digit PIN" : "Enter the PIN again";
    lockMsg(mode === "unlock" ? "Kwacha Envelopes is locked" : mode === "set1" ? "You'll enter it each time the app opens" : "To make sure it's right");
    $("lockCancel").hidden = mode === "unlock"; $("lockForgot").hidden = mode !== "unlock"; $("lockForgot").textContent = "Forgot PIN?";
    $("bioKey").classList.toggle("off", !(mode === "unlock" && store.get("ke-bio", "") && bioAvailable));
    if (mode === "unlock") { document.documentElement.classList.add("locked"); hide(); }
  }
  function unlock(){
    $("lock").hidden = true; document.documentElement.classList.remove("locked"); lockS.tries = 0;
    remindBills(false);
  }
  async function lockKey(k){
    if (k === "bio") { tryBio(); return; }
    if (k === "del") { lockS.entry = lockS.entry.slice(0, -1); lockDots(); return; }
    if (lockS.entry.length >= 4) return;
    if (lockS.mode === "unlock" && Date.now() < lockS.until) { lockMsg(`Too many tries. Wait ${Math.ceil((lockS.until - Date.now()) / 1000)} seconds.`, true); return; }
    lockS.entry += k; lockDots();
    if (lockS.entry.length < 4) return;
    const pin = lockS.entry;
    if (lockS.mode === "set1") { lockS.first = pin; setTimeout(() => showLock("set2"), 150); return; }
    if (lockS.mode === "set2") {
      if (pin !== lockS.first) { shake(); setTimeout(() => { showLock("set1"); lockMsg("The PINs didn't match. Try again.", true); }, 380); return; }
      const salt = b64(crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(12)) : new Uint8Array(12).map(() => Math.random() * 255));
      store.set("ke-pin", salt + "." + await hashPin(pin, salt));
      $("lock").hidden = true; drawSettings(); toast("App lock is on");
      return;
    }
    const [salt, hash] = store.get("ke-pin", ".").split(".");
    if (await hashPin(pin, salt) === hash) { unlock(); return; }
    lockS.tries++; shake();
    setTimeout(() => {
      lockS.entry = ""; lockDots();
      if (lockS.tries >= 5) { lockS.until = Date.now() + 30000; lockS.tries = 0; lockMsg("Too many tries. Wait 30 seconds.", true); }
      else lockMsg(`Wrong PIN. ${5 - lockS.tries} ${5 - lockS.tries === 1 ? "try" : "tries"} left before a short wait.`, true);
    }, 380);
  }
  function shake(){ const d = $("pinDots"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake"); }
  $("keypad").onclick = e => { const b = e.target.closest("[data-k]"); if (b) lockKey(b.dataset.k); };
  document.addEventListener("keydown", e => { if ($("lock").hidden) return; if (/^\d$/.test(e.key)) lockKey(e.key); else if (e.key === "Backspace") lockKey("del"); });
  $("lockCancel").onclick = () => { $("lock").hidden = true; drawSettings(); };
  $("lockForgot").onclick = () => {
    if (!lockS.forgot) { lockS.forgot = true; $("lockForgot").textContent = "Erase all data and reset"; lockMsg("Without the PIN, the only way in is to erase everything on this phone. Restore a backup afterwards if you have one.", true); return; }
    db = { v: 3, envs: [], txs: [], bills: [], goals: [], adj: [] }; save(); store.del("ke-pin"); store.del("ke-bio"); unlock(); render(); toast("Data erased and app lock removed");
  };
  $("pinRow").onclick = () => showLock("set1");
  let pinOffArm = false;
  $("pinOff").onclick = () => {
    if (!pinOffArm) { pinOffArm = true; $("pinOff").querySelector("span").textContent = "Tap again to turn off app lock"; return; }
    store.del("ke-pin"); store.del("ke-bio"); drawSettings(); toast("App lock is off");
  };
  $("bioSw").onchange = async () => {
    if (!$("bioSw").checked) { store.del("ke-bio"); toast("Fingerprint and face unlock off"); return; }
    try {
      const cred = await navigator.credentials.create({ publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: "Kwacha Envelopes", id: location.hostname },
        user: { id: crypto.getRandomValues(new Uint8Array(16)), name: "kwacha", displayName: "Kwacha Envelopes" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "discouraged" }, timeout: 60000 } });
      store.set("ke-bio", b64(cred.rawId)); toast("Fingerprint or face unlock is on");
    } catch (e) { $("bioSw").checked = false; toast("Couldn't set it up on this phone. Your PIN still works."); }
  };
  async function tryBio(){
    const id = store.get("ke-bio", ""); if (!id || !bioAvailable) return;
    try {
      await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: "public-key", id: unb64(id) }], userVerification: "required", timeout: 60000 } });
      unlock();
    } catch (e) { lockMsg("Use your PIN instead"); }
  }
  document.addEventListener("visibilitychange", () => {
    if (!store.get("ke-pin", "")) return;
    if (document.hidden) { lockS.hiddenAt = Date.now(); document.documentElement.classList.add("veil"); }
    else { document.documentElement.classList.remove("veil"); if ($("lock").hidden && Date.now() - lockS.hiddenAt > 60000) showLock("unlock"); }
  });

  // ---------- delegated actions ----------
  document.addEventListener("click", e => {
    const t = e.target;
    const pay = t.closest("[data-pay]"); if (pay) { const b = db.bills.find(x => x.id === pay.dataset.pay); if (b) markPaid(b); return; }
    const act = t.closest("[data-act]");
    if (act) {
      const a = act.dataset.act;
      if (a === "prev") { ui.month = shiftMonth(ui.month, -1); render(); }
      else if (a === "next") { ui.month = shiftMonth(ui.month, 1); render(); }
      else if (a === "eye") { hideAmounts = !hideAmounts; store.set("ke-hide", hideAmounts ? "1" : "0"); render(); }
      else if (a === "expense") openTx(null, { kind: "out" });
      else if (a === "income") openTx(null, { kind: "in" });
      else if (a === "sms") openTx(null, { paste: true });
      else if (a === "envelopes") location.hash = "envelopes";
      else if (a === "newenv") openEnv(null);
      else if (a === "newbill") openBill(null);
      else if (a === "newgoal") openGoal(null);
      else if (a === "clearex") clearExamples();
      else if (a === "matchsms") {
        const c = smsCheck();
        if (c) { db.adj.push({ id: uid(), account: c.t.account, date: c.t.date, created: (c.t.created || 0) + 0.5, delta: c.diff, note: "Matched to SMS balance" });
          toast(`${acct(c.t.account).short} matched to the SMS balance of ${fmt(c.sms)}`); }
        delete db.check; save(); render();
      }
      else if (a === "keepmine") { delete db.check; save(); render(); toast("Kept your entries"); }
      else if (a === "install") doInstall();
      else if (a === "copylink") copyLink();
      else if (a === "hideinstall") { installDismissed = true; store.set("ke-install-x", "1"); render(); }
      return;
    }
    const env = t.closest("[data-env]"); if (env) { openEnv(envById(env.dataset.env)); return; }
    const bl = t.closest("main [data-bill]"); if (bl) { openBill(db.bills.find(x => x.id === bl.dataset.bill)); return; }
    const gl = t.closest("main [data-goal]"); if (gl) { openGoal(db.goals.find(x => x.id === gl.dataset.goal)); return; }
    const row = t.closest("main [data-tx]"); if (row) { openTx(db.txs.find(x => x.id === row.dataset.tx)); return; }
    const f = t.closest("[data-f]"); if (f) { ui.filter = f.dataset.f; render(); }
  });
  document.addEventListener("input", e => { if (e.target.id === "q") { ui.q = e.target.value; render(); } });

  function route(){ const v = location.hash.slice(1); ui.view = TITLES[v] ? v : "home"; render(); scrollTo(0, 0); }
  addEventListener("hashchange", route);

  let toastT;
  function toast(msg){ const el = $("toast"); el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 2600); }

  // ---------- SMS parsing ----------
  const ENV_HINTS = [
    [/zesco|electric|units|prepaid/i, /electric|zesco|power|utilit/i],
    [/airtime|bundle|data|talktime/i, /airtime|data|phone/i],
    [/fuel|puma|total\s?energies|engen|mount meru|filling/i, /fuel|transport/i],
    [/shoprite|pick ?n ?pay|spar|choppies|game stores|food lover|hungry lion/i, /grocer|food/i],
    [/water|lwsc|lusaka water/i, /water|utilit/i],
    [/rent|landlord/i, /rent|hous/i],
    [/dstv|gotv|netflix|showmax|topstar/i, /entertain|subscr|tv|fun|going out/i]
  ];
  const titleCase = s => s.trim().replace(/\s+/g, " ").toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase())
    .replace(/\b(Nfs|Mtn|Zesco|Lwsc|Atm|Pos|Fnb)\b/g, w => w.toUpperCase());
  function parseSms(text){
    const t = text.replace(/\s+/g, " ").trim(); const out = {};
    if (/(declined|unsuccessful|failed|not sufficient|insufficient|reversed|cancelled)/i.test(t)) { out.skip = "declined"; return out; }
    const before = i => t.slice(Math.max(0, i - 22), i);
    const figs = [...t.matchAll(/\b(ZMW|ZK|ZAR|USD|K)\s?([\d,]+(?:\.\d{1,2})?)(?:\s?(ZMW))?/gi)].map(m => ({
      cur: (m[3] || m[1]).toUpperCase().replace(/^K$|^ZK$/, "ZMW"), val: m[2].replace(/,/g, ""),
      isBal: /(bal(ance)?( is)?|new balance)\W*$/i.test(before(m.index)),
      isFee: /(fee|charges?|cost|commission|levy)\W*(of|is)?\W*$/i.test(before(m.index))
    }));
    const balTail = t.match(/(?:new balance|bal(?:ance)?(?: is)?)\W*(?:ZMW\s?)?([\d,]+\.\d{2})\s?(?:ZMW)?/i);
    const feeM = t.match(/(?:fee|charges?|transaction cost|commission|levy)\s*(?:of|is)?\s*[:\-]?\s*(?:ZMW|ZK|K)?\s?([\d,]+(?:\.\d{1,2})?)/i);
    const main = figs.find(f => !f.isBal && !f.isFee);
    if (main) { out.amount = main.val; out.cur = main.cur; }
    if (balTail) out.bal = balTail[1].replace(/,/g, "");
    if (feeM && parseFloat(feeM[1].replace(/,/g, "")) > 0) out.fee = feeM[1].replace(/,/g, "");
    if (/(received|credited|deposit|cash ?in|has sent you|you have got|refund)/i.test(t)) out.kind = "in";
    else if (/(sent|paid|payment|debited|withdr|purchase|bought|transferred|cash ?out|pos )/i.test(t)) out.kind = "out";
    if (/y['’]ello|\bmomo\b|\bmtn\b/i.test(t)) out.account = "mtn";
    else if (/zanaco/i.test(t)) out.account = "zanaco";
    else if (/\bfnb\b|first national/i.test(t)) out.account = "fnb";
    else if (/stanbic/i.test(t)) out.account = "stanbic";
    else if (/absa/i.test(t)) out.account = "absa";
    else if (/airtel|TID:\s?PP\d/i.test(t)) out.account = "airtel";
    const who = t.match(/\b(?:to|from|at)\s+([A-Za-z][A-Za-z0-9 &.'-]{1,40}?)(?=\s+(?:on|at|ref|txn|trans|id|for|new|your|bal|successful|\d)|[.,;]|$)/i);
    const ref = t.match(/Message:-?\s*([^.]{2,60}?)(?:\.\s|$)/i);
    const parts = []; if (who) parts.push(titleCase(who[1])); if (ref) parts.push(titleCase(ref[1].split(",")[0]));
    if (parts.length) out.note = parts.join(" · ");
    let d = t.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (d) out.date = `${d[1]}-${d[2]}-${d[3]}`;
    else if ((d = t.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/))) { const y = d[3].length === 2 ? "20" + d[3] : d[3]; out.date = `${y}-${d[2].padStart(2, "0")}-${d[1].padStart(2, "0")}`; }
    else if ((d = t.match(/TID:\s?PP(\d{2})(\d{2})(\d{2})/i))) out.date = `20${d[1]}-${d[2]}-${d[3]}`;
    // Envelope phone-number rules win over the keyword guesses below.
    const nums = [...t.matchAll(/\+?\d[\d ]{8,15}\d/g)].map(m => last9(m[0])).filter(n => n.length === 9);
    const byNum = nums.length && db.envs.find(e => (e.numbers || []).some(n => nums.includes(n)));
    if (byNum) out.env = byNum.id;
    else for (const [needle, envRe] of ENV_HINTS) { if (needle.test(t)) { const e = db.envs.find(x => envRe.test(x.name)); if (e) { out.env = e.id; break; } } }
    return out;
  }
  function applySms(){
    const r = parseSms($("smsText").value); const hint = $("smsHint");
    tx.bal = null;
    if (r.skip) { hint.textContent = "That payment was declined, so no money moved. Nothing to record."; return; }
    if (r.amount && r.cur && r.cur !== "ZMW") { if (r.account) tx.account = r.account; if (r.kind) setKind(r.kind); drawChips();
      hint.textContent = `That amount is in ${r.cur}. Enter the Kwacha that left your wallet.`; return; }
    if (!r.amount) { hint.textContent = "Couldn't find an amount in that message. Fill the fields in by hand."; return; }
    if (r.kind) setKind(r.kind);
    $("fAmt").value = r.amount;
    $("fFee").value = r.fee || "";
    if (r.account) tx.account = r.account;
    if (r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date)) $("fDate").value = r.date;
    if (r.note) $("fNote").value = r.note;
    if (r.env) tx.env = r.env;
    if (r.bal) tx.bal = toNgwee(r.bal);
    drawChips();
    const got = ["amount", r.fee && "fee", r.kind && "type", r.account && "wallet", r.note && "who", r.date && "date", r.env && "envelope", r.bal && "balance"].filter(Boolean);
    hint.textContent = "Filled in " + got.join(", ") + ". Check it, then save.";
  }
  window.__parseSms = parseSms;

  // ---------- start ----------
  route();
  const params = new URLSearchParams(location.search);
  const shared = [params.get("text"), params.get("title")].filter(Boolean).join(" ");
  if (shared) { history.replaceState(null, "", "/" + location.hash); openTx(null, { sms: shared }); }
  if (params.get("add") === "1") { history.replaceState(null, "", "/"); openTx(null); }
  if (store.get("ke-pin", "")) { showLock("unlock"); if (store.get("ke-bio", "")) setTimeout(tryBio, 300); } else { document.documentElement.classList.remove("locked"); remindBills(false); }
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
})();
