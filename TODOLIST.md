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
