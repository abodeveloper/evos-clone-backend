export interface QueryStringInterface {
  [key: string]: string | number | undefined;
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  search?: string;
}

export interface ResponsePaginationData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResponseAllData<T> {
  data: T[];
  total: number;
}
