import React, { useState } from 'react';
import './Calculator.css';


function Display (props) {
    return <div className="Display">{props.value}</div>
}


function Numpad (props) {
    console.log("Render Numpad")
    const numbers = [7,8,9,4,5,6,1,2,3,0];

    return (<div className="Numpad">
            {numbers.map(i => 
                <button key={i} onClick={() => props.onNumPressed(i)}>{i}</button>
            )}
            <button>,</button>
            <button></button>
    </div>)
}
function Operators ({onAdd, onSub, onMul, onDiv, onC, onAC, onResult}) {
    console.log("Render Operators")

    return (<div className="Operators">
    <button onClick={onC}>C</button><button onClick={onAC}>AC</button>
    <button onClick={onMul}>×</button><button onClick={onDiv}>÷</button>
    <button onClick={onAdd}>+</button><button onClick={onSub}>-</button>
    <button onClick={onResult}>=</button><button/>
    </div>)
}

const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const div = (a, b) => a / b;
const assign = (_, b) => b;



function calculatorReducer(state, action) {
    const api = {
        add, sub, mul, div, res:assign,
    };

    const intialState = {
        acc: 0,
        operation: api.assign,
        current: null,
    }

    const accumulate = (s)  => s.current == null ? s:{
        acc: s.operation(s.acc, s.current),
        operator: assign,
        current: null,
    };

    switch (action.type) {
        case 'num':
            return {...state, current:  state.current == null ? action.value : state.current*10 + action.value};
        case 'opp':
            return {...accumulate(state), operation:api[action.value]};
        case 'ac':
            return intialState;
        case 'c':
            return state.current != null? {...state, current: null}: intialState;
        default:
            return intialState;
    }

}

function Calculator() {
    const [acc, setAcc] = useState(0);
    const [operation, setOperation] = useState(() => assign);
    const [current, setCurrent] = useState(null);

    const accumulate = ()  => {
        if (current != null) {
            const newAcc = operation(acc, current);
            setAcc(newAcc);
            setCurrent(null) 
        }
    }
    const handleNumPressed = (digit) => {
        console.log("Num pressed " + digit);
        setCurrent( current == null ? digit : current*10 + digit);
    }  

    const handleOperator = (operator) => () => {
        console.log("Add pressed") 
        accumulate();
        setOperation(() => operator);
    }

    const handleAC = () => {
        setAcc(0);
        setOperation(() => assign);
        setCurrent(null);
    }

    const handleC = () => {
        if(current!=null){
            setCurrent(null);
        } else  {
            handleAC();
        }
    }

    return (<div className="Calculator">
                <Display value={current ?? acc} />
                <div className="Keypad">
                    <Numpad onNumPressed = {handleNumPressed}/>
                    <Operators 
                        onAdd = {handleOperator(add)} 
                        onSub = {handleOperator(sub)}
                        onMul = {handleOperator(mul)}
                        onDiv = {handleOperator(div)}
                        onC = {handleC}
                        onAC = {handleAC}
                        onResult = {handleOperator(assign)}
                    />
                </div>
            </div>);
}

export default Calculator;