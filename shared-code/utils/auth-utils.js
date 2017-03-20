export function isLoggedIn (state) {
  return !!state.getIn(['user', 'loggedIn']);
}
