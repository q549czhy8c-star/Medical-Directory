import React, { useState, useEffect } from 'react';
import { dbService } from './services/dbService';
import StatBanner from './components/StatBanner';
import SidebarFilters from './components/SidebarFilters';
import DiagnosisCard from './components/DiagnosisCard';
import DetailModal from './components/DetailModal';
import { Sparkles, Shield, Cpu, RefreshCw, AlertCircle, FileText, CheckCircle } from 'lucide-react';

export default function App() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [selectedGender, setSelectedGender] = useState('全部');

  // Modal State
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  // Notification State
  const [notification, setNotification] = useState(null);

  // Load Initial Data
  useEffect(() => {
    const data = dbService.getDiagnoses();
    setDiagnoses(data);
  }, []);

  // Filter logic coordination
  useEffect(() => {
    let result = [...diagnoses];

    // 1. Text Search Filter (name/ch/en)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.diagnosis_name.toLowerCase().includes(q) ||
        (d.category_body_part && d.category_body_part.toLowerCase().includes(q))
      );
    }

    // 2. Category System Filter
    if (selectedCategory !== 'All') {
      result = result.filter(d => d.category_body_part === selectedCategory);
    }

    // 3. Age Group Filter (Match if diagnosis supports ANY of selected age groups, or all if none selected)
    if (selectedAgeGroups.length > 0) {
      result = result.filter(d => 
        d.age_group && d.age_group.some(age => selectedAgeGroups.includes(age))
      );
    }

    // 4. Gender Filter
    if (selectedGender !== '全部') {
      result = result.filter(d => 
        d.gender === '通用' || d.gender === selectedGender
      );
    }

    setFilteredDiagnoses(result);
  }, [diagnoses, searchQuery, selectedCategory, selectedAgeGroups, selectedGender]);

  // Toast Notification Trigger
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 1. Manual Form Save
  const handleSaveDiagnosis = (id, updatedFields) => {
    try {
      const updated = dbService.updateDiagnosis({ id, ...updatedFields });
      
      // Update local state
      setDiagnoses(prev => prev.map(d => d.id === id ? updated : d));
      
      // Update modal display
      if (selectedDiagnosis && selectedDiagnosis.id === id) {
        setSelectedDiagnosis(updated);
      }
      
      triggerNotification(`成功儲存「${updated.diagnosis_name.split(' ')[0]}」的核保規則條件！`);
    } catch (error) {
      triggerNotification(error.message, 'error');
    }
  };

  // 2. AI Suggestions Acceptance
  const handleAcceptAISuggestion = (id) => {
    try {
      const updated = dbService.acceptAISuggestion(id);
      
      setDiagnoses(prev => prev.map(d => d.id === id ? updated : d));
      
      if (selectedDiagnosis && selectedDiagnosis.id === id) {
        setSelectedDiagnosis(updated);
      }
      
      triggerNotification(`已核准並併入「${updated.diagnosis_name.split(' ')[0]}」的 AI 核保更新建議！`);
    } catch (error) {
      triggerNotification(error.message, 'error');
    }
  };

  // 3. Simulated AI Background Updater Event
  const handleSimulateAIUpdate = () => {
    try {
      const updated = dbService.simulateAIUpdate();
      
      if (updated) {
        setDiagnoses(dbService.getDiagnoses());
        
        // Sync active modal if it matches
        if (selectedDiagnosis && selectedDiagnosis.id === updated.id) {
          setSelectedDiagnosis(updated);
        }
        
        triggerNotification(
          `AI Agent 自動化檢索完成！已為「${updated.diagnosis_name.split(' ')[0]}」提出最新臨床核保優化建議！`, 
          'info'
        );
      } else {
        triggerNotification('所有疾病已具備待審查的 AI 建議，請審查或更新完畢後再行模擬！', 'info');
      }
    } catch (error) {
      triggerNotification('模擬失敗：' + error.message, 'error');
    }
  };

  // 4. Reset entire DB to default seed data
  const handleResetDatabase = () => {
    if (window.confirm('您確定要將核保資料庫重置回最初始的 8 個種子病例資料嗎？手動編輯的數據將會丟失。')) {
      const defaults = dbService.resetDatabase();
      setDiagnoses(defaults);
      setSelectedDiagnosis(null);
      triggerNotification('核保資料庫已成功重置為出廠設定！');
    }
  };

  // Reset filter values
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedAgeGroups([]);
    setSelectedGender('全部');
    triggerNotification('篩選器已重置！', 'info');
  };

  // Get distinct categories and counts for Sidebar
  const getCategoriesMeta = () => {
    const counts = {};
    diagnoses.forEach(d => {
      counts[d.category_body_part] = (counts[d.category_body_part] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    }));
  };

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {notification && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            padding: '16px 24px',
            borderRadius: '12px',
            borderLeft: `4px solid ${
              notification.type === 'error' ? 'var(--accent-rose)' :
              notification.type === 'info' ? 'var(--accent-blue)' : 'var(--accent-emerald)'
            }`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-tertiary)',
            boxShadow: 'var(--shadow-premium), 0 0 20px rgba(0,0,0,0.5)',
            maxWidth: '450px',
            animation: 'fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {notification.type === 'error' ? (
            <AlertCircle size={20} style={{ color: 'var(--accent-rose)' }} />
          ) : notification.type === 'info' ? (
            <Cpu size={20} style={{ color: 'var(--accent-blue)' }} />
          ) : (
            <CheckCircle size={20} style={{ color: 'var(--accent-emerald)' }} />
          )}
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {notification.message}
          </span>
        </div>
      )}

      {/* Main Navbar Header */}
      <header className="app-header">
        <div className="logo-section">
          <h1>
            <Shield size={28} style={{ color: 'var(--accent-indigo)' }} />
            互動式保險醫療核保指南
          </h1>
          <p>Interactive Medical Underwriting Directory & Decision Support</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-accent" onClick={handleSimulateAIUpdate}>
            <Sparkles size={16} />
            模擬 AI Agent 背景更新
          </button>
          <button className="btn btn-secondary" onClick={handleResetDatabase}>
            <RefreshCw size={14} />
            重置 DB
          </button>
        </div>
      </header>

      {/* Metrics Statistics banner */}
      <StatBanner diagnoses={diagnoses} />

      {/* Interactive Desktop layout */}
      <div className="dashboard-layout">
        
        {/* Sidebar Filters */}
        <SidebarFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedAgeGroups={selectedAgeGroups}
          setSelectedAgeGroups={setSelectedAgeGroups}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          categories={getCategoriesMeta()}
          onResetFilters={handleResetFilters}
        />

        {/* Content Disease Grid Grid */}
        <main className="content-area">
          <div className="grid-header">
            <span className="title">
              <FileText size={16} style={{ color: 'var(--accent-indigo)' }} />
              核保決策字卡 ({filteredDiagnoses.length} 筆疾病相符)
            </span>
            {filteredDiagnoses.length !== diagnoses.length && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                正在篩選中（總共收錄 {diagnoses.length} 個病例）
              </span>
            )}
          </div>

          {filteredDiagnoses.length > 0 ? (
            <div className="cards-grid">
              {filteredDiagnoses.map((diagnosis) => (
                <DiagnosisCard
                  key={diagnosis.id}
                  diagnosis={diagnosis}
                  onClick={() => setSelectedDiagnosis(diagnosis)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <div className="empty-icon">
                <AlertCircle size={32} />
              </div>
              <h3 className="empty-title">找不到相符的核保案例</h3>
              <p className="empty-desc">
                嘗試修改搜尋關鍵字，或在左側的系統、對象年齡及適用性別篩選器中放寬條件。
              </p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                還原所有篩選器
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Diagnosis Detail & Edit Modal */}
      {selectedDiagnosis && (
        <DetailModal
          diagnosis={selectedDiagnosis}
          onClose={() => setSelectedDiagnosis(null)}
          onSave={handleSaveDiagnosis}
          onAcceptAI={handleAcceptAISuggestion}
        />
      )}

      {/* Global Application Footer */}
      <footer className="app-footer">
        <p>© 2026 保險科技核保部 (InsurTech Underwriting Division) & AI Agent Team. All Rights Reserved.</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          聲明：本系統提供之所有醫療成因、風險評估與核保加費參考僅供原型展示 (Prototype Demonstrations)，非屬臨床診療或正式保單核准合約依據。
        </p>
      </footer>
    </div>
  );
}
