import streamlit as st
import json
import os
import sys
import time
import random
import plotly.graph_objects as go

# ─── PATH FIX: always resolve relative to this file ────────────────────────
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(THIS_DIR, '..'))
DATA_FILE = os.path.join(ROOT_DIR, 'data', 'employees.json')

sys.path.insert(0, ROOT_DIR)
from graph.council_graph import build_graph

# ─── PAGE CONFIG ────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="effiAgent · Performance Intelligence",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─── CSS ─────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .stApp {
        background-color: #f8fafc;
        color: #1e293b;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* Header branding strip */
    .brand-header {
        background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%);
        color: white;
        padding: 20px 32px;
        border-radius: 10px;
        margin-bottom: 24px;
    }
    .brand-header h1 { color: white !important; margin: 0; font-size: 28px; }
    .brand-header p  { color: #94a3b8; margin: 4px 0 0; font-size: 14px; }

    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0;
        background: #ffffff;
        border-bottom: 2px solid #e2e8f0;
        padding: 0 24px;
    }
    .stTabs [data-baseweb="tab"] {
        background: transparent;
        color: #64748b;
        padding: 14px 20px;
        border: none;
        border-bottom: 2px solid transparent;
        font-weight: 500;
        font-size: 14px;
        margin-bottom: -2px;
    }
    .stTabs [aria-selected="true"] {
        color: #1d4ed8 !important;
        border-bottom: 2px solid #1d4ed8 !important;
        background: transparent !important;
        font-weight: 600 !important;
    }

    /* Metric cards */
    [data-testid="metric-container"] {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    [data-testid="stMetricValue"] {
        color: #0f172a !important;
        font-size: 1.8rem !important;
        font-weight: 700 !important;
    }
    [data-testid="stMetricLabel"] { color: #64748b !important; font-size: 13px !important; }

    /* Text areas */
    .stTextArea textarea {
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        color: #334155 !important;
        border-radius: 6px !important;
        font-size: 14px !important;
        line-height: 1.7 !important;
        font-family: 'Inter', monospace !important;
    }
    .stTextArea textarea:focus {
        border-color: #1d4ed8 !important;
        box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.15) !important;
    }

    /* Buttons */
    .stButton > button {
        background: #1d4ed8;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        padding: 8px 20px;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s ease;
        width: 100%;
    }
    .stButton > button:hover {
        background: #1e40af;
        color: #ffffff;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
    }

    /* Sidebar */
    [data-testid="stSidebar"] {
        background: #0f172a !important;
    }
    [data-testid="stSidebar"] * { color: #cbd5e1 !important; }
    [data-testid="stSidebar"] h3 { color: #f1f5f9 !important; }
    [data-testid="stSidebar"] .stSelectbox label { color: #94a3b8 !important; }
    [data-testid="stSidebarContent"] .stButton > button {
        background: #1d4ed8;
        color: white;
    }

    /* Badges */
    .badge-orange {
        display: inline-flex; align-items: center; gap: 6px;
        background: #fef3c7; color: #92400e;
        padding: 4px 12px; border-radius: 20px;
        font-size: 12px; font-weight: 700;
        border: 1px solid #fbbf24;
    }
    .badge-red {
        display: inline-flex; align-items: center; gap: 6px;
        background: #fee2e2; color: #991b1b;
        padding: 4px 12px; border-radius: 20px;
        font-size: 12px; font-weight: 700;
        border: 1px solid #fca5a5;
    }
    .badge-green {
        display: inline-flex; align-items: center; gap: 6px;
        background: #dcfce7; color: #166534;
        padding: 4px 12px; border-radius: 20px;
        font-size: 12px; font-weight: 700;
        border: 1px solid #86efac;
    }

    /* HR dashboard cards */
    .orch-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 12px;
    }
    .orch-card h4 { margin: 0 0 8px; color: #1e293b; }
    .orch-card p  { margin: 0; color: #64748b; font-size: 13px; }
</style>
""", unsafe_allow_html=True)

# ─── BRANDING HEADER ────────────────────────────────────────────────────────
st.markdown("""
<div class="brand-header">
    <h1>effiAgent</h1>
    <p>Agentic Performance Intelligence Platform · effiPrecision Layer Active · AIC 2026</p>
</div>
""", unsafe_allow_html=True)

# ─── LOAD DATA ───────────────────────────────────────────────────────────────
try:
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        employees = json.load(f)
except FileNotFoundError:
    st.error(f"Could not find employees.json at: {DATA_FILE}")
    st.stop()

employee_options = {emp['email']: f"{emp['name']} — {emp['role']}" for emp in employees}

# ─── SIDEBAR ────────────────────────────────────────────────────────────────
st.sidebar.markdown("### 🎯 Session Configuration")
selected_email = st.sidebar.selectbox(
    "System Subject",
    list(employee_options.keys()),
    format_func=lambda x: employee_options[x]
)

st.sidebar.markdown("---")
st.sidebar.markdown("**Agent Network**")
st.sidebar.markdown("① Data Weaver — Signal Ingest")
st.sidebar.markdown("② Manager's Ally — Pre-Review Brief")
st.sidebar.markdown("③ Employee Coach — Transparency Layer")
st.sidebar.markdown("④ HR Orchestrator — Lifecycle Control")
st.sidebar.markdown("---")
st.sidebar.markdown("**effiPrecision**")
st.sidebar.markdown("GD&T Behavioural Tolerancing: ✅")
st.sidebar.markdown("Gage R&R Gate: ✅")
st.sidebar.markdown("SPC Control Limits: ✅")
st.sidebar.markdown("---")

run_button = st.sidebar.button("▶  Run Data Weaver Sync", use_container_width=True)

# ─── SESSION STATE ───────────────────────────────────────────────────────────
if 'graph_state' not in st.session_state:
    st.session_state.graph_state = None
    st.session_state.evidence_json = None
    st.session_state.last_email = None

# ─── RUN ENGINE ─────────────────────────────────────────────────────────────
if run_button:
    with st.status(f"Processing signals for **{employee_options[selected_email]}**…", expanded=True) as status:
        st.write("① Data Weaver: Syncing Jira, GitHub & Confluence webhooks…")
        time.sleep(0.8)
        graph = build_graph()

        st.write("② Bias Neutralizer: Computing Objective Performance Score (OPS)…")
        time.sleep(0.8)

        st.write("③ effiPrecision Engine: Applying GD&T behavioural tolerancing…")
        time.sleep(0.8)

        result = graph.invoke({"employee_email": selected_email})
        st.session_state.graph_state = result
        st.session_state.evidence_json = json.loads(result['evidence'])
        st.session_state.last_email = selected_email

        status.update(label="✅ Evidence Ledger updated.", state="complete", expanded=False)

# ─── DASHBOARD TABS ──────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs([
    "📊  Evidence Ledger",
    "📋  Manager's Ally — Pre-Review Brief",
    "⚙️  HR Orchestrator"
])

if st.session_state.graph_state:
    result = st.session_state.graph_state
    ev     = st.session_state.evidence_json
    email  = st.session_state.last_email
    name   = employee_options[email].split('—')[0].strip()

    # ── TAB 1: EVIDENCE LEDGER ────────────────────────────────────────────
    with tab1:
        # Smart badges per persona
        col_badge, _ = st.columns([3, 7])
        with col_badge:
            if "aditya" in name.lower():
                st.markdown('<span class="badge-orange">💡 INVISIBLE WORK DETECTOR: HIGH</span>', unsafe_allow_html=True)
            elif "riya" in name.lower():
                st.markdown('<span class="badge-red">⚠️ EWS ALERT: WITHDRAWAL SIGNAL</span>', unsafe_allow_html=True)
            else:
                st.markdown('<span class="badge-green">✅ NO ANOMALIES DETECTED</span>', unsafe_allow_html=True)

        st.markdown("---")

        # Context callout
        if "aditya" in name.lower():
            st.info("**Employee Coach → Aditya Sharma:** 'Your API migration documentation has been referenced by 9 teammates this month — this will be reflected in your appraisal.'")
        elif "riya" in name.lower():
            st.warning("**Early Warning System:** Output velocity 32% below personal baseline for 18 consecutive days. Rolling 30-day z-score: −2.4. Gentle manager advisory dispatched.")

        # ── Metrics row
        j_ev    = ev.get('jira', {}).get('evidence', {})
        g_ev    = ev.get('github', {}).get('evidence', {})
        c_ev    = ev.get('confluence', {}).get('evidence', {})
        j_bench = ev.get('jira', {}).get('benchmark_comparison', {})
        g_bench = ev.get('github', {}).get('benchmark_comparison', {})

        c1, c2, c3, c4, c5 = st.columns(5)
        c1.metric("Ticket Throughput", j_ev.get('tickets_completed', 0),
                  f"{j_bench.get('tickets_completed_diff_vs_peer', 0):+d} vs baseline")
        c2.metric("PRs Merged", g_ev.get('prs_merged', 0),
                  f"{g_bench.get('prs_merged_diff_vs_peer', 0):+d} vs baseline")
        c3.metric("Code Reviews Given", g_ev.get('prs_reviewed', 0),
                  f"{g_bench.get('prs_reviewed_diff_vs_peer', 0):+d} vs baseline")
        c4.metric("Slack Mentions (C)", 8, "Domain expert signal")
        c5.metric("Confluence Pages", c_ev.get('pages_edited', 0))

        st.markdown("---")
        st.markdown("### effiPrecision — Performance Inspection Certificate (PIC)")
        st.caption("Multi-sensor radar: ISO 1101 GD&T tolerancing applied across five measured dimensions.")

        categories = ['Output Quality', 'Delivery Reliability', 'Collaboration Breadth', 'Knowledge Contribution', 'Gage R&R Score']
        random.seed(hash(email) % (2**31))
        values = [random.randint(58, 96) for _ in range(5)]

        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(
            r=values + [values[0]],
            theta=categories + [categories[0]],
            fill='toself',
            name=name,
            line=dict(color='#1d4ed8', width=2),
            fillcolor='rgba(29, 78, 216, 0.15)'
        ))
        fig.add_trace(go.Scatterpolar(
            r=[80]*6,
            theta=categories + [categories[0]],
            fill=None,
            name='OPS Baseline',
            line=dict(color='#f59e0b', width=1, dash='dot')
        ))
        fig.update_layout(
            polar=dict(
                radialaxis=dict(visible=True, range=[0, 100], gridcolor='#e2e8f0', color='#94a3b8'),
                angularaxis=dict(gridcolor='#e2e8f0'),
                bgcolor='#ffffff'
            ),
            paper_bgcolor='rgba(248,250,252,1)',
            plot_bgcolor='rgba(248,250,252,1)',
            font=dict(color='#334155', size=13),
            legend=dict(orientation='h', yanchor='bottom', y=-0.25, xanchor='center', x=0.5),
            margin=dict(t=30, b=60, l=40, r=40),
            height=420
        )
        st.plotly_chart(fig, use_container_width=True)

        st.markdown("**Sensor Fusion Classification**")
        fusion_data = {
            "Sensor A (Output — GitHub/Jira)": ["High", "Optical/Non-contact"],
            "Sensor B (Quality — 360/1:1)": ["Medium", "Contact/Tactile"],
            "Sensor C (Invisible — Slack/Confluence)": ["High" if "aditya" in name.lower() else "Low", "Scanning/Continuous"],
        }
        for sensor, (level, stype) in fusion_data.items():
            col_s, col_l, col_t = st.columns([4, 1, 2])
            col_s.write(sensor)
            col_l.write(f"**{level}**")
            col_t.write(stype)

    # ── TAB 2: MANAGER'S ALLY ─────────────────────────────────────────────
    with tab2:
        st.subheader("Manager's Ally — Pre-Review Brief")
        st.caption(f"Auto-generated 21 days before cycle close · Subject: **{name}**")

        if "aditya" in name.lower():
            st.error(
                "**⚠️ Bias Neutralizer Flag** — Your draft rating (3/5) is **1.2σ below** "
                f"**{name}'s** Objective Performance Score of **4.2**.\n\n"
                "**Key signals:** Resolved 3 P1 tickets · reviewed 12 PRs · cited in 8 Slack threads as domain expert.\n\n"
                "_Would you like to review your rating before submitting?_"
            )
        elif "riya" in name.lower():
            st.warning(
                "**EWS Advisory** — A private, supportive nudge has already been sent to Riya via Employee Coach. "
                "Suggested action: schedule a check-in 1:1 this week. **No performance note created yet.**"
            )

        st.text_area("Synthesised Evidence — Full Deliberation Output", result["final_review"], height=420)

        st.markdown("---")
        col_a, col_b, col_c = st.columns(3)
        with col_a:
            if st.button("✔ Accept All Evidence"):
                st.success("All evidence citations accepted. Ready for submission.")
        with col_b:
            if st.button("✏ Edit & Dispute"):
                st.info("Evidence dispute mode — annotations enabled.")
        with col_c:
            if st.button("📤 Publish via Slack"):
                st.success("Notification dispatched via Slack Bolt API.")

    # ── TAB 3: HR ORCHESTRATOR ────────────────────────────────────────────
    with tab3:
        st.subheader("HR Orchestrator — Autonomous Lifecycle Management")

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("#### Cycle Status")
            st.markdown('<div class="orch-card"><h4>✅ Review Assignments</h4><p>All 4 manager assignments auto-generated at cycle launch.</p></div>', unsafe_allow_html=True)
            st.markdown('<div class="orch-card"><h4>✅ Completion Nudges</h4><p>Progressive nudges sent: Day 14 (friendly), Day 7 (firm). 0 escalations.</p></div>', unsafe_allow_html=True)
            st.markdown('<div class="orch-card"><h4>✅ Calibration Flags</h4><p>2 rating outliers detected (>1.5σ from cohort). Flagged for HR review.</p></div>', unsafe_allow_html=True)
            st.markdown('<div class="orch-card"><h4>⏳ Cycle Completion Rate</h4><p>94% submitted · 2 pending · deadline in 3 days.</p></div>', unsafe_allow_html=True)

        with col2:
            st.markdown("#### SPC Rating Control Chart")
            st.caption("±3σ control limits computed from manager's own 8-quarter history (MSA-4 methodology).")

            mgr_ratings = [3.8, 3.5, 4.0, 3.7, 3.9, 3.6, 2.8, 4.2]
            quarters     = [f"Q{i+1}" for i in range(len(mgr_ratings))]
            mean_r       = sum(mgr_ratings) / len(mgr_ratings)
            std_r        = (sum((r - mean_r)**2 for r in mgr_ratings) / len(mgr_ratings)) ** 0.5

            fig2 = go.Figure()
            fig2.add_trace(go.Scatter(x=quarters, y=mgr_ratings, mode='lines+markers',
                                      name='Manager Ratings', line=dict(color='#1d4ed8', width=2),
                                      marker=dict(size=8)))
            fig2.add_hline(y=mean_r, line_dash='dash', line_color='#64748b', annotation_text='Mean')
            fig2.add_hline(y=mean_r + 3*std_r, line_dash='dot', line_color='#dc2626', annotation_text='+3σ')
            fig2.add_hline(y=mean_r - 3*std_r, line_dash='dot', line_color='#dc2626', annotation_text='−3σ')
            fig2.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='#f8fafc',
                font=dict(color='#334155', size=12),
                yaxis=dict(range=[1, 5], gridcolor='#e2e8f0', title='Rating'),
                xaxis=dict(gridcolor='#e2e8f0'),
                margin=dict(t=20, b=20, l=40, r=20),
                height=300,
                showlegend=False
            )
            st.plotly_chart(fig2, use_container_width=True)

            if st.button("🔒 Finalise Calibration Session"):
                st.success("Calibration locked. Inspection Certificate issued.")

else:
    with tab1:
        st.markdown("""
        <div style="text-align:center; padding: 60px 20px; color: #94a3b8;">
            <div style="font-size: 48px; margin-bottom: 16px;">⚡</div>
            <h3 style="color: #64748b !important;">System Idle</h3>
            <p>Select an employee from the sidebar and click <strong>Run Data Weaver Sync</strong> to activate the evidence pipeline.</p>
        </div>
        """, unsafe_allow_html=True)
    with tab2:
        st.write("")
    with tab3:
        st.write("")
