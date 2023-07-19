let tg = window.Telegram.WebApp;

tg.expand()

tg.MainButton.textColor = "#FFFFFF"
tg.MainButton.color = "#2cab37"

let item = "";
let numProducts = 6;

const buttonsContainer = document.getElementById('buttonsContainer');

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

    button.addEventListener('click', createClickListener(i));
}

function createClickListener(index)
{
    return function() {
        if (tg.MainButton.isVisible)
        {
            tg.MainButton.hide();
            for (let j = 1; j <= numProducts; j++)
            {
                document.getElementById('btn' + j).textContent = 'Добавить';
            }
        }
        else
        {
            tg.MainButton.setText('Выбран товар №' + index);
            item = String(index);
            tg.MainButton.show();
            document.getElementById('btn' + index).textContent = 'Отменить';
        }
    };
}

Telegram.WebApp.onEvent('mainButtonClicked', function()
{
    tg.sendData(item);
});