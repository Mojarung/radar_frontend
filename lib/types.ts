export interface TimelineEvent {
  time: string;
  event: string;
}

export interface NewsSource {
  url: string;
  title: string;
  published_at?: string;
}

export interface AnalysisResult {
  dedup_group: string;
  hotness: number;
  headline: string;
  why_now: string;
  entities: string[];
  sources: NewsSource[];
  timeline: TimelineEvent[];
  draft: string;
  telegram_post: string;
}

export interface AnalysisResponse {
  results: AnalysisResult[];
  total_articles_analyzed: number;
  total_clusters: number;
  analysis_timestamp: string;
}

export interface AnalysisRequest {
  time_window_hours: number;
  top_k: number;
}

