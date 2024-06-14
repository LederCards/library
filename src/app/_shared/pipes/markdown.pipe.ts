import { Pipe, type PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    const renderer = this.getCustomRenderer();

    return marked(value, { renderer });
  }

  private getCustomRenderer(): marked.Renderer {
    const renderer = new marked.Renderer();

    // no paragraphs
    renderer.paragraph = (text: string) => text;

    return renderer;
  }
}
