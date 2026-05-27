# Medical Underwriting Guide (Medical-Directory)

## 項目簡介

本專案是一個專為保險業設計的互動式醫療核保指南系統。透過此系統，核保人員能快速檢索不同年齡、性別、身體部位對應的疾病診斷，並查閱其成因、風險、治療方法，以及最重要的核保要求與結果參考。

* **線上展示網頁 (Live Public Website)**: [https://q549czhy8c-star.github.io/Medical-Directory/](https://q549czhy8c-star.github.io/Medical-Directory/)

## 系統核心架構

1. **Frontend**: React.js SPA 互動介面，支援多維度篩選、擬真動態卡片與即時表單編輯。
2. **Backend/Database**: Node.js + PostgreSQL / MongoDB (本地使用 localStorage 進行極致的互動式前端儲存，已具備完整的 Service-layer 抽象化)。
3. **Hybrid Content Management**:
   - Base Data: 醫學常識與風險評估。
   - Dynamic Rules: 允許核保專家手動調整、AI Agent 自動優化的核保標準。

## 核心資料目錄結構

- `/src/components`: UI 篩選器、疾病字卡、編輯表單與統計資訊 Banner
- `/src/data/schema`: 資料庫 Schema 定義與預設種子資料
- `/src/services`: 瀏覽器端/伺服器端資料同步服務
- `/docs` or Root: 系統指引文件（包含 AI 運作規範）

---

## 部署與本地開發

### 本地開發步驟
1. 安裝套件：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
3. 建立生產環境打包：
   ```bash
   npm run build
   ```

### 部署至 GitHub Pages (靜態託管)
本專案已完美設定 GitHub Actions 工作流。每當您將程式碼推送到 `main` 分支時，系統將自動進行 Vite 建置，並將靜態成品推送到 `gh-pages` 分支完成自動部署。
