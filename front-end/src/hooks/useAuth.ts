import { useContext, useEffect, useState } from 'react';
import { delayWhen, finalize, from, interval, tap } from 'rxjs';
import { ServicesContext } from '../contexts/services.context';

export function useAuth({ loaderDelay }: { loaderDelay: number }) {
  const { authService, notificationsService } = useContext(ServicesContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // While Getting JWT token, it delays loading no longer then LOADER_DELAY while taking in account request time
    // Delay time: min(0, LOADER_DELAY - REQUEST_TIME)
    from(authService.getNewJwtToken())
      .pipe(
        tap(() => setIsLoading(true)),
        delayWhen(() => interval(loaderDelay)),
        finalize(() => setIsLoading(false)),
      )
      .subscribe({
        next: token => !token && notificationsService.error('🥲 Not authorised yet '),
        error: error => notificationsService.error(error.message),
      });

    const subscription = authService.isLoggedIn$.pipe(tap(setIsLoggedIn)).subscribe();

    return () => subscription.unsubscribe();
  }, [authService, notificationsService, loaderDelay]);

  return {
    isLoggedIn,
    isLoading,
  };
}
