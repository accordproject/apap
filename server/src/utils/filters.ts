/**
 * Filters an object to include only the specified fields.
 * @template T - The type of the object being filtered.
 * @param obj - The object to filter (e.g., a Template or Agreement).
 * @param fields - Array of field names to include (e.g., ["id", "name"]).
 * @returns A partial object containing only the requested fields.
 */
export const filterFields = <T>(obj: T, fields: string[]): Partial<T> => {
  if (!fields.length) return obj;
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (fields.includes(key)) {
      (result as Record<string, any>)[key] = value;
    }
  }
  return result;
};
