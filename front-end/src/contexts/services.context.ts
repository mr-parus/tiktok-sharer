import { createContext } from 'react';
import { AuthService } from '../services/auth.service';
import { HighlightsService } from '../services/highlights.service';
import { NotificationsService } from '../services/notifications.service';
import { HttpClient } from '../utils/httpClient.util';

const httpClient = new HttpClient();
const notificationsService = new NotificationsService();
const authService = new AuthService(httpClient);
const highlightsService = new HighlightsService(httpClient, authService);

export const servicesContextDefaultValue = {
  authService,
  notificationsService,
  highlightsService,
};

export const ServicesContext = createContext(servicesContextDefaultValue);
