# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

只列**尚未完成**的項目。做完的項目——含查證過程、決策理由、驗證方式——記在 [DEVLOG.md](DEVLOG.md),這裡不重複贅述,避免待辦清單被歷史紀錄淹沒;查證後確認「其實不是缺口」的結論也在 DEVLOG.md 備查,避免下次重新調查一次。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。項目編號沿用歷史待辦清單的順序,做完的項目移除後編號會留空,不重新排序。

---

## P19 — Blocks:其餘六個頁面模板

起手三個(`dashboard-shell`、`login`、`table-page`)已出貨,見 [DEVLOG.md](DEVLOG.md)。剩下是覆蓋率,不是機制。

- [ ] `register`、`forgot-password`、`settings-page`、`detail-page`、`wizard`、`pricing-page`

**頁面類型與元件組合**(2026-08-22 盤點):

- `auth/register`(page):同 login + `select`(可選:角色/國家)
- `auth/forgot-password`(page):`card` + `field` + `input` + `button` + `alert`
- `layout/settings-page`(page):`tabs`(分區)+ `field` + `input` + `avatar`(頭像上傳)+ `switch` + `select` + `divider` + `button` + `alert-dialog`(刪除確認)
- `content/detail-page`(page):`card` + `avatar` + `badge` + `tabs` + `breadcrumb` + `timeline` + `tag`
- `form/wizard`(page):`stepper` + `field` + `input` + `select` + `date-picker` + `radio` + `file-upload` + `button` + `progress`
- `billing/pricing-page`(page):`card` + `badge` + `table` + `toggle`(月/年切換)+ `button` + `tag`

**成本**:中。CLI `block/` prefix、`registry.json` `blocks[]`、docs `/blocks` 頁都已就位,剩下是逐個組裝。

---

## P25 — Registry 生態系擴展（對標 shadcn registry）

目標是把目前「單人自用的 `sanring build`」升級成開放的第三方 registry 生態系，讓任何團隊或套件作者都能發布、搜尋、安裝彼此的元件。

**子項目（依實作順序）**：

- [ ] **Registry Directory**：Docs 站新增第三方 registry 目錄頁，列出社群維護的 registry（類似 shadcn 的 Registry Directory）；初期可由人工審核提交
- [ ] **Namespaces**：解決多 registry 同名元件衝突，定義 namespace 規則（目前 alias 機制已部分解決，需形式化）
- [ ] **Authentication**：CLI 支援 private registry 的 Bearer token 認證（`sanring.config.json` 加入 `auth` 欄位），讓企業內網或 private GitHub repo 可用
- [ ] **Dynamic Search API**：registry 可選擇暴露搜尋 endpoint（而非只靠靜態 JSON 全量掃描），`sanring search` 優先呼叫 endpoint
- [ ] **Docs 多頁拆分**：registry 頁面從目前的單頁拆成多頁（Introduction、Getting Started、GitHub Registries、Authentication、API Reference 等）

**現況**：`github:<owner>/<repo>` source 與 `registry.json` API Reference 已出貨，見 [DEVLOG.md](DEVLOG.md)。CLI 的 multi-registry 支援（alias:name 語法）與 GitHub source 可用。生態系其餘部分（directory、namespaces、auth、search API、docs 多頁拆分）尚未實作。

**影響**：shadcn 的 registry 生態是目前採用率的核心驅動之一——開發者能找到、安裝、分享社群元件，讓整個 UI library 不只靠官方維護。Angular 生態目前沒有等價物，這是 Sanring 差異化的機會。

**成本**：高。各子項目可獨立交付。GitHub Registries 與 API Reference 已出貨；下一步是 Directory 和 Auth。

---

## P32 — 52 元件產品/API 掃描：對齊既有組件，不新增 primitive

2026-09-22 對 `packages/ui` 52 個正式元件做產品/API 掃描（公開 input/output、兄弟組件對齊、docs 是否超賣能力）。不是重跑 P3/P26/P30 的 a11y 稽核。`check-registry-parity.mjs` 與 `check-registry-sync.mjs` 當日皆綠（52/52）。官方目錄不缺新 primitive；該做的是把兄弟組件對齊，以及把 docs 已經講出去的能力做完。

0.25.0 進行中的 input/textarea/combobox count、combobox chip wrap、dialog header `align`/獨立底色**不列入本項**，那些收斂完再看要不要疊。

### 該做

- [x] **table sticky 欄背景**：`sticky`/`stickyEnd` 已能傳進 CDK，但 CDK 只加 `position: sticky` + 位移，沒有不透明背景；捲動時文字會透出來。細節與「刻意不做」的 `CdkTextColumn` / CDK flex-layout 見 [packages/ui/src/lib/components/table/todolist.md](packages/ui/src/lib/components/table/todolist.md)
- [x] **table docs 配方**（不寫新元件）：loading skeleton rows（既有 `skeleton`）；欄位顯隱（dropdown-menu + checkbox + 動態 `sanringRowDefColumns`）。同上 todolist「使用模式」節
- [x] **sheet 對齊 dialog**：dialog content 已有內建 `showClose` / `closeAriaLabel`，header 已有 `align`；sheet 還要自己放 `[sanringSheetClose]`，`sanring-sheet-header` 沒有 `align`
- [x] **radio `size`**：checkbox / switch / otp-input 有 sm/md/lg；radio 寫死 `RADIO_SIZE_CLASS = 'aspect-square h-4 w-4'`（`radio.styles.ts`）
- [x] **dropdown-menu 真 submenu**：docs 鍵盤表寫了左右鍵開關子選單，官網範例卻是 `mouseenter` 切兩欄，不是巢狀 `menu`。checkbox / radio 範例用打勾圖示組出來即可，不必先做成一等 primitive
- [x] **popover `side` + aria fallback**：tooltip / hover-card 已有四向 `side`；popover 只做上/下，而且沒投影 title 時仍綁死 `aria-labelledby`（`popover-content.component.ts`）
- [x] **transfer 根層 `disabled` + `ariaLabel`**：現在只能 disable 單一 item（`TransferItem.disabled`）；雙列表是沒名字的 `role="group"`

### 可選（有缺口，但已有組合路徑）

- [ ] **combobox** trigger/input 補 `ariaLabel` / `ariaLabelledBy`（已有 `sanring-combobox-label` 與 field 整合）
- [ ] **select** 補獨立 `required` input（現在只從 `Validators.required` 推導，`aria-required` 吃不到純 template `[required]`）
- [ ] **toast docs** 補 `ToastOptions.class`（型別已有，走 service，不要加元件級 `class` `@Input`）

### 明確不做（查證後不是缺口，避免下次掃描重開）

- 新 primitive（`kbd` / `chart` / `toggle-group` / `empty` 等）——官方方向在 blocks 與 registry 生態，不在再堆元件
- input / textarea 再包一層 `disabled` / `aria-*` input——原生 host 屬性 + `SanringFieldControl` 是刻意的薄 API
- toast 元件級 `class` `@Input`——走 `ToastOptions.class`
- table `CdkTextColumn`、CDK flex-layout `<cdk-table>`——見 table todolist，已明示不做
- dialog 加 `[(isOpen)]`——CDK Dialog 是 service 開啟；sheet / popover 的 `isOpen` model 是另一套 overlay。沒需求不要硬對齊
- 每個控制項都加 `size`——field 高度契約是共用的 `FIELD_SIZE_CLASS`；radio 是唯一跟 checkbox/switch 並排會明顯不齊的

**現況**：52 個元件裡約 44 個判定維持。alert-dialog 沒有自己的 `class` 沒關係（複用 dialog 零件，`showClose` 預設關是對的）。dropdown-menu 的 checkbox/radio docs 範例是組合解法，不是假文件。

**影響**：不處理的話，消費者會在「看起來該有的兄弟 API」上卡關（sheet 關閉鈕、radio 尺寸、popover 左右、transfer 整組停用），或照著 dropdown-menu 鍵盤表做出不能用方向鍵開的子選單。

**成本**：中。各子項可獨立交付；table docs 配方最低、sheet/radio 次之、dropdown-menu submenu 最重（要接 `@angular/aria/menu` 巢狀，不能沿用現在的兩欄 hover）。
