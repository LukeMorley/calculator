const button1 = document.getElementById("1");
const button2 = document.getElementById("2");
const button3 = document.getElementById("3");
const button4 = document.getElementById("4");
const button5 = document.getElementById("5");
const button6 = document.getElementById("6");
const button7 = document.getElementById("7");
const button8 = document.getElementById("8");
const button9 = document.getElementById("9");
const button0 = document.getElementById("0");
const buttonEqual = document.getElementById("=");
const buttonDivide = document.getElementById("/");
const buttonAC = document.getElementById("AC");
const buttonMult = document.getElementById("*");
const buttonPlus = document.getElementById("+");
const buttonDot = document.getElementById(".");
const buttonC = document.getElementById("C");
const buttonDEL = document.getElementById("DEL");
const screen = document.getElementById("screen");
const screenText = document.getElementById("screenText");
const buttons = document.querySelectorAll('.calcButton');

let queue = [];
let temp = '';
let resultBuilder = []
let cleaned = new Array;
let result = 0;
let current=0;

buttons.forEach(e => {e. onclick = () => addToQueue(e.textContent);});

buttonAC.onclick = ()=> {
    clear();
    screenText.textContent='0';
}

buttonC.removeAttribute("onclick");
buttonDEL.removeAttribute("onclick");
buttonC.onclick = ()=>{clearLastInput();}
buttonDEL.onclick = ()=>{del();}

function del(){
    if(queue.length==0){
        screenText.textContent = '0';
        return;
    }
    queue.pop();
    updateScreen();
}

function clearLastInput(){
    if(queue.length<2){
        clear();
        updateScreen();
        screenText.textContent='0';
    }else{
        cleaned.pop();
        queue = cleaned;
        updateScreen();
    }
}

function clear(){
    temp = queue[0];
    queue = [];
    temp = '';
    resultBuilder = [];
    result = 0;
    current=0;
    cleaned = [];
}

function addToQueue(input){
    //Gets the last result if the first input is an operator
    x = parseFloat(screenText.textContent);
    if(split(input)&&queue.length==0){
        queue.push(x);
        queue.push(input);
        updateScreen();
        return;
    }
    //Checks if the current input & last input were both operators, to avoid
    //multiple operators in a row (i.e. 33,X,/,+,22). If true replace last
    //operator with current input 
    if(split(input)){
        if(split(queue[queue.length-1])){
            queue.pop();
            queue.push(input);
        }else{
            queue.push(input);
        }
        updateScreen();
        return;
    }
    //Calculate
    if(input=='='){
        cleanAll(queue);
        //console.log('cleaned: '+cleaned);
        if(cleaned.length==1){
            return;
        }
        if(split(cleaned[cleaned.length-1])){
            return;
        }
        calculateAll(cleaned);
        //console.log('result = '+result);
        screenText.textContent = parseFloat(result.toFixed(2));
        clear();
    }else{
        queue.push(input);
        //console.log(queue);
        if(x=='0'){
            current='';
        }
        updateScreen();
    }
}

//Cleans the current queue into a readable string and displays it
function updateScreen(){
    // console.log("queue is : "+queue);
    cleanAll(queue);
    // console.log("cleaned is : "+cleaned);
    // queue=cleaned;
    let str = cleaned.join(' ');
    if(str.length==0){
        screenText.textContent = 0;
    }else{
        screenText.textContent = str;
    }
}

//Checks if the current input is an operator
function split(input){
    if(input=='-'||input=='/'||input=='+'||input=='X'){
        return true;
    }else{
        return false;
    }
}

//sanitises the input array so that numbers are grouped
//i.e. transforms [3,0,.,2,+,1,2] into [30.2,+,12]
function cleanAll(array){
    cleaned = [];
    if(array.length==1){
        cleaned.push(array[0]);
        return;
    }
    let temp2 ='';
    for(i=0;i<array.length;i++){
        if(i==array.length-1){
            if(split(array[i])){
                cleaned.push(temp2);
                cleaned.push(array[i]);
            }else{
                if(array.length==1){
                    if(array[0]=='.'){
                        cleaned.push(0)
                        cleaned.push(array[0]);
                        return;
                    }
                    cleaned[0] = array[0];
                    return;
                }
                temp2 = temp2+array[i];
                cleaned.push(temp2);
            }
            return;
        }else{
            if(split(array[i])){
                cleaned.push(temp2);
                cleaned.push(array[i]);
                temp2='';
            }else{
                temp2 = temp2+array[i];
            }
        }
    }
}

//Given a number, an operator and another number returns the result
function calculate(int,string,int2){
    if(string=='/'){return int/int2};
    if(string=='+'){return int+int2};
    if(string=='-'){return int-int2};
    if(string=='X'){return int*int2};
}

//Calculates from left to right using the above calculate function.
//Replaces the first 3 items in queue with the result and repeats
//until the queue is empty
function calculateAll(array){
    x = array.length;
    for(i=0;i<x;i++){
        if(array.length<3){
            result=array[0];
            return
        }
        if(array.length==3){
            result=calculate(parseFloat(array[0]),array[1],parseFloat(array[2]));
            return;
        }
        if(i%2==1){
            result=calculate(parseFloat(array[0]),array[1],parseFloat(array[2]));
            array.shift();
            array.shift();
            array.shift();
            array.unshift(result);
        }
    }
}