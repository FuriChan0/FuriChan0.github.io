let tg = window.Telegram.WebApp;

tg.expand()

tg.MainButton.textColor = "#FFFFFF"
tg.MainButton.color = "#2cab37"

let item = "";
let numProducts = 6;

const buttonsContainer = document.getElementById('buttonsContainer');
const userCard = document.getElementById('usercard');
let quantityContainer = null;

for (let i = 1; i <= numProducts; i++) {
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

    button.addEventListener('click', createClickListener(i));
}

function createClickListener(index) {
    return function() {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
            for (let j = 1; j <= numProducts; j++) {
                document.getElementById('btn' + j).textContent = 'Добавить';
            }
            clearUserCard();
        } else {
            tg.MainButton.setText('Выбран товар №' + index);
            item = String(index);
            tg.MainButton.show();
            document.getElementById('btn' + index).textContent = 'Отменить';
            showUserCard(index);
        }
    };
}

function showUserCard(index) {
    clearUserCard();

    if (quantityContainer === null)
    {
        quantityContainer = document.createElement('div');
        quantityContainer.className = 'quantity';
    }

    const minusButton = document.createElement('button');
    minusButton.textContent = '-';
    minusButton.className = 'quantity-btn';
    minusButton.addEventListener('click', decreaseQuantity);

    const quantityText = document.createElement('span');
    quantityText.textContent = 'Выбрано: 1';
    quantityText.className = 'quantity-text';

    const plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.className = 'quantity-btn';
    plusButton.addEventListener('click', increaseQuantity);

    quantityContainer.innerHTML = '';

    quantityContainer.appendChild(minusButton);
    quantityContainer.appendChild(quantityText);
    quantityContainer.appendChild(plusButton);

    const itemContainer = document.getElementById('btn' + index).parentNode;
    itemContainer.style.position = 'relative';
    itemContainer.appendChild(quantityContainer);
}

function clearUserCard()
{
    if (quantityContainer !== null) {
        quantityContainer.parentNode.removeChild(quantityContainer);
        quantityContainer = null;
    }
}

function increaseQuantity()
{
    const quantityText = document.querySelector('.quantity-text');
    let quantity = parseInt(quantityText.textContent.split(':')[1].trim(), 10);
    quantity++;
    quantityText.textContent = 'Выбрано: ' + quantity;
}

function decreaseQuantity()
{
    const quantityText = document.querySelector('.quantity-text');
    let quantity = parseInt(quantityText.textContent.split(':')[1].trim(), 10);
    if (quantity > 1) {
        quantity--;
        quantityText.textContent = 'Выбрано: ' + quantity;
    }
}

Telegram.WebApp.onEvent('mainButtonClicked', function()
{
    const quantityText = document.querySelector('.quantity-text');
    let quantity = parseInt(quantityText.textContent.split(':')[1].trim(), 10);
    tg.sendData(item + " " + String(quantity));
});
