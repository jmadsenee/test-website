import { postMessage } from './utils/http.js';


async function checkToken() {
  const response = await postMessage('sourcePage: index');

  if (response) {
    if (response.token === 'valid') {
      window.location.href="timesheet.html";
    } else {
      window.location.href="login.html";
    }
  } else {
    alert('Internet error.');
  }
  
};

checkToken();