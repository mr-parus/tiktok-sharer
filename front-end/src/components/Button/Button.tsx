import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { debounce, Subject, timer } from 'rxjs';
import classes from './Button.module.css';
import { ButtonCreateParamsInterface } from './Button.types';

export const DEFAULT_DEBOUNCE_TIMEOUT = 300; // in ms

export function Button(params: ButtonCreateParamsInterface) {
  const { label, onClick, disabled = false, debounceTimout = DEFAULT_DEBOUNCE_TIMEOUT } = params;
  const [click$] = useState(new Subject<MouseEvent<HTMLElement>>());
  const onClickHandler = useCallback((event: MouseEvent<HTMLElement>) => click$.next(event), [click$]);

  useEffect(() => {
    const subscription = click$.pipe(debounce(() => timer(debounceTimout))).subscribe(onClick);
    return () => {
      subscription.unsubscribe();
    };
  }, [click$, onClick, debounceTimout]);

  return (
    <button type="button" disabled={disabled} className={classes.Button} onClick={onClickHandler}>
      {label}
    </button>
  );
}
