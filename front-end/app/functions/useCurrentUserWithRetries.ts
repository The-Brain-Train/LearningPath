import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { User } from '../util/types';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUserWithRetries = (): User | null | undefined => {
    const [cookies] = useCookies(['user']);
    const [retryCount, setRetryCount] = useState(0);
  
    const { data: currentUser, refetch } = useQuery<User | null | undefined>(
      ['currentUser'],
      async () => {
        const user = jwtDecode(cookies.user) as User | null;
        return user;
      },
      {
        enabled: !!cookies.user,
      }
    );
  
    useEffect(() => {
      let retryTimer: NodeJS.Timeout;
  
      if (currentUser === null && retryCount < 5) {
        retryTimer = setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
          refetch(); 
        }, 200); 
      }
  
      return () => clearTimeout(retryTimer);
    }, [currentUser, retryCount, refetch]);
  
    return currentUser;
  };