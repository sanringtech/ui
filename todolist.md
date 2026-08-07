# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

---

## P1 — registry / packages/ui / docs / public-api 一致性

- [x] 建立一致性檢查,確保每個正式元件在 `registry`、`packages/ui`、docs navigation/page、`public-api.ts` 的狀態一致
- [x] 移除殘留 `menu` registry 元件,避免和 `dropdown-menu` / `context-menu` 語意重疊

**已完成**:擴充 `packages/cli/scripts/check-registry-sync.mjs`,原本只檢查 docs↔registry 兩面,現在同時檢查四面八個方向：registry.json 內部完整性(`files` 是否真的存在)、registry.json↔`registry/components/`、registry.json↔`packages/ui` lib(這正是先前 `menu` bug 的那種落差)、`packages/ui` lib↔`public-api.ts`、docs nav id↔registry.json、docs nav id↔`packages/ui` lib、docs nav id↔docs page 檔案、docs nav id↔`app.routes.ts` 路由註冊。文件化但缺實作/路由的方向一律 fail CI;實作了但還沒文件化的方向只 warn(視為正常 WIP)。用手動模擬 drift(假 registry entry、註解掉一個 public-api export)驗證過腳本抓得到,目前 50 個正式元件在全部八個方向都一致,`pnpm lint`/腳本本身都是綠的。同步把 `.github/workflows/registry-sync-check.yml` 的 `paths` 觸發範圍擴大,涵蓋新檢查會用到的檔案,避免新檢查形同虛設。

**現況**:`menu` 曾只存在於 `registry` / README,沒有 `packages/ui` lib、沒有 docs page、也沒有 public API export。此類落差會讓 CLI 可安裝清單、文件站、套件開發 surface 彼此不同步。

**風險**:使用者可能透過 CLI 安裝到未文件化、未測試、或不是正式 library surface 的元件;反過來 docs 也可能介紹 CLI 無法安裝的元件。

**成本**:中低。已有 `packages/cli/scripts/check-registry-sync.mjs`,可擴充成同時檢查 registry、docs、package lib、public API。

---

## P2 — lint 要能乾淨通過

- [x] 修復目前 `pnpm lint` 的既有錯誤,讓 lint 成為可被 CI 信任的品質門檻

**現況**:已在 P0 CI workflow 那次一併修好(見 commit `3c516aa`)。15 個既有錯誤——docs template label association(`sanringLabel` 動態 `for` 綁定的已知 false positive,補了有註明原因的 disable comment;date-picker 兩處是真的沒關聯,補上 `id`/`for`)、`combobox` input alias(套用跟 `command-item` 一致的既有慣例)、死掉的 spec unused var——全部修好,`pnpm lint` 目前是綠的。

**風險**:主流元件庫不能長期讓 lint 紅燈;否則外部貢獻、CI、release gate 都會失去可信度,真正的新問題也容易被舊錯誤淹沒。

**成本**:中。多數是局部修正,但要小心不要為了過 lint 破壞 accessibility 或既有 API。

---

## P3 — 建立 component audit matrix 並逐一盤點 lib

- [x] 建立 `COMPONENT_AUDIT.md` 或等價盤點表,列出 50 個正式 component 的品質狀態與下一步 action
- [x] 依風險分批檢查 `packages/ui` / `registry` / docs,不要用無順序的人工掃描

**盤點欄位**:每個 component 至少記錄 `registry/package/docs/public-api 一致性`、`spec 狀態`、`a11y`、`keyboard`、`API 穩定性`、`SSR/hydration 安全`、`docs 完整度`、`風險等級`、`下一步 action`。

**建議順序**:

1. ✅ 高風險互動元件(已完成,見 `COMPONENT_AUDIT.md` 的「Batch 1 Findings」):`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`。查出 3 個 P0,**全部修完**:`select` 開啟後的 listbox 沒有方向鍵導覽(只能 Tab)——補上 `FocusKeyManager`,開啟時自動 focus 選中項、方向鍵可跳過 disabled 項並循環;`command` 完全沒有測試——補了 6 個 spec;`context-menu` 完全沒有方向鍵導覽也沒有測試——新增共用的 `focusAdjacentMenuItem()` 工具函式(接在既有的 `overlayKeydown` 訂閱上,root menu 跟 submenu 各自都能用方向鍵導覽、跳過 disabled 項、循環),補了 7 個 spec,寫 spec 過程中還抓到自己寫的一個 bug(還沒開的子選單項目雖然 CSS 隱藏但還在 DOM 裡、`tabindex="0"` 還在,會被誤判成可導覽項目)並修掉了。三個都在真實瀏覽器用 Playwright 跑過一輪驗證。`sheet` 文件範例用了原始碼裡根本不存在的 `showClose` input 這個次要問題還沒修。(原本以為 `command` 的 `aria-expanded="true"` 是寫死的 bug,後來查證發現它的清單本來就沒有收合狀態,寫死是對的,已撤回這條。)
2. ✅ form/control 元件(已完成盤點且找到的問題全部修完,見 `COMPONENT_AUDIT.md` 的「Batch 2 Findings」):`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`。查出 2 個真的 bug,都在 `switch`,**都修好了**:補上 `checkedChange` output(現在可以 `[(checked)]` 雙向綁定);補上真正的 `ariaLabel`/`ariaLabelledBy` input——原本文件範例寫的 `aria-label="Toggle theme"` 掛在 `<sanring-switch>` 標籤上根本傳不到內部真正的 `role="switch"` button,修的時候發現不只文件程式碼範例錯,連即時渲染用的 demo 模板(`switch-page.component.ts`)也獨立踩了同一個坑(用 `[attr.aria-label]` 而不是走 input),兩處都修了,瀏覽器驗證過真的傳到 button 上。`checkbox`/`radio-group` 共用的 a11y 邊界案例(`aria-required` 只看原始 `required` input,沒涵蓋純用 `Validators.required` 的情況)也修好,兩邊都補了 regression spec。`date-picker`/`calendar` 零測試(鍵盤邏輯全部在外部套件 `@sanring/date-picker-core` 裡,這兩個元件本身沒有可審的鍵盤程式碼)這個沒修,還是 backlog。其餘主要是文件 API 表漏欄位,`field` 本身查起來完全乾淨。
3. ✅ display/layout 元件(已完成盤點且找到的問題全部修完,見 `COMPONENT_AUDIT.md` 的「Batch 3 Findings」):`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`。查出 2 個真的 SSR bug,同一種類型,**都修好了**:`avatar` 的 `AvatarImageDirective` 原本在建構子欄位初始化直接 `new MutationObserver(...)` 並同步 `.observe()`——改成包進 `afterNextRender`;`carousel` 的 `CarouselContentComponent` 原本在 `ngAfterViewInit()` 直接呼叫 `EmblaCarousel()`(內部會 `new ResizeObserver(...)`)——同樣改成 `afterNextRender`,跟同一批 `resizable` 既有的正確寫法一致。`resizable` 的 handle 補上了 `aria-valuenow`/`min`/`max`(反映 handle 前面那個 panel 的目前尺寸與該 panel 自己的 `minSize`/`maxSize`,為此在 `ResizableGroupComponent` 加了一個 `getBeforePanel()` 方法)。`progress` 的 `ariaValueText` 補上轉發給底層 directive。`tabs` 的 `selectionMode` 補進文件(說明 `'follow'`/`'explicit'` 自動/手動啟用的差異),`orientation` 要同時設在 `<sanring-tabs>` 跟 `<sanring-tabs-list>` 這件事——原本想用 host binding 讓 `sanring-tabs-list` 自動吃父層的值、不讓消費者能個別覆寫,但 Angular 的 host binding 語法無法綁到 hostDirectives pass-through 以外的 input(NG8002 編譯錯誤),技術上做不到乾淨的自動同步,改成把「為什麼要設兩次」寫清楚進文件跟原始碼註解。`table` 的文件曾經真的引用不存在的 `<sanring-paginator>`,但等到要修的時候查證發現另一個並行工作階段已經把這個元件補齊、註冊完整、API 跟文件範例完全對得上——不需要改程式碼,已在稽核表更正這條過時的結論。所有修復都在真實瀏覽器用 Playwright 跑過一輪驗證,無 console error。

**風險**:如果沒有盤點矩陣,逐一檢查 lib 很容易變成「看過但沒有結論」,也會先花時間在低風險元件,延後發現真正影響 production 採用的互動/a11y/API 問題。

**成本**:中。先建立矩陣成本低,但後續每批元件需要逐一補結論與 follow-up。

---

## P4 — 每個 component 至少有最低 spec

- [x] 補齊無 spec 元件的最低測試:render、class merging、a11y/keyboard 核心行為

**已完成**:50 個正式 component 現在都有至少一個 package-level `.spec.ts` baseline。這次補齊 `alert`、`avatar`、`badge`、`breadcrumb`、`calendar`、`card`、`carousel`、`date-picker`、`divider`、`hover-card`、`label`、`link`、`resizable`、`spinner`、`table`；`command`、`context-menu` 也已在高風險互動元件盤點中補齊。最低 spec 覆蓋 render、class merging、重要 aria/security attribute、以及互動元件的核心 keyboard/open/selection 行為。

**風險**:headless component library 的信任感很大一部分來自互動與 a11y 穩定性。沒有最低 spec 時,重構 styling、ARIA、keyboard 行為都容易出現隱性退化。

**成本**:中高。可先從高風險互動元件開始: `dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`。

---

## P5 — docs 要成為採用入口

- [x] 補齊每個 component docs 的採用資訊:usage、installation、API、accessibility notes、keyboard behavior、controlled/uncontrolled 或 state 說明

**現況**:docs page 覆蓋度已不錯,但主流採用入口需要更穩定的資訊架構。`menu` 缺頁問題已改以移除 `menu` 解決;後續重點是讓保留下來的正式元件文件完整、可預期。

**進度**:已先修正可查證的採用/API 準確性缺口,但 P5 整體尚未完成。第一批:`sheet` 文件移除不存在的 `showClose` API 與會編譯失敗的 `[showClose]="false"` 範例,改成自訂 `sanringSheetClose` close control 範例;`calendar` API 表補上 `id`、`required`、`ariaDescribedBy`、`jumpMonthLabel`、`jumpYearLabel`、`focus()`;`date-picker` API 表補上 `id`、`required`、`ariaDescribedBy`、`focus()`。第二批:`otp-input` API 表補上 `name`、`autocomplete`、`required`、`ariaLabel`、`ariaLabelledBy`、`ariaDescribedBy`、`pasted`、`slotKeydown`;`slider` 補 `tabIndex`;`radio` 補 `RadioGroupComponent.id`;`dropdown-menu` 補 `id`、`wrap`、`typeaheadDelay`;`select` 補 `id`、`contentId`、`placeholder`,並把 `value` 說明改清楚為唯讀 getter、值更新應走 Angular Forms。

**完成標準**:每個正式 component docs 至少具備:usage/imports、installation、API table、accessibility notes、keyboard behavior、state model(controlled/uncontrolled、CVA、model/input/output 或 service-driven 狀態)。

**下一步**:

- [x] 建立 docs completeness checklist/matrix,逐頁標記 usage、installation、API、accessibility、keyboard、state model 是否完成
- [x] 先補高互動元件的 adoption notes:`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`
- [x] 再補表單元件的 field/CVA/state 說明:`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`
- [x] 最後補 display/layout 元件的 accessibility semantics 與 keyboard note:`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`

**風險**:即使元件可用,若文件缺少 a11y、keyboard、state model 與 API 說明,使用者會很難判斷它是否適合 production。

**成本**:中。可搭配 component audit matrix 逐一補,避免每頁格式與深度不一致。

---

## P6 — package-only 使用者的 theme token 入口(已評估,暫不執行)

- [x] 評估是否要讓 package-only(不透過 CLI)使用者取得 theme CSS

**原始現況(2026-08 前)**:`registry/shared/theme.css` 已經提供完整 `--sanring-*` CSS custom properties,`registry/registry.json` 也已把 `theme` 宣告為 shared dependency;`sanring init` 會產生 `src/sanring-theme.css`,docs theming page 也有說明。但如果使用者只從 npm 安裝 `@sanring/ui`,目前不夠直覺地知道 `bg-[var(--sanring-border)]`、`text-[var(--sanring-foreground)]` 等 token 要從哪裡設定。

**查證後發現前提不成立**:`@sanring/ui` 目前**沒有被發布到 npm**,而且是刻意設計成這樣——`packages/ui/package.json` 是 `private: true`、`.changeset/config.json` 把 `@sanring/ui` 明確排除在版本管理外、`release.yml` 只在 `packages/cli/**`/`registry/**` 變動時觸發,`release` script 也只 build/publish `@sanring/cli`。唯一真實存在的發布管道是 CLI 把 `registry/` 的原始碼複製進使用者專案(shadcn 那套模式),「只從 npm 安裝 @sanring/ui」這個使用情境目前不存在,原始「現況」段的假設不成立。

**結論**:不執行,維持 CLI-only 發布模式。要讓這個情境成立,前提是先決定要不要把 `@sanring/ui` 也發布成傳統 npm 依賴套件——那是一個獨立、更大的策略決定(牽涉 semver 版本紀律、使用者失去「程式碼歸你、可以隨便改」的 CLI 模式優勢、兩條發布管道共存的複雜度),不是「補一個 CSS export」這麼小的事。若之後真的要發 npm 套件,「要不要發 npm 套件」本身應該先開一個新的 P 項目評估,這條再接在後面做。

**技術備查(留給未來參考)**:實測過 ng-packagr 的 `assets` 設定會拒絕讀取 project root 以外的檔案(不能直接指到 `../../registry/shared/theme.css`),且它會自己產生/覆寫 `package.json` 的 `exports` 欄位(預設只有 `.` 跟 `./package.json`)。這條路技術上可行,但要嘛把 theme.css 複製一份進 `packages/ui/` 自己顧跟 `registry/shared/theme.css` 同步,要嘛接受兩份 source of truth。

---

## P7 — docs 站沒有搜尋功能

- [x] 幫 docs 站加上搜尋(至少支援元件名稱/描述搜尋,理想上做成 Cmd+K 面板)

**現況(更新)**:查證後發現 `apps/docs/src/app/shell/header/feature-list.component.ts` 其實已經有完整的 Cmd+K 搜尋面板(快捷鍵、fuzzy match、鍵盤導覽都做了),原本的「找不到任何搜尋元件」現況查證是舊的、不準。真正的落差只有：搜尋索引只比對翻譯過的元件名稱(`labelKey`),沒有比對描述文字，跟這裡「至少支援名稱/描述搜尋」的要求還差一步。

**已完成**:`docsComponentItems`(`apps/docs/src/app/navigation/docs-navigation.ts`)每筆補上 `descriptionKey`(對應各元件 `.docs.ts` 裡本來就有的 `page.descriptionKey`，型別化、雙語言都不用另外維護);`feature-list.component.ts` 的 `searchIndex`/`filteredItems` 改成先比對名稱、名稱沒中才退而求其次比對描述(用固定偏移量讓名稱命中永遠排前面);結果項目改成兩行式，名稱下面帶一行描述摘要。已用 Playwright 手動驗證：搜尋不在名稱裡的描述字串(如 "vertically stacked")能正確命中 Accordion 並正常導頁。

---

## P8 — 沒有 MCP server 整合

- [x] 實作 `@sanring/cli` MCP server 支援,讓 Claude Code / Cursor 等 AI agent 能直接查詢、安裝元件

**已完成**：新增 `packages/cli/src/commands/mcp.ts`，加入 `@modelcontextprotocol/sdk@1.30.0` 依賴，以 lower-level `Server` API（NodeNext ESM 相容、不額外依賴 zod）實作四個 tool：`list_components`（列出全部 52 個元件）、`search_components`（名稱優先搜尋）、`get_component_info`（含 files、自動安裝的 componentDeps、shared utilities、peerDeps）、`add_component`（`cwd` 參數指定 Angular project root，子程序執行 `sanring add --yes`）。`sanring mcp` command 透過 stdio transport 啟動，`serverInfo.version` 正確讀取 CLI 版本。已補 `packages/cli/src/commands/mcp.test.ts`，用 MCP SDK `Client` + `InMemoryTransport` 覆蓋 tools/list、search、detail、add tool boundary；README 也補上 Claude Code / local development 設定方式。

**使用方式**（待合回 main 後生效）：在 `.claude/mcp.json` 或 Claude Code 設定中加入：
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

## P9 — 沒有自訂/第三方 registry 支援

- [ ] 評估支援 `@namespace/component` 語法 + `sanring build` 指令,讓團隊可以架自己的私有 registry

**現況**:`registry.ts` 沒有 namespace 概念,`packages/cli/src/commands/` 沒有 `build` 指令。目前 CLI 只認一個寫死的 registry 來源。

**對比**:shadcn 支援混用官方 registry + 團隊自己的私有 registry。優先度較低,除非近期有多團隊/多產品線共用元件庫的需求才需要拉高。

---

## P10 — `sanring init` 沒有 monorepo/workspace 偵測

- [x] 評估 `init` 指令加上 monorepo 結構偵測與對應處理邏輯

**已完成**:在 `utils.ts` 新增三個函式：`detectMonorepoRoot()`(偵測單一目錄是否為 monorepo root,辨識 pnpm-workspace.yaml / lerna.json / turbo.json / nx.json(無 angular.json 時) / package.json workspaces)、`findMonorepoAncestor()`(從 startDir 往上走直到找到 monorepo root 或碰到 filesystem root)、`findAngularProjectsInWorkspace()`(在 workspace root 下搜尋最多 2 層深的 angular.json,跳過 node_modules/.git/dist 等目錄)。`init.ts` 移除 `requireAngularProject()` 硬停,改成:若 cwd 無 angular.json → 往上找 monorepo root → 搜尋 workspace 內的 Angular 專案 → 找到一個自動選取、找到多個列出讓使用者互動選取(--yes 模式直接 fail 並印出 cd 指令)。所有後續操作改用 `projectRoot`(可能不同於 cwd)。補 5 個 init monorepo 整合測試,目前 92 tests 全過。

**現況**:`sanring init` 已不再假設 cwd 必須就是單一 Angular 專案 root。從 workspace root 或 workspace 子目錄執行時,會先辨識 monorepo root,再把設定檔、theme CSS、dependency install、global stylesheet import 寫到實際 Angular project root。已覆蓋單一 project 自動選取、多 project + `--yes` fail、workspace 內無 Angular project、非 Angular/非 monorepo 目錄、以及兩層深 Angular project 等情境。

**限制**:目前只搜尋 workspace root 往下最多 2 層深的 `angular.json`,這符合常見 `apps/web`、`packages/admin`、`apps/feature/web` 結構,但不涵蓋更深或非標準 layout。`nx.json` 只有在同目錄沒有 `angular.json` 時才視為 monorepo 訊號,避免把單一 Nx Angular 專案誤判成 workspace root。

---

## P11 — 品質關卡類(優先度較低,長期補強)

- [ ] 自動化 a11y 測試(如 axe-core),目前 UI library 完全沒有無障礙迴歸的自動把關,只能靠人工肉眼抓
- [ ] 視覺回歸測試(如 Chromatic / Playwright screenshot),CSS 改動有沒有意外破壞其他元件外觀,現在沒有自動偵測
- [ ] CLI 補真正的 e2e 測試(拉一個全新 Angular 專案、真的跑 `sanring add`、真的 `ng build`)——現有的 `add.test.ts`/`doctor.test.ts` 等是對假的檔案系統 mock 驗證邏輯,不是「CLI 真的能在使用者機器上跑起來」的保證

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

**風險**:低,是行為不變的重構,但散落的邏輯會讓未來改動(例如 P9 的 namespace 支援要動到每個 command)成本變高——先收斂能讓那類改動的 diff 小很多。

**成本**:低。四項都可以各自獨立成一個小 PR,合計約半天工作量。

---

## P14 — UI lib 效能與重複邏輯優化

- [x] 約 4 成元件(實測 162 個 `@Component` 檔案中有 69 個)未明確設定 `ChangeDetectionStrategy.OnPush`,包含 `select`、`switch`、`combobox`、`command`、`tabs`、`tree`、`tooltip`、`dropdown-menu` 等已經是 signals-based 寫法的元件,等於沒拿到 OnPush 的效能紅利
- [ ] 9 個表單元件(`checkbox`/`switch`/`radio-group`/`slider`/`otp-input`/`date-picker`/`calendar`/`file-upload`/`combobox`)各自重複一份幾乎逐字相同的 `XxxFieldControlAdapter` + CVA state-bridge 邏輯(約 500–600 行複製貼上),`shared/` 目錄目前沒有對應抽象
- [x] `navigation-menu-sub-content`/`context-menu-sub-content`/`context-menu-content` 三個元件各自手刻幾乎相同的 CDK Overlay 生命週期邏輯(建立/attach/detach `OverlayRef`、`outsidePointerEvents`/`keydownEvents` 訂閱、destroy 清理),約 50–60 行重複 3 次
- [x] `resizable/resizable.utils.ts:75` 的 `Array.from(groupElement.children) as HTMLElement[]` 是沒有 runtime guard 的型別斷言(`children` 是 `HTMLCollection`,假設全部是 `HTMLElement`,一般成立但沒檢查)

**現況**:2026-08-06 code review(人工抽查 12–15 個代表性元件 + `shared/` 全目錄,並用 grep 驗證 OnPush 覆蓋率數字)發現的落差。已確認乾淨、不用動的部分:`components/` 裡沒有 `any`、沒有殘留的舊式 `@Input()`/`@Output()` decorator(全部是 signal-based)、`cn()`/`uniqueId()` 已統一在 `utils.ts`、所有 `.subscribe()` 都有正確清理(`takeUntilDestroyed` 或隨 `overlayRef.dispose()` complete)、`package.json` 依賴合理無大材小用。

**已完成**:OnPush 清理:全部 162 個 `@Component` 現在都設了 `ChangeDetectionStrategy.OnPush`(packages/ui + registry 雙向同步),同時修正 registry `context-menu-content`/`context-menu-sub-content` 之前缺漏的方向鍵導覽(`ArrowDown`/`ArrowUp` → `focusAdjacentMenuItem`)與 `menu-navigation` sharedDep。Overlay 生命週期抽共用 class:新增 `packages/ui/src/lib/components/shared/menu-overlay-controller.ts`(`MenuOverlayController`)與對應的 `registry/shared/menu-overlay-controller.ts`。三個 content 元件(`context-menu-content`、`context-menu-sub-content`、`navigation-menu-sub-content`)各自從 ~50 行手刻邏輯改為直接用 `MenuOverlayController`,兩種 origin 型別(`{x,y}` 座標 vs `ElementRef`)均支援;registry.json 新增 `menu-overlay-controller` shared 條目並更新 context-menu/navigation-menu 的 `sharedDeps`。`resizable.utils.ts` 型別斷言改成 `.filter((el): el is HTMLElement => el instanceof HTMLElement)`,移除 unsafe cast。

**剩餘**:CVA adapter 大重構(範圍最大,建議等有新表單元件加入或有明確 bug/效能動機時再做,不建議純粹為了 DRY 就大動表單核心邏輯)。

**成本**:CVA adapter 重構高(牽涉 9 個檔案的表單核心邏輯,改完要重新驗證每個元件的 Angular Forms 整合沒有壞掉)。

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

**成本**:中。型別定義低成本;`add`/`update` 寫入版本低成本;`migrate` 指令本身中等成本(需要處理缺 installedVersions 的降級邏輯、`--check` 模式、registry not found 等邊界情況)。

---

## P16 — Docs 站沒有暗色模式切換

- [ ] 在 docs header 加入 light / dark / system 三段切換,並讓全站 CSS variables 隨之切換

**現況**:`packages/ui` 的元件本身已經用 `--sanring-*` CSS custom properties,支援 dark mode;但 docs 站本身沒有提供切換按鈕,使用者只能依賴系統設定。

**影響**:開發者打開元件庫 docs 第一件事通常是切 dark mode 看元件效果,沒有切換按鈕會讓人對「這個 lib 有沒有認真維護 dark mode」產生懷疑,屬於第一印象層面的信任訊號。

**成本**:低。docs 站已有 CSS variables 骨架,只需要在 `<html>` 加 class/data-attribute、用一個 signal 做狀態、寫入 `localStorage` 持久化,約半天。

---

## P17 — Component 頁面沒有顯示該元件自己的 changelog

- [ ] 每個 component 頁面底部加一個「Recent changes」區塊,從 `componentChangelog` 過濾出 `componentIds` 包含該元件的最新 N 筆

**現況**:`component-changelog.ts` 裡每筆 change 都有 `componentIds?: DocsComponentId[]`,這份資料已經在用(驅動 sidebar 的「Updated」badge),但 component 頁面本身完全沒有顯示。

**影響**:使用者升版時想知道「這個元件到底改了什麼」,現在要去全局 changelog 自己找;shadcn 每個元件頁頂部有 "Updated X days ago" 連結。

**成本**:低。資料已有,只需要在 `component-page-header` 或頁面底部加一個 section,從現有 changelog 陣列過濾、渲染即可。

---

## P18 — `sanring list --outdated`：安裝元件的更新狀態概覽

- [ ] 新增 `sanring list --outdated`(或獨立指令 `sanring outdated`),快速顯示哪些已安裝元件的本地檔案和 registry 目前版本不同

**現況**:`diff` 指令可以逐檔比較,`update` 會實際套用,`migrate` 處理 breaking changes。但沒有一個指令能像 `npm outdated` 那樣一眼看出「我裝了哪些元件、哪些有更新、哪些是乾淨的」。

**差異**:`diff` 太詳細(每個檔案都展開);`update --dry-run` 要拿到結果需要執行整個 update 流程;這裡要的是一個 **5 秒 status overview**,只輸出元件名稱 + 狀態(up-to-date / outdated / has-conflicts)。

**成本**:中低。可以在 `list.ts` 加一個 `--outdated` flag,或另開 `outdated.ts`。核心邏輯可重用 `update.ts` 的 classify 邏輯,只差最後不寫檔案改為彙整輸出。

---

## P19 — Blocks：可直接安裝的頁面級組合模板

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

## P20 — Theme Presets：具名主題預設 + 互動式主題產生器

- [ ] 提供數個可直接套用的具名主題(如 Default、Slate、Warm、High-Contrast),讓 `sanring init --theme slate` 能直接寫入對應的 CSS variables
- [ ] Docs theming page 加入互動式調色預覽,讓使用者即時看到改變 accent/background/radius 的效果並複製 CSS

**現況**:docs 有 theming page 說明 CSS variables,`sanring init` 會寫入一份 `sanring-theme.css`,但只有一套預設值,使用者要自訂必須手動改 token。

**影響**:使用者不想從頭調 20 個 token。「我要暖色系/我要深藍色/我要更大的圓角」這類需求,具名 preset 能立刻滿足。shadcn 的 theme builder 是 docs 站停留時間最長的頁面之一。

**成本**:中。Preset CSS 本身低成本;互動式 preview 中等成本(需要在 docs 裡動態套用 CSS variables 並即時反映到 demo 元件)。

---

## P21 — `ng add @sanring/cli` Schematics 支援

- [ ] 實作 Angular Schematics,讓 `ng add @sanring/cli` 等同於跑完 `sanring init` 的全部步驟

**現況**:安裝入口是 `npx @sanring/cli@latest init`,這對於習慣 Angular CLI 的使用者並不直覺。Angular 生態系預期 UI 工具都支援 `ng add`(Angular Material、PrimeNG、Spartan UI 都有)。

**影響**:在 Angular 社群中,`ng add` 是「這是 Angular-native 工具」的一種認証訊號。缺少時,Angular 開發者會覺得這個工具「是給 React 的人做的、硬套在 Angular 上」。

**實作方向**:在 `packages/cli/` 加入 `schematics/` 目錄,`package.json` 加上 `"ng-add": { "save": "devDependencies" }` + `"schematics": "./schematics/collection.json"`;schematic 的主體就是 spawn `sanring init` 或重用其邏輯。

**成本**:中低。Angular Schematics 本身有固定樣板,核心邏輯直接重用 `init.ts`。主要成本是熟悉 Schematics API 和測試工具鏈。

---

## P22 — Docs component 頁面加入 StackBlitz 快捷連結

- [ ] 每個 component 頁面的 code previewer 旁加一個「Open in StackBlitz」按鈕,讓使用者不用本地安裝就能試用

**現況**:Docs 的 code previewer 是靜態展示,使用者若想動手試要先本地建好 Angular 專案並跑完 `sanring init` + `sanring add`。

**差異**:這裡的目標是「一鍵開啟含有該元件的最小 Angular 專案」,而非在 docs 頁面內嵌入可編輯 editor(已確認 shadcn 自己的 docs 也不這樣做,兩邊打平)。StackBlitz 支援從 URL params 或 POST 預填專案內容,可以把 component 程式碼預先注入。

**成本**:中。StackBlitz SDK 有 `sdk.openProject()` API,需要為每個元件準備一份最小化的 Angular 專案 template + 注入對應的元件程式碼。可以先做成通用 template,再逐元件補範例程式碼。

---

## 查證後確認「不算差距」的項目(備查,避免重複討論)

- **PR 沒有測試/型別檢查關卡**:原 P0 已完成,目前不再放主 todo。已新增 PR 觸發的 CI workflow,跑 `pnpm test`、`tsc --noEmit`、`pnpm lint`。
- **可編輯 playground(Monaco/StackBlitz 匯出)**:查證後 shadcn 自己的元件文件頁也是「靜態 demo + 程式碼區塊」,沒有即時可編輯的 playground,兩邊打平,不是缺口。
- **文件版本切換(per-CLI-version docs)**:shadcn 文件站同樣沒有明顯的版本切換機制,兩邊打平,不是缺口。
