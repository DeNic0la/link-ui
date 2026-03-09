import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <main>
      <section>
        <h1>Welcome to Link</h1>
        <p>A simple, fast, and secure way to manage your links.</p>
      </section>
    </main>
  `,
  styles: `
    main {
      display: grid;
      place-items: center;
      height: 100dvh;
      padding: 1rem;
      overflow: hidden;
    }
    section {
      text-align: center;
      max-width: 600px;
    }
    h1 {
      font-size: clamp(2rem, 8vw, 4rem);
      margin-bottom: 1rem;
      letter-spacing: -0.025em;
    }
    p {
      font-size: clamp(1rem, 4vw, 1.25rem);
      color: #4b5563;
      margin-bottom: 2rem;
    }
    .button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 0.375rem;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    @media (prefers-color-scheme: dark) {
      p {
        color: #9ca3af;
      }
      h1 {
        color: white;
      }
    }
  `,
})
export class LandingComponent {}
