import { getCookie } from './cookies.js';

const url = '209.198.192.53:7199';
// const url = 'localhost';


export async function postFormData(form) {
  // Associate the FormData object with the form element
  const formData = new FormData(form);
  const authToken = getCookie('imcrttauth');
  const headers = new Headers();

  if (authToken) {
    headers.append('Authorization', `Bearer ${authToken}`)
  }

  try {
    const response = await fetch(`https://${url}/TTBackend/FormData`, {
      method: "POST",
      headers: headers,
      body: formData
    });

    if (response.ok) {
      return await response.json();
    } else {
      return false;
    }
  } catch (e) {
    alert(e);
    console.error(e);
  }
}

export async function postMessage(message) {
  const authToken = getCookie('imcrttauth');
  const headers = new Headers();

  if (authToken) {
    headers.append('Authorization', `Bearer ${authToken}`)
  }

  try {
    const response = await fetch(`https://${url}/TTBackend/PostData`, {
      method: "POST",
      headers: headers,
      body: message
    });

    if (response.ok) {
      return await response.json();
    } else {
      return false;
    }
  } catch (e) {
    alert(e);
    console.error(e);
  }
};