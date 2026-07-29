export const avatarTranslations = {
  'avatar.description': '可組合的頭像 primitive，適用於個人圖片、替代文字、狀態徽章與堆疊群組。',
  'avatar.demo.sizes': '尺寸',
  'avatar.demo.statusBadge': '狀態徽章',
  'avatar.demo.badgeWithIcon': '包含圖示的徽章',
  'avatar.demo.group': '頭像群組',
  'avatar.demo.groupWithIcon': '包含圖示的頭像群組',
  'avatar.examples.description': '常見頭像模式，包含 fallback、在線狀態與精簡成員群組。',
  'avatar.examples.basic.description':
    '圖片載入完成後顯示圖片；圖片缺失或載入失敗時保留 fallback。',
  'avatar.usage.description':
    '匯入 avatar primitives，依需求組合 image、fallback、badge 或 group。',
  'avatar.installation.description':
    '使用 AvatarComponent 作為 root，並搭配 image、fallback、badge 與 group primitives。',
  'avatar.composition.description':
    'Avatar 由 root、image、fallback、status badge 與 group primitives 組成，各部分可依情境獨立組合。',
  'avatar.api.description': 'Avatar primitives 支援的 Inputs。',
  'avatar.api.class.description': '與對應 avatar primitive 樣式合併的額外 class。',
  'avatar.api.size.description': '控制頭像密度，可使用 sm、md 或 lg。',
  'avatar.api.ariaLabel.description': '無可見文字時，提供單一頭像或頭像群組的無障礙標籤。',
  'avatar.api.delayMs.description': 'fallback 顯示前的延遲毫秒數。',
  'avatar.api.status.description': '控制徽章顏色，可使用 online、offline、away、busy 或 default。',
  'avatar.api.placement.description': '將徽章放在視覺起點或終點，並尊重 RTL 方向。',
  'avatar.api.overlap.description': '頭像群組的堆疊重疊量，單位為 rem。',
  'avatar.api.count.description': '頭像群組數量項目顯示的數字。',
} as const;
