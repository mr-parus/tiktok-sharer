import React from 'react';
import classes from './Container.module.css';

export function Container({ children }: { children: React.ReactNode }) {
  return <div className={classes.Container}>{children}</div>;
}
