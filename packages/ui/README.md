# @sanring/ui

以 Angular 22 打造的 UI 元件庫，採 standalone component、Tailwind CSS v4 樣式策略，並提供 `cn()` 工具整合 `clsx` 與 `tailwind-merge`。

> 本套件位於 [sanring-workspace](https://github.com/sanringtech/ui) monorepo，完整的開發、測試、發布流程請參考 workspace 根目錄的 README。

---

## 安裝

```bash
pnpm add @sanring/ui
# 或
npm install @sanring/ui
```

### Peer dependencies

```jsonc
{
  "@angular/common": "^22.0.0",
  "@angular/core": "^22.0.0"
}
```

請確認你的應用程式已安裝對應版本的 Angular。

### Tailwind CSS

本套件以 Tailwind CSS v4 撰寫樣式，使用前請於消費端的 Tailwind 入口加入掃描來源：

```css
/* styles.css */
@import 'tailwindcss';
@source "../node_modules/@sanring/ui";
```

---

## 使用

```ts
import { Component } from '@angular/core';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@sanring/ui';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
  template: `
    <sanring-accordion>
      <sanring-accordion-item value="item-1">
        <sanring-accordion-trigger>是否符合無障礙？</sanring-accordion-trigger>
        <sanring-accordion-content>
          是。遵循 WAI-ARIA 設計模式。
        </sanring-accordion-content>
      </sanring-accordion-item>
    </sanring-accordion>
  `,
})
export class DemoComponent {}
```

### `cn()` 工具

```ts
import { cn } from '@sanring/ui';

const classes = cn('px-2 py-1', condition && 'bg-primary', userClass);
```

底層為 `twMerge(clsx(...))`，可安全處理 Tailwind class 衝突。

---

## 元件清單

目前已釋出：

- Accordion（Accordion / AccordionItem / AccordionTrigger / AccordionContent）

更多元件持續開發中，詳見 workspace 中的 `docs` 展示站。

---

## License

尚未指定。
