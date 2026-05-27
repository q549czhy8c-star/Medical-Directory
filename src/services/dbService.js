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
   * Merges pending AI suggestions into the active human underwriting rules.
   * @param {string} id 
   */
  acceptAISuggestion(id) {
    const records = this.getDiagnoses();
    const index = records.findIndex(r => r.id === id);

    if (index !== -1 && records[index].ai_suggestions) {
      const record = records[index];
      const ai = record.ai_suggestions;

      // Merge suggestions into the main rules
      const mergedRequirements = record.underwriting_rules.requirements.trim() + 
        "\n\n* **[AI 建議併入]** " + ai.requirements.replace(/^\*\s*/gm, '').replace(/\n\*\s*/g, '\n* ');
      
      const mergedDecisions = record.underwriting_rules.decisions_reference.trim() + 
        "\n\n* **[AI 建議併入]** " + ai.decisions_reference.replace(/^\*\s*/gm, '').replace(/\n\*\s*/g, '\n* ');

      records[index] = {
        ...record,
        underwriting_rules: {
          requirements: mergedRequirements,
          decisions_reference: mergedDecisions
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
   * Simulates an AI Agent background run that generates an AI suggestion for a random diagnosis.
   */
  simulateAIUpdate() {
    const records = this.getDiagnoses();
    
    // Filter records that do not currently have AI suggestions
    const availableRecords = records.filter(r => !r.ai_suggestions);
    
    if (availableRecords.length === 0) {
      // If all have suggestions, just clear them for testing or pick any
      return null;
    }

    const randomRecord = availableRecords[Math.floor(Math.random() * availableRecords.length)];
    const index = records.findIndex(r => r.id === randomRecord.id);

    // AI Suggestions Database based on disease name
    let suggestion = {
      requirements: "* 建議安排**高精確度血管超音波**以評估內皮受損程度。",
      decisions_reference: "* **AI 臨床預測**：該患者長期死亡風險偏高，建議維持 +25% 加費比例以彌補潛在賠付波動。",
      created_at: new Date().toISOString()
    };

    if (randomRecord.diagnosis_name.includes("第二型糖尿病")) {
      suggestion = {
        requirements: "* 建議追加 **連續血糖監測 (CGM)** 的雙週報告，以確認血糖波動係數 (Coefficient of Variation, CV)。\n* 增列**週邊動脈檢查報告 (ABI Index)** 以評估有無下肢動脈硬化症風險。",
        decisions_reference: "* **AI 實證預估**：若 CGM 顯示時間在目標範圍內 (TIR) < 70%，其急性心血管病變風險將提升 1.5 倍，健康險建議評估加費幅度調整為 +120% 起算。",
        created_at: new Date().toISOString()
      };
    } else if (randomRecord.diagnosis_name.includes("胃食道逆流")) {
      suggestion = {
        requirements: "* 建議加做**食道壓力蠕動測試 (Esophageal Manometry)** 以排除賁門失弛緩症 (Achalasia) 之混淆診斷。",
        decisions_reference: "* **AI 診斷支持**：若併發食道重度狹窄且接受過食道擴張術者，醫療險建議逕予加費 +50% 且列入部位除外。",
        created_at: new Date().toISOString()
      };
    } else if (randomRecord.diagnosis_name.includes("退化性關節炎")) {
      suggestion = {
        requirements: "* 建議檢附**關節镜鏡檢病理報告**或近年最新 MRI 關節腔影像診斷報告。\n* 需提供近半年的復健物理治療完整歷程與疼痛指數評估量表 (VAS Score)。",
        decisions_reference: "* **AI 賠付演算**：若患者已預定在三個月內進行全人工膝關節置換手術 (TKA)，實支實付醫療險與意外殘廢險建議暫緩承保 (Postpone) 直至術後康復滿六個月且無不良併發症。",
        created_at: new Date().toISOString()
      };
    } else if (randomRecord.diagnosis_name.includes("慢性腎臟病")) {
      suggestion = {
        requirements: "* 建議加附最近一期的**副甲狀腺素 (iPTH)** 與血清鈣磷離子檢測，以利排除腎骨病變併發症。\n* 需補充**心臟超音波 (Echocardiogram)** 確認有無因尿毒素引發之尿毒性心包膜炎或左心室肥大。",
        decisions_reference: "* **AI 再保指引優化**：慢性腎臟病第三期 A 階段患者，若 UACR > 300 mg/g (重度蛋白尿)，其進展至末期腎臟病 (ESRD) 的年複合率高達 8.4%，強烈建議拒保 (Decline)。",
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
