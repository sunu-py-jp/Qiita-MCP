import { config } from "./config.js";
import {
  QiitaAPIError,
  QiitaAuthError,
  QiitaNotFoundError,
  QiitaRateLimitError,
} from "./errors.js";
import type { PaginatedResponse } from "./types.js";

function parseLinkHeader(
  header: string | null
): Record<string, string | null> {
  const result: Record<string, string | null> = {
    first: null,
    last: null,
    next: null,
    prev: null,
  };
  if (!header) return result;
  for (const part of header.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="(\w+)"/);
    if (match) {
      result[match[2]] = match[1];
    }
  }
  return result;
}

class QiitaClient {
  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<{ data: T; response: Response }> {
    const url = path.startsWith("http") ? path : `${config.apiBaseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => res.statusText);
      switch (res.status) {
        case 401:
          throw new QiitaAuthError(errorBody);
        case 404:
          throw new QiitaNotFoundError(errorBody);
        case 429:
          throw new QiitaRateLimitError(errorBody);
        default:
          throw new QiitaAPIError(res.status, res.statusText, errorBody);
      }
    }

    if (res.status === 204) {
      return { data: undefined as T, response: res };
    }

    const data = (await res.json()) as T;
    return { data, response: res };
  }

  async get<T>(path: string): Promise<T> {
    const { data } = await this.request<T>("GET", path);
    return data;
  }

  async getPaginated<T>(
    path: string,
    page = 1,
    perPage = config.defaultPerPage
  ): Promise<PaginatedResponse<T>> {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${path}${separator}page=${page}&per_page=${perPage}`;
    const { data, response } = await this.request<T[]>("GET", url);
    const links = parseLinkHeader(response.headers.get("link"));
    const totalCount = response.headers.get("total-count");
    return {
      data,
      totalCount: totalCount ? parseInt(totalCount, 10) : null,
      firstPage: links.first,
      lastPage: links.last,
      nextPage: links.next,
      prevPage: links.prev,
    };
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const { data } = await this.request<T>("POST", path, body);
    return data;
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const { data } = await this.request<T>("PUT", path, body);
    return data;
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const { data } = await this.request<T>("PATCH", path, body);
    return data;
  }

  async delete(path: string): Promise<void> {
    await this.request<void>("DELETE", path);
  }
}

export const qiitaClient = new QiitaClient();
