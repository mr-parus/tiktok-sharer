export function redirect(url: string, timout = 0) {
  setTimeout(() => window.location.assign(url), timout);
}
