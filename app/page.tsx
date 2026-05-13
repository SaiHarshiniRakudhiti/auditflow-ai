"use client";

import { useEffect, useMemo, useState } from "react";
import { auditSpend, fallbackSummary, SpendItem, UseCase } from "../lib/audit-engine";

const tools = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
] as const;

const useCases = ["coding", "writing", "data", "research", "mixed"] as const;

const starter: SpendItem[] = [
  { tool: "Cursor", plan: "Business", monthlySpend: 80, seats: 2, useCase: "coding" },
  { tool: "GitHub Copilot", plan: "Business", monthlySpend: 38, seats: 2, useCase: "coding" },
  { tool: "OpenAI API", plan: "API direct", monthlySpend: 650, seats: 1, useCase: "coding" },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export default function Page() {
  const [teamSize, setTeamSize] = useState(5);
  const [primaryUseCase, setPrimaryUseCase] = useState<UseCase>("coding");
  const [items, setItems] = useState<SpendItem[]>(starter);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("auditflow-state");
    if (!raw) return;
    try {
      const savedState = JSON.parse(raw);
      setTeamSize(savedState.teamSize || 5);
      setPrimaryUseCase(savedState.primaryUseCase || "coding");
      setItems(savedState.items || starter);
    } catch {
      localStorage.removeItem("auditflow-state");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auditflow-state", JSON.stringify({ teamSize, primaryUseCase, items }));
  }, [teamSize, primaryUseCase, items]);

  const result = useMemo(
    () => auditSpend({ teamSize, primaryUseCase, tools: items }),
    [teamSize, primaryUseCase, items]
  );

  function update(i: number, key: keyof SpendItem, value: string) {
    setItems((current) =>
      current.map((item, index) =>
        index === i
          ? {
              ...item,
              [key]: key === "monthlySpend" || key === "seats" ? Number(value) : value,
            }
          : item
      )
    );
  }

  function addTool() {
    setItems([...items, { tool: "Claude", plan: "Pro", monthlySpend: 20, seats: 1, useCase: "research" }]);
  }

  function removeTool(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  async function capture() {
    if (!email.trim()) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, company, role, team_size: teamSize, audit: result, hp: "" }),
    }).catch(() => null);
    setSaving(false);
    setSaved(true);
  }

  const maxRecommendation = Math.max(...result.recommendations.map((r) => r.monthlySavings), 1);

  return (
    <main className="page-shell">
      <section className="hero-grid">
        <nav className="top-nav">
          <div className="brand-mark">AF</div>
          <div>
            <strong>AuditFlow AI</strong>
            <span>Credex Round 1 MVP</span>
          </div>
          <a className="nav-pill" href="#audit">Run audit</a>
        </nav>

        <div className="hero-copy">
          <div className="eyebrow">AI spend intelligence for startup teams</div>
          <h1>Optimize your AI stack before it drains runway.</h1>
          <p>
            Audit Cursor, Copilot, Claude, ChatGPT, Gemini and API spend in minutes. See savings first,
            capture the report after value, and share a public-safe result link.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#audit">Start free audit</a>
            <a className="secondary-button" href="#report">View sample report</a>
          </div>
          <div className="trust-row">
            <span>No login required</span>
            <span>Pricing sourced</span>
            <span>Founder-friendly</span>
          </div>
        </div>

        <aside className="hero-card" aria-label="Audit summary preview">
          <div className="hero-card-header">
            <span>Live savings forecast</span>
            <b>{result.confidenceScore}% confidence</b>
          </div>
          <div className="big-number">${money(result.totalAnnualSavings)}</div>
          <p>estimated annual savings</p>
          <div className="mini-bars">
            {result.recommendations.slice(0, 4).map((r) => (
              <div key={r.tool}>
                <span>{r.tool}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.max(12, (r.monthlySavings / maxRecommendation) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="metric-grid" aria-label="Key audit metrics">
        <Metric label="Monthly savings" value={`$${money(result.totalMonthlySavings)}`} />
        <Metric label="Annual savings" value={`$${money(result.totalAnnualSavings)}`} />
        <Metric label="Optimization confidence" value={`${result.confidenceScore}%`} />
        <Metric label="Tools analyzed" value={`${items.length}`} />
      </section>

      <section id="audit" className="workspace-grid">
        <div className="panel input-panel">
          <div className="section-heading">
            <span>Step 1</span>
            <h2>Enter AI stack</h2>
            <p>Form state persists across reloads so founders can complete the audit without losing work.</p>
          </div>

          <div className="form-row two">
            <label>
              Team size
              <input type="number" value={teamSize} min={1} onChange={(e) => setTeamSize(Number(e.target.value))} />
            </label>
            <label>
              Primary use case
              <select value={primaryUseCase} onChange={(e) => setPrimaryUseCase(e.target.value as UseCase)}>
                {useCases.map((useCase) => <option key={useCase}>{useCase}</option>)}
              </select>
            </label>
          </div>

          <div className="tool-list">
            {items.map((item, index) => (
              <article className="tool-card" key={`${item.tool}-${index}`}>
                <div className="tool-card-top">
                  <strong>Tool {index + 1}</strong>
                  {items.length > 1 && <button onClick={() => removeTool(index)}>Remove</button>}
                </div>
                <div className="form-row five">
                  <label>
                    Tool
                    <select value={item.tool} onChange={(e) => update(index, "tool", e.target.value)}>
                      {tools.map((tool) => <option key={tool}>{tool}</option>)}
                    </select>
                  </label>
                  <label>
                    Plan
                    <input value={item.plan} onChange={(e) => update(index, "plan", e.target.value)} />
                  </label>
                  <label>
                    Monthly spend
                    <input type="number" value={item.monthlySpend} onChange={(e) => update(index, "monthlySpend", e.target.value)} />
                  </label>
                  <label>
                    Seats
                    <input type="number" value={item.seats} onChange={(e) => update(index, "seats", e.target.value)} />
                  </label>
                  <label>
                    Use case
                    <select value={item.useCase} onChange={(e) => update(index, "useCase", e.target.value)}>
                      {useCases.map((useCase) => <option key={useCase}>{useCase}</option>)}
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
          <button className="ghost-button" onClick={addTool}>+ Add another tool</button>
        </div>

        <aside className="panel insight-panel">
          <div className="section-heading">
            <span>Step 2</span>
            <h2>Audit intelligence</h2>
            <p>Hardcoded financial rules do the math. AI is reserved for the summary layer only.</p>
          </div>
          <div className="score-ring">
            <div>{result.confidenceScore}%</div>
            <span>confidence</span>
          </div>
          <ul className="check-list">
            <li>Plan rightsizing</li>
            <li>Duplicate tool consolidation</li>
            <li>Retail-to-credit savings signal</li>
            <li>Public-safe report data</li>
          </ul>
        </aside>
      </section>

      <section id="report" className="report-panel">
        <div className="report-header">
          <div>
            <span className="eyebrow dark">Step 3 · Audit result</span>
            <h2>Save ${money(result.totalAnnualSavings)}/year</h2>
            <p>{fallbackSummary(result)}</p>
          </div>
          {result.tier === "high" && (
            <div className="credex-card">
              <strong>Credex-fit opportunity</strong>
              <p>High-savings case. Surface consultation CTA prominently after the user sees value.</p>
            </div>
          )}
        </div>

        <div className="recommendation-grid">
          {result.recommendations.map((r) => (
            <article className="recommendation-card" key={r.tool}>
              <div className="recommendation-top">
                <strong>{r.tool}</strong>
                <span>Save ${money(r.monthlySavings)}/mo</span>
              </div>
              <div className="spend-line">
                <b>${money(r.currentSpend)}</b>
                <span>current</span>
                <i>→</i>
                <b>${money(r.recommendedSpend)}</b>
                <span>recommended</span>
              </div>
              <h3>{r.recommendedAction}</h3>
              <p>{r.reason}</p>
            </article>
          ))}
        </div>

        <div className="lead-card">
          <div>
            <h3>Send the full report</h3>
            <p>Email is requested after value is shown, matching the Credex assignment requirement.</p>
          </div>
          <div className="lead-form">
            <input placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Company optional" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input placeholder="Role optional" value={role} onChange={(e) => setRole(e.target.value)} />
            <button onClick={capture} disabled={saving || !email.trim()}>{saving ? "Sending..." : saved ? "Saved" : "Send report"}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
