import { getShareHighlightUrl } from '../utils/apiRouting.util';
import { HttpClient } from '../utils/httpClient.util';
import { AuthService } from './auth.service';

export class HighlightsService {
  constructor(private readonly httpClient: HttpClient, private readonly authService: AuthService) {}

  public async shareHighlightToTiktok(highlightId: string): Promise<string> {
    const [response, responseError] = await this.httpClient.sendRequest<{ shareId: string }>({
      url: getShareHighlightUrl({ highlightId }),
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authService.getJwtToken()}`,
      },
    });

    if (responseError?.response?.status === 401) {
      this.authService.resetJwtToken();
      throw new Error('JWT token is invalid');
    }

    if (!response?.data?.shareId) {
      throw new Error('Failed to share a highlight');
    }

    return response.data.shareId;
  }
}
