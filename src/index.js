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

  //マスをクリックした時の動作
  handleClick(i) {
    const blockArray = this.state.blockArray.slice();

    if (blockArray[i]) {
      return;
    }

    blockArray[i] = this.state.whiteIsNext ? 'O' : 'X';
    this.turnOverRight(blockArray, i);
    this.setState({
      blockArray: blockArray,
      whiteIsNext: !this.state.whiteIsNext,
    });
  }

  //右のコマをひっくり返す
  turnOverRight(blockArray, currentPosistion) {
    //列の中で一番低い値を計算
    const colMinValue = currentPosistion%8;

    //コマを置いた位置の右の空白を計算
    const rightSpace = 7-colMinValue;

    for (let shift = 1; shift <= rightSpace; shift++) {
      //一つ右が同じ色か、空白があったらreturn
      if (
        (shift === 1 && blockArray[currentPosistion] === blockArray[currentPosistion+shift])
        || blockArray[currentPosistion+shift] === null
      ) {
        return;
      }

      //二つ以上右が同じ色だと間をひっくり返す
      if(blockArray[currentPosistion] === blockArray[currentPosistion+shift]) {
        for (let shiftTurnPosition = 1; shiftTurnPosition < shift; shiftTurnPosition++) {
          blockArray[currentPosistion+shiftTurnPosition] = blockArray[currentPosistion];
        }
        this.setState({blockArray: blockArray});
        return
      }
    }
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
