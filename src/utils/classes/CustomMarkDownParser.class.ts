export class CustomMarkdownParser {
  rawMarkdown: string;
  summary: string;
  content: string;

  constructor(rawWarkdown: string) {
    this.rawMarkdown = rawWarkdown;
    // Use regex to extract the first <summary> tag content
    const summaryMatch = this.rawMarkdown.match(/<summary>(.*?)<\/summary>/s);
    this.summary = summaryMatch ? summaryMatch[1].trim() : '';
    // Remove the <summary> tag and its content from the raw markdown
    this.content = this.rawMarkdown.replace(/<summary>.*?<\/summary>/s, '').trim();
  }
}
