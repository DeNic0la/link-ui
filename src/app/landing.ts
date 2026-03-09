import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    }
    @media (prefers-color-scheme: dark) {
      p {
        color: #9ca3af;
      }
    }
  `,
})
export class Landing {}
