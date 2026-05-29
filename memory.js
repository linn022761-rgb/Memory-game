// =================================================
// Game State Variables
// =================================================


let firstPick = null;
let secondPick = null;
let count = 0;
let score = 0;
let seconds = 0;
let minutes = 0;
let intervalId = null;
let isBoardLocked = true;
let showMessage = false;


//=================================================
// DOM elements
// =================================================

const startBtn = document.querySelector(".start button");
const timer = document.querySelector(".timer span");
const countSpan = document.querySelector(".count span");
const scoreSpan = document.querySelector(".score span");
const box = document.querySelector(".box");
const messageBox = document.querySelector(".message");

const MatchSound = new Audio("sounds/Match.wav");
const WrongSound = new Audio("sounds/Wrong.wav");
const WinSound = new Audio("sounds/Win.wav");

const images = [
    "https://i.pinimg.com/1200x/45/13/c2/4513c2e7cf4cbbc2577d0eb6785e1fe9.jpg",
    "https://i.pinimg.com/1200x/35/9b/e4/359be48db4dc41f68986981579897db2.jpg",
    "https://i.pinimg.com/736x/4a/79/32/4a79322ab1ee2c915931447369d008af.jpg",
    "https://i.pinimg.com/736x/ad/bd/6d/adbd6dcb13961c586ef41b2018b4b43c.jpg",
    "https://i.pinimg.com/736x/6e/37/7f/6e377f739b9ed298a8507cbde8a4081e.jpg",
    "https://i.pinimg.com/1200x/5f/2e/ad/5f2ead5c4323d99cb9d0dfeecd0c3886.jpg"
]

const totalImages = [...images,...images];

console.log("Before shuffle");
console.log(totalImages)
console.log("After shuffle");

shuffleImage(totalImages);
console.log(totalImages)

function shuffleImage(image){
    for(let i = image.length-1; i>0 ;i--){
    const j = Math.floor(Math.random()*(i+1));
    [image[i],image[j]] = [image[j],image[i]];
    }
   
}

function showGameBox(){
   box.innerHTML = "";
    totalImages.forEach((img)=>{
    const card = document.createElement("div");
    card.classList.add("card");
    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");
    
    const front = document.createElement("div");
    front.classList.add("front");
    const back = document.createElement("div");
    back.classList.add("back");
    const image = document.createElement("img");
    image.src = img

    box.appendChild(card);
    card.appendChild(cardInner); 
    cardInner.appendChild(front);
    cardInner.appendChild(back);
    back.appendChild(image);

      card.addEventListener('click', startGame);
    })

    // const cards = document.querySelectorAll(".card")
    // cards.forEach((card)=>{
    //     card.addEventListener("click",()=>{
    //         card.classList.add("active");
    //     })
    // })
  
  
}

function gameCount(){
    countSpan.textContent = count;
    
}

function gameScore(){
    scoreSpan.textContent = score;
}

function startGame(){
   if(isBoardLocked || this.classList.contains("active")) return;
    this.classList.toggle("active")//this သည် လက်ရှိ နှိပ်လိုက်တာကို မှတ်ထားပေးတာ

    if(!firstPick){
        firstPick = this; // !null = !false = true In first click // !true = false In second click 
        return;
    }
    
    count++;
    gameCount();
    secondPick = this;

    if(firstPick.querySelector(".back img").src === secondPick.querySelector(".back img").src){

        MatchSound.pause();
        MatchSound.currentTime = 0;
        MatchSound.play();
        score++;
        gameScore();

        if(score === 6){
            WinSound.pause();
            WinSound.currentTime = 0;
            WinSound.play();

            let message = "";
            let time = `${minutes}:${seconds<10? "0"+seconds:seconds}`
            if(count < 7){
                message = `🎉 Impossible mode! I bet you can’t do better, can you? If you can, you're a memory master! Only ${count} tries and your time was ${time}!`;
            }else if(count <10){
                message = `😎 Not bad! You remembered most of them! Tries: ${count}, Time: ${time}.`
            }else{
                message = `🤔 Oops! Looks like you need more memory training. Tries: ${count}, Time: ${time}.`;
            }

            let div = document.createElement("div");
            div.textContent = message;
            messageBox.appendChild(div);

            let restartBtn = document.createElement("button");
            restartBtn.textContent = "Restart";
            messageBox.appendChild(restartBtn);
            
            setTimeout(()=>{

                if(!showMessage){
                    messageBox.style.display = "block";
                    box.style.display = "none";
                    showMessage = true;
                    restartBtn.addEventListener("click",restartGame)
                }
               
                },500);
                clearInterval(intervalId);
        }

        firstPick = null;
        secondPick = null;
    }else{
        WrongSound.pause();
        WrongSound.currentTime = 0;
        WrongSound.play();
        isBoardLocked = true;
        setTimeout(()=>{
            firstPick.classList.remove("active");
            secondPick.classList.remove("active");
            firstPick = null;
            secondPick = null;
            isBoardLocked = false;

        },1000)
    }

}

function previewCards(){
    const cards = document.querySelectorAll(".card");
    //div ထဲက ရှိပီးသား card ကို ပြန်ခေါ်ခြင်း
    cards.forEach((card)=> card.classList.add("active"))

    setTimeout(()=>{
        cards.forEach((card)=>card.classList.remove("active"))
    },2000)
}

function startTimer(){
    if(!intervalId){

        intervalId = setInterval(()=>{
        seconds++;
        if(seconds === 60){
            minutes++
            seconds = 0;
        }
        timer.textContent = `${minutes<10? "0"+minutes : minutes}:${seconds<10? "0"+ seconds : seconds} `  
    },1000)

    }
}

function restartGame(){
    clearInterval(intervalId);
    intervalId = null;
   
    timer.textContent = "00:00"
    count = 0;
    score = 0;
    seconds = 0;
    minutes = 0;
    countSpan.textContent = count;
    scoreSpan.textContent = score;
    startBtn.textContent = "Start";
    startBtn.style.color = " #8e57ef ";

    firstPick = null;
    secondPick = null;

    box.style.display = "grid";
    messageBox.innerHTML = "";
    messageBox.style.display = "none";
    showMessage = false;
    
    isBoardLocked = true;

    shuffleImage(totalImages);
    showGameBox();
}

 startBtn.addEventListener("click",()=>{
    if(startBtn.textContent === "Start"){
        isBoardLocked = false;
        showMessage = false;
        startBtn.textContent = "Stop";
        startBtn.style.color = "#d53a9d";
        startBtn.style.fontSize = "20px";
        
        startTimer();
        previewCards(); 
    }else{
        restartGame();
    }

 })

showGameBox();



