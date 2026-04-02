import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { analyzeImage, addTransaction, getDashboard, getWeeklyReport } from "./api";

// ── Colour tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#0f0a1e",
  card: "#1a1130",
  border: "#2e2050",
  purple: "#7c3aed",
  purpleLight: "#a855f7",
  gold: "#f59e0b",
  goldLight: "#fcd34d",
  green: "#10b981",
  red: "#ef4444",
  text: "#f3f0ff",
  muted: "#9d8ec7",
};

// ── Tiny helpers ───────────────────────────────────────────────────────────────
const Spinner = () => (
  <span style={{
    display: "inline-block", width: 18, height: 18,
    border: `2px solid ${C.gold}`, borderTopColor: "transparent",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  }} />
);

const Badge = ({ children, color = C.purple }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600,
  }}>{children}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 16, padding: "20px 24px", ...style,
  }}>{children}</div>
);

// ── Nav tabs ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: "vision", label: "📸 Ideas", },
  { id: "log", label: "💬 Daily Log", },
  { id: "dashboard", label: "📊 Dashboard", },
  { id: "report", label: "🔊 Coach", },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("vision");

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${C.purple}33, transparent)`,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .fadeUp { animation: fadeUp 0.4s ease both; }
        button { cursor: pointer; border: none; font-family: inherit; }
        input, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "16px 24px", borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: C.bg + "ee",
        backdropFilter: "blur(12px)", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>💜</span>
          <span style={{
            fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800,
            background: `linear-gradient(135deg, ${C.purpleLight}, ${C.gold})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>VentureHer</span>
        </div>
        <span style={{ fontSize: 12, color: C.muted }}>Your AI Co-Founder</span>
      </header>

      {/* Nav */}
      <nav style={{
        display: "flex", gap: 4, padding: "12px 24px",
        borderBottom: `1px solid ${C.border}`, overflowX: "auto",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: tab === t.id ? C.purple : "transparent",
            color: tab === t.id ? "#fff" : C.muted,
            border: `1px solid ${tab === t.id ? C.purple : "transparent"}`,
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>
        {tab === "vision" && <VisionScreen />}
        {tab === "log" && <LogScreen />}
        {tab === "dashboard" && <DashboardScreen />}
        {tab === "report" && <ReportScreen />}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — Vision
// ══════════════════════════════════════════════════════════════════════════════
function VisionScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null); setError(null); setLoading(true);
    try {
      const data = await analyzeImage(file);
      setResult(data.data || data);
    } catch (e) {
      setError("Could not analyze image. Make sure the backend is running.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fadeUp">
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800,
          lineHeight: 1.2, marginBottom: 10,
        }}>
          Show Me<br />
          <span style={{
            background: `linear-gradient(135deg, ${C.purpleLight}, ${C.gold})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>What You Have</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 15 }}>
          Photograph your kitchen or workspace.<br />
          Get a complete business plan in seconds.
        </p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${C.purple}`,
          borderRadius: 20, padding: "40px 24px", textAlign: "center",
          cursor: "pointer", background: C.purple + "0a",
          transition: "all 0.2s", marginBottom: 20,
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.purple + "18"}
        onMouseLeave={e => e.currentTarget.style.background = C.purple + "0a"}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{
            maxHeight: 200, maxWidth: "100%", borderRadius: 12, objectFit: "cover",
          }} />
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
            <p style={{ color: C.purpleLight, fontWeight: 600, marginBottom: 4 }}>
              Tap to upload a photo
            </p>
            <p style={{ color: C.muted, fontSize: 13 }}>
              Kitchen, craft table, workspace — anything!
            </p>
          </>
        )}
        <input
          ref={fileRef} type="file" accept="image/*" capture="environment"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>

      {preview && !loading && !result && (
        <button onClick={() => fileRef.current.click()} style={{
          width: "100%", padding: "14px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
          color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16,
        }}>
          Analyze This Photo ✨
        </button>
      )}

      {loading && (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <Spinner />
          <p style={{ color: C.muted, marginTop: 12, fontSize: 14 }}>
            Analyzing your photo with Gemini Vision...
          </p>
        </Card>
      )}

      {error && (
        <Card style={{ borderColor: C.red + "44", background: C.red + "11" }}>
          <p style={{ color: C.red }}>{error}</p>
        </Card>
      )}

      {result && <BusinessCard result={result} />}
    </div>
  );
}

function BusinessCard({ result }) {
  return (
    <div className="fadeUp">
      <Card style={{ borderColor: C.gold + "44", marginBottom: 16 }}>
        {/* Items found */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>I spotted:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(result.identified_items || []).map((item, i) => (
              <Badge key={i} color={C.muted}>{item}</Badge>
            ))}
          </div>
        </div>

        {/* Business idea */}
        <h2 style={{
          fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800,
          color: C.gold, marginBottom: 6,
        }}>{result.business_idea}</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>
          {result.why_it_fits}
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{
            background: C.green + "18", border: `1px solid ${C.green}44`,
            borderRadius: 12, padding: "12px 16px",
          }}>
            <p style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Startup Cost</p>
            <p style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>
              ₹{result.startup_cost_inr}
            </p>
          </div>
          <div style={{
            background: C.gold + "18", border: `1px solid ${C.gold}44`,
            borderRadius: 12, padding: "12px 16px",
          }}>
            <p style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Week 1 Potential</p>
            <p style={{ color: C.gold, fontSize: 20, fontWeight: 700 }}>
              ₹{result.first_week_revenue_potential_inr}
            </p>
          </div>
        </div>

        {/* Steps */}
        <p style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>Your first 3 steps:</p>
        {(result.first_3_steps || []).map((step, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10,
          }}>
            <span style={{
              minWidth: 24, height: 24, borderRadius: "50%",
              background: C.purple, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
            }}>{i + 1}</span>
            <p style={{ color: C.text, fontSize: 14, lineHeight: 1.5 }}>{step}</p>
          </div>
        ))}

        {/* Pricing */}
        <div style={{
          marginTop: 16, padding: "12px 16px",
          background: C.purple + "18", borderRadius: 12,
          borderLeft: `3px solid ${C.purple}`,
        }}>
          <p style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>💡 Pricing Strategy</p>
          <p style={{ color: C.text, fontSize: 14 }}>{result.pricing_strategy}</p>
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — Daily Log
// ══════════════════════════════════════════════════════════════════════════════
function LogScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const data = await addTransaction(text);
      setResult(data.parsed);
      if (data.parsed?.transactions) {
        setHistory(prev => [...data.parsed.transactions, ...prev]);
      }
      setText("");
    } catch (e) {
      setError("Could not process. Is the backend running?");
    } finally { setLoading(false); }
  };

  return (
    <div className="fadeUp">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 6,
        }}>Daily Log</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>
          Just tell me what you bought or sold today.
        </p>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='e.g. "bought dal for ₹120, sold 4 tiffins at ₹80 each"'
          rows={3}
          style={{
            width: "100%", background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "12px 14px", color: C.text,
            fontSize: 15, resize: "none", outline: "none", lineHeight: 1.6,
          }}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) submit(); }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>Ctrl+Enter to submit</span>
          <button
            onClick={submit} disabled={loading || !text.trim()}
            style={{
              padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: loading || !text.trim()
                ? C.border
                : `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              color: "#fff", display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
          >
            {loading ? <><Spinner /> Processing...</> : "Add to Ledger →"}
          </button>
        </div>
      </Card>

      {error && (
        <Card style={{ borderColor: C.red + "44", marginBottom: 16 }}>
          <p style={{ color: C.red, fontSize: 14 }}>{error}</p>
        </Card>
      )}

      {result && (
        <div className="fadeUp">
          <Card style={{ borderColor: C.green + "44", marginBottom: 16 }}>
            <p style={{ color: C.green, fontWeight: 600, marginBottom: 12 }}>
              ✅ {result.summary}
            </p>
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0", borderTop: `1px solid ${C.border}`,
            }}>
              <span style={{ color: C.muted, fontSize: 13 }}>This entry:</span>
              <span style={{
                color: result.net_profit_inr >= 0 ? C.green : C.red,
                fontWeight: 700,
              }}>
                {result.net_profit_inr >= 0 ? "+" : ""}₹{result.net_profit_inr}
              </span>
            </div>
          </Card>
        </div>
      )}

      {history.length > 0 && (
        <Card>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 14, fontWeight: 600 }}>
            TODAY'S ENTRIES
          </p>
          {history.map((t, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0",
              borderBottom: i < history.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div>
                <span style={{
                  fontSize: 11, fontWeight: 600, marginRight: 8,
                  color: t.type === "income" ? C.green : C.red,
                }}>
                  {t.type === "income" ? "💰 INCOME" : "💸 EXPENSE"}
                </span>
                <Badge color={C.muted}>{t.category}</Badge>
                <p style={{ color: C.text, fontSize: 14, marginTop: 4 }}>
                  {t.description}
                </p>
              </div>
              <span style={{
                fontWeight: 700, fontSize: 16,
                color: t.type === "income" ? C.green : C.red,
              }}>
                {t.type === "income" ? "+" : "-"}₹{t.amount_inr}
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — Dashboard
// ══════════════════════════════════════════════════════════════════════════════
function DashboardScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then(d => setData(d.data || d))
      .catch(() => setError("Could not load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <Spinner /><p style={{ color: C.muted, marginTop: 12 }}>Loading your data...</p>
    </div>
  );

  if (error) return (
    <Card style={{ borderColor: C.red + "44" }}>
      <p style={{ color: C.red }}>{error}</p>
    </Card>
  );

  const revenue = data?.total_revenue || 0;
  const expenses = data?.total_expenses || 0;
  const profit = data?.net_profit || 0;
  const txns = data?.transactions || [];

  const chartData = [
    { name: "Revenue", value: revenue, color: C.green },
    { name: "Expenses", value: expenses, color: C.red },
    { name: "Profit", value: Math.max(profit, 0), color: C.gold },
  ];

  const catTotals = {};
  txns.filter(t => t.type === "expense").forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount_inr;
  });
  const catData = Object.entries(catTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="fadeUp">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
          Your Numbers
        </h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Weekly financial overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Revenue", value: revenue, color: C.green, icon: "💰" },
          { label: "Expenses", value: expenses, color: C.red, icon: "💸" },
          { label: "Profit", value: profit, color: C.gold, icon: "✨" },
        ].map(s => (
          <div key={s.label} style={{
            background: s.color + "15", border: `1px solid ${s.color}44`,
            borderRadius: 14, padding: "14px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <p style={{ color: s.color, fontSize: 18, fontWeight: 800 }}>₹{s.value}</p>
            <p style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* P&L Chart */}
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
          PROFIT & LOSS
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={36}>
            <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }}
              labelStyle={{ color: C.text }}
              cursor={{ fill: C.border + "44" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category breakdown */}
      {catData.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <p style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
            EXPENSE BREAKDOWN
          </p>
          {catData.map((c, i) => {
            const pct = expenses ? Math.round((c.value / expenses) * 100) : 0;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: C.text }}>{c.name}</span>
                  <span style={{ fontSize: 13, color: C.muted }}>₹{c.value} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, borderRadius: 3,
                    background: `linear-gradient(90deg, ${C.purple}, ${C.purpleLight})`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Cluster insight */}
      {data?.clusters?.available && (
        <Card style={{ borderColor: C.gold + "44" }}>
          <p style={{ color: C.gold, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            🤖 ML PATTERN INSIGHT
          </p>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>
            {data.clusters.insight}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {Array.from({ length: data.clusters.n_clusters }, (_, i) => (
              <Badge key={i} color={[C.purple, C.gold, C.green][i % 3]}>
                Cluster {i + 1}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {txns.length === 0 && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>📊</p>
          <p style={{ color: C.muted }}>No transactions yet.<br />Add some in the Daily Log tab!</p>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — Weekly Report / Voice Coach
// ══════════════════════════════════════════════════════════════════════════════
function ReportScreen() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const generate = async () => {
    setLoading(true); setReport(null); setError(null);
    try {
      const data = await getWeeklyReport();
      if (!data.success) {
        setError(data.message || "No transactions found. Add some entries first!");
        return;
      }
      setReport(data.data);
    } catch (e) {
      setError("Could not generate report. Is the backend running?");
    } finally { setLoading(false); }
  };

  const playAudio = () => {
    if (!report?.audio_base64) return;
    if (audioRef.current) { audioRef.current.pause(); }
    const audio = new Audio(`data:audio/mp3;base64,${report.audio_base64}`);
    audioRef.current = audio;
    audio.onended = () => setPlaying(false);
    audio.play();
    setPlaying(true);
  };

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); setPlaying(false); }
  };

  return (
    <div className="fadeUp">
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
          Your Voice Coach
        </h1>
        <p style={{ color: C.muted, fontSize: 14 }}>
          Get your weekly financial report<br />spoken to you by your AI mentor.
        </p>
      </div>

      {!report && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%", margin: "0 auto 24px",
            background: `radial-gradient(circle, ${C.purple}44, ${C.purple}11)`,
            border: `2px solid ${C.purple}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 44,
            animation: loading ? "pulse 1.5s ease infinite" : "none",
          }}>🔊</div>

          <button
            onClick={generate} disabled={loading}
            style={{
              padding: "16px 40px", borderRadius: 50, fontWeight: 700, fontSize: 16,
              background: loading
                ? C.border
                : `linear-gradient(135deg, ${C.purple}, ${C.gold})`,
              color: "#fff", display: "inline-flex", alignItems: "center",
              gap: 10, transition: "all 0.2s",
              boxShadow: loading ? "none" : `0 0 30px ${C.purple}66`,
            }}
          >
            {loading ? <><Spinner /> Generating your report...</> : "Get My Weekly Report ✨"}
          </button>
        </div>
      )}

      {error && (
        <Card style={{ borderColor: C.red + "44", marginBottom: 16 }}>
          <p style={{ color: C.red, fontSize: 14 }}>{error}</p>
        </Card>
      )}

      {report && (
        <div className="fadeUp">
          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Revenue", value: report.summary?.total_revenue, color: C.green },
              { label: "Expenses", value: report.summary?.total_expenses, color: C.red },
              { label: "Profit", value: report.summary?.net_profit, color: C.gold },
            ].map(s => (
              <div key={s.label} style={{
                background: s.color + "15", border: `1px solid ${s.color}44`,
                borderRadius: 12, padding: "12px", textAlign: "center",
              }}>
                <p style={{ color: s.color, fontSize: 18, fontWeight: 800 }}>₹{s.value || 0}</p>
                <p style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Advice text */}
          <Card style={{ borderColor: C.purple + "44", marginBottom: 16 }}>
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 600, marginBottom: 10 }}>
              💜 YOUR AI COACH SAYS
            </p>
            <p style={{ color: C.text, fontSize: 15, lineHeight: 1.8, fontStyle: "italic" }}>
              "{report.advice_text}"
            </p>
          </Card>

          {/* Audio player */}
          {report.audio_base64 && (
            <Card style={{ marginBottom: 16, textAlign: "center" }}>
              <p style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>
                🎙️ Listen to your coach
              </p>
              <button
                onClick={playing ? stopAudio : playAudio}
                style={{
                  width: 64, height: 64, borderRadius: "50%", fontSize: 24,
                  background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
                  color: "#fff", display: "inline-flex", alignItems: "center",
                  justifyContent: "center",
                  boxShadow: playing ? `0 0 0 8px ${C.purple}33, 0 0 0 16px ${C.purple}11` : "none",
                  transition: "all 0.3s", animation: playing ? "pulse 2s ease infinite" : "none",
                }}
              >
                {playing ? "⏸" : "▶️"}
              </button>
              <p style={{ color: C.muted, fontSize: 12, marginTop: 10 }}>
                {playing ? "Playing your report..." : "Tap to hear your financial coaching"}
              </p>
            </Card>
          )}

          {/* GitHub link */}
          {report.github_url && (
            <Card style={{ borderColor: C.green + "44" }}>
              <p style={{ color: C.green, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                ✅ Ledger committed to GitHub!
              </p>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 10 }}>
                Your financial record is now permanently saved and version-controlled.
              </p>
              <a
                href={report.github_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: C.purpleLight, fontSize: 13, fontWeight: 600, textDecoration: "none",
                }}
              >
                View your ledger on GitHub →
              </a>
            </Card>
          )}

          {/* Re-generate */}
          <button
            onClick={() => { setReport(null); setError(null); }}
            style={{
              width: "100%", marginTop: 16, padding: 12,
              background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.muted, fontSize: 13,
            }}
          >
            Generate new report
          </button>
        </div>
      )}
    </div>
  );
}