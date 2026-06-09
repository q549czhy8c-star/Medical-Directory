import React, { useState, useEffect } from 'react';
import { Calendar, ArrowUp, ArrowDown, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export default function TimelineSolicitation() {
  // Initial unordered events
  const [events, setEvents] = useState([
    { id: 'proposal_print', title_zh: '建議書印製日期', title_en: 'Print Date of Proposal', date: '2026-06-10' },
    { id: 'app_sign', title_zh: '投保單簽署日期', title_en: 'Sign Date of Application Form', date: '2026-06-12' },
    { id: 'fna_sign', title_zh: 'FNA 簽署日期', title_en: 'Sign Date of FNA', date: '2026-06-09' },
    { id: 'proposal_sign', title_zh: '建議書簽署日期', title_en: 'Sign Date of Proposal', date: '2026-06-11' },
  ]);

  const [validation, setValidation] = useState({ isValid: false, message: '', details: [] });

  // Move event up in the list
  const moveUp = (index) => {
    if (index === 0) return;
    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[index - 1];
    newEvents[index - 1] = temp;
    setEvents(newEvents);
  };

  // Move event down in the list
  const moveDown = (index) => {
    if (index === events.length - 1) return;
    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[index + 1];
    newEvents[index + 1] = temp;
    setEvents(newEvents);
  };

  // Update date of an event
  const handleDateChange = (id, newDate) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, date: newDate } : e));
  };

  // Validate the timeline sequence
  useEffect(() => {
    // Correct order ID sequence: fna_sign -> proposal_print -> proposal_sign -> app_sign
    const correctSeq = ['fna_sign', 'proposal_print', 'proposal_sign', 'app_sign'];
    
    // Check if the current list order matches the correct ID sequence
    const currentSeqIds = events.map(e => e.id);
    const isOrderCorrect = currentSeqIds.every((id, idx) => id === correctSeq[idx]);
    
    // Parse dates
    const dates = {};
    events.forEach(e => {
      dates[e.id] = new Date(e.date);
    });

    const details = [];
    let isDatesCorrect = true;

    // Check Rule 1: FNA Sign Date <= Proposal Print Date
    if (dates['fna_sign'] > dates['proposal_print']) {
      isDatesCorrect = false;
      details.push({
        rule: 'FNA 簽署日期 必須早於或等於 建議書印製日期',
        rule_en: 'Sign Date of FNA must be earlier than or equal to the Print Date of Proposal',
        status: 'fail'
      });
    } else {
      details.push({
        rule: 'FNA 簽署日期 ≦ 建議書印製日期',
        rule_en: 'Sign Date of FNA ≤ Print Date of Proposal',
        status: 'pass'
      });
    }

    // Check Rule 2: Proposal Print Date <= Proposal Sign Date
    if (dates['proposal_print'] > dates['proposal_sign']) {
      isDatesCorrect = false;
      details.push({
        rule: '建議書印製日期 必須早於或等於 建議書簽署日期',
        rule_en: 'Print Date of Proposal must be earlier than or equal to the Sign Date of Proposal',
        status: 'fail'
      });
    } else {
      details.push({
        rule: '建議書印製日期 ≦ 建議書簽署日期',
        rule_en: 'Print Date of Proposal ≤ Sign Date of Proposal',
        status: 'pass'
      });
    }

    // Check Rule 3: Proposal Sign Date <= App Form Sign Date
    if (dates['proposal_sign'] > dates['app_sign']) {
      isDatesCorrect = false;
      details.push({
        rule: '建議書簽署日期 必須早於或等於 投保單簽署日期',
        rule_en: 'Sign Date of Proposal must be earlier than or equal to the Sign Date of Application Form',
        status: 'fail'
      });
    } else {
      details.push({
        rule: '建議書簽署日期 ≦ 投保單簽署日期',
        rule_en: 'Sign Date of Proposal ≤ Sign Date of Application Form',
        status: 'pass'
      });
    }

    const isValid = isOrderCorrect && isDatesCorrect;
    let message = '';
    
    if (isValid) {
      message = '時間順序與日期設定完全符合合規要求！';
    } else if (!isOrderCorrect && !isDatesCorrect) {
      message = '步驟順序不正確，且日期先後順序違反合規規則。';
    } else if (!isOrderCorrect) {
      message = '步驟順序不正確！請調整卡片順序使銷售流程合規。';
    } else {
      message = '步驟順序正確，但具體日期先後設定違反合規規則。';
    }

    setValidation({ isValid, isOrderCorrect, message, details });
  }, [events]);

  // Auto-arrange in correct order and fix dates
  const handleAutoArrange = () => {
    const correctOrder = ['fna_sign', 'proposal_print', 'proposal_sign', 'app_sign'];
    const sorted = [...events].sort((a, b) => correctOrder.indexOf(a.id) - correctOrder.indexOf(b.id));
    
    // Adjust dates chronologically starting from fna_sign date
    const updated = sorted.map((e, idx) => {
      const dateVal = new Date('2026-06-09');
      dateVal.setDate(dateVal.getDate() + idx);
      const year = dateVal.getFullYear();
      const month = String(dateVal.getMonth() + 1).padStart(2, '0');
      const day = String(dateVal.getDate()).padStart(2, '0');
      return {
        ...e,
        date: `${year}-${month}-${day}`
      };
    });
    
    setEvents(updated);
  };

  return (
    <div className="main-content">
      <div className="glass-panel module-card">
        <div className="module-header">
          <h2>銷售招攬流程時間順序 (Flow of Solicitation)</h2>
          <p>
            根據保監局 GL30 指引，人壽保險（非投連險）招攬流程有嚴格的先後順序。請調整下方卡片順序並設定合理日期。
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            提示：銷售合理順序應為：<strong>FNA 簽署 ➔ 建議書印製 ➔ 建議書簽署 ➔ 投保單簽署</strong>
          </span>
          <button className="btn btn-secondary btn-sm" onClick={handleAutoArrange}>
            自動修正順序與日期
          </button>
        </div>

        {/* Timeline Slots */}
        <div className="timeline-slots">
          {events.map((event, index) => {
            const isFirst = index === 0;
            const isLast = index === events.length - 1;
            
            return (
              <div key={event.id} className="timeline-slot filled">
                <div className="slot-number">0{index + 1}</div>
                <div className="timeline-card">
                  <div>
                    <span className="timeline-card-title">{event.title_zh}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                      {event.title_en}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--accent-indigo)' }} />
                      <input 
                        type="date" 
                        value={event.date}
                        onChange={(e) => handleDateChange(event.id, e.target.value)}
                        className="timeline-card-date-input"
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        className="btn btn-secondary btn-xs" 
                        onClick={() => moveUp(index)}
                        disabled={isFirst}
                        style={{ padding: '4px 8px', opacity: isFirst ? 0.3 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-xs" 
                        onClick={() => moveDown(index)}
                        disabled={isLast}
                        style={{ padding: '4px 8px', opacity: isLast ? 0.3 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation Result */}
        <div className={`verdict-card ${validation.isValid ? 'pass' : 'fail'}`} style={{ marginBottom: '24px' }}>
          <div className="verdict-title">
            {validation.isValid ? <CheckCircle size={22} /> : <AlertTriangle size={22} />}
            {validation.isValid ? '合規通過 (PASS)' : '合規未通過 (FAIL)'}
          </div>
          <div className="verdict-subtitle">{validation.message}</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '16px', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px' }}>
              具體檢核規則狀態 (Checking Rules):
            </span>
            {validation.details.map((detail, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: detail.status === 'pass' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {detail.status === 'pass' ? '✓' : '✗'} {detail.rule}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {detail.status === 'pass' ? 'PASS' : 'FAIL'}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: validation.isOrderCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {validation.isOrderCorrect ? '✓' : '✗'} 銷售步驟順序 (FNA ➔ 建議書印製 ➔ 建議書簽署 ➔ 投保單簽署)
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                {validation.isOrderCorrect ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        </div>

        {/* Educational Info */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '15px', marginBottom: '10px' }}>
            <HelpCircle size={16} style={{ color: 'var(--accent-indigo)' }} />
            合規知識庫 (Regulatory Guidelines)
          </h4>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>FNA 簽署日期 ≦ 建議書印製日期</strong>：必須先分析客戶財務需要，才能針對性地印製和推薦適合的建議書，嚴禁「先印建議書，後做需要分析」。
            </li>
            <li>
              <strong>建議書印製日期 ≦ 建議書簽署日期</strong>：客戶只能在建議書印製出紙後，才能在建議書上簽字確認。
            </li>
            <li>
              <strong>建議書簽署日期 ≦ 投保單簽署日期</strong>：客戶必須先簽署確認理解保險建議書的保障細節，才能進一步簽署正式投保單。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
