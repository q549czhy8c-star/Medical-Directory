import React from 'react';
import { Activity, ShieldAlert, Cpu, Heart } from 'lucide-react';

export default function StatBanner({ diagnoses = [] }) {
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
          <span className="label">收錄疾病診斷</span>
          <span className="value">{total} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>個病例</span></span>
        </div>
      </div>
      
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--accent-emerald)' }}>
          <Activity size={20} />
        </div>
        <div className="stat-info">
          <span className="label">專家審核比例</span>
          <span className="value">
            {total ? Math.round((humanEdited / total) * 100) : 0}% 
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--accent-emerald)', marginLeft: '6px' }}>
              ({humanEdited} 案已審)
            </span>
          </span>
        </div>
      </div>
      
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--accent-violet)' }}>
          <Cpu size={20} />
        </div>
        <div className="stat-info">
          <span className="label">AI 待審查建議</span>
          <span className="value">
            {pendingAISuggestions} 
            <span style={{ fontSize: '11px', fontWeight: 500, color: pendingAISuggestions > 0 ? 'var(--accent-amber)' : 'var(--text-muted)', marginLeft: '6px' }}>
              {pendingAISuggestions > 0 ? '● 需要關注' : '已全部處理'}
            </span>
          </span>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--accent-blue)' }}>
          <ShieldAlert size={20} />
        </div>
        <div className="stat-info">
          <span className="label">核保資料庫狀態</span>
          <span className="value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', animation: 'pulse 2s infinite' }}></span>
            同步運作中 (Local DB)
          </span>
        </div>
      </div>
    </div>
  );
}
