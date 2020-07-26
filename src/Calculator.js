import React, { useReducer, useEffect } from 'react';
import './Calculator.css';

import Keypad from './Keypad';

function Display (props) {
    return <div className="Display">{props.value}</div>
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
    const [actionType, actionValue] = action.split(':');
    switch (actionType) {
        case 'digit':
            const digit = Number(actionValue);
            return {...state, current:  state.current == null ? digit : state.current*10 + digit};
        case 'key':
            switch (actionValue) {
                case 'AC':
                    return intialState;
                case 'C':
                    return state.current != null? {...state, current: null}: intialState;
                default:
                    return api[actionValue]?{...accumulate(state), operation: api[actionValue]}:intialState;
            }
        default:
            return intialState;
    }
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

    [...Array(10).keys()].forEach(i => {
        keymap[i] = 'digit:' + i;
    });

    const action = keymap[e.key]; 
    if (action) {
        dispatch(action); 
        e.preventDefault();
    }
};

function Calculator() {
    const [{current, acc}, dispatch] = useReducer(calculatorReducer, intialState);
    useEffect( () => {
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