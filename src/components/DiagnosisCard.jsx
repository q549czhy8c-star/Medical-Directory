import React from 'react';
import { Eye, Clock, Sparkles } from 'lucide-react';

export default function DiagnosisCard({ diagnosis, onClick }) {
  const {
    diagnosis_name,
    category_body_part,
    age_group = [],
    gender,
    base_data = {},
    updated_by,
    last_updated,
    ai_suggestions
  } = diagnosis;

  // Format date readable
  const formattedDate = last_updated 
    ? new Date(last_updated).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '無紀錄';

  const isAIUpdated = updated_by && updated_by.toLowerCase().includes('ai');

  return (
    <div className="diagnosis-card glass-panel" onClick={onClick}>
      <div className="card-top">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="card-system">{category_body_part.split(' ')[0]}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {ai_suggestions && (
              <span className="badge badge-amber" style={{ animation: 'pulse 2s infinite', fontSize: '9px', padding: '2px 6px' }}>
                <Sparkles size={8} /> AI 建議
              </span>
            )}
            <span className={`updater-badge ${isAIUpdated ? 'ai' : 'human'}`}>
              {updated_by || 'Human'}
            </span>
          </div>
        </div>
        <h3 className="card-title">{diagnosis_name}</h3>
        <div className="card-meta-badges">
          {age_group.map(age => (
            <span key={age} className="badge badge-blue" style={{ fontSize: '9px', padding: '1px 6px' }}>{age}</span>
          ))}
          <span className="badge badge-purple" style={{ fontSize: '9px', padding: '1px 6px' }}>性別: {gender}</span>
        </div>
      </div>

      <p className="card-middle">
        {base_data.causes || '尚無成因說明。'}
      </p>

      <div className="card-bottom">
        <div className="updater-info">
          <Clock size={12} />
          <span>更新於 {formattedDate}</span>
        </div>
        <span className="view-more-link">
          詳細指南
          <Eye size={14} />
        </span>
      </div>
    </div>
  );
}
