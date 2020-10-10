import { UserData } from '../../user/service/user.interface';
import { ArticleEntity } from '../entity/article.entity';

interface Comment {
  body: string;
}

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  favorited?: boolean;
  favoritesCount?: number;
  author?: UserData;
}

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: ArticleEntity;
}

export interface ArticlesRO {
  articles: ArticleEntity[];
  articlesCount: number;
}
