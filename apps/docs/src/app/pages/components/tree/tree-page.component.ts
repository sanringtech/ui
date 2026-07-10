import { Component, inject, signal } from '@angular/core';
import { LucideChevronRight, LucideFile, LucideFolder, LucideFolderOpen } from '@lucide/angular';
import { cn, SANRING_TREE_IMPORTS, TreeNodeComponent } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { treePage, treePageExamples } from './tree.docs';

@Component({
  selector: 'app-tree-page',
  imports: [
    SANRING_TREE_IMPORTS,
    LucideChevronRight,
    LucideFile,
    LucideFolder,
    LucideFolderOpen,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="w-[min(460px,100%)]">
            <sanring-tree
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-2"
              [expandedValue]="expandedValue()"
              (expandedValueChange)="expandedValue.set($event)"
              [selectedValue]="selectedValue()"
              (selectedValueChange)="selectedValue.set($event)"
              #tree
            >
              <sanring-tree-node value="src" #srcNode="sanringTreeNode">
                <button type="button" tabindex="-1" [class]="folderButtonClass(srcNode)" sanringTreeTrigger>
                  <svg lucideChevronRight [class]="chevronClass(srcNode)"></svg>
                  @if (srcNode.isExpanded()) {
                    <svg lucideFolderOpen class="size-4 text-[var(--docs-accent-strong)]"></svg>
                  } @else {
                    <svg lucideFolder class="size-4 text-[var(--docs-accent-strong)]"></svg>
                  }
                  <span>src</span>
                </button>
                <sanring-tree-group>
                  <sanring-tree-node value="src/app" #appNode="sanringTreeNode">
                    <button type="button" tabindex="-1" [class]="folderButtonClass(appNode)" sanringTreeTrigger>
                      <svg lucideChevronRight [class]="chevronClass(appNode)"></svg>
                      @if (appNode.isExpanded()) {
                        <svg lucideFolderOpen class="size-4 text-[var(--docs-accent-strong)]"></svg>
                      } @else {
                        <svg lucideFolder class="size-4 text-[var(--docs-accent-strong)]"></svg>
                      }
                      <span>app</span>
                    </button>
                    <sanring-tree-group>
                      <sanring-tree-node value="src/app/app.component.ts" #appComponentNode="sanringTreeNode">
                        <button
                          type="button"
                          tabindex="-1"
                          [class]="fileButtonClass(appComponentNode)"
                          (click)="tree.selectNode('src/app/app.component.ts')"
                        >
                          <span class="w-4"></span>
                          <svg lucideFile class="size-4 text-[var(--docs-muted)]"></svg>
                          <span>app.component.ts</span>
                        </button>
                      </sanring-tree-node>
                      <sanring-tree-node value="src/app/app.routes.ts" #appRoutesNode="sanringTreeNode">
                        <button
                          type="button"
                          tabindex="-1"
                          [class]="fileButtonClass(appRoutesNode)"
                          (click)="tree.selectNode('src/app/app.routes.ts')"
                        >
                          <span class="w-4"></span>
                          <svg lucideFile class="size-4 text-[var(--docs-muted)]"></svg>
                          <span>app.routes.ts</span>
                        </button>
                      </sanring-tree-node>
                    </sanring-tree-group>
                  </sanring-tree-node>

                  <sanring-tree-node value="src/styles.css" #stylesNode="sanringTreeNode">
                    <button
                      type="button"
                      tabindex="-1"
                      [class]="fileButtonClass(stylesNode)"
                      (click)="tree.selectNode('src/styles.css')"
                    >
                      <span class="w-4"></span>
                      <svg lucideFile class="size-4 text-[var(--docs-muted)]"></svg>
                      <span>styles.css</span>
                    </button>
                  </sanring-tree-node>
                </sanring-tree-group>
              </sanring-tree-node>

              <sanring-tree-node value="package.json" #packageJsonNode="sanringTreeNode">
                <button
                  type="button"
                  tabindex="-1"
                  [class]="fileButtonClass(packageJsonNode)"
                  (click)="tree.selectNode('package.json')"
                >
                  <span class="w-4"></span>
                  <svg lucideFile class="size-4 text-[var(--docs-muted)]"></svg>
                  <span>package.json</span>
                </button>
              </sanring-tree-node>
            </sanring-tree>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports
            [code]="examples.usageImport"
            [individualCode]="examples.usageIndividualImports"
          />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="tree"
          manualSnippet="import { SANRING_TREE_IMPORTS } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <div
          class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class TreePageComponent {
  protected readonly page = treePage;
  protected readonly examples = treePageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly expandedValue = signal<string[]>(['src', 'src/app']);
  protected readonly selectedValue = signal<string | null>('src/app/app.component.ts');

  private readonly baseNodeButtonClass =
    'flex h-8 w-full min-w-0 items-center gap-2 rounded-[var(--sanring-radius-xs)] px-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--docs-ring)]';

  // 靠 exportAs="sanringTreeNode" 直接讀節點自己的狀態，範例不用再自己拿 value
  // 字串去跟 expandedValue()/selectedValue() 比對。
  protected folderButtonClass(node: TreeNodeComponent): string {
    return cn(
      this.baseNodeButtonClass,
      node.isSelected()
        ? 'bg-[var(--docs-accent)] text-[var(--docs-accent-foreground)]'
        : 'text-[var(--docs-fg)] hover:bg-[var(--docs-surface-strong)]',
    );
  }

  protected fileButtonClass(node: TreeNodeComponent): string {
    return cn(
      this.baseNodeButtonClass,
      node.isSelected()
        ? 'bg-[var(--docs-accent)] text-[var(--docs-accent-foreground)]'
        : 'text-[var(--docs-muted)] hover:bg-[var(--docs-surface-strong)] hover:text-[var(--docs-fg)]',
    );
  }

  protected chevronClass(node: TreeNodeComponent): string {
    return cn(
      'size-4 shrink-0 text-[var(--docs-muted)] transition-transform',
      node.isExpanded() && 'rotate-90',
    );
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
