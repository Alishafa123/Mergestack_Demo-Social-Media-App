import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '@api/profile.api';

export const SEARCH_QUERY_KEY = ['search'];

export const useSearchUsers = (query: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...SEARCH_QUERY_KEY, 'users', { query, page, limit }],
    queryFn: () => searchUsers(query, page, limit),
    enabled: query.length >= 2, 
    staleTime: 2 * 60 * 1000, 
    retry: 1, 
  });
};