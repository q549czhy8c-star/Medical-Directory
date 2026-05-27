import { defaultDiagnoses } from '../data/defaultDiagnoses';

const DB_KEY = 'medical_underwriting_diagnoses';

export const dbService = {
  /**
   * Initializes the database in localStorage if it does not exist, and returns all records.
   */
  init() {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultDiagnoses));
      return defaultDiagnoses;
    }
    return JSON.parse(data);
  },

  /**
   * Retrieves all diagnoses from the database.
   */
  getDiagnoses() {
    return this.init();
  },

  /**
   * Saves a single diagnosis record, marking it as updated by a Human.
   * @param {Object} updatedRecord 
   */
  updateDiagnosis(updatedRecord) {
    const records = this.getDiagnoses();
    const index = records.findIndex(r => r.id === updatedRecord.id);
    
    if (index !== -1) {
      records[index] = {
        ...records[index],
        ...updatedRecord,
        updated_by: 'Human',
        last_updated: new Date().toISOString()
      };
      localStorage.setItem(DB_KEY, JSON.stringify(records));
      return records[index];
    }
    throw new Error('Diagnosis not found');
  },

  /**
   * Merges pending AI suggestions into the active human underwriting rules for both languages.
   * @param {string} id 
   */
  acceptAISuggestion(id) {
    const records = this.getDiagnoses();
    const index = records.findIndex(r => r.id === id);

    if (index !== -1 && records[index].ai_suggestions) {
      const record = records[index];
      const ai = record.ai_suggestions;

      // Merge suggestions into the main rules for both languages
      const mergedRequirementsZh = record.underwriting_rules.requirements_zh.trim() + 
        "\n\n* **[AI 建議併入]** " + ai.requirements_zh.replace(/^\*\s*/gm, '').replace(/\n\*\s*/g, '\n* ');
      
      const mergedRequirementsEn = record.underwriting_rules.requirements_en.trim() + 
        "\n\n* **[AI APPROVED MERGE]** " + ai.requirements_en.replace(/^\*\s*/gm, '').replace(/\n\*\s*/g, '\n* ');
      
      const mergedDecisionsZh = record.underwriting_rules.decisions_reference_zh.trim() + 
        "\n\n* **[AI 建議併入]** " + ai.decisions_reference_zh.replace(/^\*\s*/gm, '').replace(/\n\*\s*/g, '\n* ');
      
      const mergedDecisionsEn = record.underwriting_rules.decisions_reference_en.trim() + 
        "\n\n* **[AI APPROVED MERGE]** " + ai.decisions_reference_en.replace(/^\*\s*/gm, '').replace(/\n\*\s*/g, '\n* ');

      records[index] = {
        ...record,
        underwriting_rules: {
          requirements_zh: mergedRequirementsZh,
          requirements_en: mergedRequirementsEn,
          decisions_reference_zh: mergedDecisionsZh,
          decisions_reference_en: mergedDecisionsEn
        },
        ai_suggestions: null, // Clear the pending suggestion
        updated_by: 'Human (Approved AI)',
        last_updated: new Date().toISOString()
      };
      
      localStorage.setItem(DB_KEY, JSON.stringify(records));
      return records[index];
    }
    throw new Error('Record or pending AI suggestion not found');
  },

  /**
   * Simulates an AI Agent background run that generates a bilingual AI suggestion for a random diagnosis.
   */
  simulateAIUpdate() {
    const records = this.getDiagnoses();
    
    // Filter records that do not currently have AI suggestions
    const availableRecords = records.filter(r => !r.ai_suggestions);
    
    if (availableRecords.length === 0) {
      return null;
    }

    const randomRecord = availableRecords[Math.floor(Math.random() * availableRecords.length)];
    const index = records.findIndex(r => r.id === randomRecord.id);

    // AI Suggestions Database based on disease name (Dual Language)
    let suggestion = {
      requirements_zh: "* 建議安排**高精確度血管超音波**以評估內皮受損程度。",
      requirements_en: "* Recommend scheduling **high-resolution vascular ultrasound** to evaluate endothelial damage.",
      decisions_reference_zh: "* **AI 臨床預測**：該患者長期死亡風險偏高，建議維持 +25% 加費比例以彌補潛在賠付波動。",
      decisions_reference_en: "* **AI Clinical Prediction**: Patient carries elevated long-term mortality risk; recommend maintaining a +25% loading.",
      created_at: new Date().toISOString()
    };

    if (randomRecord.diagnosis_name_en.includes("Diabetes")) {
      suggestion = {
        requirements_zh: "* 建議追加 **連續血糖監測 (CGM)** 的雙週報告，以確認血糖波動係數 (CV)。\n* 增列**週邊動脈檢查報告 (ABI Index)** 以評估有無下肢動脈硬化症風險。",
        requirements_en: "* Recommend adding **Continuous Glucose Monitoring (CGM)** reports to confirm glycemic Coefficient of Variation (CV).\n* Request **Ankle-Brachial Index (ABI)** report to evaluate lower-extremity peripheral artery disease risk.",
        decisions_reference_zh: "* **AI 實證預估**：若 CGM 顯示時間在目標範圍內 (TIR) < 70%，其急性心血管病變風險將提升 1.5 倍，健康險建議評估加費幅度調整為 +120% 起算。",
        decisions_reference_en: "* **AI Evidence-based Forecast**: If CGM Time in Range (TIR) is < 70%, acute cardiovascular event risk increases 1.5x; recommend health rating loading starts from +120%.",
        created_at: new Date().toISOString()
      };
    } else if (randomRecord.diagnosis_name_en.includes("GERD")) {
      suggestion = {
        requirements_zh: "* 建議加做**食道壓力蠕動測試 (Esophageal Manometry)** 以排除賁門失弛緩症 (Achalasia) 之混淆診斷。",
        requirements_en: "* Recommend performing **Esophageal Manometry** to exclude Achalasia as a confounding diagnosis.",
        decisions_reference_zh: "* **AI 診斷支持**：若併發食道重度狹窄且接受過食道擴張術者，醫療險建議逕予加費 +50% 且列入部位除外。",
        decisions_reference_en: "* **AI Diagnostic Support**: If severe esophageal stricture exists and esophageal dilation was performed, recommend medical loading of +50% with site exclusions.",
        created_at: new Date().toISOString()
      };
    } else if (randomRecord.diagnosis_name_en.includes("Osteoarthritis")) {
      suggestion = {
        requirements_zh: "* 建議檢附**關節鏡鏡檢病理報告**或近年最新 MRI 關節腔影像診斷報告。\n* 需提供近半年的復健物理治療完整歷程與疼痛指數評估量表 (VAS Score)。",
        requirements_en: "* Recommend submitting **arthroscopic biopsy** or recent joint MRI diagnostic imaging reports.\n* Detailed physical therapy history and Visual Analog Scale (VAS) pain score for the past 6 months are required.",
        decisions_reference_zh: "* **AI 賠付演算**：若患者已預定在三個月內進行全人工膝關節置換手術 (TKA)，實支實付醫療險與意外殘廢險建議暫緩承保 (Postpone) 直至術後康復滿六個月且無不良併發症。",
        decisions_reference_en: "* **AI Payout Calculation**: If patient is scheduled for Total Knee Arthroplasty (TKA) within 3 months, medical reimbursement and accidental disability lines should be postponed until 6 months post-surgery.",
        created_at: new Date().toISOString()
      };
    } else if (randomRecord.diagnosis_name_en.includes("Kidney")) {
      suggestion = {
        requirements_zh: "* 建議加附最近一期的**副甲狀腺素 (iPTH)** 與血清鈣磷離子檢測，以利排除腎骨病變併發症。\n* 需補充**心臟超音波 (Echocardiogram)** 確認有無因尿毒素引發之尿毒性心包膜炎或左心室肥大。",
        requirements_en: "* Recommend adding recent **intact Parathyroid Hormone (iPTH)** and serum calcium/phosphorus checks to rule out renal osteodystrophy.\n* Echocardiogram is recommended to rule out uremic pericarditis or left ventricular hypertrophy.",
        decisions_reference_zh: "* **AI 再保指引優化**：慢性腎臟病第三期 A 階段患者，若 UACR > 300 mg/g (重度蛋白尿)，其進展至末期腎臟病 (ESRD) 的年複合率高達 8.4%，強烈建議拒保 (Decline)。",
        decisions_reference_en: "* **AI Reinsurance Guide Optimization**: For Stage 3A CKD, if UACR is > 300 mg/g (severe proteinuria), progression to ESRD carries an annual compound rate of 8.4%; strongly recommend Decline.",
        created_at: new Date().toISOString()
      };
    }

    records[index] = {
      ...randomRecord,
      ai_suggestions: suggestion,
      updated_by: 'AI_Agent_V1',
      last_updated: new Date().toISOString()
    };

    localStorage.setItem(DB_KEY, JSON.stringify(records));
    return records[index];
  },

  /**
   * Resets the entire database to defaultDiagnoses.
   */
  resetDatabase() {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDiagnoses));
    return defaultDiagnoses;
  }
};
