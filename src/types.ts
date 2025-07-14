export interface BisnessItem {
  type: 'user' | 'company';
  alias: string;
  name?: string;
  avatar?: string;
}

export interface UseApiOptions<T> {
  endpoint: (query: string) => string;
  extractData: (response: any) => T[];
  minQueryLength?: number;
  debounceTime?: number;
  timeout?: number;
}
