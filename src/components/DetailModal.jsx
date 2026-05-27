import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Check, Heart, Shield, HelpCircle, FileText } from 'lucide-react';

export default function DetailModal({ diagnosis, onClose, onSave, onAcceptAI }) {
  const {
    id,
    diagnosis_name,
    category_body_part,
    age_group = [],
    gender,
    base_data = {},
    underwriting_rules = {},
    ai_suggestions,
    updated_by,
    last_updated
  } = diagnosis;

  // Local Form state
  const [requirements, setRequirements] = useState(underwriting_rules.requirements || '');
  const [decisions, setDecisions] = useState(underwriting_rules.decisions_reference || '');
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [savedStatus, setSavedStatus] = useState(false);

  // Sync state if diagnosis changes
  useEffect(() => {
    setRequirements(underwriting_rules.requirements || '');
    setDecisions(underwriting_rules.decisions_reference || '');
    setSavedStatus(false);
  }, [diagnosis]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(id, {
      underwriting_rules: {
        requirements,
        decisions_reference: decisions
      }
    });
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
    }, 2000);
  };

  const handleAcceptAISuggestion = () => {
    onAcceptAI(id);
    // The suggestions get merged into parent state, which updates this modal's diagnosis object
  };

  // Safe markdown/text line rendering
  const renderFormattedList = (text) => {
    if (!text) return <p className="text-muted">無資料</p>;
    return (
      <div className="markdown-content">
        {text.split('\n').map((line, idx) => {
          if (line.trim().startsWith('*')) {
            const cleanText = line.replace(/^\*\s*/, '');
            // Simple bold parser
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
          
          <div className="modal-header-meta">
            <span className="badge badge-blue">{category_body_part}</span>
            <span className="badge badge-purple">{gender} • {age_group.join(', ')}</span>
          </div>
          
          <h2 className="modal-title">{diagnosis_name}</h2>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          {/* Left Column: Medical Base Data (Read-Only) */}
          <div className="modal-info-block">
            <div className="modal-section-title">
              <Heart size={16} style={{ color: 'var(--accent-rose)' }} />
              基礎臨床醫學常識 (Base Data)
            </div>

            <div className="info-item">
              <span className="label">成因說明 (Causes)</span>
              <div className="content">{base_data.causes}</div>
            </div>

            <div className="info-item">
              <span className="label" style={{ color: 'var(--accent-amber)' }}>核保風險評估 (Risks)</span>
              <div className="content" style={{ borderLeft: '3px solid var(--accent-amber)', paddingLeft: '12px' }}>
                {base_data.risks}
              </div>
            </div>

            <div className="info-item">
              <span className="label" style={{ color: 'var(--accent-blue)' }}>常見治療方案 (Treatments)</span>
              <div className="content">{base_data.treatments}</div>
            </div>
            
            {/* Display Underwriting Rules Preview if in Preview Mode */}
            {activeTab === 'preview' && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="modal-section-title">
                  <Shield size={16} style={{ color: 'var(--accent-emerald)' }} />
                  核保規則預覽 (Rules Preview)
                </div>
                <div className="info-item">
                  <span className="label">核保要求條件 (Requirements)</span>
                  <div className="content" style={{ background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                    {renderFormattedList(requirements)}
                  </div>
                </div>
                <div className="info-item">
                  <span className="label">核保決策參考 (Decisions)</span>
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
                <span>動態核保規範 (Dynamic Rules)</span>
              </div>
              <div className="radio-group" style={{ width: '140px', padding: '2px', marginLeft: 'auto' }}>
                <div 
                  className={`radio-btn ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                  style={{ padding: '4px 2px', fontSize: '11px' }}
                >
                  編輯編輯
                </div>
                <div 
                  className={`radio-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                  style={{ padding: '4px 2px', fontSize: '11px' }}
                >
                  預覽預覽
                </div>
              </div>
            </div>

            {activeTab === 'edit' ? (
              <form onSubmit={handleSave} className="rules-form">
                <div className="form-group">
                  <label htmlFor="reqs-textarea" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={14} style={{ color: 'var(--accent-indigo)' }} />
                    手動核保要求 (Requirements)
                  </label>
                  <textarea
                    id="reqs-textarea"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="輸入對客人的核保要求，例如：需附健檢報告、免責聲明等..."
                  />
                  <span className="form-helper-text">支援 Markdown 清單，每一行以 * 開頭即可在預覽渲染點點。</span>
                </div>

                <div className="form-group">
                  <label htmlFor="decs-textarea" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <HelpCircle size={14} style={{ color: 'var(--accent-indigo)' }} />
                    核保結果與加費參考 (Decisions Reference)
                  </label>
                  <textarea
                    id="decs-textarea"
                    value={decisions}
                    onChange={(e) => setDecisions(e.target.value)}
                    placeholder="輸入核保結果等級，例如：標準體、加費X%、拒保等..."
                  />
                  <span className="form-helper-text">支援使用雙星號（**粗體**）強調關鍵承保比例。</span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ display: 'flex', width: '100%', gap: '8px', justifyContent: 'center' }}>
                  {savedStatus ? (
                    <>
                      <Check size={16} /> 已成功儲存！
                    </>
                  ) : (
                    <>
                      <Save size={16} /> 儲存目前修改 (Lock as Human)
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', padding: '20px', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: '10px' }}>
                已在左側面板渲染「預覽預覽」格式，您可以隨時切換回「編輯編輯」進行調整。
              </div>
            )}

            {/* AI Suggestions Review Board */}
            {ai_suggestions ? (
              <div className="ai-suggestions-box">
                <div className="ai-suggest-header">
                  <span className="ai-suggest-title">
                    <Sparkles size={14} style={{ animation: 'spin 4s linear infinite' }} />
                    AI Agent 智能優化建議
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '9px' }}>待審查</span>
                </div>
                
                <div className="ai-suggest-content">
                  {ai_suggestions.requirements && (
                    <div className="ai-suggest-item">
                      <span className="label">建議補足要求：</span>
                      <div className="val">{renderFormattedList(ai_suggestions.requirements)}</div>
                    </div>
                  )}
                  {ai_suggestions.decisions_reference && (
                    <div className="ai-suggest-item">
                      <span className="label">建議核保加費參考：</span>
                      <div className="val">{renderFormattedList(ai_suggestions.decisions_reference)}</div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleAcceptAISuggestion}
                  className="btn btn-accent"
                  style={{ marginTop: '8px', display: 'flex', width: '100%', gap: '8px', justifyContent: 'center' }}
                >
                  <Check size={16} />
                  核准並併入正式核保規範 (Approved AI)
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={16} />
                <span>此病例目前無待處理的 AI 更新建議。可在主頁模擬觸發。</span>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-footer-info">
            最後修改者：<strong style={{ color: 'var(--accent-blue)' }}>{updated_by}</strong> 
            {last_updated && ` 於 ${new Date(last_updated).toLocaleString('zh-TW')}`}
          </div>
          <div className="modal-footer-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              關閉視窗
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
