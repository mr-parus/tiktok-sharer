import { wait } from '@testing-library/user-event/dist/utils';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button, DEFAULT_DEBOUNCE_TIMEOUT } from './Button';

const EXPECTED_LABEL = 'label';

describe('Button', () => {
  it('should render a button with a label', () => {
    render(<Button onClick={jest.fn()} label={EXPECTED_LABEL} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.innerHTML).toBe(EXPECTED_LABEL);
  });

  it('should debounce a MouseClick event', async () => {
    const mockCallBack = jest.fn();

    render(<Button label={EXPECTED_LABEL} onClick={mockCallBack} />);

    const buttonElement = screen.getByRole('button');

    buttonElement.click();
    buttonElement.click();
    buttonElement.click();

    expect(mockCallBack).toBeCalledTimes(0);

    await wait(DEFAULT_DEBOUNCE_TIMEOUT);

    expect(mockCallBack).toBeCalledTimes(1);
  }, 30000);
});
