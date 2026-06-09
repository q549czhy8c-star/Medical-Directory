import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export default function TargetSavingsCalculator() {
  // Inputs
  const [timeframe, setTimeframe] = useState(30);
  const [illustrationBenefit, setIllustrationBenefit] = useState(291000);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(7.8);
  const [clientAnswer, setClientAnswer] = useState(2269800); // Question 1.3

  // Calculated values
  const [convertedBenefit, setConvertedBenefit] = useState(0);
  const [bounds, setBounds] = useState({ min: 0, max: 0 });
  const [status, setStatus] = useState({ isValid: false, percentDeviation: 0, message: '' });

  // Calculate suitability
  useEffect(() => {
    // Converted to HKD
    const rate = currency === 'USD' ? exchangeRate : 1.0;
    const baseBenefit = illustrationBenefit * rate;
    setConvertedBenefit(baseBenefit);

    // Calculate bounds [95%, 106%]
    const minBound = baseBenefit * 0.95;
    const maxBound = baseBenefit * 1.06;
    setBounds({ min: Math.round(minBound), max: Math.round(maxBound) });

    // Deviation percentage of client's answer from baseBenefit
    const deviation = baseBenefit !== 0 ? (clientAnswer / baseBenefit) * 100 : 0;
    const isValid = clientAnswer >= minBound && clientAnswer <= maxBound;

    let message = '';
    if (isValid) {
      message = `合規通過！客戶填寫的目標儲蓄金額落於基準利益的 95% ~ 106% 區間內（實值佔比為：${deviation.toFixed(1)}%）。`;
    } else {
      const boundaryMsg = clientAnswer < minBound ? '低於下限 95%' : '高於上限 106%';
      message = `合規未通過！客戶填寫的目標儲蓄金額與建議書利益差距過大（實值佔比為：${deviation.toFixed(1)}%，${boundaryMsg}）。`;
    }

    setStatus({ isValid, percentDeviation: deviation, message });
  }, [timeframe, illustrationBenefit, currency, exchangeRate, clientAnswer]);

  const loadSlideScenario = (answerVal) => {
    setTimeframe(30);
    setIllustrationBenefit(291000);
    setCurrency('USD');
    setExchangeRate(7.8);
    setClientAnswer(answerVal);
  };

  return (
    <div className="main-content">
      <div className="glass-panel module-card">
        <div className="module-header">
          <h2>目標儲蓄金額與利益說明合適性 (Target Savings Suitability)</h2>
          <p>
            根據保險公司核保要求，客戶在 FNA 表格中填寫的目標儲蓄金額（Q1.3），必須與所選計劃建議書在目標年期（Q1.4）之預期總退保價（包括保證與非保證部分）相匹配。
          </p>
        </div>

        <div className="grid-2col">
          {/* Inputs Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              試算基準設定 (Illustration Parameters)
            </h4>

            <div className="grid-2col" style={{ gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>目標年期 (Q1.4 年)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={timeframe}
                  onChange={(e) => setTimeframe(Number(e.target.value))}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>貨幣 (Currency)</label>
                <select 
                  className="form-control"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">美元 (USD)</option>
                  <option value="HKD">港幣 (HKD)</option>
                </select>
              </div>
            </div>

            <div className="grid-2col" style={{ gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>利益說明總退保利益 (Surrender Benefit)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={illustrationBenefit}
                  onChange={(e) => setIllustrationBenefit(Number(e.target.value))}
                />
              </div>
              
              {currency === 'USD' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>匯率 (USD ➔ HKD)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    step="0.01"
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>客戶問卷表示目標儲蓄額 (Q1.3) (HKD)</label>
              <input 
                type="number" 
                className="form-control"
                value={clientAnswer}
                onChange={(e) => setClientAnswer(Number(e.target.value))}
                step="10000"
              />
            </div>
          </div>

          {/* Results Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              計算結果與合規區間 (Compliance Bound Output)
            </h4>

            <div className="range-display" style={{ margin: 0 }}>
              <div className="range-bound" style={{ flex: 1, borderRight: '1px solid var(--border-light)' }}>
                <span className="range-bound-label">換算港幣基準價值</span>
                <span className="range-bound-value" style={{ color: '#fff' }}>
                  HK$ {Math.round(convertedBenefit).toLocaleString()}
                </span>
              </div>
              <div className="range-bound" style={{ flex: 1, paddingLeft: '12px' }}>
                <span className="range-bound-label">客戶填寫實值佔比</span>
                <span className="range-bound-value" style={{ color: status.isValid ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {status.percentDeviation.toFixed(2)} %
                </span>
              </div>
            </div>

            <div className="range-display" style={{ margin: 0 }}>
              <div className="range-bound">
                <span className="range-bound-label">合規下限 (95% Min Limit)</span>
                <span className="range-bound-value">HK$ {bounds.min.toLocaleString()}</span>
              </div>
              <div className="range-bound">
                <span className="range-bound-label">合規上限 (106% Max Limit)</span>
                <span className="range-bound-value">HK$ {bounds.max.toLocaleString()}</span>
              </div>
            </div>

            <div className={`verdict-card ${status.isValid ? 'pass' : 'fail'}`} style={{ flex: 1, margin: 0 }}>
              <div className="verdict-title">
                {status.isValid ? '✓ 合規 PASS' : '✗ 合規 FAIL'}
              </div>
              <div className="verdict-subtitle">{status.message}</div>
            </div>
          </div>
        </div>

        {/* Preset Scenarios based on Slide 8 */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>
            PPT 投影片案例快速測試 (Slide 8 Case Presets):
          </span>
          <div className="presets-container" style={{ margin: 0, padding: '12px' }}>
            <button 
              className={`preset-btn ${clientAnswer === 2156310 ? 'active' : ''}`}
              onClick={() => loadSlideScenario(2156310)}
            >
              案例 A: HK$ 2,156,310 (剛好 95% 下限) ➔ PASS
            </button>
            <button 
              className={`preset-btn ${clientAnswer === 2405988 ? 'active' : ''}`}
              onClick={() => loadSlideScenario(2405988)}
            >
              案例 B: HK$ 2,405,988 (剛好 106% 上限) ➔ PASS
            </button>
            <button 
              className={`preset-btn ${clientAnswer === 2100000 ? 'active' : ''}`}
              onClick={() => loadSlideScenario(2100000)}
            >
              案例 C: HK$ 2,100,000 (低於下限) ➔ FAIL
            </button>
            <button 
              className={`preset-btn ${clientAnswer === 2450000 ? 'active' : ''}`}
              onClick={() => loadSlideScenario(2450000)}
            >
              案例 D: HK$ 2,450,000 (高於上限) ➔ FAIL
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="glass-panel module-card" style={{ padding: '20px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '15px', marginBottom: '10px' }}>
          <HelpCircle size={16} style={{ color: 'var(--accent-indigo)' }} />
          核保合規小貼士 (Underwriting Compliance Tips)
        </h4>
        <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <strong>為什麼是 95% - 106%？</strong>：此區間是保險公司核保系統對利益說明書中退保金價值與客戶在需要分析中所填寫目標額度的一致性檢核標準。客戶所填額度若與建議書中第 Q1.4 年的預期總退保價值相差超過該範圍，將被判定為合適性不匹配，需由中介人提交合理解釋，否則將被退保拒受。
          </li>
          <li>
            <strong>匯率換算</strong>：如果購買的是美元計價產品，在對比客戶於 FNA 填寫的港幣目標儲蓄金額時，核保系統會以固定匯率 <strong>7.8</strong> 進行換算。
          </li>
        </ul>
      </div>
    </div>
  );
}
