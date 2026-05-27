import React, { useState, useEffect } from 'react';
import { dbService } from './services/dbService';
import { translations } from './services/i18nService';
import StatBanner from './components/StatBanner';
import SidebarFilters from './components/SidebarFilters';
import DiagnosisCard from './components/DiagnosisCard';
import DetailModal from './components/DetailModal';
import { Sparkles, Shield, Cpu, RefreshCw, AlertCircle, FileText, CheckCircle, Globe } from 'lucide-react';

export default function App() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [lang, setLang] = useState('zh'); // 'zh' or 'en'
  
  const t = translations[lang];

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]); // indices: 0, 1, 2, 3
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

    // 1. Text Search Filter (matches both Chinese and English fields)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        (d.diagnosis_name_zh && d.diagnosis_name_zh.toLowerCase().includes(q)) ||
        (d.diagnosis_name_en && d.diagnosis_name_en.toLowerCase().includes(q)) ||
        (d.category_body_part_zh && d.category_body_part_zh.toLowerCase().includes(q)) ||
        (d.category_body_part_en && d.category_body_part_en.toLowerCase().includes(q))
      );
    }

    // 2. Category System Filter (Matches active language categories)
    if (selectedCategory !== 'All') {
      result = result.filter(d => {
        const catValue = lang === 'zh' ? d.category_body_part_zh : d.category_body_part_en;
        return catValue === selectedCategory;
      });
    }

    // 3. Age Group Filter
    if (selectedAgeGroups.length > 0) {
      const ageLabelsZh = ['兒童', '青年', '中年', '老年'];
      const ageLabelsEn = ['Child', 'Youth', 'Middle-aged', 'Elderly'];
      
      result = result.filter(d => {
        if (lang === 'zh') {
          const activeLabels = selectedAgeGroups.map(idx => ageLabelsZh[idx]);
          return d.age_group_zh && d.age_group_zh.some(age => activeLabels.includes(age));
        } else {
          const activeLabels = selectedAgeGroups.map(idx => ageLabelsEn[idx]);
          return d.age_group_en && d.age_group_en.some(age => activeLabels.includes(age));
        }
      });
    }

    // 4. Gender Filter
    if (selectedGender !== '全部') {
      result = result.filter(d => 
        d.gender_zh === '通用' || d.gender_zh === selectedGender
      );
    }

    setFilteredDiagnoses(result);
  }, [diagnoses, searchQuery, selectedCategory, selectedAgeGroups, selectedGender, lang]);

  // Toast Notification Trigger
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Toggle app language
  const handleToggleLanguage = () => {
    const nextLang = lang === 'zh' ? 'en' : 'zh';
    setLang(nextLang);
    setSelectedCategory('All'); // Reset active category since category names changes!
    triggerNotification(nextLang === 'zh' ? '已切換為繁體中文！' : 'Language set to English!', 'info');
  };

  // 1. Manual Form Save
  const handleSaveDiagnosis = (id, updatedFields) => {
    try {
      const updated = dbService.updateDiagnosis({ id, ...updatedFields });
      
      setDiagnoses(prev => prev.map(d => d.id === id ? updated : d));
      
      if (selectedDiagnosis && selectedDiagnosis.id === id) {
        setSelectedDiagnosis(updated);
      }
      
      const diseaseName = lang === 'zh' ? updated.diagnosis_name_zh.split(' ')[0] : updated.diagnosis_name_en;
      triggerNotification(`${t.toastSaveSuccess}「${diseaseName}」!`);
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
      
      const diseaseName = lang === 'zh' ? updated.diagnosis_name_zh.split(' ')[0] : updated.diagnosis_name_en;
      triggerNotification(`${t.toastAIAcceptSuccess}「${diseaseName}」!`);
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
        
        if (selectedDiagnosis && selectedDiagnosis.id === updated.id) {
          setSelectedDiagnosis(updated);
        }
        
        const diseaseName = lang === 'zh' ? updated.diagnosis_name_zh.split(' ')[0] : updated.diagnosis_name_en;
        triggerNotification(`${t.toastAISimulateSuccess}「${diseaseName}」!`, 'info');
      } else {
        triggerNotification(t.toastAISimulateLimit, 'info');
      }
    } catch (error) {
      triggerNotification('Simulation Error: ' + error.message, 'error');
    }
  };

  // 4. Reset entire DB to default seed data
  const handleResetDatabase = () => {
    if (window.confirm(t.resetConfirm)) {
      const defaults = dbService.resetDatabase();
      setDiagnoses(defaults);
      setSelectedDiagnosis(null);
      triggerNotification(t.toastResetSuccess);
    }
  };

  // Reset filter values
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedAgeGroups([]);
    setSelectedGender('全部');
    triggerNotification(t.toastFiltersReset, 'info');
  };

  // Get distinct categories and counts for Sidebar depending on active language
  const getCategoriesMeta = () => {
    const counts = {};
    diagnoses.forEach(d => {
      const catName = lang === 'zh' ? d.category_body_part_zh : d.category_body_part_en;
      counts[catName] = (counts[catName] || 0) + 1;
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
            {t.appTitle}
          </h1>
          <p>{t.appSubTitle}</p>
        </div>
        <div className="header-actions">
          {/* Bilingual Switcher pill */}
          <button className="btn btn-secondary" onClick={handleToggleLanguage} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Globe size={14} />
            <strong>{lang === 'zh' ? 'English' : '繁體中文'}</strong>
          </button>
          
          <button className="btn btn-accent" onClick={handleSimulateAIUpdate}>
            <Sparkles size={16} />
            {t.simulateButton}
          </button>
          
          <button className="btn btn-secondary" onClick={handleResetDatabase}>
            <RefreshCw size={14} />
            {t.resetDbButton}
          </button>
        </div>
      </header>

      {/* Metrics Statistics banner */}
      <StatBanner diagnoses={diagnoses} lang={lang} />

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
          lang={lang}
        />

        {/* Content Disease Grid Grid */}
        <main className="content-area">
          <div className="grid-header">
            <span className="title">
              <FileText size={16} style={{ color: 'var(--accent-indigo)' }} />
              {t.cardsTitle} ({filteredDiagnoses.length} {lang === 'zh' ? '筆疾病相符' : 'conditions matched'})
            </span>
            {filteredDiagnoses.length !== diagnoses.length && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {t.filteringNotice} ({t.totalNotice} {filteredDiagnoses.length} {t.casesNotice} {diagnoses.length})
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
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <div className="empty-icon">
                <AlertCircle size={32} />
              </div>
              <h3 className="empty-title">{t.emptyTitle}</h3>
              <p className="empty-desc">
                {t.emptyDesc}
              </p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                {t.emptyBtn}
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
          lang={lang}
        />
      )}

      {/* Global Application Footer */}
      <footer className="app-footer">
        <p>© 2026 {t.copyright}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {t.declinedNotice}
        </p>
      </footer>
    </div>
  );
}
