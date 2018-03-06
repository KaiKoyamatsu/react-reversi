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
    whiteIsNext: 次が白か判断する変数
    */
    this.state = {
      blockArray: Array(64).fill(null),
      whiteIsNext: true,
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
    blockArray[i] = this.state.whiteIsNext ? '⚪️' : '⚫️';
    this.setState({
      blockArray: blockArray,
      whiteIsNext: !this.state.whiteIsNext,
    });
  }

  turnOver(blockArray, i) {

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
