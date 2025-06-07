import type { CustomMarkdownParser } from '../classes/CustomMarkDownParser.class';

export type BlogFile = {
  path: string;
  markdown: CustomMarkdownParser;
  year: string;
  date: string;
  slug: string;
  title: string;
};
