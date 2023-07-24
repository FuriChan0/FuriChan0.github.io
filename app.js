let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

////////////////////////////////////////
/*
SPREADSHEET_ID = '1AJyCKZm4EHlyvhMhtwGgK-bJPzUa2EyHA7XvMpcrOMk'
apiKey = 'AIzaSyAw1c6Nwin5_73R6qUr61p9U-3JPoggp5M'
*/
// Замени данные ниже на свои
const SPREADSHEET_ID = '1AJyCKZm4EHlyvhMhtwGgK-bJPzUa2EyHA7XvMpcrOMk';
const SHEET_NAME = 'Лист1';
const RANGE = 'A1:B10'; // Укажи диапазон ячеек, откуда нужно получить данные

// Функция для инициализации Google Sheets API
function init()
{
  console.log('Инициализация Google Sheets API...');
  gapi.client.init({
    apiKey: 'AIzaSyAw1c6Nwin5_73R6qUr61p9U-3JPoggp5M',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    console.log('Google Sheets API инициализирован.');
    gapi.client.load('sheets', 'v4');
  }).then(function() {
    getDataFromSheet();
  }).catch(function(error) {
    console.log('Error loading Google Sheets API:', error);
  });
}

// Функция для получения данных из Google Таблицы
function getDataFromSheet()
{
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${RANGE}`,
  }).then(function(response) {
    console.log('Данные успешно получены из Google Таблицы.');
    const data = response.result.values;
    if (data && data.length > 0)
    {
      // Пример использования данных из ячейки A2 и B5:
      const cellA2 = data[1][0]; // Так как индексация начинается с 0
      const cellB5 = data[4][1];
      console.log('Данные из ячейки A2:', cellA2);
      console.log('Данные из ячейки B5:', cellB5);
    }
    else
    {
      console.log('Данные не найдены.');
    }
  }).catch(function(error) {
    console.log('Error getting data from Google Sheets:', error);
  });
}
////////////////////////////////////////

let numProducts = 6;
const buttonsContainer = document.getElementById("buttonsContainer");
const selectedItems = {};

const btn = [];

for (let i = 1; i <= numProducts; i++)
{
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

function createClickListener(index)
{
  return function ()
  {
    if (selectedItems[index])
    {
      delete selectedItems[index];
      btn[index].textContent = "Добавить"; // Меняем текст кнопки на "Добавить"
      removeQuantityContainer(index);
    }
    else
    {
      // btn[index].textContent = 'Отменить'; // Меняем текст кнопки на "Отменить"
      btn[index].classList.add("expanded");
      selectedItems[index] = 1;
      showQuantityContainer(index);
    }
  };
}

function showQuantityContainer(index)
{
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

function removeQuantityContainer(index)
{
  const itemContainer = document.getElementById("btn" + index).parentNode;
  const quantityContainer = itemContainer.querySelector(".quantity");
  if (quantityContainer)
  {
    quantityContainer.classList.add("hide");
    setTimeout(() => {
      itemContainer.removeChild(quantityContainer);
    }, 200);
  }
  btn[index].classList.remove("expanded");
}

function increaseQuantity(index)
{
  selectedItems[index]++;
  updateQuantityText(index);
}

function decreaseQuantity(index)
{
  if (selectedItems[index] > 1)
  {
    selectedItems[index]--;
    updateQuantityText(index);
  }
  else
  {
    delete selectedItems[index];
    btn[index].textContent = "Добавить"; // Меняем текст кнопки на "Добавить"
    removeQuantityContainer(index);
  }
}

function updateQuantityText(index)
{
  const quantityText = document.getElementById("quantity-text-" + index);
  quantityText.textContent = /*'Выбрано: ' +*/ selectedItems[index];
}

Telegram.WebApp.onEvent("mainButtonClicked", function ()
{
  let selectedItemsString = "";
  for (const index in selectedItems)
  {
    selectedItemsString += index + " " + selectedItems[index] + ", ";
  }
  selectedItemsString = selectedItemsString.slice(0, -2); // Удаляем лишнюю запятую и пробел в конце строки

  if (selectedItemsString === "")
  {
    tg.MainButton.hide(); // Если нет выбранных товаров, скрываем кнопку mainButton
  }

  // alert(selectedItemsString)

  tg.sendData(selectedItemsString);
});
