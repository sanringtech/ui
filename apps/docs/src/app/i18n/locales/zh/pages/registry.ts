export const registryTranslations = {
  'registry.page.description':
    '建立並 host 你自己的元件 registry，讓團隊或第三方套件庫能以跟 Sanring UI 完全相同的安裝體驗來分發 Angular 元件。',
  'registry.overview.title': '概覽',
  'registry.overview.body':
    'Registry 是一個靜態 JSON 檔（registry.json），用來描述一組元件的原始檔案路徑、元件相依關係、共用工具程式，以及執行期所需的 npm 套件。CLI 讀取這個檔案的方式跟讀取官方 Sanring registry 完全相同——任何能提供正確 schema 的 URL 或本地路徑都可以直接當 registry 使用。',
  'registry.schema.title': 'registry.json schema',
  'registry.schema.body':
    '根物件有兩個陣列：components（可安裝的元件）和 shared（元件可能相依的共用工具）。每筆元件條目需要 name、files（相對於 registry 根目錄的路徑清單）、選用的 componentDeps 和 sharedDeps（同一份 registry 中其他條目的名稱），以及 peerDependencies（元件執行期需要的 npm 套件對應表）。',
  'registry.structure.title': '專案目錄結構',
  'registry.structure.body':
    '按照以下結構組織原始檔案，讓 sanring build 能自動掃描。每個元件放在 components/ 下各自的子目錄；共用工具程式則平鋪在 shared/ 下。掃描器會解析檔案之間的 import，自動推導出 componentDeps、sharedDeps 和 peerDependencies——通常不需要手動填寫。',
  'registry.build.title': 'sanring build',
  'registry.build.body':
    '在你的元件庫根目錄執行 sanring build。它會掃描原始碼目錄、解析跨元件的 import、從 package.json 收集 peer dependencies，並將結果寫入 registry.json。加上 --dry-run 可以在不寫入任何檔案的情況下預覽輸出結果。',
  'registry.hosting.title': 'Hosting',
  'registry.hosting.body':
    '透過任何靜態 hosting 服務（GitHub Pages、CDN、公司內部 artifact server）以 HTTP 提供生成的 registry.json。本地開發時可以直接指向檔案路徑而非 URL——CLI 兩種格式都接受。',
  'registry.consuming.title': '在專案中使用',
  'registry.consuming.body':
    '在 sanring.config.json 的 registries 欄位中，以你選定的別名（alias）登記你的 registry URL。之後在 CLI 的任何指令（add、remove、info、diff、update、search、list）中，只要在元件名稱前加上別名前綴即可。別名讓不同 registry 的元件在你的專案安裝紀錄中不會混淆。',
} as const;
