import React, { useState, useEffect } from 'react';
import './ProCalculator.css';

export default function ProCalculator() {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState(null);
  const [operation, setOperation] = useState(null);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('calcHistory')) || []);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Save history in localStorage
  useEffect(() => {
    localStorage.setItem('calcHistory', JSON.stringify(history));
  }, [history]);

  const calculate = () => {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return '';

    let result = '';
    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '÷':
        if (current === 0) return 'Error';
        result = prev / current;
        break;
      default: return '';
    }
    return result.toString();
  };

  const handleButtonClick = (value) => {
    if (!isNaN(value) || value === '.') {
      if (value === '.' && currentOperand.includes('.')) return;
      setCurrentOperand(currentOperand === '0' && value !== '.' ? value : currentOperand + value);
    } else if (['+', '-', '*', '÷'].includes(value)) {
      if (currentOperand === '' && previousOperand !== null) {
        setOperation(value);
        return;
      }
      if (previousOperand !== null) {
        const result = calculate();
        setPreviousOperand(result);
        setCurrentOperand('');
      } else {
        setPreviousOperand(currentOperand);
        setCurrentOperand('');
      }
      setOperation(value);
    } else if (value === '=') {
      if (operation === null || previousOperand === null) return;
      const result = calculate();
      if (result === 'Error') {
        setCurrentOperand('Error');
        setPreviousOperand(null);
        setOperation(null);
        return;
      }
      const newHistoryEntry = {
        expression: `${previousOperand} ${operation} ${currentOperand}`,
        result: result,
        id: Date.now()
      };
      setHistory([newHistoryEntry, ...history]);
      setCurrentOperand(result);
      setPreviousOperand(null);
      setOperation(null);
    } else if (value === 'AC') {
      setCurrentOperand('0');
      setPreviousOperand(null);
      setOperation(null);
    } else if (value === '+/-') {
      setCurrentOperand((parseFloat(currentOperand) * -1).toString());
    } else if (value === '%') {
      setCurrentOperand((parseFloat(currentOperand) / 100).toString());
    } else if (value === 'DEL') {
      if (currentOperand === 'Error') {
        setCurrentOperand('0');
        return;
      }
      if (currentOperand.length === 1) {
        setCurrentOperand('0');
      } else {
        setCurrentOperand(currentOperand.slice(0, -1));
      }
    }
  };

  const buttons = [
    { value: 'AC', type: 'function' }, { value: '+/-', type: 'function' }, { value: 'DEL', type: 'function' }, { value: '÷', type: 'operator' },
    { value: '7', type: 'number' }, { value: '8', type: 'number' }, { value: '9', type: 'number' }, { value: '*', type: 'operator' },
    { value: '4', type: 'number' }, { value: '5', type: 'number' }, { value: '6', type: 'number' }, { value: '-', type: 'operator' },
    { value: '1', type: 'number' }, { value: '2', type: 'number' }, { value: '3', type: 'number' }, { value: '+', type: 'operator' },
    { value: '0', type: 'number zero' }, { value: '.', type: 'number' }, { value: '=', type: 'operator' },
  ];

  return (
    <div className="app-container">
      {/* History Toggle Button */}
      <div className="history-toggle" onClick={() => setIsHistoryOpen(true)}>
        History
      </div>

      {/* Calculator */}
      <div className="pro-calculator">
        <div className="pro-display">
          <div className="previous-operand">{previousOperand} {operation}</div>
          <div className="current-operand">{currentOperand}</div>
        </div>
        <div className="pro-keypad">
          {buttons.map((btn) => (
            <button
              key={btn.value}
              className={`btn ${btn.type}`}
              onClick={() => handleButtonClick(btn.value)}
            >
              {btn.value}
            </button>
          ))}
        </div>
      </div>

      {/* History Panel */}
      <div className={`history-panel ${isHistoryOpen ? 'active' : ''}`}>
        <div className="history-header">
          <h2 className="history-title">History</h2>
          <button className="history-close" onClick={() => setIsHistoryOpen(false)}>×</button>
        </div>
        {history.length > 0 ? (
          history.map((item) => (
            <div className="history-item" key={item.id}>
              <div className="history-expression">{item.expression}</div>
              <div className="history-result">{item.result}</div>
            </div>
          ))
        ) : (
          <div className="no-history">No history yet</div>
        )}
      </div>
    </div>
  );
}


