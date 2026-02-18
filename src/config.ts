export const config = {
  get accessToken(): string {
    const token = process.env.QIITA_ACCESS_TOKEN;
    if (!token) {
      throw new Error(
        "QIITA_ACCESS_TOKEN environment variable is required. " +
          "Get your token at https://qiita.com/settings/applications"
      );
    }
    return token;
  },
  baseUrl: process.env.QIITA_BASE_URL ?? "https://qiita.com",
  apiVersion: "v2" as const,
  get apiBaseUrl(): string {
    return `${this.baseUrl}/api/${this.apiVersion}`;
  },
  defaultPerPage: 20,
  maxPerPage: 100,
};
