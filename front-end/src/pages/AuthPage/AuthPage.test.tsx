import { render, screen } from '@testing-library/react';
import React from 'react';
import { ServicesContext, servicesContextDefaultValue } from '../../contexts/services.context';
import { AuthPage, SIGN_UP_BUTTON_TEXT } from './AuthPage';

jest.mock('../../services/auth.service');
jest.mock('../../services/highlights.service');
jest.mock('../../services/notifications.service');

describe('AuthPage', () => {
  it('should render the sign-up Button', async () => {
    render(
      <ServicesContext.Provider value={servicesContextDefaultValue}>
        <AuthPage />
      </ServicesContext.Provider>,
    );

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.innerHTML).toBe(SIGN_UP_BUTTON_TEXT);
  });
});
