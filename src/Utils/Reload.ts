export const reloadBrowser = () => {
  const pathname = window.location.pathname;
  if (
    pathname.indexOf('instructions') === -1 &&
    pathname.indexOf('promo') === -1
  ) {
    window.location.replace('/');
    return;
  }
  window.location.reload();
};
