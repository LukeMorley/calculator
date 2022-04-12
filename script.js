const buttonAC = document.getElementById("AC");
const buttonC = document.getElementById("C");
const buttonDEL = document.getElementById("DEL");
const screenText = document.getElementById("screenText");
const buttons = document.querySelectorAll('.calcButton');
const buttonBeans = document.getElementById("BEANS");
let all = document.getElementsByTagName('*');
let queue = [];
let temp = '';
let resultBuilder = []
let cleaned = new Array;
let result = 0;
let current=0;
function rand(max){
    return Math.floor(Math.random()*max);
}

//EventListeners
buttons.forEach(e => {e. onclick = () => addToQueue(e.textContent);});

buttonAC.onclick = ()=> {
    clear();
    screenText.textContent='0';
}

all = Array.from(all).slice(8,40);


//Remove regular functions from special buttons
buttonBeans.removeAttribute("onclick");
buttonC.removeAttribute("onclick");
buttonDEL.removeAttribute("onclick");
buttonC.onclick = ()=>{clearLastInput();}
buttonDEL.onclick = ()=>{del();}
buttonBeans.onclick = ()=>{
    console.log(all);
    //location.href='https://www.heinz.com.au/beanz/products/00000006';
    Array.from(all).forEach(e => {
        let x = rand(2);
        console.log(x);
        // e.outerHTML = `<marquee>${e.outerHTML} </marquee>`
        let marq = document.createElement('marquee');
        if(x==0){
            marq.direction = 'up';
            marq.behavior = 'alternate'

        }
        marq.scrollAmount=10;
        console.log(e);
        e.parentNode.insertBefore(marq,e);
        marq.appendChild(e);


    });
}

//Delete only the last input i.e. 894 becomes 89
function del(){
    if(queue.length==0){
        screenText.textContent = '0';
        return;
    }
    queue.pop();
    updateScreen();
}

//Delete the entire last entry i.e. 894 becomes 0
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

//Clear all
function clear(){
    queue = [];
    resultBuilder = [];
    result = 0;
    current=0;
    cleaned = [];
}

//Adds the input to the current queue
function addToQueue(input){
    //Gets the previous result if the first input is an operator
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
        if(cleaned.length==1){
            return;
        }
        if(split(cleaned[cleaned.length-1])){
            return;
        }
        calculateAll(cleaned);
        screenText.textContent = parseFloat(result.toFixed(2));
        clear();
    }else{
        queue.push(input);
        if(x=='0'){
            current='';
        }
        updateScreen();
    }
}

//Cleans the current queue into a readable string and displays it
function updateScreen(){
    cleanAll(queue);
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