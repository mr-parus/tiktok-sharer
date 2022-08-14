import { MouseEvent } from 'react';

export interface ButtonCreateParamsInterface {
  disabled?: boolean;
  debounceTimout?: number;
  label: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}
