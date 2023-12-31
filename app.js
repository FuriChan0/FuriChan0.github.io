let tg = window.Telegram.WebApp;

// tg.expand(); // Функция раскрытия окна на все пространство

tg.MainButton.textColor = "#FFFFFF"; // Устанавливаем цвет текста для главной кнопки.
tg.MainButton.color = "#2cab37"; // Устанавливаем цвет фона для главной кнопки.

// Константы для получения данных из таблицы Google Sheets
const SPREADSHEET_ID = '1AJyCKZm4EHlyvhMhtwGgK-bJPzUa2EyHA7XvMpcrOMk';
const SHEET_NAME = 'Лист1';
const RANGE = 'A:D';

// Объект для хранения данных из Google Sheets
const dataObj = {};

// Функция инициализации
function init()
{
  gapi.client.init({
    apiKey: 'AIzaSyAw1c6Nwin5_73R6qUr61p9U-3JPoggp5M',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    gapi.client.load('sheets', 'v4');
  }).then(function() {
    getDataFromSheet();
  }).catch(function(error) {
    console.log('Error loading Google Sheets API:', error);
  });
}

// Функция для получения данных из таблицы Google Sheets
function getDataFromSheet()
{
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${RANGE}`,
  }).then(function(response) {
    const data = response.result.values;
    console.log(data);
    const num = data.length;
    if (data && data.length > 0)
    {
      console.log('Все значения из таблицы:');
      for (let i = 1; i < num; i++) {
        const row = data[i];
        const imageUrl = row[0];
        const itemName = row[1];
        const itemPrice = row[2];

        dataObj[`imageUrl${i}`] = imageUrl;
        dataObj[`itemName${i}`] = itemName;
        dataObj[`itemPrice${i}`] = itemPrice;
      }

      createButtonsWithImages(num);
    }
    else
    {
      console.log('Данные не найдены.');
    }
  }).catch(function(error) {
    console.log('Error getting data from Google Sheets:', error);
  });
}

// Объект для хранения выбранных товаров и кнопок
const selectedItems = {};
const btn = [];

// Функция для создания кнопок с изображениями
function createButtonsWithImages(num)
{
  const buttonsContainer = document.getElementById("buttonsContainer");

  for (let i = 1; i < num; i++)
  {
    const button = document.createElement("button");
    button.className = "btn";
    button.id = "btn" + i;
    button.textContent = "Добавить";

    const img = document.createElement("img");
    img.src = dataObj[`imageUrl${i}`]; // Используем ссылку на изображение из объекта dataObj
    img.alt = "Burger";
    img.className = "img";

    const nameAndPriceContainer = document.createElement("div");
    nameAndPriceContainer.className = "item-info";

    const nameElement = document.createElement("span");
    nameElement.className = "item-name";
    nameElement.textContent = dataObj[`itemName${i}`];

    const priceElement = document.createElement("span");
    priceElement.className = "item-price";
    priceElement.textContent = " · ₽ " + dataObj[`itemPrice${i}`];

    nameAndPriceContainer.appendChild(nameElement);
    nameAndPriceContainer.appendChild(priceElement);

    const itemContainer = document.createElement("div");
    itemContainer.className = "item";
    itemContainer.appendChild(img);
    itemContainer.appendChild(nameAndPriceContainer);
    itemContainer.appendChild(button);
    buttonsContainer.appendChild(itemContainer);

    btn[i] = button;
    btn[i].addEventListener("click", createClickListener(i));
  }
}

// Функция для создания обработчика клика по кнопке
function createClickListener(index)
{
  return function ()
  {
    if (selectedItems[index])
    {
      delete selectedItems[index];
      btn[index].textContent = "Добавить";
      removeQuantityContainer(index);
    }
    else
    {
      // btn[index].textContent = 'Отменить';
      btn[index].classList.add("expanded");
      selectedItems[index] = 1;
      showQuantityContainer(index);
    }
  };
}

// Функция для отображения контейнера с количеством товаров
function showQuantityContainer(index)
{
  const itemContainer = document.getElementById("btn" + index).parentNode;
  const quantityContainer = document.createElement("div");
  quantityContainer.className = "quantity";

  const minusButton = document.createElement("button");
  minusButton.textContent = "-";
  minusButton.className = "quantity-btn-minus";
  minusButton.addEventListener("click", () => decreaseQuantity(index));

  const quantityText = document.createElement("span");
  quantityText.textContent = /*'Выбрано: ' +*/ selectedItems[index];
  quantityText.className = "quantity-text";
  quantityText.id = "quantity-text-" + index;

  const plusButton = document.createElement("button");
  plusButton.textContent = "+";
  plusButton.className = "quantity-btn-plus";
  plusButton.addEventListener("click", () => increaseQuantity(index));

  quantityContainer.appendChild(minusButton);
  quantityContainer.appendChild(quantityText);
  quantityContainer.appendChild(plusButton);
  itemContainer.appendChild(quantityContainer);

  requestAnimationFrame(() => {
    quantityContainer.classList.add("show");
  });

  tg.MainButton.setText("Продолжить оформление заказа");
  tg.MainButton.show();
}

// Функция для удаления контейнера с количеством товаров
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

// Функция для увеличения количества товаров
function increaseQuantity(index)
{
  selectedItems[index]++;
  updateQuantityText(index);
}

// Функция для уменьшения количества товаров
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
    btn[index].textContent = "Добавить";
    removeQuantityContainer(index);
  }
}

// Функция для обновления текста с количеством товаров
function updateQuantityText(index)
{
  const quantityText = document.getElementById("quantity-text-" + index);
  quantityText.textContent = /*'Выбрано: ' +*/ selectedItems[index];
}

// Обработчик события клика по главной кнопке
Telegram.WebApp.onEvent("mainButtonClicked", function ()
{
  let selectedItemsString = "";
  for (const index in selectedItems)
  {
    selectedItemsString += index + " " + selectedItems[index] + ", ";
  }
  selectedItemsString = selectedItemsString.slice(0, -2);

  if (selectedItemsString === "")
  {
    tg.MainButton.hide();
  }

  // alert(selectedItemsString) // Вывод на экран информации, которая отправляется в ТГ

  tg.sendData(selectedItemsString);
});