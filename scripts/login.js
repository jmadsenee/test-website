function openLoginWindow() {
  document.getElementById('id01').style.display='block';
}

function closeLoginWindow() {
  document.getElementById('id01').style.display='none';
}



openLoginWindow();

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