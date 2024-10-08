import { Component, effect, input } from '@angular/core';
import { marked } from 'marked';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-card-text',
  templateUrl: './card-text.component.html',
  styleUrls: ['./card-text.component.scss'],
})
export class CardTextComponent {
  public text = input.required<string>();
  public product = input<string>();

  public html = '';

  constructor() {
    const renderer = this.getCustomRenderer();

    effect(() => {
      this.html = marked(this.fixText(), {
        renderer,
      });
    });
  }

  private fixText(): string {
    if (!this.text()) {
      return `_This card has no text entered._`;
    }

    return (this.text() ?? '')
      .split('\n')
      .join('<br>')
      .split('+')
      .join('\\+')
      .split('-')
      .join('\\-');
  }

  private getCustomRenderer(): marked.Renderer {
    const renderer = new marked.Renderer();

    // custom inline image formatter
    renderer.codespan = (text: string) => {
      if (text.includes(':')) {
        const [type, subtype] = text.split(':');
        const fileName = `${type}-${subtype}`.split('\\').join('');

        return `<img src="${environment.baseUrl}/symbols/${fileName}.webp" class="inline-icon" alt="${subtype}" title="${subtype}" />`;
      }

      return `<pre>${text}</pre>`;
    };

    // no paragraphs
    renderer.paragraph = (text: string) => text;

    return renderer;
  }
}
