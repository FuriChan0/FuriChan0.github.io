let tg = window.Telegram.WebApp;

tg.expand()

tg.MainButton.textColor = "#FFFFFF"
tg.MainButton.color = "#2cab37"

let item = "";

const btn = [];

for (let i = 1; i <= 6; i++)
{
    btn[i] = document.getElementById('btn' + i);
    btn[i].addEventListener("click", function()
    {
        if (tg.MainButton.isVisible)
        {
            tg.MainButton.hide();
            btn[i].textContent = "Добавить";
        }
        else
        {
            tg.MainButton.setText("Выбран товар №" + i);
            item = i.toString();
            tg.MainButton.show();
            btn[i].textContent = "Отменить";
        }
    });
}
