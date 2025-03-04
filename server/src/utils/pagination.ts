export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; offset: number; limit: number };
  links: {
    self: string;
    next: string | null;
    prev: string | null;
    first: string;
    last: string;
  };
}

export const paginate = <T>(
  data: T[],
  offset: number,
  limit: number,
  baseUrl: string
): PaginatedResponse<T> => {
  const total = data.length;
  const paginatedData = data.slice(offset, offset + limit);
  const links = {
    self: `${baseUrl}?offset=${offset}&limit=${limit}`,
    next:
      offset + limit < total
        ? `${baseUrl}?offset=${offset + limit}&limit=${limit}`
        : null,
    prev:
      offset > 0
        ? `${baseUrl}?offset=${Math.max(0, offset - limit)}&limit=${limit}`
        : null,
    first: `${baseUrl}?offset=0&limit=${limit}`,
    last: `${baseUrl}?offset=${
      Math.floor((total - 1) / limit) * limit
    }&limit=${limit}`,
  };
  return { data: paginatedData, meta: { total, offset, limit }, links };
};
