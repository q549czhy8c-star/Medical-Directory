import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, Upload, Clipboard, Plus, Trash2, Download, 
  ArrowUpDown, Filter, ChevronLeft, ChevronRight, HelpCircle, 
  Database, RefreshCw, AlertCircle, Search
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface FilterFactor {
  id: string;
  column: string;
  operator: 'contains' | 'equals' | 'gt' | 'lt' | 'empty' | 'not_empty' | 'starts' | 'ends' | 'date_range';
  value: string;
  value2?: string; // For date range
  conjunction: 'and' | 'or';
}

export const DataFilter: React.FC = () => {
  // Data States
  const [rawData, setRawData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnTypes, setColumnTypes] = useState<Record<string, 'text' | 'number' | 'date'>>({});
  const [fileName, setFileName] = useState<string>('');
  
  // Paste Area Toggle
  const [isPasteMode, setIsPasteMode] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  
  // Filtering States
  const [filters, setFilters] = useState<FilterFactor[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // UI States
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect columns and types when rawData changes
  useEffect(() => {
    if (rawData.length === 0) {
      setColumns([]);
      setColumnTypes({});
      setFilters([]);
      setFilteredData([]);
      return;
    }

    // Determine unique column keys from all rows
    const uniqueKeys = new Set<string>();
    rawData.forEach(row => {
      Object.keys(row).forEach(key => uniqueKeys.add(key));
    });
    const colList = Array.from(uniqueKeys);
    setColumns(colList);

    // Column Type Inference
    const types: Record<string, 'text' | 'number' | 'date'> = {};
    colList.forEach(col => {
      // Sample up to 30 non-empty values
      const samples: any[] = [];
      for (let i = 0; i < rawData.length && samples.length < 30; i++) {
        const val = rawData[i][col];
        if (val !== undefined && val !== null && val !== '') {
          samples.push(val);
        }
      }

      if (samples.length === 0) {
        types[col] = 'text';
        return;
      }

      // Check if numbers
      const allNumbers = samples.every(val => !isNaN(Number(val)));
      if (allNumbers) {
        types[col] = 'number';
        return;
      }

      // Check if dates
      const allDates = samples.every(val => {
        // Prevent pure short strings or numbers from passing as dates
        if (typeof val === 'number') return false;
        if (typeof val === 'string' && val.length < 5) return false;
        const d = Date.parse(val);
        return !isNaN(d);
      });
      
      if (allDates) {
        types[col] = 'date';
      } else {
        types[col] = 'text';
      }
    });

    setColumnTypes(types);
    
    // Setup initial filter rule
    if (colList.length > 0) {
      setFilters([
        {
          id: Math.random().toString(36).substr(2, 9),
          column: colList[0],
          operator: 'contains',
          value: '',
          conjunction: 'and'
        }
      ]);
    }
    
    setFilteredData(rawData);
    setCurrentPage(1);

    // Track sessions processed
    updateMetrics('filesProcessed', 1);
  }, [rawData]);

  // Execute Filter Rules and Search
  useEffect(() => {
    if (rawData.length === 0) return;

    let result = [...rawData];

    // 1. Search term filter (global search)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        });
      });
    }

    // 2. Multi-factor filter rules
    if (filters.length > 0) {
      result = result.filter(row => {
        // Evaluate each rule
        // In this implementation:
        // - First rule sets base
        // - Subsequent rules are conjoined by their specified 'conjunction' (AND / OR)
        let rowMatch = true;

        for (let i = 0; i < filters.length; i++) {
          const rule = filters[i];
          const val = row[rule.column];
          let conditionPassed = false;

          const cellStr = val !== undefined && val !== null ? String(val).toLowerCase() : '';
          const targetStr = rule.value.toLowerCase();

          switch (rule.operator) {
            case 'contains':
              conditionPassed = cellStr.includes(targetStr);
              break;
            case 'equals':
              conditionPassed = cellStr === targetStr;
              break;
            case 'gt':
              conditionPassed = !isNaN(Number(val)) && !isNaN(Number(rule.value)) 
                ? Number(val) > Number(rule.value)
                : cellStr > targetStr;
              break;
            case 'lt':
              conditionPassed = !isNaN(Number(val)) && !isNaN(Number(rule.value))
                ? Number(val) < Number(rule.value)
                : cellStr < targetStr;
              break;
            case 'empty':
              conditionPassed = val === undefined || val === null || String(val).trim() === '';
              break;
            case 'not_empty':
              conditionPassed = val !== undefined && val !== null && String(val).trim() !== '';
              break;
            case 'starts':
              conditionPassed = cellStr.startsWith(targetStr);
              break;
            case 'ends':
              conditionPassed = cellStr.endsWith(targetStr);
              break;
            case 'date_range':
              if (val) {
                const cellDate = new Date(val).getTime();
                const d1 = rule.value ? new Date(rule.value).getTime() : -Infinity;
                const d2 = rule.value2 ? new Date(rule.value2).getTime() : Infinity;
                conditionPassed = !isNaN(cellDate) && cellDate >= d1 && cellDate <= d2;
              }
              break;
          }

          if (i === 0) {
            rowMatch = conditionPassed;
          } else {
            if (rule.conjunction === 'or') {
              rowMatch = rowMatch || conditionPassed;
            } else {
              rowMatch = rowMatch && conditionPassed;
            }
          }
        }
        return rowMatch;
      });
    }

    // 3. Sorting
    if (sortCol) {
      result.sort((a, b) => {
        let valA = a[sortCol];
        let valB = b[sortCol];

        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        const type = columnTypes[sortCol];
        if (type === 'number') {
          const numA = Number(valA);
          const numB = Number(valB);
          if (!isNaN(numA) && !isNaN(numB)) {
            return sortDirection === 'asc' ? numA - numB : numB - numA;
          }
        } else if (type === 'date') {
          const dateA = new Date(valA).getTime();
          const dateB = new Date(valB).getTime();
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
          }
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [rawData, filters, searchTerm, sortCol, sortDirection]);

  // helper to update metrics in localstorage
  const updateMetrics = (field: 'filesProcessed' | 'queriesRun' | 'savedRows', amount: number) => {
    const stored = localStorage.getItem('aerosuite_stats');
    let stats = { cleanedLines: 0, filesProcessed: 0, queriesRun: 0, savedRows: 0 };
    if (stored) {
      try {
        stats = JSON.parse(stored);
      } catch (e) {}
    }
    stats[field] += amount;
    localStorage.setItem('aerosuite_stats', JSON.stringify(stats));
    window.dispatchEvent(new Event('storage'));
  };

  // Drag and Drop File Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Read Excel/CSV file with SheetJS
  const processFile = (file: File) => {
    setErrorMsg('');
    setIsProcessing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("Could not read file data.");
        
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to array of objects, keeping empty cell definitions as empty strings
        const json = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });
        
        if (json.length === 0) {
          setErrorMsg('The spreadsheet is empty.');
          setRawData([]);
        } else {
          setRawData(json);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(`Failed to parse file: ${err.message || 'Malformed structure'}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg("Error reading file from disk.");
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Paste Text Parser (Tab separated from Excel, or comma separated CSV)
  const handlePasteParse = () => {
    setErrorMsg('');
    if (!pasteContent.trim()) {
      setErrorMsg('Please paste some tab-separated rows or CSV text.');
      return;
    }

    setIsProcessing(true);
    setFileName('Pasted Clipboard Workspace');

    try {
      const lines = pasteContent.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length === 0) throw new Error("No text content detected.");

      // Detect separator: Tab is extremely common for Excel copy-paste. Comma is standard for CSV.
      const firstLine = lines[0];
      const tabs = (firstLine.match(/\t/g) || []).length;
      const commas = (firstLine.match(/,/g) || []).length;
      const sep = tabs >= commas && tabs > 0 ? '\t' : ',';

      // Parse headers
      const headers = firstLine.split(sep).map(h => h.trim().replace(/^["']|["']$/g, ''));
      
      const rows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(sep);
        const rowObj: any = {};
        
        headers.forEach((header, index) => {
          let val = cells[index] !== undefined ? cells[index].trim() : '';
          // Remove wrapping quotes
          val = val.replace(/^["']|["']$/g, '');
          rowObj[header] = val;
        });
        rows.push(rowObj);
      }

      setRawData(rows);
    } catch (err: any) {
      setErrorMsg(`Failed parsing pasted text: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Query Builder Rule Updates
  const addFilterRule = () => {
    if (columns.length === 0) return;
    setFilters([
      ...filters,
      {
        id: Math.random().toString(36).substr(2, 9),
        column: columns[0],
        operator: 'contains',
        value: '',
        conjunction: 'and'
      }
    ]);
    updateMetrics('queriesRun', 1);
  };

  const removeFilterRule = (id: string) => {
    setFilters(filters.filter(r => r.id !== id));
  };

  const updateFilterRule = (id: string, updates: Partial<FilterFactor>) => {
    setFilters(filters.map(r => r.id === id ? { ...r, ...updates } as FilterFactor : r));
  };

  // Sorting Handler
  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDirection('asc');
    }
  };

  // Reset Dataset
  const handleReset = () => {
    setRawData([]);
    setFileName('');
    setPasteContent('');
    setFilters([]);
    setSearchTerm('');
    setSortCol(null);
    setErrorMsg('');
  };

  // Exporters
  const exportToExcel = () => {
    if (filteredData.length === 0) return;
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "AeroSuite Filtered");
      XLSX.writeFile(wb, `${fileName.replace(/\.[^/.]+$/, "")}_purified.xlsx`);
      
      updateMetrics('savedRows', filteredData.length);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to construct Excel download package.");
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName.replace(/\.[^/.]+$/, "")}_purified.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      updateMetrics('savedRows', filteredData.length);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to construct CSV download package.");
    }
  };

  // Pagination bounds
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Description Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Smart Excel/CSV Data Filter</h2>
            <p className="text-slate-400 text-xs">Analyze, structure-filter, and download sheet segments with zero latency.</p>
          </div>
        </div>
        {rawData.length > 0 && (
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-lg border border-brand-pink/30 bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-brand-pink/10 border border-brand-pink/30 text-brand-pink flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* STAGE 1: Drag & Drop Uploader */}
      {rawData.length === 0 ? (
        <div className="grid md:grid-cols-5 gap-6">
          {/* File drag-and-drop zone (Left 3 columns) */}
          <div className={`${isPasteMode ? 'md:col-span-2' : 'md:col-span-5'} transition-all duration-300`}>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`h-72 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer glass-panel-interactive relative overflow-hidden ${
                dragActive 
                  ? 'border-brand-cyan bg-brand-cyan/10 shadow-lg shadow-brand-cyan/20' 
                  : 'border-white/10 hover:border-brand-cyan/40'
              }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold text-slate-300">Processing sheet components...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition duration-300 animate-float">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-1 px-6">
                    <h3 className="font-bold text-white text-base">Drag & drop your file here</h3>
                    <p className="text-slate-400 text-xs">Supports Excel (.xlsx, .xls) and CSV (.csv)</p>
                    <p className="text-slate-600 text-[10px] mt-2">Max limit 50MB. Processes locally.</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Quick Toggle Button */}
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setIsPasteMode(!isPasteMode)}
                className="text-xs font-semibold text-brand-cyan hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                {isPasteMode ? "Hide Clipboard Paste Area" : "Or Paste Clipboard Table Data"}
              </button>
            </div>
          </div>

          {/* Structured Paste Area (Right 2 columns) */}
          {isPasteMode && (
            <div className="md:col-span-3 flex flex-col space-y-2 animate-fade-in">
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Table Paste Area</span>
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder={`Paste cells copied from Excel (tab-separated) or CSV row data here...
Example:
Name\tAge\tCity
Keith\t29\tTaipei
John\t35\tNew York`}
                rows={10}
                className="w-full bg-slate-950/40 glass-panel rounded-2xl p-4 text-xs text-slate-300 font-mono placeholder-slate-600 border border-white/5 focus:border-brand-cyan/40 resize-none h-60"
              />
              <button
                onClick={handlePasteParse}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                Parse Clipboard Data
              </button>
            </div>
          )}
        </div>
      ) : (
        /* STAGE 2: Loaded Workspace & Filter Builder */
        <div className="space-y-6">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-brand-cyan font-bold font-mono">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {fileName}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
            <span>Total: <strong>{rawData.length.toLocaleString()} rows</strong></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
            <span>Columns: <strong>{columns.length} keys</strong></span>
          </div>

          {/* Logical Multi-Factor Query Builder */}
          <div className="rounded-2xl glass-panel p-5 border border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Filter className="w-4 h-4 text-brand-cyan" />
                Dynamic Query Factors
              </div>
              <button
                onClick={addFilterRule}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/20 flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Condition
              </button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs space-y-1.5">
                <HelpCircle className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <p>No query clauses active. Showing full dataset unfiltered.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filters.map((rule, idx) => (
                  <div key={rule.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 p-3.5 rounded-xl bg-slate-950/40 border border-white/5 animate-fade-in relative">
                    
                    {/* Visual AND/OR connector line/badge */}
                    {idx > 0 && (
                      <div className="md:absolute md:-top-3 md:left-6 z-10">
                        <select
                          value={rule.conjunction}
                          onChange={(e) => updateFilterRule(rule.id, { conjunction: e.target.value as 'and' | 'or' })}
                          className="bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-[10px] font-bold rounded px-1.5 py-0.5 cursor-pointer"
                        >
                          <option value="and" className="bg-slate-950 text-white">AND</option>
                          <option value="or" className="bg-slate-950 text-white">OR</option>
                        </select>
                      </div>
                    )}

                    {/* Column Select */}
                    <div className="flex-1 min-w-[140px]">
                      <select
                        value={rule.column}
                        onChange={(e) => updateFilterRule(rule.id, { column: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white cursor-pointer"
                      >
                        {columns.map(col => (
                          <option key={col} value={col} className="bg-slate-950 text-white">
                            {col} ({columnTypes[col] || 'text'})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Operator Select */}
                    <div className="flex-1 min-w-[130px]">
                      <select
                        value={rule.operator}
                        onChange={(e) => updateFilterRule(rule.id, { operator: e.target.value as any })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white cursor-pointer"
                      >
                        <option value="contains" className="bg-slate-950 text-white">Contains</option>
                        <option value="equals" className="bg-slate-950 text-white">Equals</option>
                        <option value="gt" className="bg-slate-950 text-white">Greater Than (&gt;)</option>
                        <option value="lt" className="bg-slate-950 text-white">Less Than (&lt;)</option>
                        <option value="empty" className="bg-slate-950 text-white">Is Empty</option>
                        <option value="not_empty" className="bg-slate-950 text-white">Is Not Empty</option>
                        <option value="starts" className="bg-slate-950 text-white">Starts With</option>
                        <option value="ends" className="bg-slate-950 text-white">Ends With</option>
                        {columnTypes[rule.column] === 'date' && (
                          <option value="date_range" className="bg-slate-950 text-white">Date Range</option>
                        )}
                      </select>
                    </div>

                    {/* Value Inputs based on operator */}
                    {rule.operator !== 'empty' && rule.operator !== 'not_empty' && (
                      <div className="flex-2 flex gap-2 min-w-[200px]">
                        {rule.operator === 'date_range' ? (
                          <>
                            <input
                              type="date"
                              value={rule.value}
                              onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                            <span className="text-slate-500 self-center text-xs">to</span>
                            <input
                              type="date"
                              value={rule.value2 || ''}
                              onChange={(e) => updateFilterRule(rule.id, { value2: e.target.value })}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </>
                        ) : (
                          <input
                            type={columnTypes[rule.column] === 'number' ? 'number' : 'text'}
                            value={rule.value}
                            onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
                            placeholder="Filter value..."
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        )}
                      </div>
                    )}

                    {/* Delete Rule */}
                    <button
                      onClick={() => removeFilterRule(rule.id)}
                      className="p-2 text-slate-500 hover:text-brand-pink transition rounded hover:bg-white/5 cursor-pointer"
                      title="Remove factor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Live Data Grid & Toolbars */}
          <div className="rounded-2xl glass-panel border border-white/5 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/40 border-b border-white/5">
              {/* Row Counts */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                  Data Grid
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-semibold font-mono">
                  {filteredData.length.toLocaleString()} matching rows
                </span>
              </div>

              {/* Grid Actions (Search + Exports) */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search in results..."
                    className="pl-8 pr-3 py-1.5 w-48 bg-slate-950/60 border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:border-brand-cyan"
                  />
                </div>

                {/* Export Buttons */}
                {filteredData.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={exportToExcel}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 border border-emerald-400 hover:scale-105 active:scale-95 transition text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Excel
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 border border-white/10 hover:border-brand-cyan/40 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-brand-cyan" />
                      CSV
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Live Table Scroll Area */}
            {filteredData.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <AlertCircle className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="font-bold text-white text-base">No Matching Data Rows</h3>
                <p className="text-xs">Adjust your logical query filters or check for spelling spelling/casing issues.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-white/10 text-slate-400 uppercase font-mono font-semibold tracking-wider">
                      {columns.map(col => (
                        <th 
                          key={col}
                          onClick={() => handleSort(col)}
                          className="px-4 py-3 cursor-pointer hover:text-white transition whitespace-nowrap select-none"
                        >
                          <div className="flex items-center gap-1.5">
                            {col}
                            <ArrowUpDown className={`w-3 h-3 ${sortCol === col ? 'text-brand-cyan' : 'text-slate-600'}`} />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-slate-950/10">
                    {currentRows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-800/40 text-slate-300 hover:text-white transition font-mono">
                        {columns.map(col => {
                          const val = row[col];
                          const type = columnTypes[col];
                          
                          // Format cells beautifully
                          let formattedVal = val !== undefined && val !== null ? String(val) : '';
                          if (type === 'date' && val) {
                            const dateObj = new Date(val);
                            if (!isNaN(dateObj.getTime())) {
                              formattedVal = dateObj.toLocaleDateString();
                            }
                          }

                          return (
                            <td key={col} className="px-4 py-3 max-w-[200px] truncate" title={formattedVal}>
                              {formattedVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Panel */}
            {filteredData.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-t border-white/5 text-xs text-slate-400">
                <div>
                  Showing <strong className="text-white">{indexOfFirstRow + 1}</strong> to{" "}
                  <strong className="text-white">
                    {Math.min(indexOfLastRow, filteredData.length)}
                  </strong>{" "}
                  of <strong className="text-white">{filteredData.length.toLocaleString()}</strong> records
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Rows Per Page */}
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 cursor-pointer text-white"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-slate-300">
                      {currentPage} / {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
