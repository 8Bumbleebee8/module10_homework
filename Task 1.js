const btn = document.querySelector('.btn');

function changeInnerIcon() {
  btn.classList.toggle('shot');
}

btn.addEventListener('click', changeInnerIcon);