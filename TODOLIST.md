# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

只列**尚未完成**的項目。做完的項目——含查證過程、決策理由、驗證方式——記在 [DEVLOG.md](DEVLOG.md),這裡不重複贅述,避免待辦清單被歷史紀錄淹沒;查證後確認「其實不是缺口」的結論也在 DEVLOG.md 備查,避免下次重新調查一次。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。項目編號沿用歷史待辦清單的順序,做完的項目移除後編號會留空,不重新排序。

---

## P27 — CLI command UX / robustness 補強

針對 `packages/cli/src/commands/*` 逐一掃描後列出的待補項目。現況不是缺少核心 command，而是部分 command 的責任邊界、失敗狀態與 CI/agent 可讀性還可以再收斂。

### 整體流程

- [ ] 重新定義 CLI 對外主流程並同步 help/README/docs：`init`/`add` 是安裝流程，`info`/`list`/`search` 是探索流程，`diff`/`migrate`/`update`/`doctor` 是維護流程，`build` 是 registry 發布流程，`mcp` 是 agent 入口；npm README 只展示主流程，完整 flags 移到 docs
- [ ] 補 `--json` 給 CI/agent 常用 command：至少 `doctor`、`diff`、`build --dry-run/--check`、`list --outdated`，避免只能解析人類可讀輸出
- [ ] 把 registry 完整性檢查抽成共用工具：schema、componentDeps/sharedDeps dangling reference、registry file 是否存在/可 fetch、peer dependency version 是否可解析，供 `doctor`、`build`、CI 與 MCP 重用
- [ ] 將 `fetchRegistry`/`fetchFile` 底層錯誤改成 throw typed error，由 command 層決定怎麼印訊息與 exit；目前 `registry.ts` 內部 `die()` 直接 `process.exit(1)`，對測試與 MCP server reuse 都不理想

### 各 command 弱點

- [ ] `init`：重跑時目前只提示 `sanring.config.json already exists`，但仍會直接覆寫 config；補明確確認或 `--force` 語意，並確保 theme/dependency 失敗時不留下半初始化狀態
- [ ] `init`：base dependency install 失敗只 warning，後續仍顯示 Done；調整 summary，把「已寫檔但依賴未安裝」列成 warning 並給可複製的修復命令
- [ ] `add`：`--diff` 與 `diff` 的比較邏輯重疊，且目前逐檔 await fetch；抽成共用 diff engine，讓 `add --diff`、`diff`、`update` 使用一致分類與 bounded concurrency
- [ ] `add`：`--dry-run` 主要看 registry metadata，沒有驗證 registry file 真的可 fetch；補 `--check` 或 dry-run fetch validation，避免實際安裝時才發現缺檔
- [ ] `add`：peer dependency install 失敗後檔案已寫入且 config 仍可能更新；補 transaction-like summary，或把「source files written / peer deps failed」狀態明確記錄並引導 `doctor`
- [ ] `remove`：刪 component 目錄時會整個 `rm -r`，若使用者在該 component 目錄加入自有檔案也會被刪；改成只刪 registry-tracked files，或在刪除前列出 extra files 並要求確認
- [ ] `remove`：目前只 prune `installedHashes`，沒有同步移除 `installedVersions`；補清理邏輯，尤其要涵蓋 `alias:component` key
- [ ] `remove`：補 `--dry-run`，先列出會刪的 component files、會保留的 shared files、被 dependents 擋下的項目
- [ ] `diff`：指定未知 component 時只印錯誤但最後可能 success exit；改成 unknown target 一律 exit 1，`--exit-code` 只控制「有差異」的 exit behavior
- [ ] `diff`：補 summary-only / json mode，避免大型 component diff 在 CI 或 agent output 裡過度冗長
- [ ] `update`：指定未知或未安裝 component 時目前偏向 skip，需統一 exit code 規則；未知 target 應失敗，未安裝 target 可提示 `sanring add`
- [ ] `update`：和 `diff` 共用 target/job 建立邏輯，避免 theme/shared/component file 集合規則日後分歧
- [ ] `doctor`：補 registry integrity checks、peer dependency missing/outdated checks、`defaultRegistry` 是否存在於 `registries`、legacy `installedVersions` key 是否需要 migration
- [ ] `doctor`：補 `--fix` 或至少 `--json`；`--fix` 可先只處理安全項目，例如 backfill missing hashes、清理不存在檔案的 hash、migrate installedVersions key
- [ ] `build`：補 `--check`，只掃描/驗證/檢查 peer deps/檢查輸出一致性，不寫檔，給 CI 使用
- [ ] `build`：目前輸出 shared description 為空且不支援 groups metadata；評估加入可選 manifest，讓第三方 registry 能補 description、groups、since、migrations 等人工 metadata
- [ ] `build`：確認 nested files / 同名 basename 是否會碰撞；目前輸出路徑用 `basename(file)`，若 component 內有子目錄或同名檔案會有風險
- [ ] `info`：component 模式未支援 `alias:component` 語法，與 `add` 的 multi-registry 使用方式不一致；補 parse 或明確禁止並提示 `--registry`
- [ ] `info`：`getCliVersion` 與 MCP 內部重複實作，改用 `utils.getCliVersion()`
- [ ] `list`：`--registry` help 寫 `custom registry URL`，但實作可接 local path；統一為 `custom registry (URL or local path)`
- [ ] `list --installed`：目前靠 component 目錄掃描，不看 `installedVersions` alias key；評估是否以 config 為主、目錄為輔，讓 multi-registry 狀態更準
- [ ] `search`：目前只有 substring ranking；元件變多後補 fuzzy/token ranking、category/tag filter 與 `--json`
- [ ] `migrate`：目前用 `installedVersions` key 直接查 registry component name，`alias:component` 會被當成不存在；先 parse alias key，再對 bare component name 查 registry
- [ ] `migrate`：`noData` result 型別目前未實際產生；補 legacy/no baseline 情境或移除 dead branch
- [ ] `mcp`：registry cache 沒有 refresh/invalidate；長時間 agent session 可能看不到 registry 更新，補 refresh tool 或 TTL
- [ ] `mcp`：目前 agent 只能 list/search/info/plan/add，缺 `diff`、`doctor`、`migrate`/`update` 的安全入口；補 read-only 檢查工具，再評估是否開放更新工具

---

## P28 — P14 CVA 重構未套用到 `packages/ui`

- [ ] `packages/ui` 的 9 個表單元件（`checkbox`/`switch`/`radio-group`/`slider`/`otp-input`/`date-picker`/`calendar`/`file-upload`/`combobox`）補做 P14 第二批重構：改成 `extends SanringCvaBase`，跟 `registry/` 對齊，徹底消除架構分岔

**現況**：P14 第二批重構（`a9cb0fd`）只實際套用在 `registry/shared/cva-base.ts` + `registry/components/*`，`packages/ui` 的對應 9 個元件從未跟進，兩邊架構自此分岔——`packages/ui` 還是舊的手刻 `XxxFieldControlAdapter`。**根因（驗證缺口）已解決**：新增 `packages/cli/scripts/check-registry-parity.mjs`（已掛進 `.github/workflows/registry-sync-check.yml`），靜態比對 `packages/ui` 與 `registry/` 每個同名元件檔案的 `input()`/`output()`/`model()` 宣告 + a11y 相關 attribute binding 表達式（`aria-*`/`role`/`disabled`/`tabindex`/`id`）。跑起來後除了 `/audit-component` 已經抓到的 `switch`/`checkbox`/`radio-group` 三筆,又額外挖出四筆獨立的 registry-only regression 並修正：`button`（本次 session 自己 cherry-pick 時漏同步 `role="button"` 修復，外加 `rounded-lg`/硬編碼 destructive 色碼兩個更早的 design token 漂移）、`context-menu-sub-trigger`（漏 `aria-disabled`）、`resizable-handle` + `resizable-group`（整組 `aria-valuenow`/`min`/`max` keyboard-splitter 支援完全沒同步過去）。目前這個腳本是純靜態 regex 比對,不是真的執行 registry 程式碼(嘗試讓 `packages/ui` 的 TestBed 直接 import registry 元件失敗了——Angular 的 build 工具鏈假設單一 project rootDir,跨 project import 會讓 `extends SanringCvaBase` 的型別解析失敗,細節見下方腳本檔頭註解)。剩餘工作(改用 `SanringCvaBase`)是解決架構分岔本身,優先度較低,兩邊行為已經有腳本守著。

---

## P26 — `/audit-component` 全元件稽核佇列（52 個）

依 `/audit-component` skill 的 Tier 判定排序：先 Tier 1（純顯示型），再 Tier 2（互動型），再 Tier 3（有 CDK Overlay / 複雜鍵盤）。每個元件稽核完成後移除該行，缺陷修正記入 DEVLOG.md。

### Tier 1 — Low-interaction primitive（純顯示型，無 Overlay）

- [x] `divider` — class merging + ariaLabel 已補，spec 5/5 通過
- [x] `skeleton` — registry CSS 對齊設計 token，spec 補 class merging test（3/3 通過）
- [x] `spinner` — 零缺陷，spec 3/3 通過
- [x] `progress` — registry 補 `ariaValueText` input + template binding，spec 補 class/barClass merging test（5/5 通過）。**2026-08-14 補漏**：`aria-valuenow` 原本沒 clamp（`value` 超出 `max` 時會超出 `aria-valuemax`），已改綁 clamped 值，補齊 test 斷言
- [x] `badge` — 零缺陷，spec 3/3 通過
- [x] `tag` — 關閉按鈕補 focus-visible ring（WCAG 2.4.7），spec 補 class merging + remove output test（4/4 通過）
- [x] `aspect-ratio` — 零缺陷，spec 4/4 通過
- [x] `card` — registry 補 design token（rounded-xl → rounded-[var(--sanring-radius-lg)]），spec 3/3 通過
- [x] `avatar` — registry AvatarImageDirective 補 afterNextRender SSR 防護，spec 3/3 通過
- [x] `label` — 零缺陷，spec 2/2 通過
- [x] `link` — 零缺陷，spec 3/3 通過
- [x] `alert` — registry 補 design token（rounded-lg + destructive 紅色 → CSS var），spec 3/3 通過
- [x] `timeline` — 零缺陷，spec 5/5 通過
- [x] `breadcrumb` — 零缺陷，spec 4/4 通過

### Tier 2 — Interactive / composite（有互動，無 Overlay）

- [x] `button` — `a[sanringBtn]` 無 `href` 時補 `role="button"`，spec 補 2 個 host component 測試（6/6 通過）
- [x] `toggle` — 零缺陷（工程面）；registry 端 `rounded-md` 補齊 `--sanring-radius` design token 漂移，spec 補 class merging test（4/4 通過）。Tier 1 by design（單顆 toggle button，無方向鍵語意）
- [x] `input` — 零缺陷，`id`/`aria-invalid` 設計符合既有 `sanring-field` 整合模式，spec 補 class merging + aria-invalid 狀態 test（6/6 通過）。Tier 1 by design
- [x] `textarea` — 零缺陷，設計與 `input` 一致，spec 補 aria-invalid 狀態 test（4/4 通過）。Tier 1 by design
- [x] `switch` — **高嚴重度**：P14 的 `SanringCvaBase` 重構（`a9cb0fd`）只套用在 `registry/`，過程中漏掉先前已修好的 `ariaLabel`/`ariaLabelledBy`/`checkedChange`，導致 `sanring add switch` 裝出來的版本 regression 回無障礙缺陷。已補回並比對其餘 8 個同批重構元件（checkbox/radio/slider/otp-input/file-upload/combobox/calendar/date-picker）確認皆無此問題，只有 switch 受影響。spec 補 class merging test（284/284 通過）
- [x] `checkbox` — 同批 P14 registry 重構 drift：`aria-required` 改綁純 `required()` input，漏掉 `Validators.required` 偵測（`packages/ui` 用 `fieldRequired` 才對），已修正。spec 補 class merging test（285/285 通過）
- [x] `radio` — 第三筆同類 P14 registry drift：`aria-required` 又是漏掉 `fieldRequired`（只看 `required()`），已修正。Tier 2（方向鍵導覽/roving tabindex/disabled 跳過），consumer usage 只有自己 demo 頁，Draft 狀態待評估是否投資。spec 補 class merging test（286/286 通過）
- [x] `slider` — 零缺陷，逐行核對 `registry` vs `packages/ui` 除 P14 機械性搬移外完全一致，無 drift。Tier 2（方向鍵/PageUp-Down/Home-End/拖曳），consumer usage 只有自己 demo 頁。spec 補 class merging test（287/287 通過）
- [x] `scroll-area` — registry 與 packages/ui 皆缺 `tabindex`：純文字內容超出容器高度時,鍵盤使用者完全無法捲動(WCAG 2.1.1,對應 axe-core `scrollable-region-focusable` 規則;jsdom 無真實 layout,現有 spec 結構性偵測不到),已補 `tabindex="0"` + `focus-visible` ring(沿用 `pagination-item` 既有的 ring recipe)。spec 補 render + class merging + tabindex test（5/5 通過）
- [x] `field` — `error-message`/`label` 的錯誤態文字硬編碼 `text-red-500`（registry 與 packages/ui 皆是,非單邊 drift）,已改用既有的 `--sanring-error-40` design token；`SanringFieldComponent` 本身缺 `class` input,是 field 目錄唯一沒有 class merging 支援的檔案,已補上。順手發現同一批 `input`/`textarea` 的 `errorState` 邊框/ring 也硬編碼 `border-red-500`/`ring-red-500`,一併修正為 `--sanring-error-50`/`--sanring-error-40`（這兩個先前稽核判定「零缺陷」,漏掉了設計 token 這個面向）。spec 補 render + class merging + `aria-describedby` 端對端 wiring test（8/8 通過）。**已修復(2026-08-13)**：`badge`/`checkbox`/`switch`/`toast`/`stepper`/`file-upload`/`otp-input` 的 `red-*` 硬編碼色碼,查證 registry 與 packages/ui 兩邊皆有(非單邊 drift),已全部換成對應 design token：文字色一律 `--sanring-error-40`,邊框/實心填色一律 `--sanring-error-50`(hover 用 `--sanring-error-60`),checkbox/input/textarea 這類「邊框+focus ring」組合維持 `border-error-50 + ring-error-40`。順手發現 `toast` 的 `TYPE_ICON_CLASS` 其實四色都硬編碼(`emerald-500`/`yellow-500`/`blue-400`,不只 error 用的 `red-500`),一併換成 `--sanring-success-40`/`--sanring-warn-40`/`--sanring-info-40`。`stepper.component.spec.ts` 有一處斷言直接查 `.border-red-500` class,已同步改成新的 class 選擇器。全部 7 個元件的相關 spec(70 tests)、`pnpm lint`、`check-registry-parity.mjs` 都跑過確認通過。**另外發現(已修復)**：`pnpm lint` 曾在 `main` 分支本身就是紅的——`registry/components/file-upload/file-upload.component.ts` 殘留 2 個死 import(`computed`、`SanringFieldControlAdapter`,該檔案改用自己的 `FileUploadFieldControlAdapter`,兩個都是真的沒用到)、`registry/components/otp-input/otp-input.component.ts` 殘留 1 個死 import(`inject`)。三處都是單純刪掉沒用到的 import,不影響行為;`pnpm lint` 現在重新綠燈,`check-registry-parity.mjs` 也重跑確認過
- [x] `pagination` — **高嚴重度**：`page-size-select.component.ts` 的 select trigger 按鈕完全沒有 accessible name(registry 與 packages/ui 皆是)。原因是同時對同一個 `<button sanringSelectTrigger>` element 設了兩個會衝突的 `aria-label` 來源：component 自己的 template 用 `[attr.aria-label]="ariaLabel()"` 直接綁在 raw 屬性上,但 `SelectTriggerDirective` 自己也有一個 `ariaLabel` input 對應同一個 host binding(預設 `undefined`)——後者蓋掉前者,導致這個按鈕的 `aria-label` 屬性從未真正出現在 DOM 上。加上 `role="combobox"` 的 accessible-name 算法不採計 visible text content(跟 `role="button"` 不同),所以即使按鈕文字顯示著頁碼數字,螢幕閱讀器還是完全讀不到這個控制項是什麼。已修正:改成 `[ariaLabel]="ariaLabel()"`,直接綁到 directive 自己暴露的 input。其餘元件(`pagination`/`pagination-list`/`pagination-item`/`pagination-nav`/`disableable-nav`/`paginator`)零缺陷,`role="navigation"`、`aria-current="page"`、disabled 狀態的 anchor/button 雙路徑處理(`DisableableNavDirective` 對 `<a>` 用 `tabindex="-1"` + 攔截 click,對 `<button>` 用原生 `disabled`)設計完整,無 design token drift。Spec 補齊：`paginator.component.spec.ts` 補 render/class merging/`role="navigation"` landmark/anchor-disabled 行為 4 個 test;新增 `page-size-select.component.spec.ts`(先前零覆蓋,也是這次挖出 aria-label bug 的地方),含 render/class merging/預設選項/雙向綁定更新/axe 共 5 個 test。全部 16 個 test、`pnpm lint`、`check-registry-parity.mjs` 通過。
- [x] `collapsible` — **高嚴重度**：`registry/components/collapsible/index.ts` 缺少 `SANRING_COLLAPSIBLE_IMPORTS` export(`packages/ui` 有,registry 沒有,單邊 drift,`check-registry-parity.mjs` 抓不到這種 export-shape 落差,它只比對 input/output/model 宣告跟 a11y attribute binding)。這個匯出正是 docs 自己的安裝範例教使用者要 import 的東西(`collapsible-page.component.ts`、`sidebar.docs.ts` 都直接用),代表任何人跑 `sanring add collapsible` 後照著文件範例寫都會編譯失敗。已補齊,兩邊現在逐字相同。元件本身(`CollapsibleComponent`/`CollapsibibleTriggerDirective`/`CollapsibleContentDirective`)工程品質很高:WAI-ARIA disclosure pattern 標準實作(`aria-expanded`/`aria-controls`/`aria-labelledby` 三向連結)、non-button trigger 補齊 `role="button"` + `tabindex="0"` + Enter/Space handler,disabled 狀態同時處理 native button 與非 button 兩條路徑,零缺陷。原始碼裡還留著先前一次生產環境 bug 的修復註解(移除 `role="region"` 因為蓋掉 sidebar submenu 的 `role="list"`),顯示這個元件已經被 `sidebar` 實際組合使用過並修過真的問題。spec 原本就很完整(4 tests,涵蓋 open/close cascade、disabled 攔截、非 button trigger 的 role/tabindex/keyboard),補 render + class merging 共 6 tests 全數通過。
- [x] `accordion` — 3 個獨立缺陷。**(1) 高嚴重度**：`registry/components/accordion/index.ts` 缺 `SANRING_ACCORDION_IMPORTS`(跟 `collapsible` 同一種 drift)。發現後順手寫一次性掃描比對全部元件的 `packages/ui` vs `registry` index.ts,又抓到 9 個同款 drift:`alert-dialog`(缺最多,連帶漏了整段 `export { Dialog... } from '../dialog'` re-export)、`alert`、`avatar`、`card`、`dialog`、`radio`、`scroll-area`(這個是本 session 稍早 `/audit-component scroll-area` 時漏查的,當時只 diff 了 component/directive 檔案沒 diff index.ts)、`tabs`、`toast`、`tooltip`,全部一次修正,補完的 56 個相關 test + `pnpm lint` + `check-registry-parity.mjs` + `check-registry-sync.mjs` 都過。`check-registry-parity.mjs` 目前只比對 input/output/model 宣告跟 a11y attribute binding,不比對 export 形狀,抓不到這類 drift——如果之後還想再挖,這是明確的腳本盲區。**(2) 中高嚴重度、已避開**：`accordion.component.ts` 用反射戳 `@angular/aria` `AccordionGroup` 的私有欄位(`_pattern.inputs.multiExpandable`、`_pattern.expansionBehavior.inputs.multiExpandable`)來設定 `multi` 的預設值,一開始以為是多餘的 hack 想用 `hostDirectives.inputs` alias 取代,結果讓所有沒寫 `multi` 的 accordion 預設從單開變多開(`@angular/aria` 的 `AccordionGroup.multiExpandable` 自己預設 `true`,跟 sanring 想要的 `false` 相反,而 hostDirectives alias 沒有機制覆寫底層預設值)。被既有 spec 的 `keeps only one item open by default` 當場抓到,已改回原本的寫法並補上完整原因註解(而不是留一個看起來可以刪掉、其實會 regression 的謎樣 hack)。**(3)**：`accordion-trigger.component.ts` 的展開箭頭圖示用了 `text-muted-foreground`——這不是 `var(--sanring-*)` 語法,是裸的 shadcn 慣例 class name,專案的 Tailwind 設定裡完全沒有定義,箭頭圖示色一直沒套到樣式。已改成專案內已定義好的 `text-[var(--sanring-muted)]`。其餘工程品質很高:建立在 Angular 官方 `@angular/aria` accordion primitives 上(不是手刻鍵盤邏輯),`aria-expanded`/`aria-controls`/`aria-labelledby` 三向連結正確,方向鍵導覽/Enter/Space/disabled 跳過都是函式庫內建。既有 spec 非常完整(11 tests,涵蓋結構、展開行為、multi 模式、輸入輸出、programmatic API、樣式),`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 全過。

**已修復(2026-08-13)**：全庫 grep 裸 shadcn class name 時,除了 `checkbox.styles.ts`、`calendar-day.directive.ts`、`date-picker-cell.directive.ts`,又多抓到 `checkbox.component.ts`(`border-primary`)、`radio-item.component.ts`(`border-primary`/`text-primary`)共 5 個檔案。根因:`--color-primary`/`--color-primary-foreground` 只定義在 `apps/docs/src/styles.css`(docs 站自己為了 light/dark 切換另外補的),`registry/shared/theme.css`(真正隨 `sanring add` 裝到消費者專案的那份)完全沒有這兩個變數——docs 站預覽看起來正常,但任何人真的用 CLI 裝 `checkbox`/`radio`/`calendar`/`date-picker` 到自己專案,選中狀態會完全沒套到顏色。已全部改用已定義好的 `--sanring-primary`/`--sanring-primary-fg` token(兩邊 registry + packages/ui 都修),`bg-primary/20` 這類透明度修飾符改用專案既有的 `color-mix()` 慣例(跟 `alert`/`file-upload` 一致)而非 Tailwind 對 arbitrary value 的 `/NN` 語法。24 個相關 test(checkbox/radio/calendar/date-picker)、`pnpm lint`、`check-registry-parity.mjs`、`check-registry-sync.mjs` 全過。
- [x] `tabs` — 建立在 `@angular/aria/tabs` 上,同一批 P14 commit 裡 registry 出現三處落差(跟 accordion 那筆一樣,是既有 drift,不是這次改動造成的)。**(1)** `tabs-content.component.ts` 是結構性差異,不只是樣式:`packages/ui` 用「外層 host `display:contents` + 內層 `<div ngTabPanel>` 真正的 panel」,`registry` 改成把 `NgTabPanel` 直接當 hostDirective 掛在 `sanring-tabs-content` 自己的 host 上(省掉一層 wrapper div),但也因此漏掉了 `value` 的本地 `input.required<string>()` 宣告(純靠 hostDirectives alias 轉發,`check-registry-parity.mjs` 目前的偵測方式沒抓到這個差異)。因為只有 `packages/ui` 這份有完整 spec 驗證,選擇讓 registry 跟 packages/ui 對齊(還原 wrapper div 寫法),而不是反過來把可能沒驗證過的簡化版推廣出去。**(2)(3)** `tabs-list.component.ts` 的 `rounded-lg`、`tabs-trigger.component.ts` 的 `rounded-md`,兩處都是 registry 端漏套 `--sanring-radius`/`--sanring-radius-sm` token(跟本 session 前面好幾筆 design token drift 同一類)。`tabs-list.component.ts` 裡解釋 orientation 需要雙處手動同步的註解也補回 registry(先前只有 packages/ui 有)。工程品質本身很高:方向鍵導覽、`aria-selected`/`aria-controls`/`aria-labelledby` 都是函式庫內建且測試涵蓋。spec 原本只有 3 個 test(render 隱含、a11y 連結、click 切換),完全沒有 class merging 跟鍵盤導覽測試——這對一個「核心互動就是方向鍵」的元件是明顯缺口。已補 render/class merging/方向鍵導覽(含 `softDisabled` 預設 `true`:disabled tab 仍會被 focus 到但不會被選取,這個非直覺行為現在有測試釘住)共 3 個 test,現在 6 個全過。`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 均過。
- [x] `stepper` — 建立在 `@angular/cdk/stepper`(`CdkStepper`/`CdkStep`/`CdkStepHeader`/`CdkStepLabel`)上,`role="tablist"/"tab"/"tabpanel"` 語意、roving tabindex、方向鍵/Home/End/Enter 導覽都是 CDK 內建。registry 兩處獨立 drift(跟本 session 稽核的其他元件無關,是既有問題):**(1)** `step-header.component.ts` 的 focus ring 用 `--sanring-ring`,這個 token 整個專案沒有定義過(跟先前 `--sanring-muted-foreground` 同一類「幽靈 token」),已改回已定義的 `--sanring-border-strong`。**(2)** `stepper.type.ts` 的 `StepState` 型別在 registry 端漏了 `| (string & {})` 這個 union member——這是刻意保留「已知字面量有 autocomplete、但仍接受任意字串」的 TS 慣用手法,給 `StepComponent.customState` 用;registry 版本是封閉聯集,代表任何人真的用 CLI 裝 `stepper` 後想傳自訂 state 字串會直接編譯錯誤,packages/ui(npm 套件版)卻明確支援。已補回。既有 spec 是目前稽核過最完整的一份(11 tests,涵蓋渲染/點擊選取/next-previous 指令/完整鍵盤導覽/linear+stepControl 阻擋/editable/completed-error 渲染/vertical orientation),只補 render + class merging 共 2 個 test,現在 13 個全過。`pnpm lint`/`check-registry-parity.mjs` 皆過。**順手發現**:`otp-input.component.ts` 也用了同一個幽靈 token `--sanring-ring`(這次兩邊都有,不是 drift),留給下一筆 `otp-input` 稽核時處理。
- [x] `otp-input` — 唯一的缺陷是前一筆 `stepper` 稽核時順手發現的同一個幽靈 token `--sanring-ring`(這次兩邊 registry/packages/ui 都有,不是 drift),用在 active slot 的 focus 邊框色,已改回 `--sanring-border-strong`。`otp-input.component.ts` 本身跟 registry 有已知的 P28 架構分岔(`packages/ui` 手刻 CVA、`registry` 用 `SanringCvaBase`),這是舊帳、先前 P14 saga 已經逐一比對過 packages/ui vs registry 的 input/output 清單確認 otp-input 沒受影響,這次沒有重新展開調查。工程品質很高:真正的鍵盤/IME/貼上/自動填入邏輯都在一個 `aria-hidden` 之外、視覺上縮到 1px 的真實 `<input>` 上(shadcn/Radix `input-otp` 同款設計),視覺 slot 全部 `aria-hidden`;手機虛擬鍵盤 keydown/input 重複觸發的 race condition 有文件化的雙層 `requestAnimationFrame` workaround。既有 spec 很完整(10 tests,涵蓋渲染、projected slots、數字過濾、自訂 pattern、貼上、backspace、disabled、field 整合、touched-on-blur、axe),但完全沒有方向鍵導覽測試——這是元件明確刻的功能(ArrowLeft/ArrowRight/Home/End)卻沒有回歸測試釘住,已補 render + class merging + 方向鍵導覽共 3 個 test,現在 13 個全過。`pnpm lint`/`check-registry-parity.mjs` 皆過。
- [x] `table` — 建立在 `@angular/cdk/table` 上,是這次稽核系列裡工程設計最紮實的一個,`registry`/`packages/ui` 完全零 drift(12 個檔案逐位元組相同)。**發現**:元件目錄裡有一份 `todolist.md`,內容嚴重過時——聲稱「paginator 不存在」「docs 頁面不存在」「spec 只驗證過 tsc 型別,沒有真的在瀏覽器驗證渲染,是目前最大未知風險」,但查證後這三項其實都已經解決(`pagination` 元件已存在、`apps/docs/.../table/` 頁面已存在且示範 row actions/checkbox 選取/排序/分頁組合、`table.component.spec.ts` 已經測過完整的 columnDef+cellDef+rowDef 內容查詢鏈)。已改寫 `todolist.md` 反映實際現況,移除已解決項目,只留真的還沒做的(sticky 欄位背景色、`CdkTextColumn` 等效元件、CDK flex-layout 支援、loading skeleton/欄位顯示切換的 docs 示範)。**補**:`index.ts` 沒有 `SANRING_TABLE_IMPORTS`——是這次稽核系列裡唯一一個沒有這個慣例匯出的多檔案元件,docs 自己的 table 頁面因此要手動 import 14 個個別 symbol;已比照其他 50+ 個元件的慣例補上(19 個 symbol 全部納入),兩邊同步。spec 原本 3 個 test 涵蓋渲染/class merging/selected row/sort 切換/axe,但完全沒測過 no-data 分支(`todolist.md` 自己都點名這是風險)跟 `ratio`/`width` 欄寬計算邏輯(有非平凡的比例分配數學,零覆蓋),已補 render + no-data 兩態 + ratio/width 換算共 5 個 test,現在 8 個全過。`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆過。
- [x] `resizable` — 零缺陷,是這次稽核系列裡少數完全手刻(無 CDK、無 `@angular/aria`)但工程品質依然很高的元件:滑鼠/觸控拖曳的 listener 清理完整(`stopDrag()` 同時處理正常結束跟 `destroyRef.onDestroy`)、鍵盤 resize 有 RTL 感知(`getComputedStyle(...).direction === 'rtl'` 反轉 ArrowLeft/ArrowRight)、collapsible panel 的「拖過 minSize 直接吸附 collapsedSize 而非卡住」邏輯正確。`registry`/`packages/ui` 零 drift,無硬編碼色碼、無幽靈 token,registry.json 對應正確。既有 spec 只有 3 個 test(渲染/ArrowRight resize/axe),完全沒測 disabled 狀態、Home/End、collapsible panel 這個獨立分支邏輯(有非平凡的「超過 minSize 就吸附到 collapsedSize」判斷,零覆蓋)。已補 render + disabled 狀態(aria-disabled/tabindex/攔截鍵盤)+ Home/End + collapsible 吸附共 4 個 test,現在 7 個全過。拖曳/觸控/RTL 三項因 jsdom 對 `getBoundingClientRect`/`getComputedStyle` 的層疊計算支援有限,沿用既有 spec「只測鍵盤路徑」的既有取捨,未新增覆蓋。`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆過。

**P26 Tier 2 佇列至此全數完成**(collapsible/accordion/tabs/stepper/otp-input/table/resizable 皆已稽核並修正)。

### Tier 3 — High-risk interaction（CDK Overlay / 複雜鍵盤 / Focus trap）

- [x] `tooltip` — 唯一缺陷是這個 session 很早期（`toggle` 稽核時）就發現、特意留給 tooltip 自己稽核時處理的 `rounded-md` design token 漂移，已修正。用 `cdkConnectedOverlay` 宣告式寫法（非手動 `Overlay.create()`），CDK 自動管理 attach/detach，Phase 1-C 手動生命週期檢查項目多數不適用。spec 補 class merging + hover 開關（原本只測 Escape，沒測過主要的 hover 觸發路徑）共 2 個 test（4/4 通過）。Tier 3，consumer usage 只有自己 demo 頁
- [x] `hover-card` — 零缺陷，`registry`/`packages/ui` 除了 4 個方法的 `protected`/`public` 可見度標記外完全一致。內容區塊刻意不加 `role`/`aria-describedby`（跟 tooltip 不同——內容常含可互動元素，做法對齊 Radix HoverCard 的既有慣例）。spec 補主要滑鼠 hover 開關路徑 + 「移到卡片內容不關閉」這個元件特有行為共 2 個 test（5/5 通過）。Tier 3，consumer usage 只有自己 demo 頁
- [x] `popover` — **中高嚴重度**：`role="dialog"` 面板有 `tabindex="-1"`（明顯預留給程式化 focus 用）但從未被呼叫，開啟時焦點不會移進面板、Escape/關閉時也不會回到 trigger，鍵盤/screen reader 使用者會迷失焦點。已修正：attach 時 focus 進面板、Escape 關閉時 focus 回 trigger（比照 `context-menu-sub-content` 既有慣例），outside-click 關閉時刻意不搶焦點。`packages/ui`/`registry` 皆有此問題（非單邊 drift），兩邊同步修正。spec 補 class merging + 3 個 focus 行為 test（331/331 通過）。Tier 3，**consumer usage 找到真正的內部依賴**（`calendar`/`calendar-header` 組件用它做月份/年份選單，不只是自己的 demo）
- [ ] `toast`
- [ ] `calendar`
- [ ] `dropdown-menu`
- [ ] `context-menu`
- [ ] `select`
- [ ] `file-upload`（已知：registry 的 `id` 是 `input()`，`packages/ui` 是純字串，消費者無法在 npm 套件版覆寫 id——見 `check-registry-parity.mjs` 允許清單，正式稽核時處理）
- [ ] `carousel`
- [ ] `dialog`
- [ ] `alert-dialog`
- [ ] `sheet`
- [ ] `command`
- [ ] `date-picker`
- [ ] `navigation-menu`
- [ ] `combobox`
- [ ] `tree`
- [ ] `transfer`
- [ ] `sidebar`

---

## P11 — 品質關卡類(優先度較低,長期補強)

- [ ] Docs 站補 light/dark theme accessibility smoke test,至少覆蓋 component 頁面的標題、說明文字、tabs、installation/code block、copy buttons 與 focus ring,確認文字對比、可讀性與鍵盤操作都通過
- [ ] 視覺回歸測試(如 Chromatic / Playwright screenshot),CSS 改動有沒有意外破壞其他元件外觀,現在沒有自動偵測
- [ ] CLI 補真正的 e2e 測試(拉一個全新 Angular 專案、真的跑 `sanring add`、真的 `ng build`)——現有的 `add.test.ts`/`doctor.test.ts` 等是對假的檔案系統 mock 驗證邏輯,不是「CLI 真的能在使用者機器上跑起來」的保證

---

## P19 — Blocks:可直接安裝的頁面級組合模板

- [ ] 設計 `blocks/` registry 類別,讓 `sanring add block/dashboard-shell` 可以一次安裝完整頁面片段(login page、settings page、data table page、dashboard layout 等)

**現況**:目前 registry 只有 `components/` 和 `shared/`,沒有 blocks 概念。使用者必須自己把元件組裝成頁面。

**影響**:這是目前與 shadcn 最大的採用體驗差距。開發者的採用決策通常不是「這個 Button 好不好」,而是「我能不能 30 分鐘內搭出一個看起來像樣的登入頁」。Blocks 直接回答這個問題。shadcn blocks 是近兩年對採用率貢獻最大的功能之一。

**實作方向**:

- `registry/blocks/` 目錄,每個 block 是一個 Angular component(可含多個 child component)
- `registry.json` 加入 `blocks` 陣列(類似 `components`),每筆有 `name`、`description`、`componentDeps`、`files`
- CLI 的 `add` 指令識別 `block/` prefix,路由到 blocks registry
- 初始 blocks 建議:`auth/login`、`auth/register`、`layout/dashboard-shell`、`layout/settings-page`

**成本**:高。單個 block 的設計/實作本身不難,但要做出夠多、夠有代表性的 blocks 讓功能有意義,需要持續投入。建議先做 2–3 個 blocks 驗證 CLI 流程,再逐步擴充。

---

## P25 — Registry 生態系擴展（對標 shadcn registry）

目標是把目前「單人自用的 `sanring build`」升級成開放的第三方 registry 生態系，讓任何團隊或套件作者都能發布、搜尋、安裝彼此的元件。

**子項目（依實作順序）**：

- [ ] **Registry Directory**：Docs 站新增第三方 registry 目錄頁，列出社群維護的 registry（類似 shadcn 的 Registry Directory）；初期可由人工審核提交
- [ ] **GitHub Registries**：CLI 支援直接以 `github:<owner>/<repo>` 格式作為 registry source，省去 host 步驟（背後解析為 `https://raw.githubusercontent.com/<owner>/<repo>/main/registry.json`）
- [ ] **Namespaces**：解決多 registry 同名元件衝突，定義 namespace 規則（目前 alias 機制已部分解決，需形式化）
- [ ] **Authentication**：CLI 支援 private registry 的 Bearer token 認證（`sanring.config.json` 加入 `auth` 欄位），讓企業內網或 private GitHub repo 可用
- [ ] **Dynamic Search API**：registry 可選擇暴露搜尋 endpoint（而非只靠靜態 JSON 全量掃描），`sanring search` 優先呼叫 endpoint
- [ ] **API Reference 頁面**：補 `registry.json` 完整 schema 文件（目前 docs registry 頁只有範例，缺欄位定義、型別、必要/選用標記）
- [ ] **Docs 多頁拆分**：registry 頁面從目前的單頁拆成多頁（Introduction、Getting Started、GitHub Registries、Authentication、API Reference 等）

**現況**：目前 registry 頁只有一頁，涵蓋基本的 `sanring build` 工作流程與 `registries` config 設定。CLI 的 multi-registry 支援（alias:name 語法）已完成，但生態系的其餘部分（directory、GitHub source、auth）尚未實作。

**影響**：shadcn 的 registry 生態是目前採用率的核心驅動之一——開發者能找到、安裝、分享社群元件，讓整個 UI library 不只靠官方維護。Angular 生態目前沒有等價物，這是 Sanring 差異化的機會。

**成本**：高。各子項目可獨立交付，建議從 GitHub Registries（低實作成本、高使用者價值）和 API Reference 開始，再推進 Directory 和 Auth。

---

## P22 — Docs component 頁面加入 StackBlitz 快捷連結

- [ ] 每個 component 頁面的 code previewer 旁加一個「Open in StackBlitz」按鈕,讓使用者不用本地安裝就能試用

**現況**:Docs 的 code previewer 是靜態展示,使用者若想動手試要先本地建好 Angular 專案並跑完 `sanring init` + `sanring add`。

**差異**:這裡的目標是「一鍵開啟含有該元件的最小 Angular 專案」,而非在 docs 頁面內嵌入可編輯 editor(已確認 shadcn 自己的 docs 也不這樣做,兩邊打平)。StackBlitz 支援從 URL params 或 POST 預填專案內容,可以把 component 程式碼預先注入。

**成本**:中。StackBlitz SDK 有 `sdk.openProject()` API,需要為每個元件準備一份最小化的 Angular 專案 template + 注入對應的元件程式碼。可以先做成通用 template,再逐元件補範例程式碼。
