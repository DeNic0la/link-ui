import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SecureLinkService } from '../../core/secure-link.service';

@Component({
  selector: 'app-secure-link-access',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <main>
      <section>
        <h1>Sicherer Zugriff</h1>
        <p>
          Dieser Link ist geschützt. Bitte geben Sie den 6-stelligen 2FA-Code ein, um fortzufahren.
        </p>

        <form (submit)="onCheck($event)">
          <div class="input-group">
            <label for="2fa-code">Verifizierungscode</label>
            <input
              id="2fa-code"
              type="text"
              [formControl]="codeControl"
              placeholder="000000"
              maxlength="6"
              pattern="\\d*"
              inputmode="numeric"
              autocomplete="one-time-code"
              required
              (paste)="onPaste($event)"
            />
          </div>

          @if (error()) {
            <div class="error-message" role="alert">
              {{ error() }}
            </div>
          }

          <button type="submit" [disabled]="codeControl.invalid || loading()" class="button">
            {{ loading() ? 'Prüfen...' : 'Prüfen' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: `
    main {
      display: grid;
      place-items: center;
      height: 100dvh;
      padding: 1rem;
    }
    section {
      text-align: center;
      max-width: 400px;
      width: 100%;
      background: #ffffff;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    h1 {
      font-size: 1.875rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
      color: #111827;
    }
    p {
      color: #4b5563;
      margin-bottom: 2rem;
      font-size: 0.875rem;
    }
    .input-group {
      text-align: left;
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1.5rem;
      letter-spacing: 0.5rem;
      text-align: center;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px #2563eb;
    }
    .error-message {
      background-color: #fef2f2;
      color: #991b1b;
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }
    .button {
      width: 100%;
      padding: 0.75rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .button:hover:not(:disabled) {
      background-color: #1d4ed8;
    }
    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (prefers-color-scheme: dark) {
      section {
        background: #1f2937;
      }
      h1 {
        color: #f9fafb;
      }
      p {
        color: #9ca3af;
      }
      label {
        color: #d1d5db;
      }
      input {
        background: #374151;
        color: white;
        border-color: #4b5563;
      }
      .error-message {
        background-color: rgba(153, 27, 27, 0.2);
        color: #fca5a5;
      }
    }
  `,
})
export class SecureLinkAccessComponent {
  constructor() {
    this.codeControl.events.subscribe((event) => {
      console.log('Code event:', event);
    });
  }
  private readonly secureLinkService = inject(SecureLinkService);

  accessKey = input.required<string>();

  codeControl = new FormControl('', {
    validators: [Validators.required, Validators.minLength(6)],
    nonNullable: true,
  });

  loading = signal(false);
  error = signal<string | null>(null);

  onPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text');
    if (pasteData) {
      // Clean up pasted data: keep only digits
      const cleanedData = pasteData.replace(/\D/g, '').substring(0, 6);
      this.codeControl.setValue(cleanedData);
      event.preventDefault();
    }
  }

  async onCheck(event: Event) {
    event.preventDefault();
    if (this.codeControl.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.secureLinkService.checkSecureLink(this.accessKey(), this.codeControl.value),
      );

      if (response.error) {
        this.error.set(response.error);
      } else if (response.targetLink) {
        window.location.href = response.targetLink;
      } else {
        this.error.set('Vom Server wurde eine ungültige Antwort erhalten.');
      }
    } catch (err) {
      this.error.set('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      this.loading.set(false);
    }
  }
}
