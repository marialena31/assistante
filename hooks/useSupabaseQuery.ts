import useSWR, { mutate as globalMutate } from 'swr';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QueryOptions {
  table: string;
  select?: string;
  filter?: Record<string, any>;
  orderBy?: {
    column: string;
    ascending: boolean;
  };
  limit?: number;
}

interface MutateOptions {
  table: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  data?: any;
  filter?: Record<string, any>;
}

// Helper function to build the cache key
const buildCacheKey = (options: QueryOptions) => {
  const key = [
    options.table,
    options.select,
    options.filter ? JSON.stringify(options.filter) : null,
    options.orderBy ? JSON.stringify(options.orderBy) : null,
    options.limit
  ];
  return key;
};

// Fetch data from Supabase
const fetcher = async <T>(options: QueryOptions): Promise<T> => {
  let query = supabase
    .schema('api') // Always use api schema
    .from(options.table)
    .select(options.select || '*');

  // Apply filters if any
  if (options.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  // Apply ordering if specified
  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending,
    });
  }

  // Apply limit if specified
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as T;
};

// Custom hook for data fetching
export function useSupabaseQuery<T>(options: QueryOptions) {
  const cacheKey = buildCacheKey(options);
  const { data, error, mutate } = useSWR<T>(
    cacheKey,
    () => fetcher<T>(options),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data,
    loading: !error && !data,
    error,
    mutate,
  };
}

// Function to mutate data (create, update, delete)
export async function mutateData(
  options: MutateOptions,
  showToast?: (message: string, type: 'success' | 'error') => void,
  mutate?: () => void
): Promise<boolean> {
  try {
    let query = supabase.schema('api').from(options.table);

    switch (options.action) {
      case 'INSERT':
        const { error: insertError } = await query.insert(options.data);
        if (insertError) {
          showToast?.('Une erreur est survenue lors de l\'insertion', 'error');
          throw insertError;
        }
        break;

      case 'UPDATE':
        if (!options.filter) throw new Error('Filter is required for UPDATE');
        const { error: updateError } = await query
          .update(options.data)
          .match(options.filter);
        if (updateError) {
          showToast?.('Une erreur est survenue lors de la mise à jour', 'error');
          throw updateError;
        }
        break;

      case 'DELETE':
        if (!options.filter) throw new Error('Filter is required for DELETE');
        const { error: deleteError } = await query.delete().match(options.filter);
        if (deleteError) {
          showToast?.('Une erreur est survenue lors de la suppression', 'error');
          throw deleteError;
        }
        break;

      default:
        throw new Error('Invalid action');
    }

    // Invalidate all queries for this table
    const cacheKeyPattern = new RegExp(`^${options.table}`);
    await globalMutate(
      (key) => Array.isArray(key) && key[0] === options.table
    );
    
    // Call the provided mutate function if it exists
    mutate?.();

    return true;
  } catch (error) {
    console.error('Error in mutateData:', error);
    return false;
  }
}
