import React, { useState } from 'react';
import { HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PremiumPaymentTermMatch() {
  const [productPayTerm, setProductPayTerm] = useState('10'); // '10' Pay, '20' Pay, '25' Pay
  
  // Client choices
  const [q2Horizon, setQ2Horizon] = useState('D'); // Part 2 Q2 Expected Timeframe (Default 'D': 11-15 years)
  const [q6PayPeriod, setQ6PayPeriod] = useState('6-10'); // Part 4 Q6 Willingness to pay (Default '6-10' years)

  const horizons = [
    { id: 'A', name: '< 1 Year', label: '< 1年' },
    { id: 'B', name: '1 - 5 Years', label: '1 - 5年' },
    { id: 'C', name: '6 - 10 Years', label: '6 - 10年' },
    { id: 'D', name: '11 - 15 Years', label: '11 - 15年' },
    { id: 'E', name: '16 - 20 Years', label: '16 - 20年' },
    { id: 'F', name: '> 20 Years', label: '> 20年' },
    { id: 'G', name: 'Whole of Life', label: '終身' },
  ];

  const payPeriods = [
    { id: '2-5', label: '2 - 5年' },
    { id: '6-10', label: '6 - 10年' },
    { id: '11-15', label: '11 - 15年' },
    { id: '16-20', label: '16 - 20年' },
    { id: '>20', label: '> 20年' },
    { id: 'WOL', label: '終身' },
  ];

  // Logic to determine if a combination is valid for the selected product term
  const validateMatch = (term, horizonId, payPeriodId) => {
    // 10 Pay Product
    if (term === '10') {
      const validHorizons = ['D', 'E', 'F', 'G']; // >= 10 years
      const validPayPeriods = ['6-10', '11-15', '16-20', '>20', 'WOL']; // Willingness must cover 10 years (which starts at 6-10 years band)
      return validHorizons.includes(horizonId) && validPayPeriods.includes(payPeriodId);
    }
    
    // 20 Pay Product
    if (term === '20') {
      const validHorizons = ['E', 'F', 'G']; // >= 20 years
      const validPayPeriods = ['16-20', '>20', 'WOL']; // Willingness must cover 20 years (starts at 16-20 years band)
      return validHorizons.includes(horizonId) && validPayPeriods.includes(payPeriodId);
    }
    
    // 25 Pay Product
    if (term === '25') {
      const validHorizons = ['F', 'G']; // >= 25 years (maps to >20 or Whole of life)
      const validPayPeriods = ['>20', 'WOL']; // Willingness must cover 25 years (starts at >20 band)
      return validHorizons.includes(horizonId) && validPayPeriods.includes(payPeriodId);
    }
    
    return false;
  };

  const isCurrentMatch = validateMatch(productPayTerm, q2Horizon, q6PayPeriod);

  return (
    <div className="main-content">
      <div className="glass-panel module-card">
        <div className="module-header">
          <h2>繳費年期與保障年期合適性匹配 (Premium Term Compatibility)</h2>
          <p>
            根據合適性評估矩陣（投影片 10），客戶的「預期保障期 (Q2)」與「繳費期意願 (Q6)」必須能匹配所選保險產品的繳費年期。
          </p>
        </div>

        <div className="form-group" style={{ maxWidth: '400px', marginBottom: '20px' }}>
          <label>所選保險產品的繳費年期 (Product Premium Pay Term)</label>
          <select 
            className="form-control"
            value={productPayTerm}
            onChange={(e) => setProductPayTerm(e.target.value)}
          >
            <option value="10">10年期繳費計劃 (10 Pay Product)</option>
            <option value="20">20年期繳費計劃 (20 Pay Product)</option>
            <option value="25">25年期繳費計劃 (25 Pay Product)</option>
          </select>
        </div>

        <div className="grid-2col" style={{ gap: '20px' }}>
          {/* Dropdown Selects */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 700 }}>
              客戶問卷回答 (Client Questionnaire Answers)
            </h4>
            
            <div className="form-group">
              <label>問卷第二部分 Q2: 客戶預期保障期 / 目標年期</label>
              <select 
                className="form-control"
                value={q2Horizon}
                onChange={(e) => setQ2Horizon(e.target.value)}
              >
                {horizons.map(h => (
                  <option key={h.id} value={h.id}>{h.label} ({h.name})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>問卷第四部分 Q6: 客戶願意並能夠繳付保費的年期</label>
              <select 
                className="form-control"
                value={q6PayPeriod}
                onChange={(e) => setQ6PayPeriod(e.target.value)}
              >
                {payPeriods.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className={`verdict-card ${isCurrentMatch ? 'pass' : 'fail'}`} style={{ marginTop: '8px' }}>
              <div className="verdict-title">
                {isCurrentMatch ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                {isCurrentMatch ? '匹配通過 (PASS)' : '匹配失敗 (FAIL)'}
              </div>
              <div className="verdict-subtitle">
                {isCurrentMatch 
                  ? '客戶的保障年期與繳費意願完全支持該繳費年期的產品計畫。' 
                  : `此配對不合規！申請 ${productPayTerm} 年繳費產品，要求預期保障年期必須符合且願意繳費年期必須能覆蓋 ${productPayTerm} 年。`
                }
              </div>
            </div>
          </div>

          {/* Visual Matrix Grid */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              互動式合適性評估矩陣 (Interactive Matrix Grid)
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              下圖展示當前產品在不同組合下的合規狀態。點選方格以切換客戶答案：
            </span>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
              <div className="matrix-grid">
                {/* Header Row */}
                <div className="matrix-header">Q2 \ Q6</div>
                {payPeriods.map(p => (
                  <div key={p.id} className="matrix-header">{p.label}</div>
                ))}

                {/* Matrix Rows */}
                {horizons.map(h => {
                  return (
                    <React.Fragment key={h.id}>
                      <div className="matrix-header row-label">{h.label}</div>
                      {payPeriods.map(p => {
                        const isValid = validateMatch(productPayTerm, h.id, p.id);
                        const isSelected = q2Horizon === h.id && q6PayPeriod === p.id;
                        
                        return (
                          <div 
                            key={p.id}
                            className={`matrix-cell ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setQ2Horizon(h.id);
                              setQ6PayPeriod(p.id);
                            }}
                            style={{
                              borderColor: isSelected ? 'var(--accent-indigo)' : (isValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'),
                              background: isValid 
                                ? 'rgba(16, 185, 129, 0.03)' 
                                : 'rgba(244, 63, 94, 0.02)',
                              color: isValid ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            {isSelected ? '★ ' : ''}
                            {isValid ? 'PASS' : 'FAIL'}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="glass-panel module-card" style={{ padding: '20px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '15px', marginBottom: '10px' }}>
          <HelpCircle size={16} style={{ color: 'var(--accent-indigo)' }} />
          匹配規則核心邏輯 (Matrix Logic Summary)
        </h4>
        <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <strong>基本黃金法則</strong>：<strong>客戶預期保障期 (Part 2 Q2) ≧ 產品繳費年期</strong>。例如客戶預期年期為 6-10 年，則絕不能投保 10 年、20 年、25 年期繳費的產品，因為這會迫使客戶在需求結束後繼續付款，或者面臨早期退保的虧損風險。
          </li>
          <li>
            <strong>繳費意願匹配</strong>：<strong>客戶願意繳費年期 (Part 4 Q6) ≧ 產品繳費年期</strong>。例如客戶最多只願意付 2-5 年的保費，就不能向其銷售 10 年、20 年期繳費計劃。
          </li>
        </ul>
      </div>
    </div>
  );
}
