export const navigationMenuTranslations = {
  'navigationMenu.description':
    '水平或垂直排列的連結集合，trigger 可展開內容面板，用於分組導覽。',
  'navigationMenu.examples.basic.description':
    '水平頂端導覽列，三個 trigger 各自展開面板：豐富的 Product mega-menu、純文字的 Resources 清單，以及帶說明文字的 Docs 清單。',
  'navigationMenu.usage.description':
    '在 sanring-navigation-menu 內包裹 sanring-navigation-menu-list，每個 item 可以是 trigger + content 組合，也可以只放一個 sanringNavigationMenuLink 作為直接連結。',
  'navigationMenu.installation.description':
    '用 CLI 加入這個元件，再匯入 SANRING_NAVIGATION_MENU_IMPORTS 取得完整 primitive set；需要更細的 imports 控制時，也可改用個別 primitive。',
  'navigationMenu.demo.viewport': '共用 Viewport',
  'navigationMenu.demo.submenu': '子選單',
  'navigationMenu.demo.vertical': '垂直方向',
  'navigationMenu.examples.viewport.description':
    '整組 trigger 共用同一個固定大小、置中對齊的面板，而不是像 Basic 範例那樣每個 trigger 各自一個大小不同的面板。',
  'navigationMenu.examples.submenu.description':
    '內容面板內的第二層 flyout。submenu content 使用 CDK overlay positioning，靠近視窗邊界時會自動 fallback。',
  'navigationMenu.examples.vertical.description':
    '用於 app shell 側欄或次層導覽的垂直導覽群組。',
  'navigationMenu.api.description': 'Navigation menu primitives 支援的 Inputs、Outputs 與 class。',
  'navigationMenu.api.orientation.description':
    '排列方向。vertical 會讓 item 撐滿寬度，而非水平置中排列。',
  'navigationMenu.api.value.description':
    '目前開啟 item 的 value，關閉時為 null。可用 [(value)] 雙向綁定——適合用來從外層模板驅動共用的 sanring-navigation-menu-viewport。',
  'navigationMenu.api.delayDuration.description':
    '保留給未來的 hover-intent 延遲使用。目前 trigger 只在點擊或 Enter / Space / ArrowDown / ArrowUp 時開啟，尚未支援 hover。',
  'navigationMenu.api.skipDelayDuration.description':
    '保留給未來「在多個 trigger 間直接移動」的 hover-intent 延遲，目前尚未生效。',
  'navigationMenu.api.ariaLabel.description':
    '根層 navigation landmark 的無障礙名稱（aria-label / aria-labelledby）。',
  'navigationMenu.api.itemValue.description':
    '識別這個 item，讓根層 value 能對應到它。預設為自動產生的 id，只有在自行綁定 [(value)] 時才需要指定。',
  'navigationMenu.api.itemDisabled.description':
    '停用這個 item：它的 trigger 不再回應點擊、鍵盤操作與 toggle()。',
  'navigationMenu.api.contentId.description':
    '套用到內容面板、並被 trigger 的 aria-controls 參照的 id，預設為自動產生。',
  'navigationMenu.api.subOpen.description':
    '控制 submenu flyout 是否開啟。trigger 會在 hover、click、Enter、Space 或 ArrowRight 時開啟。',
  'navigationMenu.api.subTriggerDisabled.description':
    '停用 submenu trigger，並將它從鍵盤導覽順序中移除。',
  'navigationMenu.api.linkActive.description':
    '將連結標記為目前頁面——設定 aria-current="page" 與 data-active 樣式掛勾。',
  'navigationMenu.api.linkDisabled.description': '停用連結：不再回應點擊，並從 tab 順序中移除。',
  'navigationMenu.api.linkTarget.description':
    '標準 anchor target。target="_blank" 會自動加上 rel="noopener noreferrer"。',
  'navigationMenu.api.separatorVertical.description':
    '將分隔線改為垂直線，而非預設的水平線。',
  'navigationMenu.api.class.description':
    '與對應 navigation menu primitive 樣式合併的額外 class。',
  'navigationMenu.accessibility.description':
    '根層有 role="navigation"。list 有 role="list"，每個 item 有 role="listitem"。trigger 具備 aria-haspopup、aria-expanded 與指向內容面板的 aria-controls，面板本身有 role="region"。submenu 使用 role="menu"/"menuitem"，並透過 CDK overlay positioning 處理碰撞 fallback。作用中的連結會有 aria-current="page"。點擊根層以外的任何地方都會關閉開啟中的面板；點在 submenu flyout 內不算「外部」，因為它仍屬於這套選單系統。Navigation menu 不會做 focus trap。',
  'navigationMenu.keyboard.description': 'Trigger 的鍵盤操作遵循 WAI-ARIA disclosure 模式。',
  'navigationMenu.keyboard.toggle': '切換聚焦 trigger 的內容面板開關。',
  'navigationMenu.keyboard.open': '開啟聚焦 trigger 的內容面板。',
  'navigationMenu.keyboard.subOpen': '開啟聚焦中的 submenu trigger。',
  'navigationMenu.keyboard.subClose': '關閉聚焦中的 submenu，並把焦點送回 submenu trigger。',
  'navigationMenu.keyboard.close': '關閉開啟中的內容面板，焦點留在 trigger 上。',
  'navigationMenu.stateModel.description':
    '單一資料來源：NavigationMenuComponent.value 保存目前開啟 item 的 value，關閉時為 null。每個 NavigationMenuItemComponent 會把自己的 value 與根層 value 比對來算出 isOpen，因此同時只會有一個 item 開啟。根層有一個 document 層級的 click listener，只要點擊落在整個元件之外就會把 value 設回 null（submenu flyout 除外，因為它是 render 進 CDK overlay layer）。submenu open state 則由 NavigationMenuSubComponent 自己管理，因為第二層 flyout 是作用在父面板內的局部狀態。delayDuration / skipDelayDuration 仍保留給頂層 trigger hover-intent；submenu hover 目前使用短暫 close grace period。Typeahead 尚未實作。',
} as const;
