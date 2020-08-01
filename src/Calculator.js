import React, { useReducer, useEffect } from 'react';
import './Calculator.css';
import Keypad from './Keypad';
import Display from './Display';

const api = {
    add : (a, b) => a + b,
    sub : (a, b) => a - b,
    mul : (a, b) => a * b,
    div : (a, b) => a / b,
    res : (_, b) => b,
};

const digits = [...Array(10).keys()]; 
const operations = Object.keys(api);

const initialState = {
    acc: 0,
    operation: api.res,
    current: null,
};

const accumulate = (s) => s.current == null ? s:{
    acc: s.operation(s.acc, s.current),
    operation: api.res,
    current: null,
};

const handleOperation = (op) => (state) => ({
        ...accumulate(state),
        operation: api[op]
});

const handleDigit = (digit) => (state) => ({
        ...state,
        current: state.current == null ? digit : state.current * 10 + digit
});

//Handlers para transiciones de estados en el reducer
let actionHandlers = {
    'key:AC' : (state) => initialState,
    'key:C' : (state) => state.current != null? {...state, current: null}: initialState,
    ...Object.fromEntries(operations.map(op => [`key:${op}`, handleOperation(op)])),
    ...Object.fromEntries(digits.map(d => [`digit:${d}`, handleDigit(d)])),
}

function calculatorReducer(state, action) {
    return actionHandlers[action]? actionHandlers[action](state): initialState;    
}

const handleKeypress = (dispatch) => (e) => {
    let keymap = {
        'c': 'key:C', 
        'a': 'key:AC',
        '*': 'key:mul',
        '/': 'key:div',
        '+': 'key:add',
        '-': 'key:sub',
        'Enter':'key:res',
    };

    digits.forEach(i => {
        keymap[i] = 'digit:' + i;
    });

    const action = keymap[e.key]; 
    if (action) {
        dispatch(action); 
        e.preventDefault();
    }
};

function Calculator() {
    const [{current, acc}, dispatch] = useReducer(calculatorReducer, initialState);
    useEffect(() => {
        const listener = handleKeypress(dispatch);
        document.addEventListener("keypress", listener);
        return () => document.removeEventListener("keypress", listener);
    });

    return (<div className="Calculator">
                <Display value={current ?? acc} />
                <Keypad onButtonClick = {dispatch}/>
            </div>);
}

export default Calculator;