export interface StrapiResponse<T> {
    data: T;
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    url: string;
    mime: string;
}

export interface NewsItem {
    id: number;
    documentId: string;
    title: string;
    summary?: string | null;
    content?: any;
    slug?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image?: StrapiMedia | null; // Single media
    category: string;
    tags?: any;
    businessForms?: any;
}

export interface FAQItem {
    id: number;
    documentId: string;
    question: string;
    answer?: string | null;
    situation?: string | null;
    solution?: string | null;
    tips?: any; // Blocks, array of strings or string
    category: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface KnowledgeArticle {
    id: number;
    documentId: string;
    title: string;
    excerpt: string;
    content?: any;
    author?: string;
    readTime: string;
    tags?: any; // Blocks, array or string
    category: string;
    views: number;
    rating: number;
    isFavorite: boolean;
    isNew: boolean;
    isPopular: boolean;
    publishDate: string;
}

export interface CaseStudyItem {
    id: number;
    documentId: string;
    name: string;
    role: string;
    niche: string;
    problem: string;
    journey?: any;
    result: string;
    subscription?: "lite" | "max";
    taxRate: string;
    clientType: string;
    savings?: any;
    warning?: any;
    features?: any;
    avatar?: StrapiMedia | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface SiteSettings {
    showNews: boolean;
    showFeaturedArticles: boolean;
    showCaseStudies: boolean;
    showFAQ: boolean;
    showKnowledgeBase: boolean;
    heroTitle?: string;
    heroSubtitle?: string;
}

