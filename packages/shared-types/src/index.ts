export type AppEnvironment = "local" | "development" | "staging" | "production";

export interface ApiMeta {
  request_id?: string;
  page?: number;
  page_size?: number;
  total?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<TData, TMeta extends ApiMeta = ApiMeta> {
  data: TData;
  meta: TMeta;
  error: null;
}

export interface ApiErrorResponse<TMeta extends ApiMeta = ApiMeta> {
  data: null;
  meta: TMeta;
  error: ApiError;
}

export type ApiEnvelope<TData, TMeta extends ApiMeta = ApiMeta> =
  | ApiResponse<TData, TMeta>
  | ApiErrorResponse<TMeta>;

export interface HealthcheckData {
  status: "ok";
  service: string;
  environment: AppEnvironment;
}
