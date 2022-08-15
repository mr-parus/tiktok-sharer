import React, { useContext, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Container } from '../../components/Container/Container';
import { ServicesContext } from '../../contexts/services.context';
import { getHighlightSourceUrl } from '../../utils/apiRouting.util';

export const SHARE_BUTTON_TEXT = 'share to tiktok';
const HIGHLIGHT_ID = 'HIGHLIGHT_ID'; // mocked id

export function HomePage() {
  const { highlightsService, notificationsService } = useContext(ServicesContext);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onClick = () => {
    setIsButtonDisabled(true);

    highlightsService
      .shareHighlightToTiktok(HIGHLIGHT_ID)
      .then(shareId => notificationsService.info(`Successfully shared! Share Id: "${shareId}"`))
      .catch(({ message }) => notificationsService.error(message))
      .finally(() => setIsButtonDisabled(false));
  };

  return (
    <Container>
      <video controls src={getHighlightSourceUrl({ highlightId: HIGHLIGHT_ID })} />
      <Button label={SHARE_BUTTON_TEXT} disabled={isButtonDisabled} onClick={onClick} />
    </Container>
  );
}
