import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { getNewJwtTokenUrl } from '../utils/apiRouting.util';
import { HttpClient } from '../utils/httpClient.util';

export class AuthService {
  private readonly jwtToken$: BehaviorSubject<string | null>;
  public readonly isLoggedIn$: Observable<boolean>;

  constructor(private readonly httpClient: HttpClient, jwtToken: string | null = null) {
    this.jwtToken$ = new BehaviorSubject<string | null>(jwtToken);
    this.isLoggedIn$ = this.jwtToken$.pipe(map(Boolean), distinctUntilChanged());
  }

  public getJwtToken(): string | null {
    return this.jwtToken$.value;
  }

  public resetJwtToken(): void {
    this.jwtToken$.next(null);
  }

  public async getNewJwtToken(): Promise<string | null> {
    const [response] = await this.httpClient.sendRequest<{ jwtToken: string }>({ url: getNewJwtTokenUrl() });
    const token = response?.data?.jwtToken || null;

    this.jwtToken$.next(token);

    return token;
  }
}
