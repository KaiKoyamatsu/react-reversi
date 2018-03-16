import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Block(props) {
  return (<div onClick={props.onClick}>{props.value}</div>);
}

class Reversi extends React.Component {
  constructor(props) {
    super(props);

    const blockArrayInit = Array(8).fill(null);
    const blockArray = blockArrayInit.map(currentArray => currentArray = Array(8).fill(null));

    /*
    blockArray: Blockを宣言する配列
    whiteIsNext: 次が白か判断する変数
    */
    this.state = {
      blockArray: blockArray,
      whiteIsNext: true
    };
  }

  //複数のBlockを宣言する関数コンポーネント
  blockList() {
    const blockArray = this.state.blockArray;
    const blocks = blockArray.map((value, index) =>
      value.map((x, y) =>
        <Block
          key={index + y}
          value={blockArray[index][y]}
          onClick={() => this.handleClick(index, y)}
        />
      )
    );

    return <div className='block'>{blocks}</div>;
  }

  // マスをクリックした時の動作
  // handleClick(i) {
  //   const blockArray = this.state.blockArray.slice();
  //
  //   if (blockArray[i]) {
  //     return;
  //   }
  //
  //   blockArray[i] = this.state.whiteIsNext ? '⚪️' : '⚫️';
  //   this.setState({
  //     blockArray: blockArray,
  //     whiteIsNext: !this.state.whiteIsNext,
  //   });
  // }

  render() {
    return (
      <div className='field'>
        {this.blockList()}
      </div>);
  }
}

/* ------------------------------------------------------ */

ReactDOM.render(
  <Reversi/>,
  document.getElementById('root')
);
