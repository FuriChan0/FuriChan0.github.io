let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

let numProducts = 6;
const buttonsContainer = document.getElementById('buttonsContainer');
const selectedItems = {};

const btn = [];

for (let i = 1; i <= numProducts; i++)
{
  const button = document.createElement('button');
  button.className = 'btn';
  button.id = 'btn' + i;
  button.textContent = 'Добавить';

  const img = document.createElement('img');
  img.src = i + '.png';
  img.alt = 'Burger';
  img.className = 'img';

  const itemContainer = document.createElement('div');
  itemContainer.className = 'item';
  itemContainer.appendChild(img);
  itemContainer.appendChild(button);
  buttonsContainer.appendChild(itemContainer);

  btn[i] = button; // Сохраняем ссылку на кнопку в массиве btn
  btn[i].addEventListener('click', createClickListener(i));
}

function createClickListener(index)
{
  return function() {
    if (selectedItems[index]) {
      delete selectedItems[index];
      btn[index].textContent = 'Добавить'; // Меняем текст кнопки на "Добавить"
      removeQuantityContainer(index);
    } else {
      btn[index].textContent = 'Отменить'; // Меняем текст кнопки на "Отменить"
      selectedItems[index] = 1;
      showQuantityContainer(index);
    }
  };
}

function showQuantityContainer(index)
{
  const itemContainer = document.getElementById('btn' + index).parentNode;
  const quantityContainer = document.createElement('div');
  quantityContainer.className = 'quantity';

  const minusButton = document.createElement('button');
  minusButton.textContent = '-';
  minusButton.className = 'quantity-btn';
  minusButton.addEventListener('click', () => decreaseQuantity(index));

  const quantityText = document.createElement('span');
  quantityText.textContent = 'Выбрано: ' + selectedItems[index];
  quantityText.className = 'quantity-text';
  quantityText.id = 'quantity-text-' + index;

  const plusButton = document.createElement('button');
  plusButton.textContent = '+';
  plusButton.className = 'quantity-btn';
  plusButton.addEventListener('click', () => increaseQuantity(index));

  quantityContainer.appendChild(minusButton);
  quantityContainer.appendChild(quantityText);
  quantityContainer.appendChild(plusButton);
  itemContainer.appendChild(quantityContainer);

  tg.MainButton.setText('Продолжить оформление заказа');
  tg.MainButton.show(); // Показываем кнопку mainButton при выборе товара
}

function removeQuantityContainer(index)
{
  const itemContainer = document.getElementById('btn' + index).parentNode;
  const quantityContainer = itemContainer.querySelector('.quantity');
  if (quantityContainer)
  {
    itemContainer.removeChild(quantityContainer);
  }
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
}

function updateQuantityText(index)
{
  const quantityText = document.getElementById('quantity-text-' + index);
  quantityText.textContent = 'Выбрано: ' + selectedItems[index];
}

Telegram.WebApp.onEvent('mainButtonClicked', function()
{
  let selectedItemsString = '';
  for (const index in selectedItems)
  {
    selectedItemsString += index + ' ' + selectedItems[index] + ', ';
  }
  selectedItemsString = selectedItemsString.slice(0, -2); // Удаляем лишнюю запятую и пробел в конце строки

  if (selectedItemsString === '')
  {
    tg.MainButton.hide(); // Если нет выбранных товаров, скрываем кнопку mainButton
  }

  //alert(selectedItemsString)

  tg.sendData(selectedItemsString);
});
