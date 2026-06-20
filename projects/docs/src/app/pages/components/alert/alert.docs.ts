import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const alertPage = {
  componentId: 'alert',
  titleKey: 'component.alert',
  descriptionKey: 'alert.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'alert.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'alert.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'alert.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'alert.examples.description',
      level: 2,
      children: [
        {
          id: 'example-banner',
          titleKey: 'alert.demo.banner',
          level: 3,
        },
        {
          id: 'example-destructive',
          titleKey: 'alert.demo.destructive',
          level: 3,
        },
        {
          id: 'example-empty',
          titleKey: 'alert.demo.empty',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'alert.api.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

export const alertPageExamples = {
  basic: `<sanring-alert>
  <svg lucideInfo class="size-4"></svg>
  <h5 sanringAlertTitle>系統維護通知</h5>
  <p sanringAlertDescription>
    系統將於本週日凌晨 02:00 進行升級，屆時將暫停服務 30 分鐘。
  </p>
</sanring-alert>`,
  usageImport: `import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@sanring/ui';`,
  usageMain: `<sanring-alert variant="destructive">
  <svg lucideAlertTriangle class="size-4"></svg>
  <h5 sanringAlertTitle>危險操作</h5>
  <p sanringAlertDescription>
    此操作無法復原，請確認後再繼續。
  </p>
</sanring-alert>`,
  banner: `<sanring-alert class="mb-6 rounded-none border-x-0 border-t-0">
  <svg lucideInfo class="size-4"></svg>
  <h5 sanringAlertTitle>系統維護通知</h5>
  <p sanringAlertDescription>
    系統將於本週日凌晨 02:00 進行升級，屆時將暫停服務 30 分鐘。
  </p>
</sanring-alert>`,
  destructive: `<sanring-card>
  <sanring-card-header>
    <h3 sanringCardTitle>刪除 API 金鑰</h3>
    <p sanringCardDescription>此操作將立即影響正在使用中的應用程式。</p>
  </sanring-card-header>
  <sanring-card-content class="space-y-4">
    <sanring-alert variant="destructive">
      <svg lucideAlertTriangle class="size-4"></svg>
      <h5 sanringAlertTitle>危險操作</h5>
      <p sanringAlertDescription>
        刪除此金鑰將導致正在使用此金鑰的應用程式立刻失效，請再三確認。
      </p>
    </sanring-alert>
  </sanring-card-content>
</sanring-card>`,
  empty: `<sanring-alert>
  <svg lucideLightbulb class="size-4"></svg>
  <h5 sanringAlertTitle>尚無 API 金鑰</h5>
  <p sanringAlertDescription>
    您尚未建立任何金鑰。請點擊右上方「建立金鑰」開始串接您的應用服務。
  </p>
</sanring-alert>`,
} as const;
