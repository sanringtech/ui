export const tabsTranslations = {
  'tabs.description': '用於在同一頁切換相關面板內容的複合式頁籤 primitive。',
  'tabs.demo.account': '帳戶',
  'tabs.demo.password': '密碼',
  'tabs.demo.notifications': '通知',
  'tabs.demo.overview': '總覽',
  'tabs.demo.analytics': '分析',
  'tabs.demo.reports': '報表',
  'tabs.demo.security': '安全性',
  'tabs.demo.settings': '設定',
  'tabs.demo.horizontal': '水平',
  'tabs.demo.withIcon': '包含圖示',
  'tabs.demo.vertical': '垂直',
  'tabs.demo.line': '底線變體',
  'tabs.demo.disabled': '停用頁籤',
  'tabs.examples.description': '常見 Tabs 版型，適合設定頁、儀表板、停用選項與垂直導覽。',
  'tabs.examples.basic.description':
    'Tabs 會用相同 value 配對 trigger 與 content。未提供 defaultValue 時，會自動選取第一個可用 trigger。',
  'tabs.usage.description': '匯入 tabs primitives，並組合 root、list、trigger 與 content。',
  'tabs.installation.description':
    '使用 sanring-tabs 作為狀態根節點，並讓每個 trigger value 對應 content value。',
  'tabs.composition.description':
    'Tabs 拆分為 root、list、trigger 與 content primitives，讓版面與內容面板保持彈性。',
  'tabs.api.description': 'Tabs primitives 支援的 Inputs 與 Outputs。',
  'tabs.api.defaultValue.description': '元件建立時預設選取的 tab value。',
  'tabs.api.orientation.description':
    '控制 sanring-tabs 自己的水平/垂直版面(CSS grid)。不會驅動鍵盤導覽方向——要在 sanring-tabs-list 上也設同樣的值,方向鍵導覽才會跟版面一致。',
  'tabs.api.listOrientation.description':
    '真正驅動鍵盤導覽方向(方向鍵是 Left/Right 還是 Up/Down)的欄位——要跟 sanring-tabs 的 orientation 設成一樣的值,兩者不會自動同步。',
  'tabs.api.selectionMode.description':
    "'follow'(預設)只要用鍵盤把焦點移到某個頁籤就會立即選取(自動啟用,符合 ARIA APG 的 tabs pattern)。'explicit' 則要按 Enter/Space 才會選取目前 focus 的頁籤(手動啟用)——適合切換頁籤成本較高的情境(例如會觸發網路請求)。",
  'tabs.api.variant.description': '控制 trigger list 的視覺樣式。',
  'tabs.api.value.description': '用來配對 trigger 與 content panel 的必要值。',
  'tabs.api.disabled.description': '避免 trigger 被選取，並從鍵盤導覽中略過。',
  'tabs.api.valueChange.description': '選取的 tab value 變更時觸發。',
} as const;
