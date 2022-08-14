import { render, screen } from '@testing-library/react';
import React from 'react';
import { ServicesContext, servicesContextDefaultValue } from '../../contexts/services.context';
import { HomePage, SHARE_BUTTON_TEXT } from './HomePage';

jest.mock('../../services/auth.service');
jest.mock('../../services/highlights.service');
jest.mock('../../services/notifications.service');

describe('HomePage', () => {
  it('should render the share Button', async () => {
    render(
      <ServicesContext.Provider value={servicesContextDefaultValue}>
        <HomePage />
      </ServicesContext.Provider>,
    );

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.innerHTML).toBe(SHARE_BUTTON_TEXT);
  });
});
