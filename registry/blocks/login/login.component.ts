import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SANRING_ALERT_IMPORTS } from '../alert';
import { ButtonDirective } from '../button';
import { SANRING_CARD_IMPORTS } from '../card';
import { CheckboxComponent } from '../checkbox';
import { DividerComponent } from '../divider';
import { DescriptionDirective, FieldLabelDirective, SanringFieldComponent } from '../field';
import { InputDirective } from '../input';
import { LinkDirective } from '../link';

@Component({
  selector: 'sanring-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    SANRING_ALERT_IMPORTS,
    ButtonDirective,
    SANRING_CARD_IMPORTS,
    CheckboxComponent,
    DividerComponent,
    DescriptionDirective,
    FieldLabelDirective,
    SanringFieldComponent,
    InputDirective,
    LinkDirective,
  ],
  template: `
    <div class="flex min-h-svh items-center justify-center bg-[var(--sanring-background)] p-6">
      <sanring-card class="w-full max-w-md">
        <sanring-card-header>
          <h1 sanringCardTitle class="text-xl font-semibold">{{ title() }}</h1>
          <p sanringCardDescription class="text-sm text-[var(--sanring-muted)]">
            {{ description() }}
          </p>
        </sanring-card-header>
        <sanring-card-content>
          @if (error()) {
            <sanring-alert variant="destructive" class="mb-4">
              <div sanringAlertTitle>Could not sign in</div>
              <p sanringAlertDescription>{{ error() }}</p>
            </sanring-alert>
          }
          <form class="grid gap-4" (ngSubmit)="onSubmit()">
            <sanring-field>
              <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
              <label sanringLabel>Email</label>
              <input
                sanringInput
                type="email"
                name="email"
                autocomplete="email"
                placeholder="you@company.com"
                [(ngModel)]="email"
                required
              />
              <p sanringDescription>Use the email on your workspace invite.</p>
            </sanring-field>
            <sanring-field>
              <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
              <label sanringLabel>Password</label>
              <input
                sanringInput
                type="password"
                name="password"
                autocomplete="current-password"
                [(ngModel)]="password"
                required
              />
            </sanring-field>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <sanring-checkbox
                  [checked]="rememberMe"
                  (checkedChange)="rememberMe = $event === true"
                />
                <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
                <label sanringLabel class="text-sm">Remember me</label>
              </div>
              <a sanringLink href="#">Forgot password?</a>
            </div>
            <button sanringBtn type="submit" class="w-full" [disabled]="submitting()">
              {{ submitting() ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>
          <sanring-divider class="my-6" />
          <p class="text-center text-sm text-[var(--sanring-muted)]">
            No account yet?
            <a sanringLink href="#">Create one</a>
          </p>
        </sanring-card-content>
      </sanring-card>
    </div>
  `,
})
export class LoginComponent {
  readonly title = input('Sign in');
  readonly description = input('Enter your email and password to continue.');
  readonly error = input<string | null>(null);
  readonly submitted = output<{ email: string; password: string; rememberMe: boolean }>();

  protected email = '';
  protected password = '';
  protected rememberMe = false;
  protected readonly submitting = signal(false);

  protected onSubmit(): void {
    this.submitting.set(true);
    this.submitted.emit({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe,
    });
    this.submitting.set(false);
  }
}
