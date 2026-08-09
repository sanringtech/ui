import { createSanringStackBlitzProject, SanringStackBlitzConfig } from './project';

export async function openSanringStackBlitz(config: SanringStackBlitzConfig): Promise<void> {
  const sdk = await import('@stackblitz/sdk');

  sdk.default.openProject(createSanringStackBlitzProject(config), {
    newWindow: true,
    openFile: ['src/app/app.component.ts,src/styles.css', 'package.json'],
    showSidebar: true,
    startScript: 'start',
    terminalHeight: 35,
  });
}
