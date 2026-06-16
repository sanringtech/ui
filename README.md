# @sanring/ui

以 Angular 22 打造的 UI 元件庫與文件展示站，使用 Tailwind CSS v4 進行樣式設計，並透過 `cn()` 工具整合 `clsx` + `tailwind-merge` 的樣式合併策略。

本倉庫採 Angular CLI monorepo 結構，同時容納可發布的元件庫與本地的文件 / 展示應用程式。

---

## 技術堆疊

| 類別        | 工具                                                         |
| ----------- | ------------------------------------------------------------ |
| 框架        | [Angular 22](https://angular.dev)                            |
| 元件庫打包  | [ng-packagr](https://github.com/ng-packagr/ng-packagr)       |
| 樣式        | [Tailwind CSS v4](https://tailwindcss.com) + PostCSS         |
| Class 合併  | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| Icon        | [@lucide/angular](https://lucide.dev)                        |
| 測試        | [Vitest](https://vitest.dev)（透過 `@angular/build:unit-test`） |
| Lint        | [ESLint](https://eslint.org) + [angular-eslint](https://github.com/angular-eslint/angular-eslint) + [typescript-eslint](https://typescript-eslint.io) |
| 格式化      | [Prettier](https://prettier.io)                              |
| 套件管理    | [pnpm](https://pnpm.io) 10                                   |
| TypeScript  | 6.x（target `ES2022`，`module: preserve`）                   |

---

## 目錄結構

```text
sanring-workspace/
├─ projects/
│  ├─ sanring/
│  │  └─ ui/                    # @sanring/ui — 可發布的元件庫
│  │     ├─ src/
│  │     │  ├─ lib/
│  │     │  │  ├─ components/   # 元件實作（例如 accordion）
│  │     │  │  ├─ ui.ts
│  │     │  │  └─ utils.ts      # cn() 等工具
│  │     │  └─ public-api.ts    # 對外 export 入口
│  │     ├─ ng-package.json
│  │     ├─ package.json
│  │     └─ tsconfig.lib*.json
│  └─ docs/                     # 文件 / 展示站（Angular 應用）
│     ├─ src/
│     │  ├─ app/
│     │  │  ├─ blocks/          # docs 區塊
│     │  │  ├─ layouts/         # docs / plain layout
│     │  │  ├─ pages/           # 各元件範例頁
│     │  │  ├─ app.routes.ts
│     │  │  ├─ app.config.ts
│     │  │  └─ app.ts
│     │  ├─ styles.css          # Tailwind 入口、design token
│     │  ├─ index.html
│     │  └─ main.ts
│     └─ tsconfig.app.json
├─ angular.json                 # workspace 設定（兩個 project）
├─ eslint.config.js             # flat config，含 selector 前綴規則
├─ tailwind.config.js
├─ .postcssrc.json
├─ tsconfig.json                # path alias：@sanring/ui
├─ package.json
└─ pnpm-lock.yaml
```

### 路徑別名

`tsconfig.json` 已設定：

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@sanring/ui": ["./projects/sanring/ui/src/public-api.ts"]
    }
  }
}
```

`docs` 應用程式直接以 `import { ... } from '@sanring/ui'` 引用元件庫，不需先 build。

---

## 環境需求

- Node.js **>= 20.19**（建議 22 LTS）
- pnpm **10.33+**

推薦使用 [Corepack](https://nodejs.org/api/corepack.html) 自動鎖定 pnpm 版本：

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

---

## 安裝

```bash
pnpm install
```

> 本專案以 pnpm 為唯一套件管理器（已於 `package.json` 透過 `packageManager` 欄位鎖定）。請勿混用 npm / yarn，避免 lockfile 漂移。

---

## 常用指令

| 指令              | 說明                                                         |
| ----------------- | ------------------------------------------------------------ |
| `pnpm start`      | 啟動 `docs` 應用程式（dev server，預設 `http://localhost:4200`） |
| `pnpm build`      | 預設 build 第一個 project（即 `@sanring/ui`），輸出 `dist/`  |
| `pnpm watch`      | 以 development 設定持續監看 build                            |
| `pnpm test`       | 執行 Vitest 單元測試                                         |
| `pnpm lint`       | 全專案執行 ESLint                                            |
| `pnpm lint:ng`    | 透過 Angular CLI 對每個 project 跑 lint                      |

針對個別 project，亦可直接用 Angular CLI：

```bash
# 啟動 docs 站
pnpm ng serve docs

# 只 build 元件庫
pnpm ng build @sanring/ui

# 只測試某一個 project
pnpm ng test @sanring/ui
pnpm ng test docs
```

---

## 開發 — 文件 / 展示站

```bash
pnpm start            # 等同於 pnpm ng serve docs
```

開啟 `http://localhost:4200`，預設會導向 `components/accordion` 頁面。

`projects/docs/src/styles.css` 為 Tailwind 入口，並透過 `@source` 指令同時掃描 `docs` 與 `@sanring/ui` 兩個來源：

```css
@import 'tailwindcss';
@source "./app";
@source "../../sanring/ui/src";
```

CSS 變數（design token，例如 `--docs-bg`、`--primary` 等）也在此檔定義，支援 `:root[data-theme='light']` 切換淺色主題。

### Selector 前綴

ESLint 規則已強制：

- `projects/docs/**`：元件 selector 前綴 `app`（kebab-case）、指令前綴 `app`（camelCase）
- `projects/sanring/ui/**`：元件 selector 前綴 `sanring`（kebab-case）、指令前綴 `sanring`（camelCase）

新增元件 / 指令時請遵守，否則 `pnpm lint` 會失敗。

---

## 開發 — 元件庫 `@sanring/ui`

### 新增元件

```bash
pnpm ng generate component components/<name> --project=@sanring/ui
```

依預設 schematic 會建立 inline template / inline style、skip tests 的 standalone component。請於 `projects/sanring/ui/src/public-api.ts` 補上 export，才會被消費端看見。

### `cn()` 樣式合併工具

`projects/sanring/ui/src/lib/utils.ts`：

```ts
import { cn } from '@sanring/ui';

const classes = cn('px-2 py-1', condition && 'bg-primary', userClass);
```

底層為 `twMerge(clsx(...))`，可安全處理 Tailwind class 衝突。

### 建置與發布

```bash
pnpm ng build @sanring/ui                # 預設 production 設定
pnpm ng build @sanring/ui --configuration development
```

產物會輸出到 `dist/sanring/ui`。發布到 npm：

```bash
cd dist/sanring/ui
npm publish --access public
```

> 首次發布前請確認 `projects/sanring/ui/package.json` 的 `version`，並登入對應的 npm 帳號 / organization。

---

## 測試

```bash
pnpm test                         # workspace 預設 project
pnpm ng test @sanring/ui          # 只跑元件庫
pnpm ng test docs                 # 只跑 docs
```

Runner 為 Vitest，沿用 `@angular/build:unit-test` builder；額外環境（如 DOM）已透過 `jsdom` 提供。

---

## Lint 與格式化

```bash
pnpm lint        # ESLint flat config
pnpm lint:ng     # 透過 Angular CLI 對每個 project 執行 lint
```

格式化使用 Prettier，設定見 `.prettierrc`。建議於 IDE 啟用「儲存時格式化」。

---

## VS Code

`.vscode/extensions.json` 已建議安裝下列擴充套件以獲得最佳開發體驗：

- Angular Language Service
- ESLint
- Prettier
- Tailwind CSS IntelliSense

`.vscode/settings.json` 內含本專案的 workspace 設定（請依需求調整）。

---

## 貢獻流程

1. 從 `main` 開新分支（建議命名：`feat/<scope>`、`fix/<scope>`、`docs/<scope>`）。
2. 開發完成後執行：

   ```bash
   pnpm lint
   pnpm test
   pnpm ng build @sanring/ui
   ```

3. 提交 commit（建議遵循 [Conventional Commits](https://www.conventionalcommits.org/)）。
4. 發 Pull Request 至 `main`，並於描述中說明：變更動機、影響範圍、測試方式。

---

## License

尚未指定。如需公開發布，請於倉庫根目錄補上 `LICENSE` 檔案，並於 `projects/sanring/ui/package.json` 補上 `license` 欄位。
