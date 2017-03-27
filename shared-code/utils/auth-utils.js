export function isLoggedIn (state) {
  return !!state.getIn(['credentials', 'token']);
}
