import React, { useContext, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Container } from '../../components/Container/Container';
import { ServicesContext } from '../../contexts/services.context';
import { getAuthViaTikTokUrl } from '../../utils/apiRouting.util';
import { redirect } from '../../utils/navigator.util';

export const SIGN_UP_BUTTON_TEXT = 'sign up with tiktok';
export const FAKE_AUTH_BUTTON_TEXT = 'fake auth';
export const TIKTOK_AUTH_REDIRECTION_TIMEOUT = 3000; // in ms

export function AuthPage() {
  const { notificationsService, authService } = useContext(ServicesContext);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onClick = () => {
    setIsButtonDisabled(true);
    notificationsService.warn('It will redirect you to TikTok soon');
    redirect(getAuthViaTikTokUrl(), TIKTOK_AUTH_REDIRECTION_TIMEOUT);
  };

  return (
    <Container>
      <Button label={SIGN_UP_BUTTON_TEXT} disabled={isButtonDisabled} onClick={onClick} />
      <Button label={FAKE_AUTH_BUTTON_TEXT} onClick={() => authService.setFakeToken()} />
    </Container>
  );
}
