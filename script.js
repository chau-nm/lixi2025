const LUCKY_MONEY_SIZE = 12
const MONEY = {
    "50.000 vnđ": 6,
    "100.000 vnđ": 5,
    "200.000 vnđ": 1,
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

const luckyMoneyList = []
const app = document.getElementById("app")
let isShuffling = false
let canSelect = false
let isMusicPlaying = false

const initializeGame = () => {

    const luckyMoneyWrapper = document.createElement("div")
    luckyMoneyWrapper.className = "lucky-money-wrapper"
    app.appendChild(luckyMoneyWrapper)

    const displayGift = (gift) => {
        const luckyMoneyCoreWrapper = document.createElement("div");
        luckyMoneyCoreWrapper.className = "lucky-money-core-wrapper";
        const luckyMoneyCore = document.createElement("div");
        luckyMoneyCore.className = "lucky-money-core";
        luckyMoneyCore.innerHTML = gift;
        const resetButton = document.createElement("button");
        resetButton.className = "reset-button";
        resetButton.innerHTML = "X";
        resetButton.addEventListener("click", () => {
            luckyMoneyCoreWrapper.remove();
        })
        luckyMoneyCore.appendChild(resetButton);

        luckyMoneyCoreWrapper.appendChild(luckyMoneyCore);
        app.appendChild(luckyMoneyCoreWrapper);
    }

    const drawLuckyMoneyEnvelope = (price, index) => {
        const luckyMoney = document.createElement("div")
        luckyMoney.className = "lucky-money flipped"
        luckyMoney.dataset.index = index
        luckyMoney.dataset.price = price

        const front = document.createElement("div")
        front.className = "lucky-money-front"
        const frontImage = document.createElement("img")
        frontImage.src = "./asset/lucky-card.jpg"
        frontImage.alt = "Lucky Money Envelope"
        front.appendChild(frontImage)

        const back = document.createElement("div")
        back.className = "lucky-money-back"
        const backImage = document.createElement("img")
        backImage.src = "./asset/lucky-card.jpg"
        backImage.alt = "Lucky Money Envelope"
        back.appendChild(backImage)

        const backContent = document.createElement("div")
        backContent.className = "lucky-money-back-content"
        backContent.textContent = price
        back.appendChild(backContent)

        luckyMoney.appendChild(front)
        luckyMoney.appendChild(back)

        luckyMoney.addEventListener("click", () => {
            if (canSelect && !luckyMoney.classList.contains("shuffling") && !luckyMoney.classList.contains("selected")) {
                canSelect = false
                luckyMoney.classList.add("selected")
                luckyMoney.classList.add("flipped")
                setTimeout(() => {
                    setTimeout(() => {
                        document.querySelectorAll(".lucky-money:not(.selected)").forEach((card) => {
                            card.classList.add("flipped")
                        })

                        setTimeout(() => {
                            displayGift(luckyMoney.dataset.price)
                        }, 120)
                    }, 600) // Đợi 500ms trước khi lật các lá bài khác


                }, 1000) // Đợi 1 giây trước khi lật lại lá bài được chọn
            }
        })

        return luckyMoney
    }

    const luckyMoneyEnvelopes = []
    for (const [price, count] of Object.entries(MONEY)) {
        for (let i = 0; i < count; i++) {
            luckyMoneyList.push(price)
        }
    }
    shuffleArray(luckyMoneyList)

    for (let i = 0; i < LUCKY_MONEY_SIZE; i++) {
        const envelope = drawLuckyMoneyEnvelope(luckyMoneyList[i], i)
        luckyMoneyEnvelopes.push(envelope)
        luckyMoneyWrapper.appendChild(envelope)
    }

    const shuffleButton = document.createElement("button")
    shuffleButton.className = "shuffle-button"
    shuffleButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>'
    shuffleButton.addEventListener("click", () => {
        if (!isShuffling) {
            shuffleAnimation(luckyMoneyEnvelopes)
        }
    })
    app.appendChild(shuffleButton)

    const musicButton = document.createElement("button")
    musicButton.className = "music-button"
    musicButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
    musicButton.addEventListener("click", toggleMusic)
    app.appendChild(musicButton)
}

const shuffleAnimation = (envelopes) => {
    if (isShuffling) return
    isShuffling = true
    canSelect = false

    const wrapper = document.querySelector(".lucky-money-wrapper")
    const wrapperRect = wrapper.getBoundingClientRect()
    const centerX = wrapperRect.width / 2
    const centerY = wrapperRect.height / 2

    envelopes.forEach((envelope) => envelope.classList.add("shuffling"))

    const flipAllCardsDown = () => {
        return new Promise((resolve) => {
            envelopes.forEach((envelope) => {
                envelope.classList.remove("flipped", "selected")
            })
            setTimeout(() => {
                canSelect = true
            }, 2000)
            setTimeout(resolve, 1000)
        })
    }

    shuffleArray(luckyMoneyList)
    const gatherCards = () => {
        return new Promise((resolve) => {
            anime({
                targets: ".lucky-money",
                translateX: (el) => {
                    const rect = el.getBoundingClientRect();
                    return centerX - rect.left - rect.width / 2;
                },
                translateY: (el) => {
                    const rect = el.getBoundingClientRect();
                    return centerY - rect.top - rect.height / 2;
                },
                delay: anime.stagger(10, {
                    from: 'center',
                    easing: 'easeOutQuad' // Easing cho stagger effect
                }),
                rotate: {
                    value: 360,
                    duration: 100,
                    easing: 'easeOutCubic' // Easing riêng cho xoay
                },
                duration: 240, // Tăng thời gian để chuyển động mượt hơn
                complete: () => {
                    setTimeout(resolve, 500);
                },
            });
        });
    };
    const shuffleCards = () => {
        return new Promise((resolve) => {
            anime({
                targets: ".lucky-money",
                rotate: [
                    { value: 320, duration: 100 },
                    { value: 400, duration: 100 },
                    { value: 320, duration: 100 },
                    { value: 400, duration: 100 },
                    { value: 360, duration: 100 },
                ],
                duration: 2500,
                easing: "easeInOutSine",
                delay: anime.stagger(40), // Delay for each card to start staggered
                complete: () => {
                    setTimeout(resolve, 500); // Resolve after animation finishes
                },
            });
        });
    };
    const distributeCards = () => {
        return new Promise((resolve) => {
            anime.timeline()
                .add({
                    targets: ".lucky-money",
                    translateX: 0,
                    translateY: 0,
                    duration: 120,
                    rotate:0,
                    delay: anime.stagger(40, {
                        from: 'center'
                    }),
                    complete: () => {
                        envelopes.forEach((envelope, index) => {
                            envelope.style.transform = ''
                            envelope.classList.remove("shuffling");
                            envelope.dataset.price = luckyMoneyList[index];
                            envelope.querySelector(".lucky-money-back-content").textContent = luckyMoneyList[index];
                        });
                        isShuffling = false;
                        canSelect = true;
                        resolve();
                    }
                });
        });
    };
    flipAllCardsDown()
        .then(gatherCards)
        .then(shuffleCards)
        .then(distributeCards)
        .then(() => {
            console.log("Animation completed")
        })
}





const toggleMusic = () => {
    const audio = document.getElementById("music")
    if (isMusicPlaying) {
        audio.pause()
    } else {
        audio.play()
    }
    isMusicPlaying = !isMusicPlaying
    updateMusicButtonIcon()
}

const updateMusicButtonIcon = () => {
    const musicButton = document.querySelector(".music-button")
    if (isMusicPlaying) {
        musicButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>'
    } else {
        musicButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
    }
}

initializeGame()


