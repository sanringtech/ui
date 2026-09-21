export const registryTranslations = {
  'registry.page.description':
    '建立並 host 你自己的元件 registry，讓團隊或第三方套件庫能以跟 Sanring UI 完全相同的安裝體驗來分發 Angular 元件。',
  'registry.overview.title': '概覽',
  'registry.overview.body':
    'Registry 是一個靜態 JSON 檔（registry.json），用來描述一組元件的原始檔案路徑、元件相依關係、共用工具程式，以及執行期所需的 npm 套件。CLI 讀取這個檔案的方式跟讀取官方 Sanring registry 完全相同——任何能提供正確 schema 的 URL、本地路徑，或 github:owner/repo source 都可以直接當 registry 使用。',
  'registry.schema.title': 'registry.json schema',
  'registry.schema.body':
    '根物件包含 components（可安裝元件）、shared（共用工具），以及可選的 blocks 陣列（頁面級模板，欄位形狀與 components 相同）。每個元件或 block 條目需要 name、files 清單（相對 components/ 或 blocks/ 的路徑）、可選的 componentDeps 與 sharedDeps，以及 peerDependencies map。',
  'registry.api.title': 'API 參考',
  'registry.api.body':
    'registry.json 的欄位定義。必要欄位已標出。第三方 registry 可以省略 blocks 與 groups。',
  'registry.api.root.heading': '根物件',
  'registry.api.item.heading': 'components[] / blocks[] 條目',
  'registry.api.sharedItem.heading': 'shared[] 條目',
  'registry.api.group.heading': 'groups[] 條目',
  'registry.api.migration.heading': 'migrations[] 條目',
  'registry.api.root.name': '必要。list 與 search 顯示的 registry 名稱。',
  'registry.api.root.shared': '必要。元件與 block 可能依賴的共用工具。',
  'registry.api.root.components': '必要。可安裝元件。檔案放在 components/ 底下。',
  'registry.api.root.blocks':
    '選用。頁面級模板，欄位形狀與 components 相同。檔案放在 blocks/ 底下。名稱不可與 component 衝突。',
  'registry.api.root.groups':
    '選用。側欄分組。省略時 CLI 會合成一個 Components 群組。',
  'registry.api.item.name': '必要。唯一安裝名稱。用 sanring add <name> 或 sanring add block/<name>。',
  'registry.api.item.description': '必要。list、search、info 顯示的一行摘要。',
  'registry.api.item.files':
    '必要。相對 components/<name>/ 或 blocks/<name>/ 的路徑，不是相對 registry 根目錄。',
  'registry.api.item.componentDeps': '這個 registry 裡必須先安裝的其他元件名稱。',
  'registry.api.item.sharedDeps': '這個條目會 import 的 shared[] 名稱。',
  'registry.api.item.peerDependencies': '安裝這個條目時，CLI 應一併安裝的 npm 套件。',
  'registry.api.item.since': '這個條目第一次隨 CLI 發布的版本。',
  'registry.api.item.tags': '搜尋用標籤。安裝時不是必要欄位。',
  'registry.api.item.migrations': '破壞性變更指南，由舊到新。sanring migrate 會顯示。',
  'registry.api.shared.name': '必要。sharedDeps 參照的名稱。',
  'registry.api.shared.description': '必要。共用檔的一行摘要。',
  'registry.api.shared.file': '必要。從 registry 根目錄算起的路徑，通常是 shared/<file>.ts。',
  'registry.api.shared.peerDependencies': '這個共用檔需要的 npm 套件。會併入安裝集合。',
  'registry.api.group.id': '必要。穩定的群組 id，給 sanring search --group 使用。',
  'registry.api.group.title': '必要。顯示標題。',
  'registry.api.group.description': '選用。群組的較長說明。',
  'registry.api.group.components': '必要。屬於這個群組的元件或 block 名稱。',
  'registry.api.migration.fromVersion': '必要。已安裝版本不大於此值的使用者需要這份遷移。',
  'registry.api.migration.breaking': '必要。這次變更是否破壞相容。',
  'registry.api.migration.steps': '必要。更新後要做的人類可讀步驟。',
  'registry.github.title': 'GitHub registries',
  'registry.github.body':
    '若 GitHub repo 根目錄有 registry.json，CLI 可直接用 github:owner/repo 當 source，會展開成 main 分支的 raw 檔；加上 #ref 或 @ref 可以釘選分支、tag 或 commit。',
  'registry.structure.title': '專案目錄結構',
  'registry.structure.body':
    '按照以下結構組織原始檔案，讓 sanring build 能自動掃描。每個元件放在 components/ 下各自的子目錄；共用工具程式則平鋪在 shared/ 下。掃描器會解析檔案之間的 import，自動推導出 componentDeps、sharedDeps 和 peerDependencies——通常不需要手動填寫。',
  'registry.build.title': 'sanring build',
  'registry.build.body':
    '在你的元件庫根目錄執行 sanring build。它會掃描原始碼目錄、解析跨元件的 import、從 package.json 收集 peer dependencies，並將結果寫入 registry.json。加上 --dry-run 可以在不寫入任何檔案的情況下預覽輸出結果。',
  'registry.hosting.title': 'Hosting',
  'registry.hosting.body':
    '透過任何靜態 hosting 服務（GitHub Pages、CDN、公司內部 artifact server）以 HTTP 提供生成的 registry.json。本地開發時可以直接指向檔案路徑而非 URL——CLI 兩種格式都接受。若檔案已經放在公開 GitHub repo 根目錄，可以略過 hosting，改用 github: source。',
  'registry.consuming.title': '在專案中使用',
  'registry.consuming.body':
    '在 sanring.config.json 的 registries 欄位中，以你選定的別名（alias）登記你的 registry URL 或 github:owner/repo source。之後在 CLI 的任何指令（add、remove、info、diff、update、search、list）中，只要在元件名稱前加上別名前綴即可。別名讓不同 registry 的元件在你的專案安裝紀錄中不會混淆。',
} as const;
