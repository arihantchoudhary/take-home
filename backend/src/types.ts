// Block types for our simple Notion clone

export type TextType = 'h1' | 'h2' | 'h3' | 'paragraph';

export interface TextBlock {
  id: string;
  type: 'text';
  textType: TextType;
  value: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export type Block = TextBlock | ImageBlock;

export interface BlocksData {
  blocks: Block[];
}
