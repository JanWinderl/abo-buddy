/**
 * API Service Layer
 * Zentrale HTTP-Kommunikation mit dem Backend
 * Wiederverwendbare Funktionen für alle API-Anfragen
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

/**
 * Basis HTTP-Client mit Fehlerbehandlung
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  role?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Rolle als Header mitsenden für rollenbasierte API-Anfragen
  if (role) {
    (headers as Record<string, string>)['X-User-Role'] = role;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || `HTTP Error: ${response.status}`,
        statusCode: response.status,
      } as ApiError;
    }

    // Handle empty responses (e.g., 204 No Content)
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    if ((error as ApiError).statusCode) {
      throw error;
    }
    throw {
      message: 'Netzwerkfehler: Verbindung zum Server fehlgeschlagen',
      statusCode: 0,
    } as ApiError;
  }
}

/**
 * HTTP GET Request
 */
export function get<T>(endpoint: string, role?: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' }, role);
}

/**
 * HTTP POST Request
 */
export function post<T>(endpoint: string, data: unknown, role?: string): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    role
  );
}

/**
 * HTTP PUT Request
 */
export function put<T>(endpoint: string, data: unknown, role?: string): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    role
  );
}

/**
 * HTTP PATCH Request
 */
export function patch<T>(endpoint: string, data: unknown, role?: string): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    role
  );
}

/**
 * HTTP DELETE Request
 */
export function del<T>(endpoint: string, role?: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' }, role);
}

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};
