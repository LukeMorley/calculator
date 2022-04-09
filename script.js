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
const screen = document.getElementById("screen");
const screenText = document.getElementById("screenText");
const buttons = document.querySelectorAll('.calcButton');

let queue = [];
let temp = '';
let resultBuilder = []
let cleaned = new Array;
let result = 0;
let current=0;

buttons.forEach(e => {
    e. onclick = () => addToQueue(e.textContent);
});

buttonAC.onclick = ()=> {
    clear();
    screenText.textContent='0';
}

function clearLastInput(){

}

function clear(){
    temp = queue[0];
    queue = [];
    //queue.push(temp);
    temp = '';
    resultBuilder = [];
    result = 0;
    current=0;
    cleaned = [];
}

function addToQueue(input){
    x = parseFloat(screenText.textContent);
    if(split(input)&&queue.length==0){
        queue.push(x);
        queue.push(input);
        updateScreen();
        return;
    }
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
    if(input=='='){
        if(split(queue[queue.length-1])){
            return;
        }
        cleanAll(queue);
        console.log('cleaned: '+cleaned);
        calculateAll(cleaned);
        console.log('result = '+result);
        screenText.textContent = parseFloat(result.toFixed(2));
        clear();
    }else{
        queue.push(input);
        console.log(queue);
        if(x=='0'){
            current='';
        }
        updateScreen();
    }
}

function updateScreen(){
    console.log("queue is : "+queue);
    cleanAll(queue);
    let str = cleaned.join(' ');
    cleaned = [];
    screenText.textContent = str;
}

function split(input){
    if(input=='-'||input=='/'||input=='+'||input=='X'){
        return true;
    }else{
        return false;
    }
}

function cleanAll(array){
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

function calculate(int,string,int2){
    if(string=='/'){return int/int2};
    if(string=='+'){return int+int2};
    if(string=='-'){return int-int2};
    if(string=='X'){return int*int2};
}

function calculateAll(array){
    x = array.length;
    for(i=0;i<x;i++){
        if(array.length<=3){
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