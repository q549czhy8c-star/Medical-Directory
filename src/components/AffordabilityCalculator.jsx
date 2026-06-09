import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldCheck, AlertCircle, RefreshCw, Layers, DollarSign, Users } from 'lucide-react';

export default function AffordabilityCalculator() {
  // Client Financials Profile
  const [currentAge, setCurrentAge] = useState(18);
  const [retirementAge, setRetirementAge] = useState(70);
  const [monthlyIncome, setMonthlyIncome] = useState(8333);
  const [willingIncomePercent, setWillingIncomePercent] = useState(50); // Default 50% for combine preset
  const [netAssets, setNetAssets] = useState(1228571);
  const [willingAssetsPercent, setWillingAssetsPercent] = useState(70); // Default 70% for combine preset

  // Calculation approach
  const [approach, setApproach] = useState('combine'); // 'income', 'assets', 'combine'
  const [activePreset, setActivePreset] = useState('scenario1');

  // Policies List
  const [policies, setPolicies] = useState([
    { id: '1', name: 'AXA', status: 'Existing', annualPremium: 10000, term: 30, type: 'Regular', currency: 'HKD' },
    { id: '2', name: 'SunLife', status: 'Existing', annualPremium: 20000, term: 20, type: 'Regular', currency: 'HKD' },
    { id: '3', name: 'AIA', status: 'Existing', annualPremium: 60000, term: 10, type: 'Regular', currency: 'HKD' },
    { id: '4', name: 'Generali', status: 'Applying', annualPremium: 50000, term: 5, type: 'Regular', currency: 'HKD' },
    { id: '5', name: 'Manulife', status: 'Existing', annualPremium: 100000, term: 2, type: 'Regular', currency: 'HKD' },
  ]);

  // Premium Financing parameters
  const [isPF, setIsPF] = useState(false);
  const [pfLoanAmount, setPfLoanAmount] = useState(1440000);
  const [pfInterestRate, setPfInterestRate] = useState(3.0);
  const [pfLoanTenure, setPfLoanTenure] = useState(10);
  const [pfMonthlyRepay, setPfMonthlyRepay] = useState(14500);

  // New policy state (temp form)
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyStatus, setNewPolicyStatus] = useState('Applying');
  const [newPolicyPremium, setNewPolicyPremium] = useState(20000);
  const [newPolicyTerm, setNewPolicyTerm] = useState(10);
  const [newPolicyType, setNewPolicyType] = useState('Regular');
  const [newPolicyCurrency, setNewPolicyCurrency] = useState('HKD');

  // Calculation outputs
  const [outputs, setOutputs] = useState({
    waterfallRows: [],
    effectiveSalary: 0,
    effectiveAssets: 0,
    totalAssetRequired: 0,
    difference: 0,
    isPassed: false,
    projectedInterest: 0,
    testBPassed: false,
    testBDifference: 0,
  });

  // Load Preset Scenarios
  const loadPreset = (presetId) => {
    setActivePreset(presetId);
    
    if (presetId === 'scenario1') {
      // Scenario 1: Age 18 Combine Approach PASS
      setCurrentAge(18);
      setRetirementAge(70);
      setMonthlyIncome(8333);
      setWillingIncomePercent(50);
      setNetAssets(1228571);
      setWillingAssetsPercent(70);
      setApproach('combine');
      setIsPF(false);
      setPolicies([
        { id: '1', name: 'AXA', status: 'Existing', annualPremium: 10000, term: 30, type: 'Regular', currency: 'HKD' },
        { id: '2', name: 'SunLife', status: 'Existing', annualPremium: 20000, term: 20, type: 'Regular', currency: 'HKD' },
        { id: '3', name: 'AIA', status: 'Existing', annualPremium: 60000, term: 10, type: 'Regular', currency: 'HKD' },
        { id: '4', name: 'Generali', status: 'Applying', annualPremium: 50000, term: 5, type: 'Regular', currency: 'HKD' },
        { id: '5', name: 'Manulife', status: 'Existing', annualPremium: 100000, term: 2, type: 'Regular', currency: 'HKD' },
      ]);
    } else if (presetId === 'scenario2') {
      // Scenario 2: Age 51 Combine Approach FAIL
      setCurrentAge(51);
      setRetirementAge(70);
      setMonthlyIncome(8333);
      setWillingIncomePercent(50);
      setNetAssets(1228571);
      setWillingAssetsPercent(70);
      setApproach('combine');
      setIsPF(false);
      setPolicies([
        { id: '1', name: 'AXA', status: 'Existing', annualPremium: 10000, term: 30, type: 'Regular', currency: 'HKD' },
        { id: '2', name: 'SunLife', status: 'Existing', annualPremium: 20000, term: 20, type: 'Regular', currency: 'HKD' },
        { id: '3', name: 'AIA', status: 'Existing', annualPremium: 60000, term: 10, type: 'Regular', currency: 'HKD' },
        { id: '4', name: 'Generali', status: 'Applying', annualPremium: 50000, term: 5, type: 'Regular', currency: 'HKD' },
        { id: '5', name: 'Manulife', status: 'Existing', annualPremium: 100000, term: 2, type: 'Regular', currency: 'HKD' },
      ]);
    } else if (presetId === 'scenario3') {
      // Scenario 3: PF PASS (Slide 23)
      setCurrentAge(18);
      setRetirementAge(70);
      setMonthlyIncome(200000);
      setWillingIncomePercent(50);
      setNetAssets(3000000);
      setWillingAssetsPercent(70);
      setApproach('combine');
      setIsPF(true);
      setPfLoanAmount(1440000);
      setPfInterestRate(3.0);
      setPfLoanTenure(10);
      setPfMonthlyRepay(14500);
      setPolicies([
        { id: '1', name: 'AXA', status: 'Existing', annualPremium: 10000, term: 30, type: 'Regular', currency: 'HKD' },
        { id: '2', name: 'SunLife', status: 'Existing', annualPremium: 20000, term: 20, type: 'Regular', currency: 'HKD' },
        { id: '3', name: 'AIA', status: 'Existing', annualPremium: 60000, term: 10, type: 'Regular', currency: 'HKD' },
        { id: '4', name: 'Generali Inforce', status: 'Existing', annualPremium: 50000, term: 5, type: 'Regular', currency: 'HKD' },
        { id: '5', name: 'Manulife', status: 'Existing', annualPremium: 100000, term: 2, type: 'Regular', currency: 'HKD' },
        { id: '6', name: 'Generali New Policy', status: 'Applying', annualPremium: 1800000, term: 1, type: 'Single', currency: 'HKD' },
      ]);
    } else if (presetId === 'scenario4') {
      // Scenario 4: PF FAIL (Slide 24)
      setCurrentAge(18);
      setRetirementAge(70);
      setMonthlyIncome(200000);
      setWillingIncomePercent(50);
      setNetAssets(2780000); // Gives 1,946,000 effective net assets
      setWillingAssetsPercent(70);
      setApproach('combine');
      setIsPF(true);
      setPfLoanAmount(1930000);
      setPfInterestRate(4.5803); // Gives exactly 884,000 interest over 10 years
      setPfLoanTenure(10);
      setPfMonthlyRepay(20000);
      setPolicies([
        { id: '1', name: 'AXA', status: 'Existing', annualPremium: 10000, term: 30, type: 'Regular', currency: 'HKD' },
        { id: '2', name: 'SunLife', status: 'Existing', annualPremium: 20000, term: 20, type: 'Regular', currency: 'HKD' },
        { id: '3', name: 'AIA', status: 'Existing', annualPremium: 60000, term: 10, type: 'Regular', currency: 'HKD' },
        { id: '4', name: 'Generali Inforce', status: 'Existing', annualPremium: 50000, term: 5, type: 'Regular', currency: 'HKD' },
        { id: '5', name: 'Manulife', status: 'Existing', annualPremium: 100000, term: 2, type: 'Regular', currency: 'HKD' },
        { id: '6', name: 'Generali New Policy', status: 'Applying', annualPremium: 1930000, term: 1, type: 'Single', currency: 'HKD' },
      ]);
    }
  };

  // Policy CRUD
  const addPolicy = () => {
    if (!newPolicyName.trim()) return;
    const p = {
      id: Date.now().toString(),
      name: newPolicyName,
      status: newPolicyStatus,
      annualPremium: Number(newPolicyPremium),
      term: Number(newPolicyTerm),
      type: newPolicyType,
      currency: newPolicyCurrency
    };
    setPolicies(prev => [...prev, p]);
    setNewPolicyName('');
    setActivePreset('custom');
  };

  const removePolicy = (id) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
    setActivePreset('custom');
  };

  // Perform Calculations
  useEffect(() => {
    // 1. Convert all premiums to HKD (USD at 7.8 rate)
    const processedPolicies = policies.map(p => {
      const rate = p.currency === 'USD' ? 7.8 : 1.0;
      return {
        ...p,
        annualPremiumHkd: p.annualPremium * rate
      };
    });

    // 2. Sort policies: Term descending (longest term first)
    processedPolicies.sort((a, b) => b.term - a.term);

    // Financial Profile Calculations
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const effectiveSalary = monthlyIncome * 12 * (willingIncomePercent / 100);
    const effectiveAssets = netAssets * (willingAssetsPercent / 100);

    let remainingSalary = effectiveSalary;
    let totalAssetRequired = 0;
    
    // Waterfall processing
    const waterfallRows = processedPolicies.map(p => {
      // Determine pre and post-retirement terms
      let postRetirementTerm = 0;
      let preRetirementTerm = p.term;

      if (p.term > yearsToRetire) {
        postRetirementTerm = p.term - yearsToRetire;
        preRetirementTerm = yearsToRetire;
      }

      // If it is a Single-Pay policy, or if we are in Assets Approach Only
      const forceAssetOnly = p.type === 'Single' || approach === 'assets';
      
      let coveredBySalary = 0;
      let incomeShortfall = p.annualPremiumHkd;

      if (!forceAssetOnly && approach !== 'assets') {
        coveredBySalary = Math.min(p.annualPremiumHkd, remainingSalary);
        remainingSalary = Math.max(0, remainingSalary - coveredBySalary);
        incomeShortfall = p.annualPremiumHkd - coveredBySalary;
      }

      // Calculate asset required
      let assetsRequired = 0;
      if (approach === 'assets' || p.type === 'Single') {
        // Assets Only covers the entire premium over the term
        assetsRequired = p.annualPremiumHkd * p.term;
      } else if (approach === 'income') {
        // Income Only doesn't utilize assets (only highlights shortfall)
        assetsRequired = 0;
      } else {
        // Combine Approach: pre-retirement shortfall + 100% of post-retirement premiums
        const preRetirementAssetPart = incomeShortfall * preRetirementTerm;
        const postRetirementAssetPart = p.annualPremiumHkd * postRetirementTerm;
        assetsRequired = preRetirementAssetPart + postRetirementAssetPart;
      }

      totalAssetRequired += assetsRequired;

      return {
        ...p,
        preRetirementTerm,
        postRetirementTerm,
        incomeShortfall,
        assetsRequired
      };
    });

    // Calculate final results
    let isPassed = false;
    let difference = 0;

    if (approach === 'income') {
      // Income check: total annual regular premium <= effective annual salary
      const totalRegularPremium = processedPolicies
        .filter(p => p.type !== 'Single')
        .reduce((sum, p) => sum + p.annualPremiumHkd, 0);
      difference = effectiveSalary - totalRegularPremium;
      isPassed = difference >= 0;
    } else {
      // Assets or Combine check: effective assets >= total asset required
      difference = effectiveAssets - totalAssetRequired;
      isPassed = difference >= 0;
    }

    // Test B (Over-leveraging) Check for PF
    const projectedInterest = pfLoanAmount * (pfInterestRate / 100) * pfLoanTenure;
    
    // Test B LHS = Net Liquid Assets (raw, Q2c) - Total premium covered by Net Asset Approach
    // Note: The total premium covered by net asset approach is the single premium (e.g. 1.8M or 1.93M)
    const singlePremiumsTotal = processedPolicies
      .filter(p => p.type === 'Single')
      .reduce((sum, p) => sum + p.annualPremiumHkd, 0);

    const testBLhs = netAssets - singlePremiumsTotal;
    const testBDifference = testBLhs - projectedInterest;
    const testBPassed = testBDifference >= 0;

    setOutputs({
      waterfallRows,
      effectiveSalary,
      effectiveAssets,
      totalAssetRequired,
      difference,
      isPassed,
      projectedInterest,
      testBPassed,
      testBDifference
    });

  }, [currentAge, retirementAge, monthlyIncome, willingIncomePercent, netAssets, willingAssetsPercent, approach, policies, isPF, pfLoanAmount, pfInterestRate, pfLoanTenure]);

  return (
    <div className="main-content">
      {/* Preset Case Study Selector */}
      <div className="presets-container">
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', width: '100%', marginBottom: '8px' }}>
          載入投影片案例學習 (Load PPT Course Scenarios):
        </span>
        <button 
          className={`preset-btn ${activePreset === 'scenario1' ? 'active' : ''}`}
          onClick={() => loadPreset('scenario1')}
        >
          1. 綜合計算通過 (年齡 18 歲) ➔ PASS
        </button>
        <button 
          className={`preset-btn ${activePreset === 'scenario2' ? 'active' : ''}`}
          onClick={() => loadPreset('scenario2')}
        >
          2. 綜合計算未通過 (年齡 51 歲) ➔ FAIL
        </button>
        <button 
          className={`preset-btn ${activePreset === 'scenario3' ? 'active' : ''}`}
          onClick={() => loadPreset('scenario3')}
        >
          3. 保費融資通過 (Slide 23) ➔ PASS
        </button>
        <button 
          className={`preset-btn ${activePreset === 'scenario4' ? 'active' : ''}`}
          onClick={() => loadPreset('scenario4')}
        >
          4. 保費融資未通過 (Slide 24) ➔ FAIL
        </button>
      </div>

      <div className="grid-2col">
        {/* Client Financial Profile Form */}
        <div className="glass-panel module-card">
          <div className="module-header">
            <h2>客戶財務狀況與參數 (Financial Profile)</h2>
            <p>設定客戶的年齡、退休規劃及可支配資產/收入參數。</p>
          </div>

          <div className="grid-2col" style={{ gap: '12px' }}>
            <div className="form-group">
              <label>客戶現有年齡 (Current Age)</label>
              <input 
                type="number" 
                className="form-control"
                value={currentAge}
                onChange={(e) => { setCurrentAge(Number(e.target.value)); setActivePreset('custom'); }}
              />
            </div>
            
            <div className="form-group">
              <label>預期退休年齡 (Retirement Age)</label>
              <input 
                type="number" 
                className="form-control"
                value={retirementAge}
                onChange={(e) => { setRetirementAge(Number(e.target.value)); setActivePreset('custom'); }}
              />
            </div>
          </div>

          <div className="grid-2col" style={{ gap: '12px' }}>
            <div className="form-group">
              <label>每月可支配收入 (Income) (HKD)</label>
              <input 
                type="number" 
                className="form-control"
                value={monthlyIncome}
                onChange={(e) => { setMonthlyIncome(Number(e.target.value)); setActivePreset('custom'); }}
              />
            </div>
            
            <div className="form-group">
              <label>收入分配佔比 (Willing to Pay %)</label>
              <select 
                className="form-control"
                value={willingIncomePercent}
                onChange={(e) => { setWillingIncomePercent(Number(e.target.value)); setActivePreset('custom'); }}
              >
                <option value={10}>&lt; 10% (計 10%)</option>
                <option value={20}>10% - 20% (計 20%)</option>
                <option value={30}>21% - 30% (計 30%)</option>
                <option value={40}>31% - 40% (計 40%)</option>
                <option value={50}>41% - 50% (計 50%)</option>
                <option value={60}>&gt; 50% (計 60%)</option>
              </select>
            </div>
          </div>

          <div className="grid-2col" style={{ gap: '12px' }}>
            <div className="form-group">
              <label>淨流動資產 (Net Assets) (HKD)</label>
              <input 
                type="number" 
                className="form-control"
                value={netAssets}
                onChange={(e) => { setNetAssets(Number(e.target.value)); setActivePreset('custom'); }}
              />
            </div>
            
            <div className="form-group">
              <label>資產使用意願佔比 (Willing to Use %)</label>
              <select 
                className="form-control"
                value={willingAssetsPercent}
                onChange={(e) => { setWillingAssetsPercent(Number(e.target.value)); setActivePreset('custom'); }}
              >
                <option value={10}>&lt; 10% (計 10%)</option>
                <option value={20}>10% - 20% (計 20%)</option>
                <option value={30}>21% - 30% (計 30%)</option>
                <option value={40}>31% - 40% (計 40%)</option>
                <option value={50}>41% - 50% (計 50%)</option>
                <option value={70}>&gt; 50% (計 70%)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>負擔能力評估方法 (Calculation Approach)</label>
            <select 
              className="form-control"
              value={approach}
              onChange={(e) => { setApproach(e.target.value); setActivePreset('custom'); }}
            >
              <option value="combine">綜合計算方法 (Combine Approach - 推薦)</option>
              <option value="income">僅計算收入方法 (Income Approach Only)</option>
              <option value="assets">僅計算資產方法 (Assets Approach Only)</option>
            </select>
          </div>

          {/* Premium Financing Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <input 
              type="checkbox" 
              id="isPF_chk"
              checked={isPF}
              onChange={(e) => { setIsPF(e.target.checked); setActivePreset('custom'); }}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="isPF_chk" style={{ fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}>
              此投保件使用保費融資 (Premium Financing Arranged)
            </label>
          </div>
        </div>

        {/* Premium Financing Inputs Form */}
        {isPF && (
          <div className="glass-panel module-card">
            <div className="module-header">
              <h2>保費融資貸款設定 (Premium Financing Options)</h2>
              <p>設定融資貸款額度、利率及還款期限，以進行 Test (B) 超額借貸檢測。</p>
            </div>

            <div className="grid-2col" style={{ gap: '12px' }}>
              <div className="form-group">
                <label>融資貸款額 (Loan Amount) (HKD)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={pfLoanAmount}
                  onChange={(e) => { setPfLoanAmount(Number(e.target.value)); setActivePreset('custom'); }}
                />
              </div>
              <div className="form-group">
                <label>貸款利率 % (Loan Interest Rate %)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={pfInterestRate}
                  onChange={(e) => { setPfInterestRate(Number(e.target.value)); setActivePreset('custom'); }}
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid-2col" style={{ gap: '12px' }}>
              <div className="form-group">
                <label>貸款年期 (Loan Tenure Years)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={pfLoanTenure}
                  onChange={(e) => { setPfLoanTenure(Number(e.target.value)); setActivePreset('custom'); }}
                />
              </div>
              <div className="form-group">
                <label>每期還款額 (Monthly Repayment) (HKD)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={pfMonthlyRepay}
                  onChange={(e) => { setPfMonthlyRepay(Number(e.target.value)); setActivePreset('custom'); }}
                />
              </div>
            </div>

            <div style={{ marginTop: '16px', background: 'rgba(99,102,241,0.05)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-indigo)' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '13.5px', fontWeight: 700, marginBottom: '6px' }}>
                Test B 超額借貸檢算公式:
              </h4>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', lineHeight: 1.5 }}>
                淨流動資產 (HK${netAssets.toLocaleString()}) - 躉繳總保費 (HK${(policies.filter(p=>p.type==='Single').reduce((s,p)=>s+p.annualPremium,0)).toLocaleString()})
                <br />
                = 可支配資產剩餘: <strong>HK$ {(netAssets - policies.filter(p=>p.type==='Single').reduce((s,p)=>s+p.annualPremium,0)).toLocaleString()}</strong>
                <br />
                預計融資總利息 = 貸款額 x 利率 x 年期 = <strong>HK$ {Math.round(pfLoanAmount * (pfInterestRate/100) * pfLoanTenure).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Policy Manager Table */}
      <div className="glass-panel module-card">
        <div className="module-header">
          <h2>擬投保及現有保單明細 (Policy Manager List)</h2>
          <p>添加或移除擬向保險公司投保的新保單（Applying）或已生效的現有保單（Existing）。</p>
        </div>

        {/* Policy List Table */}
        <div className="policy-table-container">
          <table className="policy-table">
            <thead>
              <tr>
                <th>序號</th>
                <th>保險公司/險種名稱</th>
                <th>狀態</th>
                <th>繳費類型</th>
                <th>年繳保費 (原幣)</th>
                <th>幣別</th>
                <th>繳費年期 (年)</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p, idx) => (
                <tr key={p.id}>
                  <td>0{idx + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>
                    <span className={`badge ${p.status === 'Applying' ? 'badge-blue' : 'badge-purple'}`}>
                      {p.status === 'Applying' ? '擬投保 (New)' : '現有保單 (Inforce)'}
                    </span>
                  </td>
                  <td>{p.type === 'Single' ? '躉繳 (Single)' : '期繳 (Regular)'}</td>
                  <td className="text-amount">HK$ {p.annualPremium.toLocaleString()}</td>
                  <td>{p.currency}</td>
                  <td>{p.term} 年</td>
                  <td>
                    <button className="btn btn-danger btn-xs" onClick={() => removePolicy(p.id)} style={{ padding: '4px 8px' }}>
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Policy Inline Form */}
        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
            添加保單 (Add Policy)
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="名稱 (e.g. Generali)"
              className="form-control"
              value={newPolicyName}
              onChange={(e) => setNewPolicyName(e.target.value)}
              style={{ flex: 1, minWidth: '150px' }}
            />
            
            <select 
              className="form-control"
              value={newPolicyStatus}
              onChange={(e) => setNewPolicyStatus(e.target.value)}
              style={{ width: '130px' }}
            >
              <option value="Applying">擬投保 (New)</option>
              <option value="Existing">現有保單 (Inforce)</option>
            </select>

            <select 
              className="form-control"
              value={newPolicyType}
              onChange={(e) => setNewPolicyType(e.target.value)}
              style={{ width: '130px' }}
            >
              <option value="Regular">期繳 (Regular)</option>
              <option value="Single">躉繳 (Single)</option>
            </select>

            <input 
              type="number" 
              placeholder="年繳保費 (HKD)"
              className="form-control"
              value={newPolicyPremium}
              onChange={(e) => setNewPolicyPremium(Number(e.target.value))}
              style={{ width: '140px' }}
            />

            <input 
              type="number" 
              placeholder="年期"
              className="form-control"
              value={newPolicyTerm}
              onChange={(e) => setNewPolicyTerm(Number(e.target.value))}
              style={{ width: '90px' }}
            />

            <button className="btn btn-primary" onClick={addPolicy}>
              <Plus size={14} /> 添加
            </button>
          </div>
        </div>
      </div>

      {/* Calculations Breakdown and Verification Badges */}
      <div className="glass-panel module-card">
        <div className="module-header">
          <h2>核保能力瀑布流分解 (Combine Waterfall Allocation)</h2>
          <p>下表展示保險公司如何對保單繳費期限進行按年攤銷與分配檢查。</p>
        </div>

        {/* Allocation Detail Table */}
        <div className="policy-table-container" style={{ marginBottom: '24px' }}>
          <table className="policy-table">
            <thead>
              <tr>
                <th>保單名稱</th>
                <th>年期</th>
                <th>退休前年期</th>
                <th>退休後年期</th>
                <th>年繳保費 (HKD)</th>
                <th>收入不足額 (HKD/年)</th>
                <th>資產需支付 (HKD)</th>
              </tr>
            </thead>
            <tbody>
              {outputs.waterfallRows.map((row, idx) => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.term} 年</td>
                  <td>{row.preRetirementTerm} 年</td>
                  <td className={row.postRetirementTerm > 0 ? "text-danger" : ""}>
                    {row.postRetirementTerm} 年
                  </td>
                  <td className="text-amount">HK$ {row.annualPremiumHkd.toLocaleString()}</td>
                  <td className={row.incomeShortfall > 0 ? "text-danger text-amount" : "text-amount"}>
                    HK$ {Math.round(row.incomeShortfall).toLocaleString()}
                  </td>
                  <td className="text-amount">
                    HK$ {Math.round(row.assetsRequired).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(255,255,255,0.02)', fontWeight: 700 }}>
                <td colSpan={5}>資產負擔總需求 (Asset Required)</td>
                <td colSpan={2} className="text-amount" style={{ textAlign: 'right', fontSize: '15px' }}>
                  HK$ {Math.round(outputs.totalAssetRequired).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Test Result Cards */}
        <div className="grid-2col">
          {/* Card 1: Test A (Affordability checking) */}
          <div className={`verdict-card ${outputs.isPassed ? 'pass' : 'fail'}`}>
            <div className="verdict-title">
              {outputs.isPassed ? '✓ PASS' : '✗ FAIL'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Test (A) 保費負擔能力檢測 (Premium Affordability Check)
            </div>
            <div className="verdict-subtitle">
              {approach === 'income' ? '收入檢核：年繳總保費不可大於可支配收入限額。' : '資產檢核：有效淨流動資產必須大於或等於資產負擔總需求。'}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', fontSize: '12.5px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>有效年收入上限 (Effective Salary Limit):</span>
                <span className="text-amount">HK$ {Math.round(outputs.effectiveSalary).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>有效淨流動資產 (Effective Net Assets):</span>
                <span className="text-amount">HK$ {Math.round(outputs.effectiveAssets).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '4px', marginTop: '4px' }}>
                <span>資產總需求 (Total Assets Required):</span>
                <span className="text-amount">HK$ {Math.round(outputs.totalAssetRequired).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '6px', fontWeight: 800, color: outputs.isPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                <span>差額 (Difference):</span>
                <span className="text-amount">
                  {outputs.difference >= 0 ? '+' : ''} HK$ {Math.round(outputs.difference).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Test B (Over-leveraging check for Premium Financing) */}
          {isPF ? (
            <div className={`verdict-card ${outputs.testBPassed ? 'pass' : 'fail'}`}>
              <div className="verdict-title">
                {outputs.testBPassed ? '✓ PASS' : '✗ FAIL'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>
                Test (B) 融資超額借貸檢測 (Over-leveraging Check)
              </div>
              <div className="verdict-subtitle">
                資產檢核：流動資產扣除躉繳保費後之剩餘，必須大於或等於融資利息需求。
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', fontSize: '12.5px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>扣除保費後賸餘淨資產 (Remaining Net Assets):</span>
                  <span className="text-amount">
                    HK$ {Math.round(netAssets - policies.filter(p=>p.type==='Single').reduce((s,p)=>s+p.annualPremium,0)).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>預計融資總利息 (Projected Interest):</span>
                  <span className="text-amount">HK$ {Math.round(outputs.projectedInterest).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '6px', fontWeight: 800, color: outputs.testBPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  <span>利息負擔差額 (Interest Difference):</span>
                  <span className="text-amount">
                    {outputs.testBDifference >= 0 ? '+' : ''} HK$ {Math.round(outputs.testBDifference).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="verdict-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-light)', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '24px' }}>🔒</div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '8px' }}>Test (B) 未啟用</div>
              <div className="verdict-subtitle">
                當前投保件未啟用「保費融資」選項，無須執行 Test (B) 超額借貸核保。
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
