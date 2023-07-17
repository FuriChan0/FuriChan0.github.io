let tg = window.Telegram.WebApp;

tg.expand()

tg.MainButton.textColor = "#FFFFFF"
tg.MainButton.color = "#2cab37"

let item = "";

const btn = [];

for (var i = 1; i <= 6; i++)
{
    btn[i] = document.getElementById('btn' + i);
}

/*
let btn1 = document.getElementById("btn1")
let btn2 = document.getElementById("btn2")
let btn3 = document.getElementById("btn3")
let btn4 = document.getElementById("btn4")
let btn5 = document.getElementById("btn5")
let btn6 = document.getElementById("btn6")
*/

for (let i = 0; i < 6; i++)
{
    btn[i].addEventListener("click", function()
    {
        if (tg.MainButton.isVisible)
        {
            tg.MainButton.hide();
            btn[i].textContent = "Добавить";
        }
        else
        {
            tg.MainButton.setText("Выбран товар №" + (i + 1));
            item = i+1;
            tg.MainButton.show();
            btn[i].textContent = "Отменить";
        }
    });
}

/*
btn1.addEventListener("click", function()
{
    if (tg.MainButton.isVisible)
    {
        tg.MainButton.hide();
        btn1.textContent = "Добавить";
    }
    else
    {
        tg.MainButton.setText("Выбран товар №1");
        item = "1";
        tg.MainButton.show();
        btn1.textContent = "Отменить";
    }
});

btn2.addEventListener("click", function()
{
    if (tg.MainButton.isVisible)
    {
        tg.MainButton.hide();
        btn2.textContent = "Добавить";
    }
    else
    {
        tg.MainButton.setText("Выбран товар №2");
        item = "2";
        tg.MainButton.show();
        btn2.textContent = "Отменить";
    }
});

btn3.addEventListener("click", function()
{
    if (tg.MainButton.isVisible)
    {
        tg.MainButton.hide();
        btn3.textContent = "Добавить";
    }
    else
    {
        tg.MainButton.setText("Выбран товар №3");
        item = "3";
        tg.MainButton.show();
        btn3.textContent = "Отменить";
    }
});

btn4.addEventListener("click", function()
{
    if (tg.MainButton.isVisible)
    {
        tg.MainButton.hide();
        btn4.textContent = "Добавить";
    }
    else
    {
        tg.MainButton.setText("Выбран товар №4");
        item = "4";
        tg.MainButton.show();
        btn4.textContent = "Отменить";
    }
});

btn5.addEventListener("click", function()
{
    if (tg.MainButton.isVisible)
    {
        tg.MainButton.hide();
        btn5.textContent = "Добавить";
    }
    else
    {
        tg.MainButton.setText("Выбран товар №5");
        item = "5";
        tg.MainButton.show();
        btn5.textContent = "Отменить";
    }
});

btn6.addEventListener("click", function()
{
    if (tg.MainButton.isVisible)
    {
        tg.MainButton.hide();
        btn6.textContent = "Добавить";
    }
    else
    {
        tg.MainButton.setText("Выбран товар №6");
        item = "6";
        tg.MainButton.show();
        btn6.textContent = "Отменить";
    }
});

Telegram.WebApp.onEvent("mainButtonClicked", function()
{
    tg.sendData(item);
});

let usercard = document.getElementById("usercard");

let p = document.createElement("p");

p.innerText = '${tg.initDataUnsafe.user.first_name}\n${tg.initDataUnsafe.user.last_name}'

usercard.appendChild(p);
*/
