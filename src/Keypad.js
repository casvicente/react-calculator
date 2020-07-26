import React from 'react';
import './Keypad.css';

function Keypad ({onButtonClick}){
    const btnData = [
        ['digit:7', '7'],
        ['digit:8', '8'],
        ['digit:9', '9'],
        ['key:C', 'C'],
        ['key:AC', 'AC'],
        ['digit:4', '4'],
        ['digit:5', '5'],
        ['digit:6', '6'],
        ['key:mul', '×'],
        ['key:div', '÷'],
        ['digit:1', '1'],
        ['digit:2', '2'],
        ['digit:3', '3'],
        ['key:add', '+'],
        ['key:sub', '-'],
        ['digit:0', '0'],
        ['key:res', '='],
    ];

    return (
        <div className="Keypad">
            {btnData.map(btn=> (
                <button key={btn[0]} onClick={() => onButtonClick(btn[0])}>{btn[1]}</button>
            ))}
        </div>
    );
}

export default Keypad;