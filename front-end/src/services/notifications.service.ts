import { toast, ToastOptions } from 'react-toastify';

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  theme: 'dark',
  icon: false
};

export class NotificationsService {
  constructor(private readonly options = DEFAULT_TOAST_OPTIONS) {}

  public error(message: string): void {
    return void toast.error(message, this.options);
  }

  public info(message: string): void {
    return void toast.info(message, this.options);
  }

  public warn(message: string): void {
    return void toast.warn(message, this.options);
  }
}
