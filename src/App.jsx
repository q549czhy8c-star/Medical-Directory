import React, { useState } from 'react';
import { Clock, Shield, Calendar, DollarSign, Layers, BookOpen, AlertCircle } from 'lucide-react';
import TimelineSolicitation from './components/TimelineSolicitation';
import SuitabilityProtectionRange from './components/SuitabilityProtectionRange';
import TargetSavingsCalculator from './components/TargetSavingsCalculator';
import PremiumPaymentTermMatch from './components/PremiumPaymentTermMatch';
import AffordabilityCalculator from './components/AffordabilityCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');

  const tabs = [
    { id: 'timeline', label: '招攬時序檢核', label_en: 'Solicitation Timeline', icon: <Clock size={16} />, component: <TimelineSolicitation /> },
    { id: 'protection', label: '保額區間合適性', label_en: 'Protection Range Match', icon: <Shield size={16} />, component: <SuitabilityProtectionRange /> },
    { id: 'savings', label: '目標儲蓄合適性', label_en: 'Target Savings Match', icon: <Calendar size={16} />, component: <TargetSavingsCalculator /> },
    { id: 'horizon', label: '繳費年期匹配', label_en: 'Payment Horizon Match', icon: <Layers size={16} />, component: <PremiumPaymentTermMatch /> },
    { id: 'affordability', label: '保費與融資計算器', label_en: 'Affordability & PF Calc', icon: <DollarSign size={16} />, component: <AffordabilityCalculator /> }
  ];

  return (
    <div className="app-container">
      {/* Top Navigation / App Banner */}
      <header className="app-header">
        <div className="logo-section">
          <h1>
            <BookOpen size={26} style={{ color: 'var(--accent-indigo)' }} />
            FNA 財務需要分析互動式培訓系統
          </h1>
          <p>FNA Interactive Training Suite 2026 — 協助保險中介人與核保師熟練掌握 GL30 合規與保費融資規則</p>
        </div>
      </header>

      {/* Dashboard Grid Layout */}
      <div className="dashboard-layout">
        
        {/* Sidebar Nav */}
        <aside className="glass-panel sidebar">
          <div>
            <div className="sidebar-title">培訓模組項目</div>
            <nav className="nav-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-item-icon">{tab.icon}</span>
                  <div>
                    <span style={{ display: 'block' }}>{tab.label}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                      {tab.label_en}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '11.5px', lineHeight: 1.4 }}>
              <AlertCircle size={14} style={{ flexShrink: 0, color: 'var(--accent-amber)' }} />
              <span>本系統僅供內部培訓演練使用，模擬規則完全對照 2026 FNA 合規與保監局指引。</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ minWidth: 0 }}>
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </main>
      </div>

      {/* Global Application Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '20px', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <p>© 2026 FNA Training Suite. All rights reserved.</p>
        <p>For Internal Use Only (僅供內部使用) | Refer to IA GL30 Guidelines</p>
      </footer>
    </div>
  );
}
