export const sidebarTranslations = {
  'sidebar.description': '可組合的 app shell 導覽區域，支援 offcanvas 與 icon rail 收合模式。',
  'sidebar.examples.basic.description':
    'Sidebar 會參與頁面 layout，可以收合，但不會變成 modal overlay。',
  'sidebar.usage.description':
    '使用 sidebar primitives 組合應用程式導覽、帳號切換器、分組連結與 footer actions。',
  'sidebar.installation.description':
    '安裝 sidebar primitives，並匯入便利陣列或個別 building blocks。',
  'sidebar.composition.description':
    'Sidebar 將結構與互動連結拆開。menu button 是 directive，可以套在 anchor 或 button 上。',
  'sidebar.demo.platform': '平台',
  'sidebar.demo.dashboard': '儀表板',
  'sidebar.demo.customers': '客戶',
  'sidebar.demo.notifications': '通知',
  'sidebar.demo.settings': '設定',
  'sidebar.demo.overview': '總覽',
  'sidebar.demo.reports': '報表',
  'sidebar.demo.accounts': '帳戶',
  'sidebar.demo.segments': '分群',
  'sidebar.demo.inbox': '收件匣',
  'sidebar.demo.rules': '規則',
  'sidebar.demo.teams': '團隊',
  'sidebar.demo.switchTeam': '切換團隊',
  'sidebar.demo.addTeam': '新增團隊',
  'sidebar.demo.projects': '專案',
  'sidebar.demo.designEngineering': 'Design Engineering',
  'sidebar.demo.salesMarketing': 'Sales & Marketing',
  'sidebar.demo.travel': 'Travel',
  'sidebar.demo.more': '更多',
  'sidebar.demo.projectActions': '專案操作',
  'sidebar.demo.viewProject': '查看專案',
  'sidebar.demo.shareProject': '分享專案',
  'sidebar.demo.deleteProject': '刪除專案',
  'sidebar.demo.accountMenu': '帳號選單',
  'sidebar.demo.upgradeToPro': '升級至 Pro',
  'sidebar.demo.account': '帳號',
  'sidebar.demo.billing': '帳務',
  'sidebar.demo.logOut': '登出',
  'sidebar.demo.toggle': '切換 sidebar',
  'sidebar.demo.iconMode': 'Icon 欄',
  'sidebar.demo.offcanvasMode': 'Offcanvas',
  'sidebar.demo.noneMode': '不可收合',
  'sidebar.api.description': 'Sidebar inputs 控制識別、收合策略、狀態與連結呈現。',
  'sidebar.api.id.description': '設定 trigger aria-controls 使用的 id。預設會產生穩定 id。',
  'sidebar.api.open.description':
    '控制展開狀態。支援 [(open)] 雙向綁定。當 collapsible 為 none 時會忽略關閉。',
  'sidebar.api.collapsible.description':
    '定義 closed 行為：none 保持開啟、offcanvas 收合到零寬度、icon 保留壓縮 icon 欄。',
  'sidebar.api.class.description': '合併到 sidebar 或 slot host element 的額外 class。',
  'sidebar.api.active.description':
    '將 sanringSidebarMenuButton 標記為目前頁面，並套用 active 樣式。',
  'sidebar.api.disabled.description':
    '停用 sanringSidebarMenuButton，阻止點擊啟用並加上 disabled 語意。',
  'sidebar.accessibility.description':
    'Sidebar 呈現的是持續存在的 layout 內容。它不會 trap focus、隱藏背景內容，也不會像 dialog 一樣運作。需要手機版 modal overlay 時，請搭配 Sheet 使用。',
  'sidebar.keyboard.description': '鍵盤行為跟套用 directive 的原生元素一致。',
  'sidebar.keyboard.tab': '依照文件順序移動到可 focus 的控制項與連結。',
  'sidebar.keyboard.enterSpace': '啟用 button。anchor 依照瀏覽器原生行為以 Enter 啟用。',
  'sidebar.stateModel.description':
    "open 描述 sidebar 是否展開。collapsible 控制 closed 的意思：'offcanvas' 會移除 layout 寬度，'icon' 會保留 icon 欄。外部 header button 應直接控制 [(open)]；sanringSidebarTrigger 主要給 sanring-sidebar 的子孫使用。",
} as const;
