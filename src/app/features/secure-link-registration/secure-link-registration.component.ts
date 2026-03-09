import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SecureLinkResponse, SecureLinkService } from '../../core/secure-link.service';

@Component({
  selector: 'app-secure-link-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <main>
      <section>
        <h1>Register Secure Link</h1>
        <p>Create a new link with an access key and a second factor key.</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" aria-labelledby="form-title">
          <div class="field">
            <label for="accessKey">Access Key</label>
            <input
              id="accessKey"
              type="text"
              formControlName="accessKey"
              placeholder="e.g. test-02"
              [attr.aria-invalid]="
                form.controls.accessKey.invalid && form.controls.accessKey.touched
              "
            />
          </div>

          <div class="field">
            <label for="targetLink">Target Link</label>
            <input
              id="targetLink"
              type="url"
              formControlName="targetLink"
              placeholder="https://example.com"
              [attr.aria-invalid]="
                form.controls.targetLink.invalid && form.controls.targetLink.touched
              "
            />
          </div>

          <div class="field">
            <label for="secondFactorKey">Second Factor Key</label>
            <input
              id="secondFactorKey"
              type="password"
              formControlName="secondFactorKey"
              placeholder="123456"
              [attr.aria-invalid]="
                form.controls.secondFactorKey.invalid && form.controls.secondFactorKey.touched
              "
            />
          </div>

          @if (error()) {
            <p class="error-message" role="alert">{{ error() }}</p>
          }

          <button type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) {
              Creating...
            } @else {
              Create Secure Link
            }
          </button>
        </form>

        @if (result(); as res) {
          <div class="result" role="region" aria-live="polite">
            <h2>Secure Link Created Successfully!</h2>
            <p>
              <strong>Access Link:</strong> <a [href]="res.accessLink">{{ res.accessLink }}</a>
            </p>
            <p><strong>Access Key:</strong> {{ res.accessKey }}</p>
            <p><strong>Target Link:</strong> {{ res.targetLink }}</p>
            <p><strong>Second Factor Key:</strong> {{ res.secondFactorKeyRaw }}</p>
          </div>
        }
      </section>
    </main>
  `,
  styles: `
    main {
      display: grid;
      place-items: center;
      min-height: 100dvh;
      padding: 2rem 1rem;
    }
    section {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
      background: white;
    }
    h1 {
      font-size: 1.875rem;
      margin-bottom: 0.5rem;
      color: #111827;
    }
    p {
      color: #4b5563;
      margin-bottom: 1.5rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    input {
      padding: 0.625rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
    }
    input:focus {
      outline: 2px solid #2563eb;
      outline-offset: -1px;
    }
    button {
      padding: 0.625rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    button:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    button:hover:not(:disabled) {
      background-color: #1d4ed8;
    }
    .error-message {
      color: #dc2626;
      margin: 0;
      font-size: 0.875rem;
    }
    .result {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }
    .result h2 {
      font-size: 1.25rem;
      color: #059669;
      margin-bottom: 1rem;
    }
    .result p {
      margin-bottom: 0.5rem;
      word-break: break-all;
    }
    a {
      color: #2563eb;
      text-decoration: underline;
    }
    @media (prefers-color-scheme: dark) {
      section {
        background: #1f2937;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.5);
      }
      h1,
      label,
      .result h2 {
        color: #f9fafb;
      }
      p {
        color: #9ca3af;
      }
      input {
        background: #374151;
        border-color: #4b5563;
        color: white;
      }
      .result {
        border-top-color: #374151;
      }
    }
  `,
})
export class SecureLinkRegistrationComponent {
  private readonly secureLinkService = inject(SecureLinkService);

  readonly form = new FormGroup({
    accessKey: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    targetLink: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
    }),
    secondFactorKey: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<SecureLinkResponse | null>(null);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.secureLinkService.registerSecureLink(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
        this.form.reset();
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.error.set('Failed to create secure link. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
