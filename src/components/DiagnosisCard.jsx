import React from 'react';
import { Eye, Clock, Sparkles } from 'lucide-react';
import { translations } from '../services/i18nService';

export default function DiagnosisCard({ diagnosis, onClick, lang = 'zh' }) {
  const t = translations[lang];

  // Resolve bilingual fields
  const systemName = lang === 'zh' ? diagnosis.category_body_part_zh : diagnosis.category_body_part_en;
  const diseaseName = lang === 'zh' ? diagnosis.diagnosis_name_zh : diagnosis.diagnosis_name_en;
  const ages = lang === 'zh' ? diagnosis.age_group_zh : diagnosis.age_group_en;
  const genderLabel = lang === 'zh' ? diagnosis.gender_zh : diagnosis.gender_en;
  const causeSummary = lang === 'zh' ? diagnosis.base_data.causes_zh : diagnosis.base_data.causes_en;

  const {
    updated_by,
    last_updated,
    ai_suggestions
  } = diagnosis;

  // Format date
  const formattedDate = last_updated 
    ? new Date(last_updated).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : 'N/A';

  const isAIUpdated = updated_by && updated_by.toLowerCase().includes('ai');

  return (
    <div className="diagnosis-card glass-panel" onClick={onClick}>
      <div className="card-top">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="card-system">{systemName.split(' ')[0]}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {ai_suggestions && (
              <span className="badge badge-amber" style={{ animation: 'pulse 2s infinite', fontSize: '9px', padding: '2px 6px' }}>
                <Sparkles size={8} /> {lang === 'zh' ? 'AI 建議' : 'AI Advice'}
              </span>
            )}
            <span className={`updater-badge ${isAIUpdated ? 'ai' : 'human'}`}>
              {updated_by || 'Human'}
            </span>
          </div>
        </div>
        <h3 className="card-title">{diseaseName}</h3>
        <div className="card-meta-badges">
          {ages.map(age => (
            <span key={age} className="badge badge-blue" style={{ fontSize: '9px', padding: '1px 6px' }}>{age}</span>
          ))}
          <span className="badge badge-purple" style={{ fontSize: '9px', padding: '1px 6px' }}>
            {lang === 'zh' ? `性別: ${genderLabel}` : `Gender: ${genderLabel}`}
          </span>
        </div>
      </div>

      <p className="card-middle">
        {causeSummary || 'No details available.'}
      </p>

      <div className="card-bottom">
        <div className="updater-info">
          <Clock size={12} />
          <span>{t.lastUpdated} {formattedDate}</span>
        </div>
        <span className="view-more-link">
          {t.viewMore}
          <Eye size={14} />
        </span>
      </div>
    </div>
  );
}
