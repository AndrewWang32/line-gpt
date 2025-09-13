// 簡單的測試腳本，用於驗證環境變數和依賴
const fs = require('fs');
const path = require('path');

console.log('🔍 檢查專案配置...\n');

// 檢查必要檔案
const requiredFiles = [
  'package.json',
  'vercel.json',
  'api/webhook.js',
  'api/health.js',
  'README.md'
];

console.log('📁 檢查必要檔案:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 檔案不存在`);
  }
});

// 檢查 package.json
console.log('\n📦 檢查 package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ 專案名稱: ${packageJson.name}`);
  console.log(`✅ 版本: ${packageJson.version}`);
  
  const requiredDeps = ['@line/bot-sdk', 'openai'];
  console.log('\n🔧 檢查依賴:');
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - 依賴缺失`);
    }
  });
} catch (error) {
  console.log('❌ package.json 格式錯誤');
}

// 檢查 vercel.json
console.log('\n⚡ 檢查 vercel.json:');
try {
  const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log(`✅ Vercel 版本: ${vercelJson.version}`);
  console.log(`✅ 環境變數數量: ${vercelJson.env ? Object.keys(vercelJson.env).length : 0}`);
} catch (error) {
  console.log('❌ vercel.json 格式錯誤');
}

console.log('\n🎉 專案配置檢查完成！');
console.log('\n📋 下一步:');
console.log('1. 設定環境變數 (LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, OPENAI_API_KEY)');
console.log('2. 執行 npm install 安裝依賴');
console.log('3. 部署到 Vercel');
console.log('4. 在 LINE Developers Console 設定 Webhook URL');
