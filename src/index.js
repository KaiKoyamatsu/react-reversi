import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Block (props) {
  return (
    <div className='blocksValue' onClick={props.onClick}>{props.value}</div>
  );
}

class Reversi extends React.Component {
  constructor(props) {
    super(props);

    /*
    blockArray: Blockを宣言する配列
    */
    this.state = {
      blockArray: Array(64).fill(null),
    };
  }

  //複数のBlockを宣言する関数コンポーネント
  blockList() {
    const blockArray = this.state.blockArray;
    const blocks = blockArray.map((value, index) =>
      <Block
        key={index}
        value={blockArray[index]}
        onClick={() => this.handleClick(index)}
      />
    );

    return <div className='block'>{blocks}</div>;
  }

  handleClick(i) {
    const blockArray = this.state.blockArray.slice();

    if (i % 2 == 0) {
      blockArray[i] = '⚪️';
    } else {
      blockArray[i] = '⚫️';
    }

    this.setState({blockArray:blockArray});
  }

  render() {
    return (
      <div className='field'>
        {this.blockList()}
      </div>
    );
  }
}

/* ------------------------------------------------------ */

ReactDOM.render(
  <Reversi />,
  document.getElementById('root')
);
