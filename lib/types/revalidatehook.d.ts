export interface WHPostCreatedRequestBody {
  post_id: string;
  post: any;
  post_meta?: any;
  post_thumbnail?: any;
  post_permalink: string;
  taxonomies?: Array<any>;
}
