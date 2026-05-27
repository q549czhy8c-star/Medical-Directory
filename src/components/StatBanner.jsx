import React from 'react';
import { Activity, ShieldAlert, Cpu, Heart } from 'lucide-react';
import { translations } from '../services/i18nService';

export default function StatBanner({ diagnoses = [], lang = 'zh' }) {
  const t = translations[lang];
  const total = diagnoses.length;
  const humanEdited = diagnoses.filter(d => d.updated_by && d.updated_by.includes('Human')).length;
  const pendingAISuggestions = diagnoses.filter(d => d.ai_suggestions !== null).length;
  
  return (
    <div className="stat-banner">
      <div className="stat-card glass-panel">
        <div className="stat-icon">
          <Heart size={20} />
        </div>
        <div className="stat-info">
          <span className="label">{t.diagnosesCount}</span>
          <span className="value">
            {total} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>{t.diagnosesUnit}</span>
          </span>
        </div>
      </div>
      
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--accent-emerald)' }}>
          <Activity size={20} />
        </div>
        <div className="stat-info">
          <span className="label">{t.expertReviewRate}</span>
          <span className="value">
            {total ? Math.round((humanEdited / total) * 100) : 0}% 
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--accent-emerald)', marginLeft: '6px' }}>
              ({humanEdited} {t.casesApproved})
            </span>
          </span>
        </div>
      </div>
      
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--accent-violet)' }}>
          <Cpu size={20} />
        </div>
        <div className="stat-info">
          <span className="label">{t.pendingAISuggestions}</span>
          <span className="value">
            {pendingAISuggestions} 
            <span style={{ fontSize: '11.5px', fontWeight: 500, color: pendingAISuggestions > 0 ? 'var(--accent-amber)' : 'var(--text-muted)', marginLeft: '6px' }}>
              {pendingAISuggestions > 0 ? t.attentionNeeded : t.allProcessed}
            </span>
          </span>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--accent-blue)' }}>
          <ShieldAlert size={20} />
        </div>
        <div className="stat-info">
          <span className="label">{t.dbSyncStatus}</span>
          <span className="value" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', animation: 'pulse 2s infinite' }}></span>
            {t.runningStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
