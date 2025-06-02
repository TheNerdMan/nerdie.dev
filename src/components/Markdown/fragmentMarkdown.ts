import MarkdownIt from 'markdown-it';

export interface Fragment {
  type: string;
  tag?: string;
  content?: string;
  children?: Fragment[];
  level?: number;
  ordered?: boolean;
  href?: string; // Add href for links
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

export function fragmentMarkdown(markdown: string): Fragment[] {
  const tokens = md.parse(markdown, {});
  const stack: Fragment[] = [];
  const root: Fragment = { type: 'root', children: [] };
  let current = root;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'link_open') {
      // Create a link fragment and push to stack
      const href = token.attrs?.find(([name]) => name === 'href')?.[1];
      const frag: Fragment = { type: 'link', tag: token.tag, href, children: [] };
      (current.children ||= []).push(frag);
      stack.push(current);
      current = frag;
    } else if (token.type === 'link_close') {
      current = stack.pop()!;
    } else if (token.type.endsWith('_open')) {
      const frag: Fragment = {
        type: token.type.replace('_open', ''),
        tag: token.tag,
        level: token.tag && token.tag.match(/^h(\d)$/) ? Number(token.tag[1]) : undefined,
        ordered: token.tag === 'ol',
        children: [],
      };
      (current.children ||= []).push(frag);
      stack.push(current);
      current = frag;
    } else if (token.type.endsWith('_close')) {
      current = stack.pop()!;
    } else if (token.type === 'inline') {
      // Inline tokens may contain children (e.g., links)
      if (token.children && token.children.length) {
        for (const child of token.children) {
          if (child.type === 'text') {
            (current.children ||= []).push({ type: 'inline', content: child.content });
          } else if (child.type === 'link_open') {
            const href = child.attrs?.find(([name]) => name === 'href')?.[1];
            const frag: Fragment = { type: 'link', tag: child.tag, href, children: [] };
            (current.children ||= []).push(frag);
            stack.push(current);
            current = frag;
          } else if (child.type === 'link_close') {
            current = stack.pop()!;
          } else if (child.type === 'softbreak') {
            (current.children ||= []).push({ type: 'inline', content: '\n' });
          } else if (child.type === 'code_inline') {
            (current.children ||= []).push({ type: 'inline', content: child.content });
          }
        }
      } else {
        (current.children ||= []).push({ type: 'inline', content: token.content });
      }
    } else if (token.type === 'fence') {
      (current.children ||= []).push({
        type: 'code_block',
        content: token.content,
      });
    } else if (token.type === 'blockquote_open' || token.type === 'blockquote_close') {
      // handled by open/close logic
    } else if (token.type === 'list_item_open' || token.type === 'list_item_close') {
      // handled by open/close logic
    } else if (token.type === 'paragraph_open' || token.type === 'paragraph_close') {
      // handled by open/close logic
    } else if (token.type === 'hr') {
      (current.children ||= []).push({ type: 'hr' });
    }
  }
  return root.children || [];
}
