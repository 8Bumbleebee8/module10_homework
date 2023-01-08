const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
const btnGeo = document.querySelector('.btn-geo');
const chat = document.querySelector('.chat');
const wsUrl = 'wss://echo-ws-service.herokuapp.com';

let websocket;

input.oninput = () => {
  if (input.value && input.value[0] !== ' ') {
    btn.removeAttribute('disabled', '');
  } else {
    input.value = '';
    btn.setAttribute('disabled', '');
  }
};
btn.addEventListener('click', sendMessage)
function sendMessage(e) {
  e.preventDefault();
  websocket.send(input.value);
  addMessage(input.value, 'sender');
  websocket.onmessage = function (evt) {
    addMessage(evt.data, 'recipient');
  };
  input.value = '';
  btn.setAttribute('disabled', '');
}

function addMessage(message, type) {
  chat.innerHTML += `
  <p class="message ${type}">${message}</p>
  `;
  let lastMessage = document.querySelector(".message:last-child")
  lastMessage.scrollIntoView({behavior: "smooth", block: "center", inline: "end"})
}

function addStatus(text) {
  chat.innerHTML = `
  <p class="message status">${text}</p>
  `;
}

btnGeo.addEventListener('click', getGeoLocation);

function getGeoLocation(e) {
  e.preventDefault();
  const error = () => {
    addStatus(`Невозможно получить ваше местоположение`)
    btnGeo.setAttribute('disabled', '');
  };
  const success = (position) => {
    btnGeo.removeAttribute('disabled', '');
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    let geoMessage = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" class="link" target="_blank">Гео-локация</a>`;
    websocket.send(geoMessage);
    websocket.onmessage = function (evt) {
      addMessage(evt.data, 'sender');
    };
  };

  if (!navigator.geolocation) {
    alert('Geolocation не поддерживается вашим браузером');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  websocket = new WebSocket(wsUrl);
  websocket.onopen = function () {
    addStatus(`Соединение установленно`)

  };
});