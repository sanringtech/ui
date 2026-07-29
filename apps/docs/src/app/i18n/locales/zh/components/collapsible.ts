export const collapsibleTranslations = {
  'collapsible.description': '用來從 trigger 展開或收合單一內容區域的狀態 primitive。',
  'collapsible.controlledState': '受控狀態',
  'collapsible.controlledState.description':
    '當展開狀態需要和外部控制項或儲存偏好同步時，使用 [(open)] 綁定。',
  'collapsible.demo.settingsPanel': '設定面板',
  'collapsible.demo.fileTree': '檔案樹',
  'collapsible.demo.open': '展開',
  'collapsible.demo.close': '收合',
  'collapsible.demo.advancedOptions': '進階選項',
  'collapsible.demo.controlledContent': '這個面板會跟隨外部狀態，同時保留 trigger 點擊與鍵盤啟用。',
  'collapsible.demo.basicQuestion': '這週更新了什麼？',
  'collapsible.demo.basicAnswer': '我們新增了稽核匯出、角色預設，以及更安靜的空狀態。',
  'collapsible.demo.workspacePreferences': '工作區偏好',
  'collapsible.demo.weeklyDigest': '寄送每週摘要',
  'collapsible.demo.weeklyDigestDescription': '每週一收到精簡摘要。',
  'collapsible.demo.requireReview': '發布前需要審核',
  'collapsible.demo.requireReviewDescription': '草稿會保持鎖定，直到隊友核准。',
  'collapsible.examples.description': '常見 Collapsible 模式，適合內嵌細節、密集設定與巢狀導覽。',
  'collapsible.installation.description':
    '用 CLI 加入這個元件，再匯入 root component、trigger directive 與 content directive。',
  'collapsible.usage.description':
    '將 trigger 與內容區域包在 sanring-collapsible 中。Trigger 會控制 open 狀態，並把 ARIA 屬性接到內容。',
  'collapsible.composition.description':
    'Collapsible 由狀態 root 加上 trigger 與 content directives 組成，因此可自由選擇原生元素與樣式。',
  'collapsible.api.description': 'Collapsible primitives 支援的 Inputs、Outputs 與方法。',
  'collapsible.api.class.description': '與 root element 合併的額外 class。',
  'collapsible.api.open.description': '控制內容區域是否可見，支援 [(open)] 雙向綁定。',
  'collapsible.api.disabled.description': '停用 trigger 互動，並保留目前 open 狀態。',
  'collapsible.api.toggle.description': '在未停用時切換 open 狀態。',
  'collapsible.api.openChange.description': '透過 model binding 變更 open 狀態時觸發。',

} as const;
