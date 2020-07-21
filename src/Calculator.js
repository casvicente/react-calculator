import React, { useReducer, useEffect } from 'react';
import './Calculator.css';


function Display (props) {
    return <div className="Display">{props.value}</div>
}


function Keypad ({onClick}) {
    console.log("Render Operators");
    
    const handleC = () => onClick({type: 'c'});
    const handleAC = () => onClick({type: 'ac'});
    const handleMul = () => onClick({type: 'opp', value: 'mul'});
    const handleDiv = () => onClick({type: 'opp', value: 'div'});
    const handleAdd = () => onClick({type: 'opp', value: 'add'});
    const handleSub = () => onClick({type: 'opp', value: 'sub'});
    const handleRes = () => onClick({type: 'opp', value: 'res'});
    const handleNum = (value) => () => onClick({type: 'num', value});
    const numHandlers = [...Array(10).keys()].map((i) => handleNum(i));
    
    const handleKeypress = (e) => {
        let keymap = {
            'c': handleC, 
            'a': handleAC,
            '*': handleMul,
            '/': handleDiv,
            '+': handleAdd,
            '-': handleSub,
            'Enter':handleRes,
        };
        numHandlers.forEach((numHandler, number) => {
            keymap[String(number)] = numHandler
        });

        const handler = keymap[e.key]; 
        if (handler) {
            handler(); 
            e.preventDefault();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeypress);
        return (()=> document.removeEventListener("keydown", handleKeypress));
    })

    return (<div className="Keypad">
                <button onClick={numHandlers[7]}>7</button>
                <button onClick={numHandlers[8]}>8</button>
                <button onClick={numHandlers[9]}>9</button>
                <button onClick={handleC}>C</button>
                <button onClick={handleAC}>AC</button>
                <button onClick={numHandlers[4]}>4</button>
                <button onClick={numHandlers[5]}>5</button>
                <button onClick={numHandlers[6]}>6</button>
                <button onClick={handleMul}>×</button>
                <button onClick={handleDiv}>÷</button>
                <button onClick={numHandlers[1]}>1</button>
                <button onClick={numHandlers[2]}>2</button>
                <button onClick={numHandlers[3]}>3</button>
                <button onClick={handleAdd}>+</button>
                <button onClick={handleSub}>-</button>
                <button onClick={numHandlers[0]}>0</button>
                <button/>
                <button/>
                <button onClick={handleRes}>=</button>
            </div>)
}



const api = {
    add : (a, b) => a + b,
    sub : (a, b) => a - b,
    mul : (a, b) => a * b,
    div : (a, b) => a / b,
    res : (_, b) => b,
};

const intialState = {
    acc: 0,
    operation: api.res,
    current: null,
};

function calculatorReducer(state, action) {

    const accumulate = (s)  => s.current == null ? s:{
        acc: s.operation(s.acc, s.current),
        operator: api.res,
        current: null,
    };
    switch (action.type) {
        case 'num':
            return {...state, current:  state.current == null ? action.value : state.current*10 + action.value};
        case 'opp':
            return {...accumulate(state), operation: api[action.value]};
        case 'ac':
            return intialState;
        case 'c':
            return state.current != null? {...state, current: null}: intialState;
        default:
            return intialState;
    }
}

function Calculator() {
    const [{current, acc}, dispatch] = useReducer(calculatorReducer, intialState);
    return (<div className="Calculator">
                <Display value={current ?? acc} />
                <Keypad onClick = {dispatch}/>
            </div>);
}

export default Calculator;