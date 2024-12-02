

//Setting Game Name
let gameName="Guess The Word";
document.title=gameName;
document.querySelector("h1").innerHTML=gameName;
document.querySelector("footer").innerHTML=`${gameName} Game Created By Mohnad Elgaid`;

//Setting Game Options
let numberOfTries=6;
let numberOfLetters=6;
let currentTry=1;
let numberOfHints=2;


//Manage Words
let wordToGuess="";
const Words=["People","Family","Silver","Future","Monday","Nature","Donate","Animal","Friday","Yellow","Father","Mother","Sister","Sunday","Circle","School","Engery","Monkey","Memory"]; 
wordToGuess=Words[Math.floor(Math.random() * Words.length)].toLowerCase();
// console.log(wordToGuess);
const messageArea=document.querySelector(".message");


//Manage Hints
document.querySelector(".hint span").innerHTML=numberOfHints;
let getHintButton=document.querySelector(".hint");
getHintButton.addEventListener("click",getHint);

function getHint(){
    if (numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML=numberOfHints;
    }
    if(numberOfHints===0){
        getHintButton.disabled=true;
    }

    const enabledInputs=document.querySelectorAll("input:not([disabled])");
    // console.log(enabledInputs);
    const emptyEnabledInputs=Array.from(enabledInputs).filter((input)=> input.value=== "");
    // console.log(emptyEnabledInputs);

    if(emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        // console.log(randomIndex);
        // console.log(randomInput);
        // console.log(indexToFill);
        if(indexToFill !== -1){
            randomInput.value=wordToGuess[indexToFill].toUpperCase();
        }
    }

}



function generateInput(){
    const inputsContainer = document.querySelector(".inputs");

    //Create Main Try Div
    for(let i=1 ; i <= numberOfTries; i++){
        const tryDiv=document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML=`<span> Try ${i}</span>`;
        if (i !== 1){
            tryDiv.classList.add("disabled-inputs");
        }

        for(let j=1; j <=numberOfLetters ; j++){
            const input=document.createElement("input");
            input.type="text";
            input.id=`guess-${i}-letter-${j}`;
            input.setAttribute("maxlength",1);
            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv);

    }

    // Focus in first input in first try element
    inputsContainer.children[0].children[1].focus();

    // Diabaled all inputs Expect First one
    const inputsInDisabledDiv=document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));
        
    
    const inputs=document.querySelectorAll("input");
    inputs.forEach((input,index) => {
           //covert to uppercase
           input.addEventListener("input",function(){
            this.value=this.value.toUpperCase();
            // console.log(index);
            const nextInput= inputs[index + 1];
            if(nextInput) nextInput.focus();

           });

           input.addEventListener("keydown",function(event){
            // console.log(event);
            const currentIndex= Array.from(inputs).indexOf(event.target); //or this
            // console.log(currentIndex);
            if(event.key=="ArrowRight"){
                const nextInput=currentIndex +1;
                if(nextInput< inputs.length) inputs[nextInput].focus();
            }
            if(event.key=="ArrowLeft"){
                const prevInput=currentIndex -1;
                if(prevInput>= 0) inputs[prevInput].focus();
            }

           });
           
    });
}

const guessButton=document.querySelector(".check");
guessButton.addEventListener("click",handleGuesses);
console.log(wordToGuess);
function handleGuesses(){
    let successGuess=true;
    for(let i = 1 ; i <= numberOfLetters ; i++){
        let inputField=document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter=inputField.value.toLowerCase();
        const acutalLetter=wordToGuess[i-1];

        //Game Logic
        if(letter==acutalLetter){
            //Letter Is Right And In Place
            inputField.classList.add("yes-in-place");
        }else if(wordToGuess.includes(letter) && letter !==""){
            //Letter Is Right But Not In Place
            inputField.classList.add("not-in-place");
            successGuess=false;
        }else{
            // Letter Is Wrong And Not Exists In Word
            inputField.classList.add("no");
            successGuess=false;
        }
    }

    //check if win or lose
    if(successGuess){
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

        if(numberOfHints===2){
            messageArea.innerHTML = `<p>Congratz You Didn't Use Hints </P>`;
        }

        // Add Disabled Class On All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

    // Disable Guess Button
    guessButton.disabled = true;
    getHintButton.disabled=true;
    }else{
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        let currentTryInputs=document.querySelectorAll(`.try-${currentTry} input` );
        currentTryInputs.forEach((input)=>(input.disabled=true));

        currentTry++;

        let nextTryInputs=document.querySelectorAll(`.try-${currentTry} input` );
        nextTryInputs.forEach((input)=>(input.disabled=false));

        let el=document.querySelector(`.try-${currentTry}`);
        if(el){
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        }else{
            //  Disable Guess Button
            guessButton.disabled = true;
            getHintButton.disabled=true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;

        }
    }
}

function handleBackSpace(event){
    if(event.key==="Backspace"){
        const inputs=document.querySelectorAll("input:not([disabled])");
        const currentIndex=Array.from(inputs).indexOf(document.activeElement);
        // console.log(currentIndex);
        if(currentIndex > 0){
            const currentInput=inputs[currentIndex];
            const prevInput=inputs[currentIndex - 1];
            currentInput.value="";
            prevInput.value="";
            prevInput.focus();

        }
    }

}
document.addEventListener("keydown",handleBackSpace)






window.onload=function(){
    generateInput();
}