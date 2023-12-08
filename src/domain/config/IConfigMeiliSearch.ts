export interface IConfigMeiliSearchCredentials {
  host: string;
  apiKey: string;
}

export interface IConfigMeiliSearch {
  getMeiliSearchHost(): string | null;
  getMeiliSearchApiKey(): string | null;
  getMeiliSearchConfig(): IConfigMeiliSearchCredentials;
}
