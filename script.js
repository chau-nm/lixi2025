const LUCKY_MONEY_SIZE = 10;
const MONEY = ['50.000 vnđ', '40.000 vnđ', '30.000 vnđ', '20.000 vnđ', '10.000 vnđ'];

const luckyMoneyList = [];
const app = document.getElementById('app');

const renderStartButton = () => {
    const startButton = document.createElement('button');
    startButton.className = "start-button";
    startButton.innerHTML = "Bắt đầu";
    startButton.addEventListener("click", () => {
        startButton.remove();
        selectStarting();
    });
    app.appendChild(startButton);
}

const selectStarting = () => {
    const luckyMoneyWrapper = document.createElement("div");
    luckyMoneyWrapper.className = "lucky-money-wrapper";
    app.appendChild(luckyMoneyWrapper);

    const drawLuckyMoneyEnvelope = (price, index) => {
        const luckyMoney = document.createElement("div");
        const image = document.createElement("img");
        image.src = "./asset/lixi.jpg";
        luckyMoney.appendChild(image);
        luckyMoney.className = "lucky-money";
        luckyMoney.style.animationDelay = `${index * 0.3}s`;
        luckyMoney.addEventListener('click', () => {
            luckyMoney.classList.add("open");
            drawLuckyMoneyCore(price);
        });
        return luckyMoney;
    }
    
    const drawLuckyMoneyCore = (price) => {
        const luckyMoneyCoreWrapper = document.createElement("div");
        luckyMoneyCoreWrapper.className = "lucky-money-core-wrapper";
        const luckyMoneyCore = document.createElement("div");
        luckyMoneyCore.className = "lucky-money-core";
        luckyMoneyCore.innerHTML = price;
        const resetButton = document.createElement("button");
        resetButton.className = "reset-button";
        resetButton.innerHTML = "Bắt đầu lại";
        resetButton.addEventListener("click", () => {
            luckyMoneyWrapper.remove();
            luckyMoneyCoreWrapper.remove();
            renderStartButton();
        })
        luckyMoneyCore.appendChild(resetButton);

        luckyMoneyCoreWrapper.appendChild(luckyMoneyCore);
        app.appendChild(luckyMoneyCoreWrapper);
    }
    
    for (let i = 0; i < LUCKY_MONEY_SIZE; i++) {
        const price = MONEY[Math.floor(Math.random() * (MONEY.length - 1))];
        luckyMoneyList.push(price);
        luckyMoneyWrapper.appendChild(drawLuckyMoneyEnvelope(price, i));
    }
}

renderStartButton();