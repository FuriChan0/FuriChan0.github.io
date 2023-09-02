let tg = window.Telegram.WebApp;

tg.expand(); // Функция раскрытия окна на все пространство

tg.MainButton.textColor = "#FFFFFF"; // Устанавливаем цвет текста для главной кнопки.
tg.MainButton.color = "#66836a"; // Устанавливаем цвет фона для главной кнопки.

// Константы для получения данных из таблицы Google Sheets
const SPREADSHEET_ID = '18fi5tz4n0ES-6Grbttv6PyCKXU5QuoSiU0EjBqC_o3A';
const SHEET_NAME = 'Лист1';
const RANGE = 'A:P';

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

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-images");

document.addEventListener("click", handlerOutWard);
modal.addEventListener("click", modalActive);

function handlerOutWard() {
  while (modal.firstChild) {
    modal.removeChild(modal.firstChild);
  }
  modal.style.opacity = "0";
  modal.classList.remove("modal-active");
}

function modalActive(e) {
  e.stopPropagation();
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
      for (let i = 1; i < num; i++) {
        const row = data[i];
        const imageUrl = row[0];
        const itemName = row[1];
        const itemPrice = row[2];

        const itemAvial = row[3];
        const itemAvialXS = row[4];
        const itemAvialS = row[5];
        const itemAvialM = row[6];
        const itemAvialL = row[7];
        const itemAvialXL = row[8];
        const itemAvialXXL = row[9];
        const itemAvialXXXL = row[10];
        const itemComposition = row[11];
        const itemShortDescription = row[12];
        const itemDescription = row[13];
        const itemDescriptionImage1 = row[14];
        const itemDescriptionImage2 = row[15];
        const itemDescriptionImage3 = row[16];

        dataObj[`imageUrl${i}`] = imageUrl;
        dataObj[`itemName${i}`] = itemName;
        dataObj[`itemPrice${i}`] = itemPrice;

        dataObj[`itemAvial${i}`] = itemAvial;
        dataObj[`itemAvialXS${i}`] = itemAvialXS;
        dataObj[`itemAvialS${i}`] = itemAvialS;
        dataObj[`itemAvialM${i}`] = itemAvialM;
        dataObj[`itemAvialL${i}`] = itemAvialL;
        dataObj[`itemAvialXL${i}`] = itemAvialXL;
        dataObj[`itemAvialXXL${i}`] = itemAvialXXL;
        dataObj[`itemAvialXXXL${i}`] = itemAvialXXXL;
        dataObj[`itemComposition${i}`] = itemComposition;
        dataObj[`itemShortDescription${i}`] = itemShortDescription;
        dataObj[`itemDescription${i}`] = itemDescription;
        dataObj[`itemDescriptionImage1${i}`] = itemDescriptionImage1;
        dataObj[`itemDescriptionImage2${i}`] = itemDescriptionImage2;
        dataObj[`itemDescriptionImage3${i}`] = itemDescriptionImage3;
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
const item = [];

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
    img.alt = "Ошибка!";
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

    item[i] = img;
    item[i].addEventListener("click", (e) => createClickItem(e, i));
    btn[i] = button;
    btn[i].addEventListener("click", (e) => createClickListener(e, i));
    btn[i].addEventListener("click", handlerOutWard);
  }
}

// Функция для создания обработчика клика по кнопке
function createClickListener(event, index)
{
  event.stopPropagation(event);
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
}

// Функция для создания обработчика клика по изображению
let currentImageIndex = 1;
function createClickItem(event, index)
{
  event.stopPropagation(event);

  if (modal.classList.contains("modal-active") == false)
  {
    modal.style.opacity = "0";
    modal.style.display = "block";

    modal.classList.add("modal-active");

    const modalTop = document.querySelector(".modal-active");
    const newTopValueTmp = Math.floor((index - 1) / 2);
    const newTopValue = String(newTopValueTmp * 200) + "px"; 
    modalTop.style.top = newTopValue;

    const modalCancel = document.createElement("button");
    modalCancel.className = "modal-cancel-button";
    modalCancel.textContent = "X";
    modalCancel.addEventListener("click", handlerOutWard);
    modal.appendChild(modalCancel);

    const modalImages = document.createElement("img");
    modalImages.className = "modal-images";
    modalImages.src = dataObj[`itemDescriptionImage1${index}`];
    modalImages.alt = "Ошибка!";
    modal.appendChild(modalImages);

    const modalImagesPrev = document.createElement("button");
    modalImagesPrev.className = "modal-images-button";
    modalImagesPrev.textContent = "<";
    modalImagesPrev.addEventListener("click", () => changeImage(index, modalImages, -1));
    const modalImagesNext = document.createElement("button");
    modalImagesNext.className = "modal-images-button";
    modalImagesNext.textContent = ">";
    modalImagesNext.addEventListener("click", () => changeImage(index, modalImages, 1));
    modal.appendChild(modalImagesPrev);
    modal.appendChild(modalImagesNext);

    const modalName = document.createElement("p");
    modalName.className = "modal-name-text";
    modalName.textContent = dataObj[`itemName${index}`];
    modal.appendChild(modalName);

    const modalShortDescription = document.createElement("p");
    modalShortDescription.className = "modal-description-text";
    modalShortDescription.innerHTML = dataObj[`itemShortDescription${index}`] + "<br>";
    modal.appendChild(modalShortDescription);

    const modalDescription = document.createElement("p");
    modalDescription.className = "modal-description-text";
    modalDescription.innerHTML = "<hr><b><h3>Описание:</h3></b>"
    + dataObj[`itemDescription${index}`] + "<br><b>Состав: </b>"
    + dataObj[`itemComposition${index}`] + "<br><br><hr><b><h3>Наличие:</h3></b>"
    + " - XS: " + dataObj[`itemAvialXS${index}`]
    + "<br> - S: " + dataObj[`itemAvialS${index}`]
    + "<br> - M: " + dataObj[`itemAvialM${index}`]
    + "<br> - L: " + dataObj[`itemAvialL${index}`]
    + "<br> - XL: " + dataObj[`itemAvialXL${index}`]
    + "<br> - XXL: " + dataObj[`itemAvialXXL${index}`]
    + "<br> - XXXL: " + dataObj[`itemAvialXXXL${index}`];
    modal.appendChild(modalDescription);

    setTimeout(function () {
      modal.style.opacity = "1";
    }, 0);
  }
}

// Функция для изменения изображения
function changeImage(index, imgElement, increment) {
  currentImageIndex += increment;
  if (currentImageIndex < 1) {
    currentImageIndex = 3; // Если индекс стал меньше 1, переходим к последнему изображению
  }
  if (currentImageIndex > 3) {
    currentImageIndex = 1; // Если индекс стал больше 3, переходим к первому изображению
  }
  imgElement.style.opacity = 0;
  setTimeout(function () {
    imgElement.src = dataObj[`itemDescriptionImage${currentImageIndex}${index}`];
    imgElement.alt = dataObj[`itemDescriptionImage1${index}`];
    setTimeout(function () {
      imgElement.style.opacity = 1;
    }, 10);
  }, 500);
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

  tg.MainButton.setText("Продолжить");
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