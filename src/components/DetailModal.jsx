import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Check, Heart, Shield, HelpCircle, FileText } from 'lucide-react';
import { translations } from '../services/i18nService';

export default function DetailModal({ diagnosis, onClose, onSave, onAcceptAI, lang = 'zh' }) {
  const t = translations[lang];

  // Resolve bilingual fields
  const systemName = lang === 'zh' ? diagnosis.category_body_part_zh : diagnosis.category_body_part_en;
  const diseaseName = lang === 'zh' ? diagnosis.diagnosis_name_zh : diagnosis.diagnosis_name_en;
  const ages = lang === 'zh' ? diagnosis.age_group_zh : diagnosis.age_group_en;
  const genderLabel = lang === 'zh' ? diagnosis.gender_zh : diagnosis.gender_en;
  
  const causeText = lang === 'zh' ? diagnosis.base_data.causes_zh : diagnosis.base_data.causes_en;
  const riskText = lang === 'zh' ? diagnosis.base_data.risks_zh : diagnosis.base_data.risks_en;
  const treatmentText = lang === 'zh' ? diagnosis.base_data.treatments_zh : diagnosis.base_data.treatments_en;

  const initialReqs = lang === 'zh' 
    ? (diagnosis.underwriting_rules.requirements_zh || '')
    : (diagnosis.underwriting_rules.requirements_en || '');
  
  const initialDecs = lang === 'zh'
    ? (diagnosis.underwriting_rules.decisions_reference_zh || '')
    : (diagnosis.underwriting_rules.decisions_reference_en || '');

  // Local Form state
  const [requirements, setRequirements] = useState(initialReqs);
  const [decisions, setDecisions] = useState(initialDecs);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [savedStatus, setSavedStatus] = useState(false);

  // Sync state if diagnosis or language changes
  useEffect(() => {
    setRequirements(initialReqs);
    setDecisions(initialDecs);
    setSavedStatus(false);
  }, [diagnosis, lang]);

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save to the appropriate language fields
    const updatedRules = lang === 'zh' ? {
      underwriting_rules: {
        ...diagnosis.underwriting_rules,
        requirements_zh: requirements,
        decisions_reference_zh: decisions
      }
    } : {
      underwriting_rules: {
        ...diagnosis.underwriting_rules,
        requirements_en: requirements,
        decisions_reference_en: decisions
      }
    };

    onSave(diagnosis.id, updatedRules);
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
    }, 2000);
  };

  const handleAcceptAISuggestion = () => {
    onAcceptAI(diagnosis.id);
  };

  // Safe list rendering
  const renderFormattedList = (text) => {
    if (!text) return <p className="text-muted">No data</p>;
    return (
      <div className="markdown-content">
        {text.split('\n').map((line, idx) => {
          if (line.trim().startsWith('*')) {
            const cleanText = line.replace(/^\*\s*/, '');
            const parts = cleanText.split('**');
            return (
              <li key={idx}>
                {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part)}
              </li>
            );
          }
          return <p key={idx} style={{ marginBottom: '8px' }}>{line}</p>;
        })}
      </div>
    );
  };

  const {
    id,
    ai_suggestions,
    updated_by,
    last_updated
  } = diagnosis;

  // Resolve active AI suggestions translations
  const aiReqs = ai_suggestions 
    ? (lang === 'zh' ? ai_suggestions.requirements_zh : ai_suggestions.requirements_en)
    : null;
  const aiDecs = ai_suggestions
    ? (lang === 'zh' ? ai_suggestions.decisions_reference_zh : ai_suggestions.decisions_reference_en)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
          
          <div className="modal-header-meta">
            <span className="badge badge-blue">{systemName}</span>
            <span className="badge badge-purple">{genderLabel} • {ages.join(', ')}</span>
          </div>
          
          <h2 className="modal-title">{diseaseName}</h2>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          {/* Left Column: Medical Base Data (Read-Only) */}
          <div className="modal-info-block">
            <div className="modal-section-title">
              <Heart size={16} style={{ color: 'var(--accent-rose)' }} />
              {t.modalClinicalTitle}
            </div>

            <div className="info-item">
              <span className="label">{t.modalCausesLabel}</span>
              <div className="content">{causeText}</div>
            </div>

            <div className="info-item">
              <span className="label" style={{ color: 'var(--accent-amber)' }}>{t.modalRisksLabel}</span>
              <div className="content" style={{ borderLeft: '3px solid var(--accent-amber)', paddingLeft: '12px' }}>
                {riskText}
              </div>
            </div>

            <div className="info-item">
              <span className="label" style={{ color: 'var(--accent-blue)' }}>{t.modalTreatmentsLabel}</span>
              <div className="content">{treatmentText}</div>
            </div>
            
            {/* Display Underwriting Rules Preview if in Preview Mode */}
            {activeTab === 'preview' && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="modal-section-title">
                  <Shield size={16} style={{ color: 'var(--accent-emerald)' }} />
                  {lang === 'zh' ? '核保規則預覽' : 'Rules Preview'}
                </div>
                <div className="info-item">
                  <span className="label">{lang === 'zh' ? '核保要求條件' : 'Requirements'}</span>
                  <div className="content" style={{ background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                    {renderFormattedList(requirements)}
                  </div>
                </div>
                <div className="info-item">
                  <span className="label">{lang === 'zh' ? '核保決策與加費' : 'Decisions & Loadings'}</span>
                  <div className="content" style={{ background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                    {renderFormattedList(decisions)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Underwriting Rules Form (Editable) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="modal-section-title" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span>{t.modalRulesTitle}</span>
              </div>
              <div className="radio-group" style={{ width: '120px', padding: '2px', marginLeft: 'auto' }}>
                <div 
                  className={`radio-btn ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                  style={{ padding: '4px 2px', fontSize: '11px' }}
                >
                  {t.modalTabEdit}
                </div>
                <div 
                  className={`radio-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                  style={{ padding: '4px 2px', fontSize: '11px' }}
                >
                  {t.modalTabPreview}
                </div>
              </div>
            </div>

            {activeTab === 'edit' ? (
              <form onSubmit={handleSave} className="rules-form">
                <div className="form-group">
                  <label htmlFor="reqs-textarea" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={14} style={{ color: 'var(--accent-indigo)' }} />
                    {t.modalRequirementsLabel}
                  </label>
                  <textarea
                    id="reqs-textarea"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder={t.modalRequirementsPlaceholder}
                  />
                  <span className="form-helper-text">{t.modalRequirementsHelper}</span>
                </div>

                <div className="form-group">
                  <label htmlFor="decs-textarea" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <HelpCircle size={14} style={{ color: 'var(--accent-indigo)' }} />
                    {t.modalDecisionsLabel}
                  </label>
                  <textarea
                    id="decs-textarea"
                    value={decisions}
                    onChange={(e) => setDecisions(e.target.value)}
                    placeholder={t.modalDecisionsPlaceholder}
                  />
                  <span className="form-helper-text">{t.modalDecisionsHelper}</span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ display: 'flex', width: '100%', gap: '8px', justifyContent: 'center' }}>
                  {savedStatus ? (
                    <>
                      <Check size={16} /> {t.modalSavedBtn}
                    </>
                  ) : (
                    <>
                      <Save size={16} /> {t.modalSaveBtn}
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', padding: '20px', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: '10px' }}>
                {lang === 'zh' 
                  ? '已在左側面板渲染「預覽預覽」格式，您可以隨時切換回「編輯編輯」進行調整。'
                  : 'Rules are previewed in the left panel. Toggle back to "Edit" to modify.'}
              </div>
            )}

            {/* AI Suggestions Review Board */}
            {ai_suggestions ? (
              <div className="ai-suggestions-box">
                <div className="ai-suggest-header">
                  <span className="ai-suggest-title">
                    <Sparkles size={14} style={{ animation: 'spin 4s linear infinite' }} />
                    {t.modalAISuggestionTitle}
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '9px' }}>{t.modalPendingBadge}</span>
                </div>
                
                <div className="ai-suggest-content">
                  {aiReqs && (
                    <div className="ai-suggest-item">
                      <span className="label">{t.modalAISuggestRequirements}</span>
                      <div className="val">{renderFormattedList(aiReqs)}</div>
                    </div>
                  )}
                  {aiDecs && (
                    <div className="ai-suggest-item">
                      <span className="label">{t.modalAISuggestDecisions}</span>
                      <div className="val">{renderFormattedList(aiDecs)}</div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleAcceptAISuggestion}
                  className="btn btn-accent"
                  style={{ marginTop: '8px', display: 'flex', width: '100%', gap: '8px', justifyContent: 'center' }}
                >
                  <Check size={16} />
                  {t.modalAIAcceptBtn}
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={16} />
                <span>{t.modalNoAISuggestions}</span>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-footer-info">
            {t.modalLastUpdatedBy}：<strong style={{ color: 'var(--accent-blue)' }}>{updated_by}</strong> 
            {last_updated && ` @ ${new Date(last_updated).toLocaleString(lang === 'zh' ? 'zh-TW' : 'en-US')}`}
          </div>
          <div className="modal-footer-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              {t.modalCloseBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
