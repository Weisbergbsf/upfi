/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { api } from '../services/api';

type NextPageProps = {
  after: string;
};

type FetchImageProps = {
  after: string;
  data: {
    title: string;
    description: string;
    url: string;
    ts: number;
    id: string;
  }[];
};

async function fetchImages({ pageParam = 0 }): Promise<FetchImageProps> {
  const { data } = await api.get('/api/images', {
    params: {
      after: pageParam,
    },
  });
  return data;
}

export function useImages(options?: UseInfiniteQueryOptions) {
  return useInfiniteQuery('images', fetchImages, {
    getNextPageParam: (lastPage: NextPageProps) => lastPage.after ?? null,
    ...options,
  });
}
