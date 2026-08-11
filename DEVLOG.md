# Development Log

內部工程日誌:記錄 `TODOLIST.md` 每個項目實際怎麼做、為什麼這樣做、怎麼驗證過,以及查證後發現「其實不是缺口」的結論。寫給開發者自己(人類或未來的 Claude session)看——回答的是「當初為什麼這樣做、驗證過什麼」,顆粒度比 git commit message 粗、比 todolist 的現況/風險/成本評估更偏事後敘事。

這不是使用者看的版本紀錄,那是 [`packages/cli/CHANGELOG.md`](packages/cli/CHANGELOG.md)(changesets 自動產生,逐版本、面向消費者)。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。三者的關係:

| 文件                        | 讀者          | 回答的問題                       | 更新頻率         |
| --------------------------- | ------------- | -------------------------------- | ---------------- |
| `TODOLIST.md`               | 開發者自己    | 接下來要做什麼、為什麼、值不值得 | 每完成一項就變動 |
| `DEVLOG.md`(這份)           | 開發者自己    | 這件事當初怎麼做的、驗證過什麼   | 每完成一項就追加 |
| `ROADMAP.md`                | 使用者/貢獻者 | 專案接下來的方向                 | 偶爾,方向改變時  |
| `packages/cli/CHANGELOG.md` | 使用者        | 這個版本對我有什麼影響           | 每次 release     |

條目依 `TODOLIST.md` 的 P 編號分組——編號代表歷史待辦清單裡的順序,不代表完成的時間序;新條目直接接在檔案最後面。

---

## P1 — registry / packages/ui / docs / public-api 一致性

- [x] 建立一致性檢查,確保每個正式元件在 `registry`、`packages/ui`、docs navigation/page、`public-api.ts` 的狀態一致
- [x] 移除殘留 `menu` registry 元件,避免和 `dropdown-menu` / `context-menu` 語意重疊

**已完成**:擴充 `packages/cli/scripts/check-registry-sync.mjs`,原本只檢查 docs↔registry 兩面,現在同時檢查四面八個方向:registry.json 內部完整性(`files` 是否真的存在)、registry.json↔`registry/components/`、registry.json↔`packages/ui` lib(這正是先前 `menu` bug 的那種落差)、`packages/ui` lib↔`public-api.ts`、docs nav id↔registry.json、docs nav id↔`packages/ui` lib、docs nav id↔docs page 檔案、docs nav id↔`app.routes.ts` 路由註冊。文件化但缺實作/路由的方向一律 fail CI;實作了但還沒文件化的方向只 warn(視為正常 WIP)。用手動模擬 drift(假 registry entry、註解掉一個 public-api export)驗證過腳本抓得到,目前 50 個正式元件在全部八個方向都一致,`pnpm lint`/腳本本身都是綠的。同步把 `.github/workflows/registry-sync-check.yml` 的 `paths` 觸發範圍擴大,涵蓋新檢查會用到的檔案,避免新檢查形同虛設。

**現況**:`menu` 曾只存在於 `registry` / README,沒有 `packages/ui` lib、沒有 docs page、也沒有 public API export。此類落差會讓 CLI 可安裝清單、文件站、套件開發 surface 彼此不同步。

**風險**:使用者可能透過 CLI 安裝到未文件化、未測試、或不是正式 library surface 的元件;反過來 docs 也可能介紹 CLI 無法安裝的元件。

---

## P2 — lint 要能乾淨通過

- [x] 修復目前 `pnpm lint` 的既有錯誤,讓 lint 成為可被 CI 信任的品質門檻

**現況**:已在 P0 CI workflow 那次一併修好(見 commit `3c516aa`)。15 個既有錯誤——docs template label association(`sanringLabel` 動態 `for` 綁定的已知 false positive,補了有註明原因的 disable comment;date-picker 兩處是真的沒關聯,補上 `id`/`for`)、`combobox` input alias(套用跟 `command-item` 一致的既有慣例)、死掉的 spec unused var——全部修好,`pnpm lint` 目前是綠的。

**風險**:主流元件庫不能長期讓 lint 紅燈;否則外部貢獻、CI、release gate 都會失去可信度,真正的新問題也容易被舊錯誤淹沒。

**回歸(2026-08-08)**:`sidebar` component(`39463f5 feat(ui/docs): 新增 sidebar component`)上車後沒同步套用既有的 lint 慣例,悄悄讓 `pnpm lint` 又紅了 6 個錯誤——`sidebar.component.ts`(`packages/ui` + `registry` 兩處)未用到的 `Signal` import、`_collapsible` alias 成 `collapsible` 沒補 disable comment;docs `sidebar-page.component.ts` 兩處 `sanringSidebarRail` 空 `<button>` 觸發 `elements-content`(host aria-label binding 的已知 false positive,跟 `sanringLabel` 那個一樣)。已在 `e7ba079 fix(ui): clear 6 pre-existing lint errors on sidebar component` 補齊,`pnpm lint` 目前重新綠燈。**提醒**:標記完成不代表一勞永逸,新元件上車時要記得比照既有慣例補 disable comment,不要指望事後才被發現。

---

## P3 — 建立 component audit matrix 並逐一盤點 lib

- [x] 建立 `COMPONENT_AUDIT.md` 或等價盤點表,列出 50 個正式 component 的品質狀態與下一步 action
- [x] 依風險分批檢查 `packages/ui` / `registry` / docs,不要用無順序的人工掃描

**盤點欄位**:每個 component 至少記錄 `registry/package/docs/public-api 一致性`、`spec 狀態`、`a11y`、`keyboard`、`API 穩定性`、`SSR/hydration 安全`、`docs 完整度`、`風險等級`、`下一步 action`。

**執行結果**:

1. ✅ 高風險互動元件(`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`)。查出 3 個 P0,**全部修完**:`select` 開啟後的 listbox 沒有方向鍵導覽(只能 Tab)——補上 `FocusKeyManager`,開啟時自動 focus 選中項、方向鍵可跳過 disabled 項並循環;`command` 完全沒有測試——補了 6 個 spec;`context-menu` 完全沒有方向鍵導覽也沒有測試——新增共用的 `focusAdjacentMenuItem()` 工具函式(接在既有的 `overlayKeydown` 訂閱上,root menu 跟 submenu 各自都能用方向鍵導覽、跳過 disabled 項、循環),補了 7 個 spec,寫 spec 過程中還抓到自己寫的一個 bug(還沒開的子選單項目雖然 CSS 隱藏但還在 DOM 裡、`tabindex="0"` 還在,會被誤判成可導覽項目)並修掉了。三個都在真實瀏覽器用 Playwright 跑過一輪驗證。`sheet` 文件範例用了原始碼裡根本不存在的 `showClose` input 這個次要問題還沒修(後續在 P5 修掉)。(原本以為 `command` 的 `aria-expanded="true"` 是寫死的 bug,後來查證發現它的清單本來就沒有收合狀態,寫死是對的,已撤回這條。)
2. ✅ form/control 元件(`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`)。查出 2 個真的 bug,都在 `switch`,**都修好了**:補上 `checkedChange` output(現在可以 `[(checked)]` 雙向綁定);補上真正的 `ariaLabel`/`ariaLabelledBy` input——原本文件範例寫的 `aria-label="Toggle theme"` 掛在 `<sanring-switch>` 標籤上根本傳不到內部真正的 `role="switch"` button,修的時候發現不只文件程式碼範例錯,連即時渲染用的 demo 模板(`switch-page.component.ts`)也獨立踩了同一個坑(用 `[attr.aria-label]` 而不是走 input),兩處都修了,瀏覽器驗證過真的傳到 button 上。`checkbox`/`radio-group` 共用的 a11y 邊界案例(`aria-required` 只看原始 `required` input,沒涵蓋純用 `Validators.required` 的情況)也修好,兩邊都補了 regression spec。`date-picker`/`calendar` 零測試(鍵盤邏輯全部在外部套件 `@sanring/date-picker-core` 裡,這兩個元件本身沒有可審的鍵盤程式碼)這個沒修,還是 backlog。其餘主要是文件 API 表漏欄位,`field` 本身查起來完全乾淨。
3. ✅ display/layout 元件(`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`)。查出 2 個真的 SSR bug,同一種類型,**都修好了**:`avatar` 的 `AvatarImageDirective` 原本在建構子欄位初始化直接 `new MutationObserver(...)` 並同步 `.observe()`——改成包進 `afterNextRender`;`carousel` 的 `CarouselContentComponent` 原本在 `ngAfterViewInit()` 直接呼叫 `EmblaCarousel()`(內部會 `new ResizeObserver(...)`)——同樣改成 `afterNextRender`,跟同一批 `resizable` 既有的正確寫法一致。`resizable` 的 handle 補上了 `aria-valuenow`/`min`/`max`(反映 handle 前面那個 panel 的目前尺寸與該 panel 自己的 `minSize`/`maxSize`,為此在 `ResizableGroupComponent` 加了一個 `getBeforePanel()` 方法)。`progress` 的 `ariaValueText` 補上轉發給底層 directive。`tabs` 的 `selectionMode` 補進文件(說明 `'follow'`/`'explicit'` 自動/手動啟用的差異),`orientation` 要同時設在 `<sanring-tabs>` 跟 `<sanring-tabs-list>` 這件事——原本想用 host binding 讓 `sanring-tabs-list` 自動吃父層的值、不讓消費者能個別覆寫,但 Angular 的 host binding 語法無法綁到 hostDirectives pass-through 以外的 input(NG8002 編譯錯誤),技術上做不到乾淨的自動同步,改成把「為什麼要設兩次」寫清楚進文件跟原始碼註解。`table` 的文件曾經真的引用不存在的 `<sanring-paginator>`,但等到要修的時候查證發現另一個並行工作階段已經把這個元件補齊、註冊完整、API 跟文件範例完全對得上——不需要改程式碼,已在稽核表更正這條過時的結論。所有修復都在真實瀏覽器用 Playwright 跑過一輪驗證,無 console error。

**風險**:如果沒有盤點矩陣,逐一檢查 lib 很容易變成「看過但沒有結論」,也會先花時間在低風險元件,延後發現真正影響 production 採用的互動/a11y/API 問題。

**後記**:`COMPONENT_AUDIT.md` 本身已在 `35114a3 chore: remove orphan projects/ dir and completed audit docs` 移除(盤點任務已完成,矩陣文件沒有繼續維護的價值)。`packages/cli/scripts/check-component-audit-sync.mjs` 這支驗證腳本沒有隨之移除,目前 CI 的 lint job 呼叫它會直接 `ENOENT` 失敗——這是待處理的獨立小 bug,不影響本項目結論。

---

## P4 — 每個 component 至少有最低 spec

- [x] 補齊無 spec 元件的最低測試:render、class merging、a11y/keyboard 核心行為

**已完成**:50 個正式 component 現在都有至少一個 package-level `.spec.ts` baseline。這次補齊 `alert`、`avatar`、`badge`、`breadcrumb`、`calendar`、`card`、`carousel`、`date-picker`、`divider`、`hover-card`、`label`、`link`、`resizable`、`spinner`、`table`;`command`、`context-menu` 也已在高風險互動元件盤點中補齊。最低 spec 覆蓋 render、class merging、重要 aria/security attribute、以及互動元件的核心 keyboard/open/selection 行為。

**風險**:headless component library 的信任感很大一部分來自互動與 a11y 穩定性。沒有最低 spec 時,重構 styling、ARIA、keyboard 行為都容易出現隱性退化。

---

## P5 — docs 要成為採用入口

- [x] 補齊每個 component docs 的採用資訊:usage、installation、API、accessibility notes、keyboard behavior、controlled/uncontrolled 或 state 說明

**現況**:docs page 覆蓋度已不錯,但主流採用入口需要更穩定的資訊架構。`menu` 缺頁問題已改以移除 `menu` 解決;後續重點是讓保留下來的正式元件文件完整、可預期。

**已完成**:第一批:`sheet` 文件移除不存在的 `showClose` API 與會編譯失敗的 `[showClose]="false"` 範例,改成自訂 `sanringSheetClose` close control 範例;`calendar` API 表補上 `id`、`required`、`ariaDescribedBy`、`jumpMonthLabel`、`jumpYearLabel`、`focus()`;`date-picker` API 表補上 `id`、`required`、`ariaDescribedBy`、`focus()`。第二批:`otp-input` API 表補上 `name`、`autocomplete`、`required`、`ariaLabel`、`ariaLabelledBy`、`ariaDescribedBy`、`pasted`、`slotKeydown`;`slider` 補 `tabIndex`;`radio` 補 `RadioGroupComponent.id`;`dropdown-menu` 補 `id`、`wrap`、`typeaheadDelay`;`select` 補 `id`、`contentId`、`placeholder`,並把 `value` 說明改清楚為唯讀 getter、值更新應走 Angular Forms。

**完成標準**:每個正式 component docs 至少具備:usage/imports、installation、API table、accessibility notes、keyboard behavior、state model(controlled/uncontrolled、CVA、model/input/output 或 service-driven 狀態)。

**執行順序**:

- [x] 建立 docs completeness checklist/matrix,逐頁標記 usage、installation、API、accessibility、keyboard、state model 是否完成
- [x] 先補高互動元件的 adoption notes:`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`
- [x] 再補表單元件的 field/CVA/state 說明:`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`
- [x] 最後補 display/layout 元件的 accessibility semantics 與 keyboard note:`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`

**風險**:即使元件可用,若文件缺少 a11y、keyboard、state model 與 API 說明,使用者會很難判斷它是否適合 production。

---

## P6 — package-only 使用者的 theme token 入口(已評估,暫不執行)

- [x] 評估是否要讓 package-only(不透過 CLI)使用者取得 theme CSS

**原始現況(2026-08 前)**:`registry/shared/theme.css` 已經提供完整 `--sanring-*` CSS custom properties,`registry/registry.json` 也已把 `theme` 宣告為 shared dependency;`sanring init` 會產生 `src/sanring-theme.css`,docs theming page 也有說明。但如果使用者只從 npm 安裝 `@sanring/ui`,目前不夠直覺地知道 `bg-[var(--sanring-border)]`、`text-[var(--sanring-foreground)]` 等 token 要從哪裡設定。

**查證後發現前提不成立**:`@sanring/ui` 目前**沒有被發布到 npm**,而且是刻意設計成這樣——`packages/ui/package.json` 是 `private: true`、`.changeset/config.json` 把 `@sanring/ui` 明確排除在版本管理外、`release.yml` 只在 `packages/cli/**`/`registry/**` 變動時觸發,`release` script 也只 build/publish `@sanring/cli`。唯一真實存在的發布管道是 CLI 把 `registry/` 的原始碼複製進使用者專案(shadcn 那套模式),「只從 npm 安裝 @sanring/ui」這個使用情境目前不存在,原始「現況」段的假設不成立。

**結論**:不執行,維持 CLI-only 發布模式。要讓這個情境成立,前提是先決定要不要把 `@sanring/ui` 也發布成傳統 npm 依賴套件——那是一個獨立、更大的策略決定(牽涉 semver 版本紀律、使用者失去「程式碼歸你、可以隨便改」的 CLI 模式優勢、兩條發布管道共存的複雜度),不是「補一個 CSS export」這麼小的事。若之後真的要發 npm 套件,「要不要發 npm 套件」本身應該先開一個新的 todolist 項目評估,這條再接在後面做。

**技術備查(留給未來參考)**:實測過 ng-packagr 的 `assets` 設定會拒絕讀取 project root 以外的檔案(不能直接指到 `../../registry/shared/theme.css`),且它會自己產生/覆寫 `package.json` 的 `exports` 欄位(預設只有 `.` 跟 `./package.json`)。這條路技術上可行,但要嘛把 theme.css 複製一份進 `packages/ui/` 自己顧跟 `registry/shared/theme.css` 同步,要嘛接受兩份 source of truth。

---

## P7 — docs 站沒有搜尋功能

- [x] 幫 docs 站加上搜尋(至少支援元件名稱/描述搜尋,理想上做成 Cmd+K 面板)

**現況(更新)**:查證後發現 `apps/docs/src/app/shell/header/feature-list.component.ts` 其實已經有完整的 Cmd+K 搜尋面板(快捷鍵、fuzzy match、鍵盤導覽都做了),原本的「找不到任何搜尋元件」現況查證是舊的、不準。真正的落差只有:搜尋索引只比對翻譯過的元件名稱(`labelKey`),沒有比對描述文字,跟「至少支援名稱/描述搜尋」的要求還差一步。

**已完成**:`docsComponentItems`(`apps/docs/src/app/navigation/docs-navigation.ts`)每筆補上 `descriptionKey`(對應各元件 `.docs.ts` 裡本來就有的 `page.descriptionKey`,型別化、雙語言都不用另外維護);`feature-list.component.ts` 的 `searchIndex`/`filteredItems` 改成先比對名稱、名稱沒中才退而求其次比對描述(用固定偏移量讓名稱命中永遠排前面);結果項目改成兩行式,名稱下面帶一行描述摘要。已用 Playwright 手動驗證:搜尋不在名稱裡的描述字串(如 "vertically stacked")能正確命中 Accordion 並正常導頁。

---

## P8 — 沒有 MCP server 整合

- [x] 實作 `@sanring/cli` MCP server 支援,讓 Claude Code / Cursor 等 AI agent 能直接查詢、安裝元件

**已完成**:新增 `packages/cli/src/commands/mcp.ts`,加入 `@modelcontextprotocol/sdk@1.30.0` 依賴,以 lower-level `Server` API(NodeNext ESM 相容、不額外依賴 zod)實作五個 tool:`list_components`(列出全部元件)、`search_components`(名稱優先搜尋)、`get_component_info`(含 files、自動安裝的 componentDeps、shared utilities、peerDeps)、`plan_component_install`(dry-run 預覽會寫入哪些檔案/componentDeps/peerDeps,不動專案)、`add_component`(`cwd` 參數指定 Angular project root,子程序執行 `sanring add --yes`)。所有 tool handler 都有 runtime input validation(`requireStrings`),找不到元件時統一回傳 `isError: true`。`sanring mcp` command 透過 stdio transport 啟動,`serverInfo.version` 正確讀取 CLI 版本。已補 `packages/cli/src/commands/mcp.test.ts`(`Client` + `InMemoryTransport`,覆蓋 tools/list、search、detail、plan、not-found isError、add tool boundary)與 `packages/cli/src/commands/mcp.e2e.test.ts`(`StdioClientTransport` 真實 spawn 編譯後的 CLI,驗證 cliBin 路徑解析與 `--registry` 傳遞);README 也補上 Claude Code / local development 設定方式與五個 tool 的說明表格。get_component_info 找不到元件時原本沒回傳 `isError: true`,跟 `plan_component_install` 同樣情境不一致,依賴 `isError` 判斷失敗的 AI agent 會誤判為成功呼叫,後續已補上並加測試保護。

**使用方式**:在 `.claude/mcp.json` 或 Claude Code 設定中加入:

```json
{
  "mcpServers": {
    "sanring": {
      "command": "npx",
      "args": ["@sanring/cli@latest", "mcp"]
    }
  }
}
```

**對比**:shadcn 這一兩年加了 MCP 整合,AI coding agent 可以透過 MCP protocol 直接跟 registry 互動,不用手動下 shell 指令。跟目前透過 Claude Code 使用這個專案的情境直接相關。

---

## P10 — `sanring init` 沒有 monorepo/workspace 偵測

- [x] 評估 `init` 指令加上 monorepo 結構偵測與對應處理邏輯

**已完成**:在 `utils.ts` 新增三個函式:`detectMonorepoRoot()`(偵測單一目錄是否為 monorepo root,辨識 pnpm-workspace.yaml / lerna.json / turbo.json / nx.json(無 angular.json 時) / package.json workspaces)、`findMonorepoAncestor()`(從 startDir 往上走直到找到 monorepo root 或碰到 filesystem root)、`findAngularProjectsInWorkspace()`(在 workspace root 下搜尋最多 2 層深的 angular.json,跳過 node_modules/.git/dist 等目錄)。`init.ts` 移除 `requireAngularProject()` 硬停,改成:若 cwd 無 angular.json → 往上找 monorepo root → 搜尋 workspace 內的 Angular 專案 → 找到一個自動選取、找到多個列出讓使用者互動選取(--yes 模式直接 fail 並印出 cd 指令)。所有後續操作改用 `projectRoot`(可能不同於 cwd)。補 5 個 init monorepo 整合測試,目前 92 tests 全過。

**現況**:`sanring init` 已不再假設 cwd 必須就是單一 Angular 專案 root。從 workspace root 或 workspace 子目錄執行時,會先辨識 monorepo root,再把設定檔、theme CSS、dependency install、global stylesheet import 寫到實際 Angular project root。已覆蓋單一 project 自動選取、多 project + `--yes` fail、workspace 內無 Angular project、非 Angular/非 monorepo 目錄、以及兩層深 Angular project 等情境。

**限制**:目前只搜尋 workspace root 往下最多 2 層深的 `angular.json`,這符合常見 `apps/web`、`packages/admin`、`apps/feature/web` 結構,但不涵蓋更深或非標準 layout。`nx.json` 只有在同目錄沒有 `angular.json` 時才視為 monorepo 訊號,避免把單一 Nx Angular 專案誤判成 workspace root。

---

## P12 — Masked Input 是否需要獨立套件(比照 date-picker-core)

- [x] 評估 Masked Input(roadmap tier2 規劃中)的遮罩引擎是否要比照 `@sanring/date-picker-core` 拆成獨立套件

**封存**:評估完成,無後續 action。結論:Masked Input 目前規劃只疊加在單一 `Input` directive 上,沒有第二個消費者;拆分的關鍵理由(同一引擎被多個元件共用)尚不成立。待 Masked Input 正式實作後出現第二個消費者,再重新評估是否拆成獨立套件。實作時遮罩演算法應寫成 `packages/ui` 內零 Angular 依賴的純函式模組,可獨立單元測試,不用背獨立 repo/版本協調的重量。

---

## P13 — CLI 指令間有重複邏輯,可收斂共用

- [x] 抽出 `requireAngularProject(cwd, hint?)` 共用檢查,取代 `add`/`init`/`update`/`remove`/`diff`/`list.ts` 各自重複的 `angular.json` 守衛區塊
- [x] `DEFAULT_PATH`/`DEFAULT_COMPONENT_PATH` 原本在 9 個檔案各自宣告,統一成 `utils.ts` 的 `DEFAULT_COMPONENT_PATH` export
- [x] 抽出 `resolveComponentPath(optionsPath, config)` / `resolveComponentBasePath(cwd, optionsPath, config)`,取代散落各檔案的 `options.path ?? config?.componentPath ?? DEFAULT_PATH` 解析邏輯
- [x] 抽出共用的 `confirmPrompt({ yes, question, nonTtyRefusal? })`,取代 `add.ts` 的 `confirmOverwrite`、`update.ts` 的 `confirmFile`、`remove.ts` 的 `confirmRemoval` 三份幾乎相同的 readline y/N 邏輯

**已完成**:四項都已抽進 `packages/cli/src/utils.ts`,`add`/`init`/`update`/`remove`/`diff`/`doctor`/`info`/`search`/`list.ts` 全部改用共用函式。`confirmPrompt` 用 `nonTtyRefusal` 參數保留了 `add.ts`/`remove.ts` 在非 TTY 時印出的額外錯誤訊息、`update.ts` 保持原本的靜默 skip 行為。`resolveComponentPath`/`resolveComponentBasePath` 拆成兩個函式,因為 `add.ts`/`update.ts` 除了要算 base path,還需要保留未解析的相對路徑寫回 `sanring.config.json`。改完 `tsc --noEmit`、`eslint`、`vitest`(87 tests)全過,另外手動建置後跑過 `add --force`(重複安裝觸發 overwrite 確認)、`remove`、`update`(本地已修改檔案觸發 conflict skip)、`init`、`list --installed` 在非 Angular 專案/非 TTY 情境下的訊息,逐字比對跟重構前一致。

**現況(重構前)**:2026-08-06 程式碼審查發現,`packages/cli/src` 的 9 個 command 檔案(`add`/`init`/`update`/`remove`/`diff`/`doctor`/`info`/`search`/`list.ts`)彼此有多處幾乎逐字重複的邏輯,當時都沒有收斂進 `utils.ts`。

**風險**:低,是行為不變的重構,但散落的邏輯會讓未來改動(例如自訂 registry namespace 支援要動到每個 command)成本變高——先收斂能讓那類改動的 diff 小很多。

---

## P14 — UI lib 效能與重複邏輯優化

- [x] 約 4 成元件(實測 162 個 `@Component` 檔案中有 69 個)未明確設定 `ChangeDetectionStrategy.OnPush`,包含 `select`、`switch`、`combobox`、`command`、`tabs`、`tree`、`tooltip`、`dropdown-menu` 等已經是 signals-based 寫法的元件,等於沒拿到 OnPush 的效能紅利
- [x] `navigation-menu-sub-content`/`context-menu-sub-content`/`context-menu-content` 三個元件各自手刻幾乎相同的 CDK Overlay 生命週期邏輯(建立/attach/detach `OverlayRef`、`outsidePointerEvents`/`keydownEvents` 訂閱、destroy 清理),約 50–60 行重複 3 次
- [x] `resizable/resizable.utils.ts:75` 的 `Array.from(groupElement.children) as HTMLElement[]` 是沒有 runtime guard 的型別斷言(`children` 是 `HTMLCollection`,假設全部是 `HTMLElement`,一般成立但沒檢查)
- [x] 9 個表單元件(`checkbox`/`switch`/`radio-group`/`slider`/`otp-input`/`date-picker`/`calendar`/`file-upload`/`combobox`)各自重複一份幾乎逐字相同的 `XxxFieldControlAdapter` + CVA state-bridge 邏輯(約 500–600 行複製貼上)

**現況**:2026-08-06 code review(人工抽查 12–15 個代表性元件 + `shared/` 全目錄,並用 grep 驗證 OnPush 覆蓋率數字)發現的落差。已確認乾淨、不用動的部分:`components/` 裡沒有 `any`、沒有殘留的舊式 `@Input()`/`@Output()` decorator(全部是 signal-based)、`cn()`/`uniqueId()` 已統一在 `utils.ts`、所有 `.subscribe()` 都有正確清理(`takeUntilDestroyed` 或隨 `overlayRef.dispose()` complete)、`package.json` 依賴合理無大材小用。

**已完成(第一批)**:OnPush 清理:全部 162 個 `@Component` 現在都設了 `ChangeDetectionStrategy.OnPush`(packages/ui + registry 雙向同步),同時修正 registry `context-menu-content`/`context-menu-sub-content` 之前缺漏的方向鍵導覽(`ArrowDown`/`ArrowUp` → `focusAdjacentMenuItem`)與 `menu-navigation` sharedDep。Overlay 生命週期抽共用 class:新增 `packages/ui/src/lib/components/shared/menu-overlay-controller.ts`(`MenuOverlayController`)與對應的 `registry/shared/menu-overlay-controller.ts`。三個 content 元件(`context-menu-content`、`context-menu-sub-content`、`navigation-menu-sub-content`)各自從 ~50 行手刻邏輯改為直接用 `MenuOverlayController`,兩種 origin 型別(`{x,y}` 座標 vs `ElementRef`)均支援;registry.json 新增 `menu-overlay-controller` shared 條目並更新 context-menu/navigation-menu 的 `sharedDeps`。`resizable.utils.ts` 型別斷言改成 `.filter((el): el is HTMLElement => el instanceof HTMLElement)`,移除 unsafe cast。

**已完成(第二批,2026-08-11)**:CVA adapter 重複邏輯收斂。建立 `registry/shared/cva-base.ts`,包含：
- `SanringCvaBase<T>`：抽象基底類別，集中所有 CVA 共用狀態(`focused`、`ngControl`、`disabledState`、`stateChanges`、`onChange`/`onTouched`)、生命週期(`ngOnInit` 裡延後 self-inject `NgControl` 避免 NG0200 循環依賴)、`errorState`/`fieldRequired` getter（用 `_stateVersion` signal 把非 signal 的 `ngControl.invalid/touched` 橋接進 signal graph）、`makeComputedAriaDescribedBy(signal?)` 合併外部 `ariaDescribedBy` input 與 `Field` 注入 ID、`onFocus()`/`onBlur()` 標準實作。
- `SanringFieldControlAdapter<T>`：泛型轉接器，接受 `SanringCvaHost<T>` 介面實作 `SanringFieldControl<T>`,取代 9 個 per-component `XxxFieldControlAdapter` 類別。

9 個元件全數改為 `extends SanringCvaBase<T>`,移除各自的共用 boilerplate（約 1,200 行）。三個設計變異點：(1) 有 `required` input 的 7 個元件覆寫 `protected hasInputRequired()` hook；(2) 沒有 `ariaDescribedBy` input 的 `switch`/`combobox` 呼叫 `makeComputedAriaDescribedBy()` 無參數版；(3) `file-upload` 的 `errorState` 額外計入 `rejectedFiles`，覆寫 base getter（因此 `_stateVersion` 設為 `protected`）；`combobox` 用 `inputId`（plain string）作 field id，保留自己的 slim adapter。`registry.json` 新增 `cva-base` shared 條目，9 個元件的 `sharedDeps` 補入 `cva-base`。golden fixture 53 元件全量 test 通過。

---

## P15 — 版本兼容追蹤與 `sanring migrate` 指令

- [x] `SanringConfig` 加入 `installedVersions?: Record<string, string>`,記錄每個元件最後一次安裝/更新時的 CLI 版本
- [x] `sanring add` 與 `sanring update` 在成功寫入後同步更新 `installedVersions`
- [x] `registry.json` 的 `RegistryComponent` 加入 `since?: string` 與 `migrations?: RegistryMigration[]`,供 registry 作者標記 breaking changes
- [x] 新增 `semverLte(a, b)` 工具函式與 `getCliVersion()`(runtime 讀取 package.json)
- [x] 實作 `sanring migrate [components...] [--check]` 指令:對比 installedVersion 與 registry migrations 的 fromVersion,印出需要手動處理的步驟;`--check` 在有 migration 時 exit 1(CI gate 用)
- [x] `ComponentChange` 加入 `breaking?: boolean`;docs changelog 模板對標記 breaking 的 change 顯示紅色 BREAKING badge

**現況(修復前)**:整個開發過程中沒有顧及版本向後相容問題。使用者從舊版 CLI 安裝元件後,若 registry 有 breaking change,`sanring update` 只會同步檔案、不會提示需要手動修改模板或呼叫方式。

**設計**:`sanring.config.json` 的 `installedVersions` 以元件名稱為 key、CLI 版本為 value。`registry.json` 每個元件可以有多個 `RegistryMigration`,每筆包含 `fromVersion`(安裝在這個版本以前的使用者需要執行這份遷移)、`breaking: boolean`、`steps: string[]`。`sanring migrate` 過濾出 `semverLte(installedVersion, migration.fromVersion)` 的遷移項目,依序印出步驟;缺少 `installedVersions` 的舊 config 降級為 `"0.0.0"`。

---

## P16 — Docs 站沒有暗色模式切換

- [x] 在 docs header 加入 light / dark / system 三段切換,並讓全站 CSS variables 隨之切換

**現況**:`packages/ui` 的元件本身已經用 `--sanring-*` CSS custom properties,支援 dark mode;但 docs 站本身沒有提供切換按鈕,使用者只能依賴系統設定。

**影響**:開發者打開元件庫 docs 第一件事通常是切 dark mode 看元件效果,沒有切換按鈕會讓人對「這個 lib 有沒有認真維護 dark mode」產生懷疑,屬於第一印象層面的信任訊號。

---

## P17 — Component 頁面沒有顯示該元件自己的 changelog

- [x] 每個 component 頁面底部加一個「Recent changes」區塊,從 `componentChangelog` 過濾出 `componentIds` 包含該元件的最新 N 筆

**現況**:`component-changelog.ts` 裡每筆 change 都有 `componentIds?: DocsComponentId[]`,這份資料已經在用(驅動 sidebar 的「Updated」badge),但 component 頁面本身完全沒有顯示。

**影響**:使用者升版時想知道「這個元件到底改了什麼」,現在要去全局 changelog 自己找;shadcn 每個元件頁頂部有 "Updated X days ago" 連結。

---

## P18 — `sanring list --outdated`:安裝元件的更新狀態概覽

- [x] 新增 `sanring list --outdated`(或獨立指令 `sanring outdated`),快速顯示哪些已安裝元件的本地檔案和 registry 目前版本不同

**現況**:`diff` 指令可以逐檔比較,`update` 會實際套用,`migrate` 處理 breaking changes。但沒有一個指令能像 `npm outdated` 那樣一眼看出「我裝了哪些元件、哪些有更新、哪些是乾淨的」。

**已完成**:在 `list.ts` 加 `--outdated` flag,重用 `update.ts` 的檔案分類邏輯,只差最後不寫檔案改為彙整輸出(up-to-date / outdated / has-conflicts)。

---

## P21 — `ng add @sanring/cli` Schematics 支援

- [x] 實作 Angular Schematics,讓 `ng add @sanring/cli` 等同於跑完 `sanring init` 的全部步驟

**已完成**:新增 `packages/cli/schematics/`(`collection.json` 註冊單一 `ng-add` schematic、`ng-add/index.ts`、`ng-add/schema.json`)。`ng-add` 的 Rule 不重新實作 `init.ts` 的互動流程,而是照原本規劃「spawn `sanring init`」——用 `node:child_process` 的 `spawnSync` 呼叫已編譯好的 `dist/index.js init`,把 schema 選項(`path`/`skipConfirmation`/`force`/`registry`)轉成對應 CLI flags,`stdio: 'inherit'` 讓原本的互動式 prompt 照常運作。取捨:因為是直接寫檔案而非透過 schematics 的 `Tree` 抽象,`ng add --dry-run` 不會預覽它的檔案異動,已在程式碼註解與 README 標明。

`packages/cli/src` 是 `"type": "module"`(NodeNext),但 Angular schematics engine 用 CommonJS `require()` 載入 collection,所以 schematics 需要獨立編譯管線:新增 `tsconfig.schematics.json`(`module: CommonJS`)把 `schematics/**/*.ts` 編譯到 `dist/schematics/`,並在該目錄放一份 `package.json`(`{"type": "commonjs"}`)蓋掉外層的 `"type": "module"`;非 `.ts` 資產(`collection.json`、`schema.json`、這份 `package.json`)由新增的 `scripts/copy-schematics-assets.mjs` 複製過去。`package.json` 的 `build` script 串接這兩段編譯 + assets copy;新增 `"schematics": "./dist/schematics/collection.json"` 與 `"ng-add": { "save": "devDependencies" }` 欄位。`ng-add/index.ts` 對 `@angular-devkit/schematics` 只用 `import type`(`Rule`/`SchematicContext`/`Tree`),編譯後完全不留 runtime `require`,所以只需要 devDependency,不用背 runtime 依賴或煩惱跟使用者專案的 Angular 版本對齊。

測試:`schematics/ng-add/index.test.ts` 直接匯入原始 `.ts`(vitest 的 vite-node 對 ESM 原始檔仍提供 `__dirname`,不需要先 build 就能測),mock `node:child_process` 驗證 options → CLI flags 的轉換、失敗時的 exit code 處理、以及 context logger 有被呼叫;`schematics/collection.test.ts` 驗證 `collection.json` 的 factory/schema 路徑實際存在,防止路徑打字錯誤。CI `typecheck` job 補上獨立一步 `tsc -p tsconfig.schematics.json --noEmit`(schematics 用的是另一份 tsconfig,不會被既有的 `tsc --noEmit` 覆蓋到)。README 補上 `ng add @sanring/cli` 用法與跟 `init` flags 的對應表。實際端到端驗證:手動組一個假 Angular 專案,直接呼叫編譯後的 `ngAdd` Rule(真實 `spawnSync`、指向 local registry 避免打網路),確認 `sanring.config.json`、`sanring-theme.css`、`styles.css` import、base deps 安裝全部正確落地。

---

## P23 — CI 的 `check-component-audit-sync.mjs` 對已刪除的 `COMPONENT_AUDIT.md` 失敗

- [x] 移除 `packages/cli/scripts/check-component-audit-sync.mjs`,連同 `.github/workflows/ci.yml` lint job 裡呼叫它的那一步

**現況**:`COMPONENT_AUDIT.md` 已在 `35114a3 chore: remove orphan projects/ dir and completed audit docs` 移除(P3 盤點任務已完成,矩陣文件沒有繼續維護的價值),但驗證腳本沒有跟著移除。跑 `node packages/cli/scripts/check-component-audit-sync.mjs` 會直接對著不存在的 `COMPONENT_AUDIT.md` `ENOENT` crash,`ci.yml` 的 `lint` job 有呼叫這支腳本,main 分支 CI 因此常紅。

**已完成**:選擇刪除腳本+CI 步驟,而不是恢復 `COMPONENT_AUDIT.md`——恢復矩陣文件等於承諾要繼續手動維護它,跟當初刪除它的理由(盤點任務已完成、文件沒有持續維護的價值)直接矛盾。確認過沒有其他地方引用這支腳本(`CONTRIBUTING.md`/`README.md` 都沒提到)才刪。`pnpm lint` 重新驗證過綠燈。

---

## P20 — Theme Presets:具名主題預設與互動式產生器

- [x] 提供數個可直接套用的具名主題(`default`/`slate`/`warm`/`high-contrast`),讓 `sanring init --theme <name>` 能直接寫入對應的 CSS variables
- [x] Docs theming page 加入互動式調色預覽,讓使用者即時看到改變 accent/background/surface/border/radius 的效果並複製 CSS

**已完成**:`registry/shared/theme-presets/{slate,warm,high-contrast}.css` 三個 override-only partial,加上 `init.ts` 的 `--theme <preset>` flag。設計上刻意不讓每個 preset 各自複製一份完整的 90 行 token 檔——`slate`/`warm` 只覆寫 `--sanring-primary-10`~`90` 這條色階,靠 base `theme.css` 既有的 `--sanring-active: var(--sanring-primary-80)` 這類語意層 var() 參照自動把新色系帶過去,不用逐一重寫;`high-contrast` 因為改的是語意層本身(background/foreground/border 推向純黑白、圓角收斂),額外覆寫了 `:root[data-theme='light']` 區塊,並在檔案開頭註解說明為什麼跟另外兩個 preset 的作法不同(CSS attribute selector 的 specificity 比純 `:root` 高,兩個 preset 都必須各自帶自己的 light 區塊才能贏過 base 的 light 區塊)。

`resolveThemeContent()` 的合併方式是單純字串串接(base 內容 + `\n` + preset 內容),寫成同一份 `src/sanring-theme.css`——沒有做「動態合併多個 CSS 檔」這種更複雜的方案,因為 CSS custom property 的 cascade 規則本來就會讓後面出現的同選擇器宣告蓋掉前面的,字串串接已經足夠。preset 名稱驗證(`THEME_PRESETS` 陣列)在指令一開始就做,擋掉打錯字的 `--theme` 值並列出可用選項。

**驗證**:15 個 init.test.ts 案例全過(含新增的 3 個 `--theme` 案例);另外建置後在真實 scratch Angular 專案跑過 `sanring init --theme slate`/`--theme high-contrast`/`--theme bogus`,逐行比對輸出的 `sanring-theme.css` 內容(base + preset 正確串接、`--theme` 訊息正確顯示)、確認無效 preset 名稱會印出可用清單並 exit 1。`check-registry-sync.mjs`/`sync-registry.mjs`/`pnpm lint`/`tsc --noEmit` 全過。

**踩過的坑**:`init.test.ts` 裡的 `initCommand` 是模組層級 singleton,同一個 Command 實例會被整份測試檔案的多個 `it()` 重複 `parseAsync()`——commander 的 option default 只在 `.option()` 註冊當下套用一次,之後每次 parse 若沒有帶該 flag,並不會自動回退成 default,而是沿用上一次 parse 時明確設定的值。一開始新增的「拒絕不明 preset 名稱」測試把 `--theme nonexistent` 設進了 singleton,導致排在後面、完全沒提到 `--theme` 的既有 monorepo 測試也在 theme 驗證那關被擋下來,誤判成一堆不相關測試失敗。修法是在新增的 `describe` 區塊的 `afterEach` 裡呼叫 `initCommand.setOptionValueWithSource('theme', 'default', 'default')` 把 singleton 狀態復原,不影響其他測試檔案。

**docs**:theming page 加了一個「Named presets」段落(`--theme` 指令範例 + 4 個 preset 的一行說明表格),中英文 i18n key 都補了。這是純粹展示已出貨的 CLI flag,不是互動式調色預覽——沒有瀏覽器可以實際跑 docs dev server 驗證渲染,只用 `tsc --noEmit`/`pnpm lint` 驗證過型別和 i18n key 沒漏。

**互動式產生器**:在 `apps/docs/src/app/pages/theming/theming-page.component.ts` 新增 Theme generator section,放在「自訂品牌」之前。它提供 light/dark 預覽模式、accent/background/surface/foreground/border 色票、radius slider、即時 preview surface,並產生目前模式對應的 CSS selector(`:root` 或 `:root[data-theme='light']`)。複製行為沿用 docs 既有 `ToastService` 成功/失敗提示,中英文文案同步補在 theming locale 檔。

**互動式產生器驗證**:`pnpm exec ng build docs` 通過。此 build 需要 Google Fonts 網路存取來 inline 字型,已用網路權限完成驗證。

---

## P11 — a11y 自動化測試:axe-core 基礎設施 + 13 個高風險元件(部分完成)

- [x] 導入 axe-core,建立可重複使用的測試 helper
- [x] 套用到 P3 曾抓出真實 bug 的高風險互動元件批次(`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`)以及有歷史 a11y bug 的表單元件(`checkbox`、`switch`、`radio-group`)

**已完成**:新增 `packages/ui/src/testing/axe-a11y.ts`(不掛在 `public-api.ts`,不會進發布的套件),`expectNoA11yViolations(node, options?)` 執行 `axe.run()`,只對 `results.violations` 斷言失敗——`results.incomplete`(這個 jsdom-based test runner 底下幾乎都是 `color-contrast`,因為 jsdom 沒有真正的 layout/canvas engine 能算出渲染後的顏色)刻意不當失敗處理,這是 axe-core 自己「壞掉」跟「需要人工複查」的既有區分,不是這個環境專屬的權宜之計。已用 checkbox 元件實測驗證過失敗路徑真的會擋下已知的 a11y bug(暫時拿掉 `ariaLabel` 觸發 `button-name` violation,確認 assertion 真的會 throw,再改回來)。

`axe-core` 同時放進 `packages/cli`(它真正的消費者)跟 workspace root 的 `package.json` devDependencies——後者不是重複、不能砍掉重練:`@angular/build` 的 test bundler 是用 `root: <workspace root>` 跑 Vitest,當 2 個以上 spec 檔案 import 這支 helper 時,esbuild 會把 `axe-a11y.ts` code-split 成一個共用 chunk,而這個 chunk 的合成解析基準點是 workspace root、不是 `packages/ui`;pnpm 預設不 hoist package-local 依賴,`axe-core` 只能從 `packages/ui/node_modules` 解析,workspace root 解析不到,導致這個共用 chunk 裡的 `import axe from 'axe-core'` 完全解析不出來——但只有 2 個以上這樣的 spec 檔案同一個 Vitest process 一起跑才會炸(單一檔案會被 inline 進自己的 chunk,不會走這條路),這也是為什麼一開始追這個 bug 追得特別辛苦:整個 `ng test` 100% 重現,任何單檔 `--include` 跑法 0% 重現。詳細成因記在 `packages/ui/vitest-base.config.ts` 的註解裡,連同 `optimizeDeps.include: ['axe-core']`(可以省去 Vite dev server 冷啟動時 lazily 發現這個依賴的一輪)。

過程中另外撞到一個沒關係的插曲:並行 session(另一個同時在跑的 Codex session,做 P22 StackBlitz)也在改 workspace root `package.json`,兩邊的 `pnpm add`/手動編輯彼此蓋掉了對方的寫入(read-modify-write race,不是 pnpm 的 bug),`axe-core` 那行被吃掉兩次,靠比對 `pnpm-lock.yaml` 才發現、重新手動補回去並用 `pnpm install` 校正。

**過程中發現的真實 bug(不是 fixture 寫錯,已修好)**:

1. `select`:trigger 按鈕的 `role="combobox"` 代表它是用 `<input>` 那一套規則取得無障礙名稱(aria-label/aria-labelledby/關聯 `<label>`),不是像一般按鈕那樣文字內容就算數——placeholder 文字雖然視覺上看得到,但不算有效名稱來源。`SelectTriggerDirective` 完全沒有 `ariaLabel`/`ariaLabelledBy` input,docs 裡每一個 select 範例也都沒有示範任何替代標籤方式。補上這兩個 input(`packages/ui` + `registry` 兩處),docs API 表補上說明,中英文 i18n 補齊。
2. `context-menu`:`ContextMenuTriggerDirective` 掛在任意元素(通常是 `<div>`)上,加了 `aria-haspopup`/`aria-expanded`,但這兩個屬性只有在元素的 role 允許時才是合法 ARIA——bare div 的隱含 role 是 generic,不允許。修法是補 `role="button"`(`packages/ui` + `registry` 兩處),保留既有 5 個測試斷言 `aria-expanded` 的行為不變,而不是直接拿掉這兩個屬性(那樣做語意上更接近 Radix 的做法,但會動到既有測試驗證過的行為,選擇成本較低的修法)。

**page-scope 產生的雜訊(不是元件本身的問題,測試裡個別排除)**:overlay 內容用 CDK Overlay portal 到 `document.body` 之後,要檢查 a11y 就得對整個 `document.body` 跑 axe(不能只查 fixture 本身,不然漏掉 portal 出去的內容)。role="dialog"/"alertdialog" 的 overlay(dialog、alert-dialog、popover、sheet)axe 本來就有把它們排除在「region」規則外;但 role="listbox"(select)、role="menu"(dropdown-menu、context-menu)、role="tooltip"(tooltip)沒有這個排除,對著一個沒有 `<main>` 的裸測試 fixture 掃全部 `document.body` 一定會撞到「All page content should be contained by landmarks」——這是整份頁面結構層級的規則,跟被測元件本身的標記寫得好不好無關,這幾個測試個別用 `{ rules: { region: { enabled: false } } }` 排除,並在測試裡註解說明原因。

**尚未完成(當時)**:剩餘約 37 個元件還沒套用,helper 跟 pattern 已經穩定(overlay 用 `document.body` + 視需要排除 `region`;純文字/表單元件用 `fixture.nativeElement`),剩下是機械性套用工作。後續進度見下一條。

**驗證**:`packages/ui` 全部 64 個 spec 檔、229 個測試通過(`ng test @sanring/ui`,重跑兩次確認不是巧合)。`tsc --noEmit`(`packages/ui`/`apps/docs`/`packages/cli` 三個 tsconfig)、`pnpm lint`、`sync-registry.mjs`、`check-registry-sync.mjs` 全過。

---

## P11 — axe-core a11y 測試擴大到剩餘元件(完成)

- [x] 把上一條(P3 高風險批次)之後,剩下所有 component 都套上 `expectNoA11yViolations`

**做法**:延續上一條的既定 pattern 逐一套用——純文字/表單元件用 `fixture.nativeElement`;overlay 內容(hover-card、navigation-menu 子選單)appendChild 到 `document.body` 再對 `document.body` 跑 axe,視情況用 `{ rules: { region: { enabled: false } } }` 排除頁面級 landmark 規則。`sidebar` 原本完全沒有 component-level spec(只有其他 32 個元件目錄各自的原始檔),新建了 `sidebar.component.spec.ts`,組出 provider/header/content/footer/menu/menu-sub/rail/inset 的完整組合再測;`toast` 原本只有 `toast.service.spec.ts`(測 service 邏輯),新建了 `toaster.component.spec.ts` 補 component-level 覆蓋。

**過程中發現的真實 bug(不是 fixture 寫錯,已修好)**:

1. `navigation-menu`:`NavigationMenuSubTriggerComponent` 固定帶 `role="menuitem"`,但這個 role 依 ARIA 規範只能被 `role="menu"`/`"menubar"` 的祖先包住;它實際上直接坐在 `sanring-navigation-menu-content`(`role="region"`)底下,從來不在 menu 裡——docs 的 submenu 範例本身就是照這個(有問題的)結構寫的,不是測試 fixture 自己加出來的假陽性。改成 `role="button"`,呼應頂層 trigger(`NavigationMenuTriggerDirective`)本來就用純 `aria-haspopup`/`aria-expanded` 不掛 menu role 的做法(`packages/ui` + `registry` 兩處)。同時把 docs 兩處 submenu 範例(`navigation-menu.docs.ts`、`navigation-menu-page.component.ts`)內容連結上手動加的、同樣不成立的 `role="menuitem" tabindex="0"` 拿掉。
2. `collapsible`:`[sanringCollapsibleContent]` 固定帶 `role="region"`,套用在已經有自己語意 role 的宿主元素上時會整個蓋掉——最典型的受害者是 sidebar 的可摺疊子選單(`sanring-sidebar-menu-sub`,本身 `role="list"`),docs 的 sidebar 範例正是這樣組合(`<sanring-sidebar-menu-sub sanringCollapsibleContent>`)。蓋掉之後子選單底下 `role="listitem"` 的項目找不到合法的 `role="list"` 祖先,觸發 `aria-required-parent`。拿掉這個寫死的 role——WAI-ARIA 的 disclosure pattern本來就不要求內容面板有 role,`aria-labelledby` 指回 trigger 就夠(`packages/ui` + `registry` 兩處)。
3. `date-picker`/`calendar`:host 上的 `aria-required`/`aria-invalid`/`aria-describedby`(給 Angular Forms/`sanring-field` 整合用)掛在裸 `<div>`(預設 `role="generic"`)上,axe-core 的 `aria-allowed-attr` 規則判定不合法——這幾個屬性只有 combobox/gridcell/listbox/radiogroup/spinbutton/textbox/tree 等特定 role 才允許。兩個元件的 host 都補上 `role="radiogroup"`(語意上也貼近「從一組日期格挑一個」)。`calendar` 的月曆格早就用 `role="grid"` + `role="row"` 分組;`date-picker` 原本只有扁平的 `role="gridcell"` 清單、沒有 `role="row"` 包一層,ARIA grid pattern 要求 gridcell 必須在 row 裡,所以同時補了 `gridRows` computed 把 cell 依欄數切成列、樣板用 `role="row"` + `display:contents`(不影響 CSS Grid 版面)包住,對齊 `calendar` 既有的做法(`packages/ui` + `registry` 兩處)。

**query 過程中排除的假陽性(fixture 自己的問題,不是元件 bug)**:

- `avatar`:`sanring-avatar` host 固定帶 `role="img"`,不管有沒有 `ariaLabel` 都會掛上——就跟 `<img>` 沒給 `alt` 一樣,任何時候都需要一個無障礙名稱。原本測試 fixture 裡 `avatar-group` 底下有一個 `<sanring-avatar />` 沒給 `ariaLabel`,補上即可,docs 裡每一個 avatar(包含 group 內)都有給 `ariaLabel`,元件本身沒問題。
- `pagination`:`sanring-pagination`(`sanring-paginator` 的內層)預設 `role="navigation"` + `aria-label="Pagination"`,測試 fixture 裡放了兩個沒給 `ariaLabel` 的 `sanring-paginator`,兩個 `navigation` landmark 撞名觸發 `landmark-unique`。`sanring-paginator` 早就有 `ariaLabel` input 會往下傳,只是 fixture 沒用——補上第二個實例的 `ariaLabel` 即可。
- `navigation-menu`:同一份 fixture 裡,頂層 `sanring-navigation-menu-content`(`role="region"`)底下的連結被手動加了 `role="menuitem" tabindex="0"`——`NavigationMenuLinkDirective` 本身從不設這個 role,docs 除了 submenu 範例外也都沒這樣用,是這份 spec fixture 自己多加的,拿掉即可(跟上面第 1 點的 sub-trigger bug 是分開的兩件事,一個是 fixture 誤用、一個是元件預設值真的錯)。

**驗證**:`packages/ui` 全部 67 個 spec 檔、271 個測試通過(`ng test @sanring/ui`)。`tsc --noEmit`(`packages/ui`/`apps/docs` 兩個 tsconfig)、`eslint`(受影響的元件目錄)、`check-registry-sync.mjs` 全過。

---

## P9 — 自訂/第三方 registry 支援(alias:name 語法 + `sanring build`)

- [x] `sanring.config.json` 新增 `registries`(alias → URL map)與 `defaultRegistry` 選用欄位
- [x] `sanring add alias:componentName` 語法,從指定的第三方/私有 registry 安裝元件
- [x] `installedVersions` key 格式在元件被 `add`/`update` 觸及時升級為 `alias:componentName`(lazy migration,未觸及的舊 key 保留原樣)
- [x] `sanring build` 指令(讓第三方掃自己的 Angular component 目錄產出相容 `registry.json`)

**依據**:先寫了 [ADR-0001](.claude/adrs/0001-multi-registry-support.md) 定案設計決策,再依 [Task Charter](.claude/charters/p9-multi-registry.md) 的批次 A/B/C 分批執行(型別與純函式 → 10 個 command 接入 → alias 解析與 key 升級),每批獨立驗證(`tsc --noEmit`/`eslint`/`pnpm test`)後才 commit,批次 D(`sanring build`)charter 本身就標記「預設暫停」,需另立 charter 並先做 TypeScript AST 可行性 spike。

**核心設計**(細節見 ADR):`resolveRegistrySource(alias, config, flagOverride?)` 純函式封裝優先序 `flagOverride > registries[alias] > defaultRegistry > undefined`,12 個 command handler 統一透過它取得 registry 來源,不再各自處理 `options.registry`。一次 `add` 呼叫裡的所有元件必須來自同一個 registry(顯式 alias 或共用的 `defaultRegistry`)——CLI 不在單次呼叫內合併多個 registry 的 component 列表,這是 ADR 明確拒絕的替代方案(Q3)。

**執行中發現且已修的真實 bug(不是 charter 原範圍,但屬必要修正)**:`add.ts`/`remove.ts`/`update.ts`(x2)/`init.ts`(x2)這 6 處 `writeConfig(...)` 呼叫都是手動列欄位而非展開既有 config,已經會漏掉 `sharedPath`/`installedVersions`;新加的 `registries`/`defaultRegistry` 剛好也不在手寫清單裡——代表使用者一設定多重 registry,下一次 `add`/`update`/`remove` 就會把設定靜默清空,直接讓這個功能形同沒做完。發現後先停下用 `AskUserQuestion` 跟使用者確認要不要一併修,得到「現在一併修」的答案後才動手,改成 `{ ...config, ... }` 展開再覆蓋各自要變的欄位,並在 `add.test.ts`/`remove.test.ts`/`update.test.ts`/`init.test.ts` 各補一個回歸測試鎖住這個行為。

**驗證**:每個批次、每個 command 改完都各自跑過 `tsc --noEmit`/`eslint --max-warnings 0`/`pnpm test`,全數維持綠燈,最終 135 個測試通過(從批次開始前的 125 個增加,新增的都是 alias 解析、config 欄位保留、legacy key 遷移的回歸測試)。沒有連上真實網路 registry 做端到端手測——所有整合測試都用 `writeRegistryFixture` 產生的本地假 registry 驗證。

**`sanring build` 補完(2026-08-11)**:批次 A（目錄掃描 + AST import/export 分類）、批次 C（`sanring build` 指令本體）依序完成。批次 B 的 peerDependency 遞移閉包去重演算法(`computeUpstreamPeerCoverage`/`dedupePeerDependencies`)在 53 元件 golden fixture 驗證發現設計錯誤（跨元件去重會錯誤刪除使用者專案真正需要的 peer），整批移除，改為 `canonicalizePeerDependencies`（只做 `@angular/core/rxjs-interop` → `@angular/core` 等 submodule 規範化 + 同 registry 內去重，不做跨元件去重）。golden fixture 全量比對 53 元件、53 shared + 對應 peerDependencies 三個欄位零差異，`KNOWN_MISMATCHES` 清空、`it.skip` 改為強制啟用。README 補 `sanring build` 使用說明（`--source`/`--out`/`--dry-run`/`--name` 選項、典型工作流程）。

---

## P24 — registry 內容真實 bug(P9 spike/golden fixture 副產品)

P9 golden fixture 掃完 53 元件後發現一批長期存在的 registry 宣告錯誤,集中修正(2026-08-11)：

- `transfer` 4 個檔案 import 路徑錯誤(`../../utils`/`../component-styles` → 正確的 `../shared/utils`/`../shared/component-styles`);`otp-input` 同樣路徑問題
- `navigation-menu` 遺漏 `@lucide/angular` peerDependency;`accordion`/`collapsible` 遺漏 `@angular/cdk` peerDependency
- `calendar`/`checkbox`/`date-picker`/`file-upload`/`radio`/`slider`/`switch` 補 `@angular/cdk`(與 `@angular/forms`)peerDependency
- `date-picker` 遺漏 `field` componentDep;`alert-dialog` 移除錯誤宣告的 `utils` sharedDep(實際無 import)
- 11 個元件移除過度宣告的 `component-styles` sharedDep(`alert`/`alert-dialog`/`badge`/`breadcrumb`/`calendar`/`card`/`date-picker`/`link`/`tabs`/`tag`/`tooltip`);`transfer` 補上遺漏的 `component-styles` sharedDep

**驗證**:golden fixture 53 元件全量掃描 vs 手寫 `registry.json` 零差異。

---

## 查證後確認「不算差距」的項目(備查,避免重複討論)

- **PR 沒有測試/型別檢查關卡**:原 P0 已完成,不再放主 todo。已新增 PR 觸發的 CI workflow,跑 `pnpm test`、`tsc --noEmit`、`pnpm lint`。
- **可編輯 playground(Monaco/StackBlitz 匯出)**:查證後 shadcn 自己的元件文件頁也是「靜態 demo + 程式碼區塊」,沒有即時可編輯的 playground,兩邊打平,不是缺口。
- **文件版本切換(per-CLI-version docs)**:shadcn 文件站同樣沒有明顯的版本切換機制,兩邊打平,不是缺口。
