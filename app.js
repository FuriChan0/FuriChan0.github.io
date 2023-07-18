let tg = window.Telegram.WebApp;

tg.expand()

tg.MainButton.textColor = "#FFFFFF"
tg.MainButton.color = "#2cab37"

let item = "";
let numProducts = 6;

const btn = [];

for (let i = 1; i <= numProducts; i++) {
    btn[i] = document.getElementById('btn' + i);
    btn[i].addEventListener("click", createClickListener(i));
}

function createClickListener(index)
{
    return function()
    {
        if (tg.MainButton.isVisible)
        {
            tg.MainButton.hide();
            btn[index].textContent = "Добавить";
        }
        else
        {
            tg.MainButton.setText("Выбран товар №" + index);
            item = String(index);
            tg.MainButton.show();
            btn[index].textContent = "Отменить";
            for (let j = 1; j <= numProducts; j++)
            {
                if (j !== index)
                {
                    btn[index].textContent = "Добавить";
                }
            }
        }
    };
}

Telegram.WebApp.onEvent("mainButtonClicked", function()
{
    tg.sendData(item);
});
