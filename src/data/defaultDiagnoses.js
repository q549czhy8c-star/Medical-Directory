export const defaultDiagnoses = [
  {
    id: "f84a29a0-2f3b-4c4c-9f82-1bf7d3fa2445",
    category_body_part_zh: "心血管系統 (Cardiovascular)",
    category_body_part_en: "Cardiovascular System",
    age_group_zh: ["青年", "中年", "老年"],
    age_group_en: ["Youth", "Middle-aged", "Elderly"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "原發性高血壓 (Essential Hypertension)",
    diagnosis_name_en: "Essential Hypertension",
    base_data: {
      causes_zh: "主要與遺傳、高鹽飲食、肥胖、缺乏運動、長期精神壓力以及血管硬化等多重因素相關，導致體內血壓長期持續高於正常範圍（收縮壓 ≥ 140 mmHg 或舒張壓 ≥ 90 mmHg）。",
      causes_en: "Primarily associated with genetics, high-sodium diet, obesity, physical inactivity, chronic psychological stress, and arterial stiffening, leading to persistently elevated blood pressure (systolic BP ≥ 140 mmHg or diastolic BP ≥ 90 mmHg).",
      risks_zh: "高血壓會顯著增加**心肌梗塞**、**腦中風 (Stroke)**、**慢性腎臟衰竭**以及主動脈剝離的發病率與死亡率。核保評估重點在於血壓控制的穩定度及是否已併發靶器官受損。",
      risks_en: "Hypertension significantly increases the morbidity and mortality of **myocardial infarction**, **stroke**, **chronic kidney failure**, and aortic dissection. Underwriting focuses on BP control stability and presence of target organ damage (TOD).",
      treatments_zh: "包括生活方式改善（減重、低鈉飲食、限酒、規律運動）以及使用降血壓藥物（如 ACEI、ARB、鈣離子阻斷劑 CCB、利尿劑等）進行長期控制。",
      treatments_en: "Includes lifestyle modifications (weight loss, low-sodium diet, alcohol restriction, regular exercise) and long-term pharmacotherapy (such as ACEIs, ARBs, Calcium Channel Blockers, and diuretics)."
    },
    underwriting_rules: {
      requirements_zh: "* 需提供最近六個月的**血壓量測記錄**。\n* 需提供近期的**腎功能檢查 (Creatinine, eGFR)** 與尿常規報告（排除蛋白尿）。\n* 45歲以上或有吸菸史者，需附**靜止心電圖 (ECG)**。\n* 若有合併症，需附專科醫師詳細診斷說明書。",
      requirements_en: "* Must provide **blood pressure logs** for the past 6 months.\n* Recent **renal function tests (Creatinine, eGFR)** and urinalysis (to rule out proteinuria) are required.\n* Resting **electrocardiogram (ECG)** required for ages 45+ or smokers.\n* Detailed specialist report required if comorbidities exist.",
      decisions_reference_zh: "* **血壓控制良好 (< 130/80 mmHg) 且無合併症者**：標準體 (Standard Rate) 或 輕度加費 (約 +25% ~ +50%)。\n* **中度控制不良且無靶器官受損者**：中度加費 (約 +75% ~ +100%)。\n* **已有併發症者（如左心室肥大、蛋白尿、視網膜病變）**：高度加費 (+150% 以上) 或拒保 (Decline)。",
      decisions_reference_en: "* **Well-controlled (BP < 130/80 mmHg) without complications**: Standard Rate or mild rating (approx. +25% to +50%).\n* **Moderately controlled without target organ damage**: Moderate loading (+75% to +100%).\n* **Presence of target organ damage (e.g., LVH, proteinuria, retinopathy)**: High rating (+150% and above) or Decline."
    },
    ai_suggestions: {
      requirements_zh: "* 需額外提供最近一期的**微量白蛋白尿 (Microalbuminuria)** 篩檢報告以評估極早期腎病變。\n* 建議補充**心臟超音波 (Echocardiogram)** 報告，確認有無早期左心室肥大 (LVH) 病變。",
      requirements_en: "* Recommend providing **Microalbuminuria** screening to assess early nephropathy.\n* Recommend providing an **Echocardiogram** to assess early left ventricular hypertrophy (LVH).",
      decisions_reference_zh: "* **最新 AHA/ACC 指引建議**：若有合併微量白蛋白尿，即使血壓控制正常，仍建議加費至少 +50% 以反映長期心血管死亡風險之提升。",
      decisions_reference_en: "* **Recent AHA/ACC Guidelines**: If microalbuminuria is present, even with normal BP, an additional loading of +50% is recommended due to elevated cardiovascular mortality risk.",
      created_at: "2026-05-27T10:00:00Z"
    },
    updated_by: "AI_Agent_V1",
    last_updated: "2026-05-27T14:48:34+08:00"
  },
  {
    id: "a7501b12-9c12-4d22-bf4f-e2c7a7a729e8",
    category_body_part_zh: "內分泌系統 (Endocrine)",
    category_body_part_en: "Endocrine System",
    age_group_zh: ["青年", "中年", "老年"],
    age_group_en: ["Youth", "Middle-aged", "Elderly"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "第二型糖尿病 (Type 2 Diabetes Mellitus)",
    diagnosis_name_en: "Type 2 Diabetes Mellitus",
    base_data: {
      causes_zh: "主要由於胰島素阻抗（Insulin Resistance）伴隨胰島素分泌不足。危險因子包括遺傳、肥胖、高熱量飲食、缺乏運動及年長等。",
      causes_en: "Characterized by insulin resistance combined with progressive insulin secretory defect. Risk factors include genetics, obesity, high-calorie diet, inactivity, and aging.",
      risks_zh: "糖尿病為全身性血管病變之源頭，顯著提高**冠心病**、**視網膜病變導致失明**、**糖尿病腎病變 (End-stage Renal Disease)** 以及周邊神經/血管病變（導致截肢）的發病率。核保特別看重 **糖化血色素 (HbA1c)** 控制水準。",
      risks_en: "Diabetes accelerates macrovascular and microvascular diseases, significantly increasing risks of **coronary artery disease**, **diabetic retinopathy**, **nephropathy (renal failure)**, and neuropathy. Underwriting evaluates **HbA1c** levels carefully.",
      treatments_zh: "包括飲食控制、規律運動、口服降血糖藥（如 Metformin、SGLT2 抑制劑、DPP-4 抑制劑）或皮下注射胰島素、GLP-1 受體促效劑。",
      treatments_en: "Includes dietary control, regular exercise, oral hypoglycemics (Metformin, SGLT2 inhibitors, DPP-4 inhibitors) or subcutaneous insulin, GLP-1 receptor agonists."
    },
    underwriting_rules: {
      requirements_zh: "* 需附最近六個月內的**糖化血色素 (HbA1c)** 檢測報告。\n* 需提供近期的**眼底檢查報告**（排除增殖性視網膜病變）。\n* 需提供**腎功能 (eGFR, Creatinine)** 與微量尿蛋白檢測。\n* 需檢附最新空腹血糖與血脂分析報告。",
      requirements_en: "* Must submit recent **HbA1c** reports (within 6 months).\n* Recent **fundoscopy report** required to exclude proliferative retinopathy.\n* **Renal function (eGFR, Creatinine)** and microalbuminuria tests are required.\n* Fasting blood glucose and lipid panel reports are required.",
      decisions_reference_zh: "* **HbA1c < 7.0% 且無併發症者**：中度加費 (+75% ~ +100%)。\n* **HbA1c 在 7.0% ~ 8.5% 之間者**：高度加費 (+125% ~ +150%)。\n* **HbA1c > 8.5% 或已出現嚴重微血管/大血管病變者**：拒保 (Decline)。",
      decisions_reference_en: "* **HbA1c < 7.0% without complications**: Moderate loading (+75% to +100%).\n* **HbA1c between 7.0% and 8.5%**: High loading (+125% to +150%).\n* **HbA1c > 8.5% or presence of severe vascular complications**: Decline."
    },
    ai_suggestions: null,
    updated_by: "Human",
    last_updated: "2026-05-26T09:12:00+08:00"
  },
  {
    id: "e44cda8b-c918-4034-be57-9d7a964f43de",
    category_body_part_zh: "呼吸系統 (Respiratory)",
    category_body_part_en: "Respiratory System",
    age_group_zh: ["兒童", "青年", "中年"],
    age_group_en: ["Child", "Youth", "Middle-aged"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "支氣管氣喘 (Bronchial Asthma)",
    diagnosis_name_en: "Bronchial Asthma",
    base_data: {
      causes_zh: "與遺傳易感性、過敏原暴露（如塵蟎、寵物毛髮）、呼吸道感染、冷空氣及劇烈運動等誘發氣道慢性發炎及高反應性相關。",
      causes_en: "Caused by genetics, allergen exposure (dust mites, pet dander), infections, cold air, or physical exertion, triggering airway inflammation and hyperresponsiveness.",
      risks_zh: "急性發作時可能導致**嚴重呼吸困難甚至窒息致死**。長期控制不佳可導致氣道重塑及不可逆的肺功能受損。評估重點在於發作頻率、是否曾急診/住院、以及肺功能指標。",
      risks_en: "Acute attacks can lead to **severe dyspnea or fatal asphyxiation**. Chronic poor control leads to airway remodeling. Underwriting reviews frequency, emergency/hospitalization history, and spirometry.",
      treatments_zh: "主要為吸入性類固醇（ICS，控制發炎）與長效型支氣管擴張劑（LABA）合併治療，急性發作時使用短效型支氣管擴張劑（SABA）。",
      treatments_en: "Mainly managed with Inhaled Corticosteroids (ICS) and Long-Acting Beta-Agonists (LABA), with Short-Acting Beta-Agonists (SABA) as rescue inhalers."
    },
    underwriting_rules: {
      requirements_zh: "* 需檢附**肺功能測試 (PFT, FEV1/FVC)** 報告。\n* 需附專科醫師填寫之**氣喘問卷**（評估近一年發作頻率、有無急診或插管史）。\n* 需提供近期用藥紀錄與回診追蹤報告。",
      requirements_en: "* Must submit **Pulmonary Function Test (PFT, FEV1/FVC)** reports.\n* Specialist-completed **asthma questionnaire** (evaluating attack frequency, ER visits, or intubation history in past year).\n* Recent medication and clinic follow-up records are required.",
      decisions_reference_zh: "* **輕度間歇性發作、不需每日用藥且肺功能正常者**：標準體 (Standard Rate)。\n* **中度持續性、控制穩定且 FEV1 > 80% 者**：輕度加費 (+25% ~ +50%)。\n* **重度氣喘、頻繁急性發作、曾因氣喘住院或 FEV1 < 60% 者**：拒保 (Decline)。",
      decisions_reference_en: "* **Mild intermittent, no daily meds, normal PFT**: Standard Rate.\n* **Moderate persistent, well-controlled and FEV1 > 80%**: Mild loading (+25% to +50%).\n* **Severe asthma, frequent attacks, history of hospitalization, or FEV1 < 60%**: Decline."
    },
    ai_suggestions: {
      requirements_zh: "* 對於兒童氣喘患者，建議加附最近一期的**吸入性過敏原篩檢 (CAP/MAST)** 報告，確認有無明確環境致敏因子，以精準評估避險行為影響。",
      requirements_en: "* For pediatric patients, recommend adding a recent **Allergen Screening (CAP/MAST)** report to identify triggers and evaluate avoidance compliance.",
      decisions_reference_zh: "* **新版再保指引建議**：若有近期使用系統性口服類固醇 (Oral Corticosteroids) 治療急性發作史，加費幅度需提高一個級距 (+50% 起算)。",
      decisions_reference_en: "* **New Reinsurance Guidelines**: Recent use of oral systemic corticosteroids (OCS) for acute attacks requires the rating to be increased by one tier (+50% minimum loading).",
      created_at: "2026-05-27T12:30:00Z"
    },
    updated_by: "AI_Agent_V1",
    last_updated: "2026-05-27T14:48:34+08:00"
  },
  {
    id: "d9e8020a-fb12-4ee4-90a8-ffc9a8bb6d11",
    category_body_part_zh: "消化系統 (Digestive)",
    category_body_part_en: "Digestive System",
    age_group_zh: ["青年", "中年", "老年"],
    age_group_en: ["Youth", "Middle-aged", "Elderly"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "胃食道逆流 (Gastroesophageal Reflux Disease - GERD)",
    diagnosis_name_en: "Gastroesophageal Reflux Disease (GERD)",
    base_data: {
      causes_zh: "由於下食道括約肌功能失調、胃排空延遲或腹內壓增高，導致胃酸或膽汁逆流進入食道，引發食道黏膜發炎與受損。",
      causes_en: "Arises from lower esophageal sphincter dysfunction, delayed gastric emptying, or increased intra-abdominal pressure, causing gastric acid or bile reflux and esophageal inflammation.",
      risks_zh: "長期反覆逆流發炎可能誘發食道潰瘍、狹窄，甚至轉變為食道腺癌的前驅病變——**巴雷斯特食道 (Barrett's Esophagus)**。核保主要防範消化道惡性病變的潛在風險。",
      risks_en: "Chronic reflux can cause esophageal ulcers, strictures, or **Barrett's Esophagus** (a premalignant precursor to adenocarcinoma). Underwriting assesses risks of malignancy.",
      treatments_zh: "包括生活習慣調整（避免暴飲暴食、戒菸酒、飯後避趴睡、減重）與使用質子幫浦抑制劑 (PPI)、H2 受體阻斷劑或制酸劑。",
      treatments_en: "Includes lifestyle adjustments (avoiding overeating, smoking/alcohol cessation, weight loss) and pharmacotherapy like Proton Pump Inhibitors (PPIs) or H2 blockers."
    },
    underwriting_rules: {
      requirements_zh: "* 需檢附兩年內做過的**胃鏡檢查 (Panendoscopy) 報告**（以確認洛杉磯食道炎分級 LA Classification）。\n* 需提供近期的臨床追蹤與藥物使用明細。",
      requirements_en: "* Must submit a **gastroscopy (endoscopy) report** within the past 2 years (to identify the Los Angeles Classification of esophagitis).\n* Recent clinical follow-up notes and prescription details are required.",
      decisions_reference_zh: "* **LA 分級為 A 級或 B 級，且無其他合併症者**：標準體 (Standard Rate)。\n* **LA 分級為 C 級或 D 級（重度食道炎）者**：標準體但需加除外條款（食道及其併發症除外），或微幅加費 (+25%)。\n* **經病理切片證實為巴雷斯特食道 (Barrett's Esophagus) 者**：高度加費 (+100% ~ +150%) 或拒保。",
      decisions_reference_en: "* **LA Grade A or B without complications**: Standard Rate.\n* **LA Grade C or D (severe esophagitis)**: Standard Rate with an exclusion clause (excluding esophagus diseases and complications), or mild loading (+25%).\n* **Biopsy-confirmed Barrett's Esophagus**: High loading (+100% to +150%) or Decline."
    },
    ai_suggestions: null,
    updated_by: "Human",
    last_updated: "2026-05-20T11:45:00+08:00"
  },
  {
    id: "c87629b3-1f7c-482a-89aa-ddaaee2233f2",
    category_body_part_zh: "骨骼肌肉系統 (Skeletal)",
    category_body_part_en: "Skeletal/Muscular System",
    age_group_zh: ["中年", "老年"],
    age_group_en: ["Middle-aged", "Elderly"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "退化性關節炎 (Osteoarthritis)",
    diagnosis_name_en: "Osteoarthritis",
    base_data: {
      causes_zh: "主要與關節長期過度磨損、老化、肥胖、關節外傷及遺傳有關。關節軟骨面因退化而逐漸磨損、變薄，並導致骨刺增生與關節發炎。",
      causes_en: "Primarily caused by joint wear-and-tear, aging, obesity, trauma, and genetics, leading to the progressive degradation of articular cartilage, osteophyte formation, and joint inflammation.",
      risks_zh: "主要影響日常生活活動度 (ADLs)，導致慢性疼痛與行動不便，但**一般不增加整體死亡率 (Mortality)**。核保評估重心主要在於失能險、實支實付醫療險與意外骨折險的給付賠付率。",
      risks_en: "Impairs Activities of Daily Living (ADLs) and causes chronic pain, but **does not increase overall mortality**. Underwriting focuses on disability, medical reimbursement, and fracture riders.",
      treatments_zh: "包括非藥物療法（減重、復健物理治療、肌力訓練）、口服消炎止痛藥 (NSAIDs)、注射玻尿酸或 PRP，以及嚴重時進行人工關節置換手術。",
      treatments_en: "Includes non-pharmacological treatment (weight loss, physical therapy, strength training), oral NSAIDs, intra-articular hyaluronic acid or PRP injections, and joint replacement surgery in advanced stages."
    },
    underwriting_rules: {
      requirements_zh: "* 需檢附關節部位之 **X光檢查報告** 或影像診斷書。\n* 需說明目前關節活動受限程度（如：是否需輔具、是否已安排關節置換手術）。",
      requirements_en: "* Must submit **X-ray reports** or medical imaging diagnostics for the affected joints.\n* Description of current mobility limitations (e.g., use of aids, scheduled joint replacement surgery) is required.",
      decisions_reference_zh: "* **壽險 (Life Insurance)**：通常為標準體 (Standard Rate)。\n* **醫療險 (Health/Medical)**：標準體，但通常會針對病變關節部位（如雙膝、雙髖）加上**除外責任免責條款**。\n* **失能險 / 長照險**：依功能受損程度評估，可能予以除外、加費 (+25% ~ +50%) 或拒保。",
      decisions_reference_en: "* **Life Insurance**: Standard Rate.\n* **Medical Insurance**: Standard Rate, but usually with an **exclusion rider** for the affected joints (e.g., knee, hip).\n* **Disability/Long-Term Care**: Rating, exclusion, or Decline based on functional impairment (loading +25% to +50%)."
    },
    ai_suggestions: null,
    updated_by: "Human",
    last_updated: "2026-05-22T16:20:00+08:00"
  },
  {
    id: "b2234091-a1b2-4d22-bf4f-e2c7a7a729fa",
    category_body_part_zh: "神經系統 (Nervous)",
    category_body_part_en: "Nervous System",
    age_group_zh: ["青年", "中年"],
    age_group_en: ["Youth", "Middle-aged"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "偏頭痛 (Migraine)",
    diagnosis_name_en: "Migraine",
    base_data: {
      causes_zh: "與三叉神經血管系統活化、神經傳導物質（如 CGRP、血清素）釋放失衡有關。常因壓力、睡眠不足、特定食物或女性荷爾蒙波動所誘發。",
      causes_en: "Linked to trigeminovascular system activation and neurotransmitter imbalances (like CGRP, serotonin). Commonly triggered by stress, sleep deprivation, certain foods, or hormonal fluctuations.",
      risks_zh: "偏頭痛為高度失能性疾病，嚴重損害工作與生活品質，但**不直接影響壽命/死亡率**。需特別排除是否合併其他潛在的中樞神經系統器質性病變（如動脈瘤、腦腫瘤）。",
      risks_en: "A highly disabling condition impairing quality of life, but **does not affect life expectancy/mortality**. Underwriting excludes organic CNS lesions (e.g., aneurysm, tumor).",
      treatments_zh: "包括避免誘發因子，急性發作時使用翠普登類藥物 (Triptans) 或 NSAIDs；預防發作藥物如乙型阻斷劑、抗癲癇藥物、CGRP 單株抗體。",
      treatments_en: "Includes trigger avoidance, abortive drugs (Triptans, NSAIDs) for acute attacks, and preventive medicines like beta-blockers, anti-seizure meds, or CGRP monoclonal antibodies."
    },
    underwriting_rules: {
      requirements_zh: "* 需提供專科醫師開立的確診診斷書。\n* 需說明發作頻率、每次發作持續時間與所接受的檢查報告（若曾接受腦部 MRI/CT 排除其他病變，需提供報告）。\n* 需附用藥明細以評估藥物濫用頭痛 (Medication Overuse Headaches) 的風險。",
      requirements_en: "* Must submit specialist diagnosis cert.\n* Detailed frequency, duration, and past diagnostic imaging reports (e.g., brain MRI/CT) are required.\n* Medication lists are required to assess risk of Medication Overuse Headaches (MOH).",
      decisions_reference_zh: "* **無先兆性偏頭痛 (Without Aura)，發作頻率低且藥物控制良好者**：壽險與醫療險皆可以標準體 (Standard Rate) 承保。\n* **有先兆性偏頭痛 (With Aura) 且頻繁發作者**：醫療險可能微幅加費 (+25%)，或針對頭痛及其併發症除外承保。\n* **合併嚴重藥物過度使用、疑似中樞神經系統病變未查明者**：延期核保 (Postpone) 或拒保。",
      decisions_reference_en: "* **Migraine without Aura, low frequency and well-controlled**: Standard Rate for life and health insurance.\n* **Migraine with Aura, high frequency**: Mild loading (+25%) or headache exclusion rider on medical lines.\n* **Medication overuse or suspected undiagnosed CNS pathology**: Postpone or Decline."
    },
    ai_suggestions: {
      requirements_zh: "* 建議檢附**頭痛日記記錄**，以利量化評估每月發作次數 (MMD) 與藥物依賴度。",
      requirements_en: "* Recommend submitting a **headache diary log** to quantify monthly migraine days (MMD) and dependency.",
      decisions_reference_zh: "* **AI 提示**：臨床研究顯示有先兆偏頭痛患者腦中風風險微幅上升，若同時合併吸菸或服用口服避孕藥，心血管/腦血管事件風險呈加乘效應，醫療險建議除外或加費 +50%。",
      decisions_reference_en: "* **AI Prompt**: Migraine with aura elevates stroke risk. Co-presence of smoking or oral contraceptives multiplies cardiovascular risk. Recommend medical exclusion or +50% loading.",
      created_at: "2026-05-27T11:00:00Z"
    },
    updated_by: "AI_Agent_V1",
    last_updated: "2026-05-27T14:48:34+08:00"
  },
  {
    id: "fb4a19a9-3f7c-482a-89aa-ddaaee2233f3",
    category_body_part_zh: "泌尿/生殖系統 (Urinary)",
    category_body_part_en: "Urinary/Reproductive System",
    age_group_zh: ["中年", "老年"],
    age_group_en: ["Middle-aged", "Elderly"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "慢性腎臟病 (Chronic Kidney Disease - CKD)",
    diagnosis_name_en: "Chronic Kidney Disease (CKD)",
    base_data: {
      causes_zh: "多因長期高血壓、糖尿病控制不佳、慢性腎小球腎炎，或濫用止痛藥、中草藥所致。腎臟結構或功能受損持續超過三個月，導致排毒與水鹽平衡能力退化。",
      causes_en: "Often results from long-term hypertension, poorly-controlled diabetes, chronic glomerulonephritis, or analgesic abuse. Kidneys suffer structural/functional damage over 3 months, declining clearance.",
      risks_zh: "腎功能衰退具有不可逆性，極易惡化至**尿毒症而需長期洗腎**，且合併嚴重血管鈣化及心血管疾病致死風險呈指數級增加。為保險公司的高風險案件。",
      risks_en: "Renal decline is irreversible, easily progressing to **end-stage renal disease requiring dialysis/transplant**. Risks of vascular calcification and heart disease rise exponentially. High-risk case.",
      treatments_zh: "控制原發病（降壓、降糖）、限制蛋白質與鈉磷鉀攝取、使用保護腎臟藥物（如 SGLT2i、ACEI/ARB），晚期則需接受血液透析、腹膜透析或腎移植。",
      treatments_en: "Primary disease control (BP/glucose), dietary restriction (protein, sodium, phosphorus, potassium), nephroprotective meds (SGLT2i, ACEI/ARB), and dialysis/transplant in late stages."
    },
    underwriting_rules: {
      requirements_zh: "* 需檢附最近三個月內，至少兩次間隔之**腎功能報告 (Creatinine, BUN, eGFR)**。\n* 需提供**尿液定量微量白蛋白/肌酸酐比值 (UACR)** 或 24小時尿蛋白定量報告。\n* 需附詳細的腎臟超音波報告。",
      requirements_en: "* Must submit recent **renal function tests (Creatinine, BUN, eGFR)** twice in past 3 months.\n* **Urine albumin-to-creatinine ratio (UACR)** or 24-hr urine protein quant is required.\n* Detailed renal ultrasound required.",
      decisions_reference_zh: "* **第一期 (eGFR ≥ 90 且無蛋白尿) 或 第二期 (eGFR 60~89) 且血壓控制良好者**：中度至高度加費 (+75% ~ +125%)。\n* **第三期 A 階段 (eGFR 45~59) 者**：極高度加費 (+150% ~ +200%)。\n* **第三期 B 階段以下 (eGFR < 45) 或有中/重度蛋白尿者**：通常拒保 (Decline)。",
      decisions_reference_en: "* **Stage 1 (eGFR ≥ 90 without proteinuria) or Stage 2 (eGFR 60-89) with well-controlled BP**: Moderate to high loading (+75% to +125%).\n* **Stage 3A (eGFR 45-59)**: Very high loading (+150% to +200%).\n* **Stage 3B and below (eGFR < 45) or moderate/heavy proteinuria**: Typically Decline."
    },
    ai_suggestions: null,
    updated_by: "Human",
    last_updated: "2026-05-25T15:30:00+08:00"
  },
  {
    id: "aa8910b1-c918-4034-be57-9d7a964f43e1",
    category_body_part_zh: "心血管系統 (Cardiovascular)",
    category_body_part_en: "Cardiovascular System",
    age_group_zh: ["中年", "老年"],
    age_group_en: ["Middle-aged", "Elderly"],
    gender_zh: "通用",
    gender_en: "Universal",
    diagnosis_name_zh: "冠狀動脈疾病 (Coronary Artery Disease - CAD)",
    diagnosis_name_en: "Coronary Artery Disease (CAD)",
    base_data: {
      causes_zh: "由於脂質代謝異常、高血壓、吸菸等因素，導致冠狀動脈粥狀硬化、血管腔狹窄或阻塞，造成心肌缺氧、缺血，進而引發心絞痛或心肌梗塞。",
      causes_en: "Caused by lipid metabolic disorder, hypertension, smoking etc. resulting in coronary atherosclerosis, lumen stenosis/occlusion, leading to myocardial hypoxia and angina or infarction.",
      risks_zh: "屬於**高突發死亡率**疾病（急性心肌梗塞、心室顫動猝死）。核保評估重心在於受影響的血管支數、左心室射血分數 (LVEF)、是否已接受血運重建（支架/繞道手術）以及術後時間與復發率。",
      risks_en: "Associated with **high sudden death risk** (acute MI, lethal arrhythmia). Underwriting assesses number of affected vessels, left ventricular ejection fraction (LVEF), revascularization history, time elapsed, and recurrence.",
      treatments_zh: "包括口服抗血小板藥（Aspirin/Clopidogrel）、降血脂藥（Statins）、硝酸鹽類；經皮冠狀動脈介入術（PCI，置放支架）或冠狀動脈繞道手術（CABG）。",
      treatments_en: "Includes oral antiplatelet agents (Aspirin/Clopidogrel), statins, nitrates; percutaneous coronary intervention (PCI/stent) or coronary artery bypass grafting (CABG)."
    },
    underwriting_rules: {
      requirements_zh: "* 需檢附最新**心導管手術報告 (Coronary Angiography)** 及出院病歷摘要。\n* 需提供手術後至少滿六個月的**心臟超音波報告 (Echocardiogram)**（確認 LVEF 指標）。\n* 需附最近一期的**運動心電圖 (Exercise ECG)** 或心肌灌注掃描報告。\n* 需附近期血脂、血糖與心電圖報告。",
      requirements_en: "* Must submit latest **Coronary Angiography** and discharge summaries.\n* **Echocardiogram** (verifying LVEF) at least 6 months post-procedure is required.\n* Recent **Exercise ECG** or myocardial perfusion scan report is required.\n* Recent lipid, glucose and ECG panels required.",
      decisions_reference_zh: "* **單支血管狹窄且已成功置放支架、術後滿一年、無殘餘缺血、LVEF > 50% 且無吸菸者**：高度加費 (約 +150% ~ +200%)。\n* **多支血管病變、接受冠狀動脈繞道手術 (CABG)、或術後未滿六個月者**：延期核保 (Postpone)。\n* **合併左心室功能不全 (LVEF < 40%)、有心肌梗塞病史且持續吸菸、或反覆急性心絞痛發作者**：拒保 (Decline)。",
      decisions_reference_en: "* **Single-vessel successful stenting, 1 yr post-op, no residual ischemia, LVEF > 50%, non-smoker**: High loading (+150% to +200%).\n* **Multi-vessel disease, CABG, or less than 6 months post-op**: Postpone.\n* **Left ventricular dysfunction (LVEF < 40%), MI history + smoking, or recurrent angina**: Decline."
    },
    ai_suggestions: {
      requirements_zh: "* 建議加附**高敏感度心肌鈣蛋白 (hs-cTn)** 與 **NT-proBNP** 心衰竭指標檢測，以精確評估微細心肌受損及潛在舒張期心衰竭風險。",
      requirements_en: "* Recommend checking **hs-cTn** and **NT-proBNP** heart failure biomarkers to assess microscopic myocardial injury and subclinical diastolic HF.",
      decisions_reference_zh: "* **最新歐洲心臟病學會 (ESC) 指引提示**：若患者合併左前降支 (LAD) 近端嚴重狹窄，即使已置放支架，其遠期再狹窄與不良心血管事件 (MACE) 發生率仍高於其他血管，醫療險核保建議在標準加費基礎上，額外增收 +50% 的風險點數。",
      decisions_reference_en: "* **Recent ESC Guidelines**: Proximal LAD severe stenosis carries higher rates of restenosis and MACE. Recommend adding an extra +50% loading for proximal LAD involvements.",
      created_at: "2026-05-27T08:15:00Z"
    },
    updated_by: "AI_Agent_V1",
    last_updated: "2026-05-27T14:48:34+08:00"
  }
];
