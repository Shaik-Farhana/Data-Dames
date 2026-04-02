import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { analyzeImage, addTransaction, getDashboard, getWeeklyReport } from "./api";

const C = {
  bg: "#fff0f6", bgDeep: "#ffe0ef", card: "#ffffff", border: "#ffd6ea",
  pink: "#e91e8c", pinkLight: "#ff6abf", pinkPale: "#fff0f6",
  magenta: "#c2185b", gold: "#f59e0b", goldLight: "#fde68a",
  purple: "#9c27b0", green: "#00897b", red: "#e53935",
  text: "#2d1b35", muted: "#a0688a", white: "#ffffff",
};

const toNumber = (value) => Number(value) || 0;

const Spinner = () => (
  <span style={{ display: "inline-block", width: 18, height: 18, border: `2px solid ${C.pink}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
);
const Pill = ({ children, color = C.pink }) => (
  <span style={{ background: color + "20", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, display: "inline-block" }}>{children}</span>
);
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "20px 22px", boxShadow: `0 4px 24px ${C.pink}12`, ...style }}>{children}</div>
);

const HEARTS = ["♥", "♡", "💕", "💗", "✿", "✦"];
const FloatingHearts = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
    {Array.from({ length: 14 }).map((_, i) => {
      const left = (i * 71 + 13) % 97, delay = (i * 0.7) % 6, dur = 8 + (i * 1.3) % 6, size = 14 + (i * 7) % 18;
      return (
        <span key={i} style={{
          position: "absolute", left: `${left}%`, bottom: "-40px", fontSize: size,
          color: i % 3 === 0 ? C.pink + "66" : i % 3 === 1 ? C.purple + "44" : C.gold + "55",
          animation: `floatUp ${dur}s ${delay}s ease-in infinite`, userSelect: "none",
        }}>{HEARTS[i % HEARTS.length]}</span>
      );
    })}
  </div>
);

const TABS = [
  { id: "vision", icon: "📸", label: "Ideas" },
  { id: "log", icon: "💬", label: "Daily Log" },
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "coach", icon: "🔊", label: "Coach" },
];

export default function App() {
  const [tab, setTab] = useState("vision");
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,${C.bg} 0%,${C.bgDeep} 50%,#f3e8ff 100%)`, color: C.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:.8}80%{opacity:.6}100%{transform:translateY(-105vh) scale(1.2);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heartBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
        .fadeUp{animation:fadeUp .35s ease both}
        button{cursor:pointer;border:none;font-family:inherit}
        textarea,input{font-family:inherit}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
      `}</style>
      <FloatingHearts />
      <header style={{ padding: "14px 22px", background: "rgba(255,240,246,0.85)", backdropFilter: "blur(14px)", borderBottom: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28, animation: "heartBeat 2s ease infinite" }}>💜</span>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, lineHeight: 1, background: `linear-gradient(135deg,${C.pink},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VentureHer</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: 1 }}>YOUR AI CO-FOUNDER</div>
          </div>
        </div>
        <Pill color={C.purple}>💪 Women First</Pill>
      </header>
      <nav style={{ display: "flex", gap: 6, padding: "10px 16px", background: "rgba(255,240,246,0.7)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}`, overflowX: "auto", position: "sticky", top: 62, zIndex: 40 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", borderRadius: 50, fontSize: 13, fontWeight: 700, background: tab === t.id ? `linear-gradient(135deg,${C.pink},${C.pinkLight})` : "transparent", color: tab === t.id ? "#fff" : C.muted, border: `1.5px solid ${tab === t.id ? "transparent" : C.border}`, transition: "all .2s", whiteSpace: "nowrap", boxShadow: tab === t.id ? `0 4px 16px ${C.pink}44` : "none" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </nav>
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "28px 16px 100px", position: "relative", zIndex: 1 }}>
        {tab === "vision" && <VisionScreen />}
        {tab === "log" && <LogScreen />}
        {tab === "dashboard" && <DashboardScreen />}
        {tab === "coach" && <CoachScreen />}
      </main>
    </div>
  );
}

function VisionScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();
  const handle = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file)); setResult(null); setError(null); setLoading(true);
    try { const d = await analyzeImage(file); setResult(d.data || d); }
    catch { setError("Could not analyse image. Check backend is running."); }
    finally { setLoading(false); }
  };
  return (
    <div className="fadeUp">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 52, marginBottom: 10, animation: "heartBeat 3s ease infinite" }}>✨</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 800, lineHeight: 1.25, marginBottom: 10 }}>
          Show Me<br />
          <span style={{ background: `linear-gradient(135deg,${C.pink},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>What You Have</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6 }}>Photograph your kitchen or workspace.<br />Get a <strong>complete business plan</strong> in under 5 seconds.</p>
      </div>
      <div onClick={() => fileRef.current.click()} style={{ border: `2.5px dashed ${C.pink}`, borderRadius: 24, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: `linear-gradient(135deg,${C.pink}08,${C.purple}06)`, transition: "all .2s", marginBottom: 16 }}
        onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg,${C.pink}18,${C.purple}12)`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg,${C.pink}08,${C.purple}06)`; }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ maxHeight: 220, maxWidth: "100%", borderRadius: 16, objectFit: "cover", boxShadow: `0 8px 32px ${C.pink}33` }} />
        ) : (
          <><div style={{ fontSize: 52, marginBottom: 10 }}>📸</div>
            <p style={{ color: C.pink, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Tap to upload a photo</p>
            <p style={{ color: C.muted, fontSize: 13 }}>Kitchen · Craft table · Workspace · Anything!</p></>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
      </div>
      {loading && <Card style={{ textAlign: "center", padding: 32 }}><Spinner /><p style={{ color: C.muted, marginTop: 12, fontSize: 14 }}>Gemini Vision is reading your photo... ✨</p></Card>}
      {error && <Card style={{ borderColor: C.red + "44", background: C.red + "0a" }}><p style={{ color: C.red, fontSize: 14 }}>{error}</p></Card>}
      {result && <BusinessCard result={result} />}
    </div>
  );
}

function BusinessCard({ result }) {
  return (
    <div className="fadeUp">
      <Card style={{ marginBottom: 14, borderColor: C.pinkLight + "88" }}>
        <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: .5 }}>👀 I SPOTTED</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(result.identified_items || []).map((x, i) => <Pill key={i} color={C.muted}>{x}</Pill>)}
        </div>
      </Card>
      <Card style={{ marginBottom: 14, background: `linear-gradient(135deg,${C.pink}0a,${C.purple}08)`, borderColor: C.pink + "55" }}>
        <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: .5 }}>💡 YOUR BUSINESS IDEA</p>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.pink, marginBottom: 6 }}>{result.business_idea}</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{result.why_it_fits}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[{ label: "Startup Cost", val: `₹${result.startup_cost_inr}`, color: C.green }, { label: "Week 1 Revenue", val: `₹${result.first_week_revenue_potential_inr}`, color: C.gold }].map(s => (
            <div key={s.label} style={{ background: s.color + "15", border: `1.5px solid ${s.color}44`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
              <p style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.val}</p>
              <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{ color: C.text, fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: .5 }}>🎯 FIRST 3 STEPS</p>
        {(result.first_3_steps || []).map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.pinkLight})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
            <p style={{ color: C.text, fontSize: 14, lineHeight: 1.5 }}>{step}</p>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: "12px 16px", background: C.gold + "18", borderRadius: 14, borderLeft: `4px solid ${C.gold}` }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>💰 PRICING STRATEGY</p>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.5 }}>{result.pricing_strategy}</p>
        </div>
      </Card>
    </div>
  );
}

function LogScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    getDashboard()
      .then((d) => {
        const dashboard = d.data || d;
        setHistory(Array.isArray(dashboard?.transactions) ? dashboard.transactions : []);
      })
      .catch(() => {});
  }, []);
  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const d = await addTransaction(text);
      setResult(d.parsed);
      const dashboard = d.dashboard || d.data || {};
      if (Array.isArray(dashboard.transactions)) setHistory(dashboard.transactions);
      setText("");
    }
    catch { setError("Could not process. Is backend running?"); }
    finally { setLoading(false); }
  };
  return (
    <div className="fadeUp">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>💬</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Daily Log</h1>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>Just talk to me. Tell me what you bought or sold today —<br />in plain words, no accounting needed.</p>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder={'e.g. "bought dal for ₹120, sold 4 tiffins at ₹80 each"'} rows={3}
          style={{ width: "100%", background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", color: C.text, fontSize: 15, resize: "none", outline: "none", lineHeight: 1.7 }}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) submit(); }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>Ctrl+Enter to submit</span>
          <button onClick={submit} disabled={loading || !text.trim()} style={{ padding: "11px 26px", borderRadius: 50, fontWeight: 700, fontSize: 14, background: loading || !text.trim() ? C.border : `linear-gradient(135deg,${C.pink},${C.pinkLight})`, color: loading || !text.trim() ? C.muted : "#fff", boxShadow: loading || !text.trim() ? "none" : `0 4px 18px ${C.pink}44`, display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
            {loading ? <><Spinner /> Analysing...</> : "Add to Ledger ✨"}
          </button>
        </div>
      </Card>
      {error && <Card style={{ borderColor: C.red + "44", background: C.red + "0a", marginBottom: 12 }}><p style={{ color: C.red, fontSize: 14 }}>{error}</p></Card>}
      {result && (
        <div className="fadeUp">
          <Card style={{ borderColor: C.green + "55", background: C.green + "08", marginBottom: 14 }}>
            <p style={{ color: C.green, fontWeight: 700, marginBottom: 10 }}>✅ {typeof result.summary === "string" ? result.summary : "Entry logged successfully!"}</p>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted, fontSize: 13 }}>This entry net:</span>
              <span style={{ color: toNumber(result.net_profit_inr) >= 0 ? C.green : C.red, fontWeight: 800, fontSize: 16 }}>{toNumber(result.net_profit_inr) >= 0 ? "+" : ""}₹{toNumber(result.net_profit_inr)}</span>
            </div>
          </Card>
        </div>
      )}
      {history.length > 0 && (
        <Card>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 14, letterSpacing: .5 }}>📋 TODAY'S ENTRIES</p>
          {history.map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < history.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: .5, color: t.type === "income" ? C.green : C.red }}>{t.type === "income" ? "💰 INCOME" : "💸 EXPENSE"}</span>
                  <Pill color={C.purple}>{t.category}</Pill>
                </div>
                <p style={{ color: C.text, fontSize: 14 }}>{t.description}</p>
              </div>
              <span style={{ fontWeight: 800, fontSize: 17, color: t.type === "income" ? C.green : C.red }}>{t.type === "income" ? "+" : "-"}₹{toNumber(t.amount_inr)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function DashboardScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => { getDashboard().then(d => setData(d.data || d)).catch(() => setError("Could not load dashboard.")).finally(() => setLoading(false)); }, []);
  if (loading) return <div style={{ textAlign: "center", paddingTop: 60 }}><Spinner /><p style={{ color: C.muted, marginTop: 14 }}>Loading your numbers...</p></div>;
  if (error) return <Card style={{ borderColor: C.red + "44" }}><p style={{ color: C.red }}>{error}</p></Card>;
  const rev = toNumber(data?.total_revenue), exp = toNumber(data?.total_expenses), prof = toNumber(data?.net_profit), txns = Array.isArray(data?.transactions) ? data.transactions : [];
  const barData = [{ name: "Revenue", value: rev, color: C.green }, { name: "Expenses", value: exp, color: C.red }, { name: "Profit", value: Math.max(prof, 0), color: C.pink }];
  const cats = {};
  txns.filter(t => t.type === "expense").forEach(t => { cats[t.category] = (cats[t.category] || 0) + toNumber(t.amount_inr); });
  const catData = Object.entries(cats).map(([name, value]) => ({ name, value }));
  const clrs = [C.pink, C.purple, C.gold, C.green, C.muted];
  return (
    <div className="fadeUp">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>📊</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Your Numbers</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Weekly financial overview</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        {[{ label: "Revenue", value: rev, color: C.green, icon: "💰" }, { label: "Expenses", value: exp, color: C.red, icon: "💸" }, { label: "Profit", value: prof, color: C.pink, icon: "✨" }].map(s => (
          <div key={s.label} style={{ background: s.color + "14", border: `1.5px solid ${s.color}44`, borderRadius: 18, padding: "16px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <p style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>₹{s.value}</p>
            <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <Card style={{ marginBottom: 14 }}>
        <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 16, letterSpacing: .5 }}>📈 PROFIT & LOSS</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData} barSize={40}>
            <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12 }} labelStyle={{ color: C.text, fontWeight: 700 }} cursor={{ fill: C.pink + "0a" }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>{barData.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {catData.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 14, letterSpacing: .5 }}>🎯 EXPENSE BREAKDOWN</p>
          {catData.map((c, i) => {
            const pct = exp ? Math.round(c.value / exp * 100) : 0;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: 13, color: C.muted }}>₹{c.value} ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: C.bgDeep, borderRadius: 10 }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 10, background: `linear-gradient(90deg,${clrs[i % clrs.length]},${clrs[(i + 1) % clrs.length]}88)`, transition: "width .6s ease" }} />
                </div>
              </div>
            );
          })}
        </Card>
      )}
      {data?.clusters?.available && (
        <Card style={{ borderColor: C.gold + "66", background: `linear-gradient(135deg,${C.gold}0a,${C.pink}06)` }}>
          <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: .5 }}>🤖 AI SPENDING PATTERN DETECTED</p>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>{data.clusters.insight}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {data.clusters.n_clusters > 0 && Array.from({ length: data.clusters.n_clusters }, (_, i) => (
              <Pill key={i} color={[C.pink, C.purple, C.gold][i % 3]}>Cluster {i + 1}</Pill>
            ))}
          </div>
        </Card>
      )}
      {txns.length === 0 && (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
          <p style={{ color: C.muted, lineHeight: 1.7 }}>No transactions yet.<br />Head to Daily Log and add your first entry!</p>
        </Card>
      )}
    </div>
  );
}

function CoachScreen() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const generate = async () => {
    setLoading(true); setReport(null); setError(null);
    try { const d = await getWeeklyReport(); if (!d.success) { setError(d.message || "No transactions found."); return; } setReport(d.data); }
    catch { setError("Could not generate report. Is backend running?"); }
    finally { setLoading(false); }
  };
  const playAudio = () => {
    if (!report?.audio_base64) return;
    if (audioRef.current) audioRef.current.pause();
    const a = new Audio(`data:audio/mp3;base64,${report.audio_base64}`);
    audioRef.current = a; a.onended = () => setPlaying(false); a.play(); setPlaying(true);
  };
  const stopAudio = () => { audioRef.current?.pause(); setPlaying(false); };
  return (
    <div className="fadeUp">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 52, marginBottom: 8, animation: "heartBeat 2.5s ease infinite" }}>🔊</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Your Voice Coach</h1>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Your AI mentor summarises your week<br />and speaks it to you in a warm, friendly voice.</p>
      </div>
      {!report && (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle,${C.pink}33,${C.purple}11)`, border: `2px solid ${C.pink}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, margin: "0 auto 28px", animation: loading ? "heartBeat 1s ease infinite" : "heartBeat 3s ease infinite", boxShadow: `0 0 40px ${C.pink}33` }}>💜</div>
          <button onClick={generate} disabled={loading} style={{ padding: "16px 44px", borderRadius: 50, fontWeight: 800, fontSize: 16, background: loading ? C.border : `linear-gradient(135deg,${C.pink},${C.pinkLight})`, color: loading ? C.muted : "#fff", boxShadow: loading ? "none" : `0 8px 32px ${C.pink}55`, display: "inline-flex", alignItems: "center", gap: 10, transition: "all .2s" }}>
            {loading ? <><Spinner /> Generating your report...</> : "Get My Weekly Report ✨"}
          </button>
        </div>
      )}
      {error && <Card style={{ borderColor: C.red + "44", background: C.red + "0a", marginBottom: 14 }}><p style={{ color: C.red, fontSize: 14 }}>{error}</p></Card>}
      {report && (
        <div className="fadeUp">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
            {[{ label: "Revenue", value: report.summary?.total_revenue, color: C.green }, { label: "Expenses", value: report.summary?.total_expenses, color: C.red }, { label: "Profit", value: report.summary?.net_profit, color: C.pink }].map(s => (
              <div key={s.label} style={{ background: s.color + "14", border: `1.5px solid ${s.color}44`, borderRadius: 16, padding: "14px 10px", textAlign: "center" }}>
                <p style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>₹{s.value || 0}</p>
                <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <Card style={{ borderColor: C.pink + "55", background: `linear-gradient(135deg,${C.pink}08,${C.purple}06)`, marginBottom: 14 }}>
            <p style={{ color: C.pink, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: .5 }}>💜 YOUR AI COACH SAYS</p>
            <p style={{ color: C.text, fontSize: 15, lineHeight: 1.8, fontStyle: "italic" }}>"{report.advice_text}"</p>
          </Card>
          {report.audio_base64 && (
            <Card style={{ marginBottom: 14, textAlign: "center" }}>
              <p style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>🎙️ Listen to your coach</p>
              <button onClick={playing ? stopAudio : playAudio} style={{ width: 70, height: 70, borderRadius: "50%", fontSize: 26, background: `linear-gradient(135deg,${C.pink},${C.pinkLight})`, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: playing ? `0 0 0 10px ${C.pink}22,0 0 0 20px ${C.pink}0a` : `0 8px 24px ${C.pink}44`, transition: "all .3s", animation: playing ? "heartBeat 1.5s ease infinite" : "none" }}>
                {playing ? "⏸" : "▶"}
              </button>
              <p style={{ color: C.muted, fontSize: 12, marginTop: 12 }}>{playing ? "Playing your weekly coaching..." : "Tap to hear your financial advice"}</p>
            </Card>
          )}
          {report.github_url && (
            <Card style={{ borderColor: C.green + "55", background: C.green + "08", marginBottom: 14 }}>
              <p style={{ color: C.green, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>✅ Ledger committed to GitHub!</p>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 10, lineHeight: 1.6 }}>Your financial record is permanently saved, version-controlled, and owned by you.</p>
              <a href={report.github_url} target="_blank" rel="noopener noreferrer" style={{ color: C.pink, fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>View your ledger on GitHub →</a>
            </Card>
          )}
          <button onClick={() => { setReport(null); setError(null); }} style={{ width: "100%", padding: 12, background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 14, color: C.muted, fontSize: 13 }}>Generate new report</button>
        </div>
      )}
    </div>
  );
}