// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('panda-oj-authority') || ['ADMIN', 'REGULAR'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('panda-oj-authority') : str;
  // authorityString could be ADMIN, "ADMIN", ["ADMIN"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('panda-oj-authority', JSON.stringify(proAuthority));
}
