export type PaginatedType<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = PaginatedType<T>;
