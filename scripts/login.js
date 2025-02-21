import { setCookie, getCookie  } from './utils/cookies.js';
import { postFormData } from './utils/http.js';


function openLoginWindow() {
  document.getElementById('js-login-form-window').style.display='block';
}

function closeLoginWindow() {
  document.getElementById('js-login-form-window').style.display='none';
}

function saveUsername() {
  const checked = document.querySelector('#saveUsername').value;
  if (checked) {
    const userName = document.querySelector('#userName').value;
    setCookie('imcrusername', userName, 100);
  }
}

function fillUsername() {
  const checked = document.querySelector('#saveUsername').value;
  if (checked) {
    const userName = getCookie('imcrusername');
    if (userName) {
      document.querySelector('#userName').value = userName;
    }
  }
}

openLoginWindow();
fillUsername();

document.querySelector('.js-login-button')
  .addEventListener('click', () => {
    openLoginWindow();
  });

document.querySelector('.js-cancel-button')
  .addEventListener('click', () => {
    closeLoginWindow();
  });

document.querySelector('.js-close')
  .addEventListener('click', () => {
    closeLoginWindow();
  });

document.querySelector('.js-password-input')
  .addEventListener('keydown', (key) => {
    if (key === 'Enter') {
      document.getElementById('js-login-form').submit();
    }
  })

const form = document.querySelector('#js-login-form');
  
async function sendLoginData() {
  // Associate the FormData object with the form element
  const formData = new FormData(form);

  const response = await postFormData(form);
  console.log(response);

  if (response) {
    if (response.login === 'authorized') {
      setCookie('imcrttauth', response.token, 10);
      window.location.href="timesheet.html";
    } else {
      alert('Invalid Username or Password');
    }
  } else {
    alert('Internet error.');
  }
}

// Take over form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveUsername();
  sendLoginData();
  document.querySelector('.js-password-input').value = '';
});