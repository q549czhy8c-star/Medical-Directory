import React from 'react';
import { Search, Filter, RefreshCw, Layers, Calendar, Users } from 'lucide-react';
import { translations } from '../services/i18nService';

export default function SidebarFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedAgeGroups,
  setSelectedAgeGroups,
  selectedGender,
  setSelectedGender,
  categories = [],
  onResetFilters,
  lang = 'zh'
}) {
  const t = translations[lang];

  const handleAgeGroupChange = (groupIndex) => {
    // We map internally by index: 0=兒童/Child, 1=青年/Youth, 2=中年/Middle-aged, 3=老年/Elderly
    if (selectedAgeGroups.includes(groupIndex)) {
      setSelectedAgeGroups(selectedAgeGroups.filter(g => g !== groupIndex));
    } else {
      setSelectedAgeGroups([...selectedAgeGroups, groupIndex]);
    }
  };

  const ageGroupsList = lang === 'zh' 
    ? ['兒童', '青年', '中年', '老年']
    : ['Child', 'Youth', 'Middle-aged', 'Elderly'];

  const gendersList = lang === 'zh'
    ? [{ key: '全部', label: t.allGender }, { key: '男', label: t.maleGender }, { key: '女', label: t.femaleGender }]
    : [{ key: '全部', label: t.allGender }, { key: '男', label: t.maleGender }, { key: '女', label: t.femaleGender }];

  return (
    <aside className="sidebar glass-panel">
      {/* Search Section */}
      <div className="filter-section">
        <label className="filter-title">
          <Search size={14} />
          {t.searchLabel}
        </label>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="search-icon" size={16} />
        </div>
      </div>

      {/* Body Part System Category */}
      <div className="filter-section">
        <label className="filter-title">
          <Layers size={14} />
          {t.categoryLabel}
        </label>
        <div className="category-list">
          <button
            className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            <span>{t.allCategories}</span>
            <span className="category-count">
              {categories.reduce((acc, cat) => acc + cat.count, 0)}
            </span>
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span>{cat.name.split(' ')[0]}</span> {/* Clean split */}
              <span className="category-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age Group */}
      <div className="filter-section">
        <label className="filter-title">
          <Calendar size={14} />
          {t.ageLabel}
        </label>
        <div className="checkbox-group">
          {ageGroupsList.map((ageLabel, idx) => (
            <label key={idx} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedAgeGroups.includes(idx)}
                onChange={() => handleAgeGroupChange(idx)}
              />
              <span>{ageLabel}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender selection */}
      <div className="filter-section">
        <label className="filter-title">
          <Users size={14} />
          {t.genderLabel}
        </label>
        <div className="radio-group">
          {gendersList.map((g) => (
            <div
              key={g.key}
              className={`radio-btn ${selectedGender === g.key ? 'active' : ''}`}
              onClick={() => setSelectedGender(g.key)}
            >
              {g.label}
            </div>
          ))}
        </div>
      </div>

      {/* Reset Action */}
      <button 
        className="btn btn-secondary" 
        onClick={onResetFilters}
        style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', width: '100%' }}
      >
        <RefreshCw size={14} />
        {t.resetFilters}
      </button>
    </aside>
  );
}
