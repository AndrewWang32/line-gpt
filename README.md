# LINE GPT Bot - Vercel 部署專案

這是一個整合 ChatGPT 的 LINE Bot，使用 Vercel 進行部署。

## 功能特色

- 🤖 整合 OpenAI ChatGPT API
- 📱 支援 LINE 平台
- ⚡ 使用 Vercel 無伺服器架構
- 🔒 安全的 Webhook 驗證
- 📝 支援長訊息分段發送
- 🎯 友善的繁體中文回應

## 部署步驟

### 1. 準備環境變數

在 Vercel 專案設定中添加以下環境變數：

```
LINE_CHANNEL_ACCESS_TOKEN=你的LINE頻道存取權杖
LINE_CHANNEL_SECRET=你的LINE頻道密鑰
OPENAI_API_KEY=你的OpenAI API金鑰
BOT_NAME=ChatGPT助手 (可選)
MAX_MESSAGE_LENGTH=2000 (可選)
```

### 2. 部署到 Vercel

#### 方法一：使用 Vercel CLI
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入 Vercel
vercel login

# 部署專案
vercel

# 設定環境變數
vercel env add LINE_CHANNEL_ACCESS_TOKEN
vercel env add LINE_CHANNEL_SECRET
vercel env add OPENAI_API_KEY
```

#### 方法二：使用 GitHub 整合
1. 將此專案推送到 GitHub
2. 在 Vercel 控制台連接 GitHub 倉庫
3. 設定環境變數
4. 自動部署

### 3. 設定 LINE Webhook

1. 在 LINE Developers Console 中設定 Webhook URL：
   ```
   https://你的專案名稱.vercel.app/api/webhook
   ```

2. 啟用 Webhook 功能

3. 驗證 Webhook 設定

## 本地開發

### 安裝依賴
```bash
npm install
```

### 設定環境變數
複製 `env.example` 為 `.env.local` 並填入你的 API 金鑰：
```bash
cp env.example .env.local
```

### 啟動開發伺服器
```bash
npm run dev
```

## API 端點

- `POST /api/webhook` - LINE Webhook 端點
- `GET /api/health` - 健康檢查端點

## 專案結構

```
line-gpt/
├── api/
│   ├── webhook.js      # LINE Webhook 處理
│   └── health.js       # 健康檢查
├── package.json        # 專案依賴
├── vercel.json         # Vercel 配置
├── env.example         # 環境變數範例
└── README.md          # 說明文件
```

## 功能說明

### 訊息處理
- **文字訊息**: 直接傳送給 ChatGPT 並回傳回應
- **圖片/貼圖/語音/影片**: 提示用戶使用文字訊息
- **新用戶關注**: 發送歡迎訊息

### 安全機制
- LINE 簽名驗證
- 環境變數保護敏感資訊
- 錯誤處理和日誌記錄

### 效能優化
- 長訊息自動分段
- 非同步處理
- 無伺服器架構自動擴展

## 故障排除

### 常見問題

1. **Webhook 驗證失敗**
   - 檢查 LINE_CHANNEL_SECRET 是否正確
   - 確認 Webhook URL 設定正確

2. **ChatGPT 回應失敗**
   - 檢查 OPENAI_API_KEY 是否有效
   - 確認 OpenAI 帳戶有足夠額度

3. **部署失敗**
   - 檢查所有環境變數是否已設定
   - 確認 package.json 中的依賴版本

### 日誌查看
在 Vercel 控制台的 Functions 頁面可以查看執行日誌。

## 授權

MIT License

## 支援

如有問題，請檢查：
1. Vercel 部署日誌
2. LINE Developers Console 的 Webhook 狀態
3. OpenAI API 使用狀況
