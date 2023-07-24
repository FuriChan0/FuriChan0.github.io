let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

////////////////////////////////////////
//apiKey: "AIzaSyAw1c6Nwin5_73R6qUr61p9U-3JPoggp5M"
//clientId: "103875777231063674045"
//spreadsheetId = "1AJyCKZm4EHlyvhMhtwGgK-bJPzUa2EyHA7XvMpcrOMk"

gapi.load('client', function() {
  // Здесь можно вызывать функцию для чтения данных из Google Таблицы
  initClient();
});

// Инициализация клиента и загрузка таблицы
function initClient() {
  gapi.client.init({
    apiKey: 'AIzaSyAw1c6Nwin5_73R6qUr61p9U-3JPoggp5M',
  }).then(function() {
    // Теперь мы можем использовать Google Sheets API
    readDataFromSheet('1AJyCKZm4EHlyvhMhtwGgK-bJPzUa2EyHA7XvMpcrOMk');
  });
}

// Функция для чтения данных из таблицы
function readDataFromSheet(spreadsheetId) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'Sheet1!A1:B10', // Замените на нужный диапазон вашей таблицы
  }).then(function(response) {
    var values = response.result.values;
    // Обработайте полученные данные (например, выведите их на вашей веб-странице)
    console.log(values);
  }, function(reason) {
    console.error('Ошибка: ' + reason.result.error.message);
  });
}

////////////////////////////////////////

let numProducts = 6;
const buttonsContainer = document.getElementById("buttonsContainer");
const selectedItems = {};

const btn = [];

for (let i = 1; i <= numProducts; i++) {
  const button = document.createElement("button");
  button.className = "btn";
  button.id = "btn" + i;
  button.textContent = "Добавить";

  const img = document.createElement("img");
  img.src = i + ".png";
  img.alt = "Burger";
  img.className = "img";

  const itemContainer = document.createElement("div");
  itemContainer.className = "item";
  itemContainer.appendChild(img);
  itemContainer.appendChild(button);
  buttonsContainer.appendChild(itemContainer);

  btn[i] = button; // Сохраняем ссылку на кнопку в массиве btn
  btn[i].addEventListener("click", createClickListener(i));
}

function createClickListener(index) {
  return function () {
    if (selectedItems[index]) {
      delete selectedItems[index];
      btn[index].textContent = "Добавить"; // Меняем текст кнопки на "Добавить"
      removeQuantityContainer(index);
    } else {
      // btn[index].textContent = 'Отменить'; // Меняем текст кнопки на "Отменить"
      btn[index].classList.add("expanded");
      selectedItems[index] = 1;
      showQuantityContainer(index);
    }
  };
}

function showQuantityContainer(index) {
  const itemContainer = document.getElementById("btn" + index).parentNode;
  const quantityContainer = document.createElement("div");
  quantityContainer.className = "quantity";

  const minusButton = document.createElement("button");
  minusButton.textContent = "-";
  minusButton.className = "quantity-btn";
  minusButton.addEventListener("click", () => decreaseQuantity(index));

  const quantityText = document.createElement("span");
  quantityText.textContent = /*'Выбрано: ' +*/ selectedItems[index];
  quantityText.className = "quantity-text";
  quantityText.id = "quantity-text-" + index;

  const plusButton = document.createElement("button");
  plusButton.textContent = "+";
  plusButton.className = "quantity-btn";
  plusButton.addEventListener("click", () => increaseQuantity(index));

  quantityContainer.appendChild(minusButton);
  quantityContainer.appendChild(quantityText);
  quantityContainer.appendChild(plusButton);
  itemContainer.appendChild(quantityContainer);

  requestAnimationFrame(() => {
    quantityContainer.classList.add("show");
  });

  tg.MainButton.setText("Продолжить оформление заказа");
  tg.MainButton.show(); // Показываем кнопку mainButton при выборе товара
}

function removeAddContainer(index) {}

function removeQuantityContainer(index) {
  const itemContainer = document.getElementById("btn" + index).parentNode;
  const quantityContainer = itemContainer.querySelector(".quantity");
  if (quantityContainer) {
    quantityContainer.classList.add("hide");
    setTimeout(() => {
      itemContainer.removeChild(quantityContainer);
    }, 200);
  }
  btn[index].classList.remove("expanded");
}

function increaseQuantity(index) {
  selectedItems[index]++;
  updateQuantityText(index);
}

function decreaseQuantity(index) {
  if (selectedItems[index] > 1) {
    selectedItems[index]--;
    updateQuantityText(index);
  } else {
    delete selectedItems[index];
    btn[index].textContent = "Добавить"; // Меняем текст кнопки на "Добавить"
    removeQuantityContainer(index);
    tg.MainButton.hide();
  }
}

function updateQuantityText(index) {
  const quantityText = document.getElementById("quantity-text-" + index);
  quantityText.textContent = /*'Выбрано: ' +*/ selectedItems[index];
}

Telegram.WebApp.onEvent("mainButtonClicked", function () {
  let selectedItemsString = "";
  for (const index in selectedItems) {
    selectedItemsString += index + " " + selectedItems[index] + ", ";
  }
  selectedItemsString = selectedItemsString.slice(0, -2); // Удаляем лишнюю запятую и пробел в конце строки

  if (selectedItemsString === "") {
    tg.MainButton.hide(); // Если нет выбранных товаров, скрываем кнопку mainButton
  }

  // alert(selectedItemsString)

  tg.sendData(selectedItemsString);
});
