// Function to set a cookie
export function setCookie(name, value, hours) {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie
export function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');
    if (cookiePair[0].trim() === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

/* Example usage:
// On successful login:
setCookie('authToken', 'your_token_here', 7); // Set cookie for 7 days

// On subsequent requests:
const authToken = getCookie('authToken');
if (authToken) {
  // Include the authToken in headers when making API requests
  fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
}
  */