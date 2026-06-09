import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, HelpCircle, RefreshCw } from 'lucide-react';

export default function SuitabilityProtectionRange() {
  const [productType, setProductType] = useState('standard'); // 'standard' or 'patron'
  const [calcMode, setCalcMode] = useState('from_need'); // 'from_need' (input client need -> find SA range) or 'from_sa' (input SA -> find client need range)
  
  // Calculator values
  const [clientNeed, setClientNeed] = useState(8000000); // Default HKD 8,000,000
  const [sumAssured, setSumAssured] = useState(10000000); // Default HKD 10,000,000
  const [appliedSA, setAppliedSA] = useState(8000000); // Stated applied SA for testing suitability
  const [statedNeed, setStatedNeed] = useState(8000000); // Stated need for testing suitability

  // Computed ranges
  const [saRange, setSaRange] = useState({ min: 0, max: 0 });
  const [needRange, setNeedRange] = useState({ min: 0, max: 0 });
  const [suitabilityStatus, setSuitabilityStatus] = useState({ isValid: false, message: '' });

  // Quiz values
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const quizQuestions = [
    {
      question: "客戶表示他有 HK$8,000,000 的額外人壽保障需求。若他選購「LionHarvest Prime」(標準險種)，合適的保額 (Sum Assured) 範圍應為何？",
      options: [
        "HK$4,000,000 至 HK$9,600,000",
        "HK$6,666,667 至 HK$16,000,000",
        "HK$8,000,000 至 HK$18,400,000",
        "必須剛好等於 HK$8,000,000"
      ],
      correctIndex: 1,
      explanation: "根據標準險種的 50% - 120% 合適性規則，客戶的額外保障需求必須介於保額的 50% 到 120% 之間。反推保額範圍：\n- 最小保額 = 需求 / 120% = 8,000,000 / 1.2 = HK$6,666,667\n- 最大保額 = 需求 / 50% = 8,000,000 / 0.5 = HK$16,000,000\n所以保額範圍應在 HK$6,666,667 至 HK$16,000,000 之間。"
    },
    {
      question: "若客戶申請保額為 HK$5,000,000 的「Lion Patron」人壽保障計劃。在合適性評估問卷中，客戶對人壽保障需求 (Question 1.1) 的回答應該落在哪個範圍內才能順利通過核保審核？",
      options: [
        "HK$2,500,000 至 HK$6,000,000",
        "HK$5,000,000 至 HK$11,500,000",
        "HK$5,750,000 至 HK$13,800,000",
        "HK$11,500,000 至 HK$23,000,000"
      ],
      correctIndex: 2,
      explanation: "對於「Lion Patron」險種，合適性規定為需求回答必須介於 (保額 x 2.3) 的 50% 到 120% 之間。計算如下：\n- 基準保額乘以 2.3 = 5,000,000 x 2.3 = HK$11,500,000\n- 需求下限 = 11,500,000 x 50% = HK$5,750,000\n- 需求上限 = 11,500,000 x 120% = HK$13,800,000\n因此客戶的需求回答應在 HK$5,750,000 至 HK$13,800,000 之間。"
    }
  ];

  // Recalculate ranges and check validity
  useEffect(() => {
    const factor = productType === 'patron' ? 2.3 : 1.0;

    // 1. Calculate SA Range based on Client Need
    // Client Need / 120% <= SA * factor <= Client Need / 50%
    const minSa = clientNeed / (1.2 * factor);
    const maxSa = clientNeed / (0.5 * factor);
    setSaRange({ min: Math.round(minSa), max: Math.round(maxSa) });

    // 2. Calculate Client Need Range based on SA
    // 50% * SA * factor <= Client Need <= 120% * SA * factor
    const minNeed = sumAssured * factor * 0.5;
    const maxNeed = sumAssured * factor * 1.2;
    setNeedRange({ min: Math.round(minNeed), max: Math.round(maxNeed) });

    // 3. Validate Applied values
    const currentBase = appliedSA * factor;
    const checkMinNeed = currentBase * 0.5;
    const checkMaxNeed = currentBase * 1.2;
    const isValid = statedNeed >= checkMinNeed && statedNeed <= checkMaxNeed;
    
    let message = '';
    if (isValid) {
      message = `合適性匹配通過！客戶表示的需求額度 (HK$${statedNeed.toLocaleString()}) 落於保額的合規區間：[HK$${Math.round(checkMinNeed).toLocaleString()} ~ HK$${Math.round(checkMaxNeed).toLocaleString()}] 內。`;
    } else {
      message = `合適性匹配失敗！客戶表示的需求額度 (HK$${statedNeed.toLocaleString()}) 未落於保額的合規區間：[HK$${Math.round(checkMinNeed).toLocaleString()} ~ HK$${Math.round(checkMaxNeed).toLocaleString()}]。請修改投保保額或客戶的問卷答案！`;
    }
    setSuitabilityStatus({ isValid, message });

  }, [productType, clientNeed, sumAssured, appliedSA, statedNeed]);

  const handleQuizAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === quizQuestions[quizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="main-content">
      <div className="grid-2col">
        {/* Left Card: Interactive Calculator */}
        <div className="glass-panel module-card">
          <div className="module-header">
            <h2>保障需求合適性計算器</h2>
            <p>設定保額或客戶需求回答，計算合規區間並驗證合適性狀態。</p>
          </div>

          <div className="form-group">
            <label>產品險種類型</label>
            <select 
              className="form-control" 
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="standard">儲蓄或年金險 (LionHarvest, Prime, Promise Pro, Emerald & Pearl 等)</option>
              <option value="patron">Lion Patron (專屬 2.3x 係數)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button 
              className={`btn ${calcMode === 'from_need' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCalcMode('from_need')}
              style={{ flex: 1 }}
            >
              依需求計算保額
            </button>
            <button 
              className={`btn ${calcMode === 'from_sa' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCalcMode('from_sa')}
              style={{ flex: 1 }}
            >
              依保額計算需求
            </button>
          </div>

          {calcMode === 'from_need' ? (
            <div className="form-group">
              <label>客戶在 FNA 中表示的人壽 / 危疾保障需求 (HKD)</label>
              <input 
                type="number" 
                className="form-control"
                value={clientNeed}
                onChange={(e) => setClientNeed(Number(e.target.value))}
                step="500000"
              />
              <div className="range-display">
                <div className="range-bound">
                  <span className="range-bound-label">適用保額下限 (Min SA)</span>
                  <span className="range-bound-value">HK$ {saRange.min.toLocaleString()}</span>
                </div>
                <div className="range-bound">
                  <span className="range-bound-label">適用保額上限 (Max SA)</span>
                  <span className="range-bound-value">HK$ {saRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>投保計劃的申請保額 (Sum Assured) (HKD)</label>
              <input 
                type="number" 
                className="form-control"
                value={sumAssured}
                onChange={(e) => setSumAssured(Number(e.target.value))}
                step="500000"
              />
              <div className="range-display">
                <div className="range-bound">
                  <span className="range-bound-label">FNA 需求填寫下限</span>
                  <span className="range-bound-value">HK$ {needRange.min.toLocaleString()}</span>
                </div>
                <div className="range-bound">
                  <span className="range-bound-label">FNA 需求填寫上限</span>
                  <span className="range-bound-value">HK$ {needRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Test Suitability Form */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '12px', fontWeight: 700 }}>
              合適性檢測 (Suitability Verification Sandbox)
            </h4>
            
            <div className="grid-2col" style={{ gap: '12px' }}>
              <div className="form-group">
                <label>擬申請保額 (SA) (HKD)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={appliedSA}
                  onChange={(e) => setAppliedSA(Number(e.target.value))}
                  step="500000"
                />
              </div>
              <div className="form-group">
                <label>FNA 問卷表示需求 (HKD)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={statedNeed}
                  onChange={(e) => setStatedNeed(Number(e.target.value))}
                  step="500000"
                />
              </div>
            </div>

            <div className={`verdict-card ${suitabilityStatus.isValid ? 'pass' : 'fail'}`}>
              <div className="verdict-title">
                {suitabilityStatus.isValid ? '✓ 合適性 PASS' : '✗ 合適性 FAIL'}
              </div>
              <div className="verdict-subtitle">{suitabilityStatus.message}</div>
            </div>
          </div>
        </div>

        {/* Right Card: Interactive Quiz Module */}
        <div className="glass-panel module-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="module-header">
            <h2>合適性計算考核問答 (Training Quiz)</h2>
            <p>測試您對 50% - 120% 保障區間及 Lion Patron 特殊規則的掌握度。</p>
          </div>

          {!quizFinished ? (
            <div className="protection-quiz-box" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>問題 {quizIndex + 1} / {quizQuestions.length}</span>
                <span>目前得分: {quizScore}</span>
              </div>
              
              <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.5 }}>
                {quizQuestions[quizIndex].question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {quizQuestions[quizIndex].options.map((option, idx) => {
                  let btnStyle = 'btn-secondary';
                  if (selectedAnswer !== null) {
                    if (idx === quizQuestions[quizIndex].correctIndex) {
                      btnStyle = 'btn-primary'; // Greenish glow
                    } else if (idx === selectedAnswer) {
                      btnStyle = 'btn-danger'; // Red error
                    }
                  }
                  
                  return (
                    <button 
                      key={idx}
                      className={`btn ${btnStyle}`}
                      onClick={() => selectedAnswer === null && handleQuizAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '12px 16px', fontSize: '13.5px' }}
                    >
                      {idx === quizQuestions[quizIndex].correctIndex && selectedAnswer !== null ? '✓ ' : ''}
                      {idx === selectedAnswer && selectedAnswer !== quizQuestions[quizIndex].correctIndex ? '✗ ' : ''}
                      {option}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--accent-indigo)', marginBottom: '6px' }}>
                    答案解析 (Explanation):
                  </span>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    {quizQuestions[quizIndex].explanation}
                  </p>
                  
                  <button 
                    className="btn btn-primary" 
                    onClick={handleNextQuiz} 
                    style={{ marginTop: '16px', width: '100%' }}
                  >
                    {quizIndex === quizQuestions.length - 1 ? '完成測驗' : '下一題'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="verdict-card pass" style={{ flex: 1, padding: '40px 20px', gap: '16px' }}>
              <div style={{ fontSize: '32px' }}>🏆</div>
              <div className="verdict-title">測驗完成！</div>
              <div className="verdict-subtitle">
                您的得分為 {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </div>
              <button className="btn btn-primary" onClick={handleResetQuiz} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <RefreshCw size={14} />
                再做一次
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="glass-panel module-card" style={{ padding: '20px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '15px', marginBottom: '10px' }}>
          <HelpCircle size={16} style={{ color: 'var(--accent-indigo)' }} />
          合規法規摘要 (Rules for Life/CI Suitability Assessment)
        </h4>
        <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <strong>50% - 120% 匹配規則</strong>：標準保障產品（如儲蓄及年金險）附屬的人壽/危疾保額額度，對客戶在 FNA 表示的該項需求額度必須保持在 50% 到 120% 之間，這能避免「過度保險 (Over-insurance)」或「保障不足 (Under-insurance)」的情況。
          </li>
          <li>
            <strong>Lion Patron 特殊規定</strong>：針對高端險種 Lion Patron，系統在檢核客戶回答時會自動將保額乘以 2.3 作為基數進行 50% - 120% 的檢核，此項規則為 underwriting 系統之硬性合規檢核。
          </li>
        </ul>
      </div>
    </div>
  );
}
