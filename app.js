let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

////////////////////////////////////////
const SPREADSHEET_ID = '1AJyCKZm4EHlyvhMhtwGgK-bJPzUa2EyHA7XvMpcrOMk';
const SHEET_NAME = 'Лист1';
const RANGE = 'A:D';

const dataObj = {};

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

function getDataFromSheet() {
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

const selectedItems = {};
const btn = [];

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
    priceElement.textContent = " · " + dataObj[`itemPrice${i}`] + " руб.";

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
  tg.MainButton.show();
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
    btn[index].textContent = "Добавить";
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
  selectedItemsString = selectedItemsString.slice(0, -2);

  if (selectedItemsString === "")
  {
    tg.MainButton.hide();
  }

  // alert(selectedItemsString)

  tg.sendData(selectedItemsString);
});
