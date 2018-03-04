import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Test (props) {
  return (
    <h1>Hello, world!</h1>
  );
}

ReactDOM.render(
  <Test />,
  document.getElementById('root')
);