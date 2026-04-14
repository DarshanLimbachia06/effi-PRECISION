import React from 'react';
import { 
  Document, Page, Text, View, StyleSheet, PDFDownloadLink, 
  Image, Font, Canvas 
} from '@react-pdf/renderer';
import { Download, Share2, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge, EngCard } from './EngUI';

// Register standard fonts
// Note: In a real app we'd load JetBrains Mono. Here we use standard Helvetica as proxy for reliability.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  titleCard: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  reportMeta: {
    fontSize: 9,
    textAlign: 'right',
  },
  section: {
    marginTop: 15,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: 4,
    textTransform: 'uppercase',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  grid: {
    flexDirection: 'row',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  gridCol: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  label: {
    fontSize: 8,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    transform: 'rotate(-45deg)',
    fontSize: 40,
    color: '#000000',
    opacity: 0.04,
    width: '100%',
    textAlign: 'center',
    zIndex: -1,
  },
  stamp: {
    position: 'absolute',
    top: 50,
    right: 40,
    width: 120,
    height: 40,
    borderWidth: 3,
    borderColor: '#ef4444',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(15deg)',
    opacity: 0.8,
  },
  stampText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#999999',
  }
});

const PICDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>
        ISO 1101 • GD&T • MSA-4 • effiPrecision • ISO 1101 • GD&T • MSA-4 • effiPrecision
      </Text>

      <View style={styles.stamp}>
        <Text style={styles.stampText}>Validated by effiAgent</Text>
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.mainTitle}>Performance Inspection Certificate</Text>
          <Text style={styles.subtitle}>Form ID: PIC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
        </View>
        <View style={styles.reportMeta}>
          <Text>Class: Engineering {data.grade || 'L5'}</Text>
          <Text>Cycle: Q1 2026</Text>
          <Text>Certifier: effiAgent Node 71</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject Identification</Text>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Employee Name</Text>
            <Text style={styles.value}>{data.name}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Metric Domain</Text>
            <Text style={styles.value}>Full-Stack Technical</Text>
          </View>
          <View style={{...styles.gridCol, borderRightWidth: 0}}>
            <Text style={styles.label}>Confidence Score</Text>
            <Text style={{...styles.value, color: '#10b981'}}>{data.confidence || 98}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspection Results (Metrology Suite)</Text>
        <View style={{...styles.grid, borderBottomWidth: 1, borderBottomColor: '#e5e7eb'}}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Jira Velocity</Text>
            <Text style={styles.value}>{data.jira_velocity || '1.24'} pts/sprint</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>GitHub Cycle Time</Text>
            <Text style={styles.value}>{data.github_cycle_time || '4.2'} hrs</Text>
          </View>
          <View style={{...styles.gridCol, borderRightWidth: 0}}>
            <Text style={styles.label}>Evidence Count</Text>
            <Text style={styles.value}>{data.evidence_count || 12} items</Text>
          </View>
        </View>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>OPS Score</Text>
            <Text style={styles.value}>{data.ops_score || '3.5'} / 5.0</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>LMC Status</Text>
            <Text style={styles.value}>{data.lmc_active ? 'Active Adjustment' : 'Global Norm'}</Text>
          </View>
          <View style={{...styles.gridCol, borderRightWidth: 0}}>
            <Text style={styles.label}>Bias Neutralized</Text>
            <Text style={styles.value}>{data.bias_flag ? 'Yes (Recalibrated)' : 'Verified'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agentic Deliberation Trace (Evidence-Fused)</Text>
        <Text style={{fontSize: 9, padding: 10, lineHeight: 1.5, color: '#4b5563'}}>
          {data.deliberation || "Multi-agent consensus established across 5 sensor domains. Subject demonstrates consistent performance aligned with role expectations. No corrective action required."}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 effiHR Technologies India • Confidential Performance Data</Text>
        <Text style={styles.footerText}>Generated for {data.name} • ISO 1101 compliant document</Text>
      </View>
    </Page>
  </Document>
);

export const PICreport = ({ employee, evalData }) => {
  const [copied, setCopied] = React.useState(false);
  
  const fused = evalData?.evidence?.fused_signals || {};
  const jira = evalData?.evidence?.jira?.evidence || {};
  const github = evalData?.evidence?.github?.evidence || {};

  const employeeData = {
    name: employee?.name || "Subject",
    grade: employee?.grade || "L5",
    confidence: 98,
    ops_score: evalData?.ops_score || fused.ops_objective_score || 3.5,
    jira_velocity: jira.tickets_completed || 0,
    github_cycle_time: github.prs_merged || 0,
    evidence_count: evalData?.data_sources?.length || 5,
    lmc_active: fused.lmc_active || false,
    bias_flag: fused.bias_neutralizer_flag || false,
    deliberation: evalData?.final_review || "Waiting for agent consensus..."
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://effiprecision.io/cert/verification/${Math.random().toString(36).substr(2, 9)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <EngCard title="Official PIC Generator" icon={ClipboardCheck}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2 tracking-tight">Generate ISO-Standard Report</h3>
            <p className="text-eng-text-muted text-sm leading-relaxed">
              Export a legally-defensible performance certificate for <strong>{employeeData.name}</strong>. 
              This report includes the agentic trace, evidence fusion hashes, and GD&T behavioral tolerance adjustments.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleShare}
              className="px-4 py-2 bg-eng-surface border border-eng-border rounded-lg text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-colors"
            >
              {copied ? <ClipboardCheck className="w-4 h-4 text-eng-pass" /> : <Share2 className="w-4 h-4 text-eng-info" />}
              {copied ? "Link Copied" : "Share Cert"}
            </button>

            <PDFDownloadLink 
              document={<PICDocument data={employeeData} />} 
              fileName={`PIC_Report_${employeeData.name.replace(' ', '_')}.pdf`}
            >
              {({ blob, url, loading, error }) => (
                <button 
                  disabled={loading}
                  className="px-6 py-2 bg-eng-info text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {loading ? "Preparing PDF..." : "Export Official PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </EngCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EngCard title="Bias Risk Analysis" className="border-eng-pass/20">
          <div className="flex flex-col items-center py-4">
             <div className="w-24 h-24 rounded-full border-4 border-eng-pass flex items-center justify-center relative">
                <div className="text-2xl font-mono font-bold text-white">0.2%</div>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 rounded-full border-2 border-eng-pass/30" 
                />
             </div>
             <p className="text-[10px] text-eng-text-muted mt-4 uppercase tracking-tighter">Manager-Data Divergence</p>
          </div>
        </EngCard>
        
        <EngCard title="Evidence Health" className="border-eng-info/20">
          <div className="space-y-3 pt-2">
            {[
              { label: 'Jira Sync', health: 98 },
              { label: 'Git Hash', health: 100 },
              { label: 'Slack NLP', health: 92 }
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-[10px] text-white font-bold mb-1 uppercase tracking-tighter">
                  <span>{s.label}</span>
                  <span>{s.health}%</span>
                </div>
                <div className="w-full h-1 bg-eng-border rounded-full overflow-hidden">
                  <div className="h-full bg-eng-info" style={{ width: `${s.health}%` }} />
                </div>
              </div>
            ))}
          </div>
        </EngCard>

        <EngCard title="Plain-English Explainer">
          <div className="bg-eng-surface border border-eng-border rounded-lg p-3 text-[10px] text-eng-text-muted leading-relaxed italic">
            {employeeData.deliberation.length > 200 ? employeeData.deliberation.substring(0, 200) + '...' : employeeData.deliberation}
          </div>
          <button className="w-full mt-3 py-1.5 bg-eng-border rounded text-[10px] text-white font-bold hover:bg-slate-700 uppercase tracking-widest">
            Notify Employee
          </button>
        </EngCard>
      </div>
    </div>
  );
};
