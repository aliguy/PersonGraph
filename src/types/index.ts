export type PipelineStatus = 'idle' | 'queued' | 'discovering' | 'scraping' | 'processing' | 'ready' | 'error';

export type SourceType = 'linkedin' | 'github' | 'article' | 'tweet' | 'video' | 'podcast' | 'patent' | 'scholar' | 'other';

export type NodeType = 'fact' | 'quote' | 'skill' | 'company' | 'project' | 'publication' | 'person' | 'concept';

export type EdgeType =
  | 'mentions'
  | 'related_to'
  | 'worked_at'
  | 'studied_at'
  | 'collaborated_with'
  | 'preceded_by'
  | 'skill_of'
  | 'authored'
  | 'spoke_about';

export interface ScanConfig {
  name: string;
  linkedinUrl: string;
  sources: {
    linkedin: boolean;
    github: boolean;
    twitter: boolean;
    youtube: boolean;
    articles: boolean;
    podcasts: boolean;
    scholar: boolean;
    patents: boolean;
  };
  maxSources: number;
  disambiguationThreshold: number;
  includeQuotes: boolean;
  includeTimeline: boolean;
}

export interface PersonScan {
  id: string;
  config: ScanConfig;
  status: PipelineStatus;
  sourcesFound: number;
  sourcesProcessed: number;
  nodesGenerated: number;
  createdAt: string;
  completedAt: string | null;
  error: string | null;
}

export interface GraphNode {
  id: string;
  scanId: string;
  type: NodeType;
  label: string;
  description: string;
  category: string;
  date: string | null;
  importanceScore: number;
  clusterId: string | null;
  clusterLabel: string | null;
  clusterColor: string | null;
  sourceUrl: string | null;
  sourceType: SourceType | null;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  label: string | null;
}

export interface ApiKeyConfig {
  proxycurl: string;
  serpapi: string;
  anthropic: string;
  openai: string;
  github: string;
  twitter: string;
  youtube: string;
}
