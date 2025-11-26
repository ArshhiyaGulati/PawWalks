import { useEffect, useState } from 'react';
import { request } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const useFetch = (
  path,
  deps = [],
  { initialValue = null, skip = false } = {}
) => {
  const { token } = useAuth();
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!token || skip) return;
      setLoading(true);
      try {
        const result = await request(path, { token });
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [path, token, skip, ...deps]);

  return {
    data: data ?? initialValue,
    loading,
    error,
    refetch: () => request(path, { token }),
  };
};

