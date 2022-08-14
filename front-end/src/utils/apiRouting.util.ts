const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const HIGHLIGHT_ID = '<highlightId>';

export const getAuthViaTikTokUrl = () => `${API_BASE_URL}/api/v1/auth/tiktok/`;

export const getNewJwtTokenUrl = () => `${API_BASE_URL}/api/v1/auth/jwt`;

export const getHighlightSourceUrl = ({ highlightId }: { highlightId: string }) =>
  `${API_BASE_URL}/api/v1/highlights/${HIGHLIGHT_ID}`.replace(HIGHLIGHT_ID, highlightId);

export const getShareHighlightUrl = ({ highlightId }: { highlightId: string }) =>
  `${API_BASE_URL}/api/v1/highlights/${HIGHLIGHT_ID}/share-to-tiktok`.replace(HIGHLIGHT_ID, highlightId);
