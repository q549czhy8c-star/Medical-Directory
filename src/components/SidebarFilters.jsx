import React from 'react';
import { Search, Filter, RefreshCw, Layers, Calendar, Users } from 'lucide-react';

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
  onResetFilters
}) {
  
  const handleAgeGroupChange = (group) => {
    if (selectedAgeGroups.includes(group)) {
      setSelectedAgeGroups(selectedAgeGroups.filter(g => g !== group));
    } else {
      setSelectedAgeGroups([...selectedAgeGroups, group]);
    }
  };

  return (
    <aside className="sidebar glass-panel">
      {/* Search Section */}
      <div className="filter-section">
        <label className="filter-title">
          <Search size={14} />
          疾病檢索 (中英文對照)
        </label>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="搜尋疾病名稱，例如：高血壓..."
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
          身體部位 / 系統
        </label>
        <div className="category-list">
          <button
            className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            <span>全部系統</span>
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
              <span>{cat.name.split(' ')[0]}</span> {/* Display Chinese part mainly */}
              <span className="category-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age Group */}
      <div className="filter-section">
        <label className="filter-title">
          <Calendar size={14} />
          適用對象年齡層
        </label>
        <div className="checkbox-group">
          {['兒童', '青年', '中年', '老年'].map((age) => (
            <label key={age} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedAgeGroups.includes(age)}
                onChange={() => handleAgeGroupChange(age)}
              />
              <span>{age}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender selection */}
      <div className="filter-section">
        <label className="filter-title">
          <Users size={14} />
          適用對象性別
        </label>
        <div className="radio-group">
          {['全部', '男', '女'].map((gender) => (
            <div
              key={gender}
              className={`radio-btn ${selectedGender === gender ? 'active' : ''}`}
              onClick={() => setSelectedGender(gender)}
            >
              {gender}
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
        重置所有篩選器
      </button>
    </aside>
  );
}
