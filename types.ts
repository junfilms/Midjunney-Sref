export interface ImageItem {
  id: string;
  imageUrl: string | null;
  code: string;
}

export interface ImageGroup {
  id: string;
  description: string;
  items: [ImageItem, ImageItem, ImageItem, ImageItem];
}

export interface Category {
  id: string;
  name: string;
  groups: ImageGroup[];
}

export interface Section {
  id: string;
  title: string;
  categories: Category[];
}
