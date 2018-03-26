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
    console.log("aaa");
    console.log("check", this.state.blockArray);
    const blockArray = this.state.blockArray.slice();
    const blocks = blockArray.map((rowArray, row) =>
      rowArray.map((colArray, col) =>
        <Block
          key={row + ':' + col}
          value={blockArray[row][col]}
          onClick={() => this.handleClick(row, col)}
        />
      )
    );
    console.log("return");

    return <div className='block'>{blocks}</div>;
  }

  // マスをクリックした時の動作
  handleClick(row, col) {
    const blockArray = this.state.blockArray.slice();

    if (blockArray[row][col]) return;

    //多次元配列は下の次元のオブジェクトが参照渡しになってしまうため、わざわざ配列を宣言している
    const childBlockArray = blockArray[row].slice();
    childBlockArray[col] = this.state.whiteIsNext ? '⚪️' : '⚫️';
    blockArray[row] = childBlockArray;

    blockArray[row] = this.searchRightSide(blockArray, row, col);
    console.log(this.searchRightSide(blockArray, row, col)) ;
    // this.searchRightSide(blockArray, row, col);
    // this.searchLeftSide(blockArray, row, col);
    // this.searchUpSide(blockArray, row, col);

    // this.setState({
    //   blockArray: blockArray,
    //   whiteIsNext: !this.state.whiteIsNext,
    // });
  }

  /*
  探索の際に、わざわざ値渡しを頑張っているのは、探索を一回にするため
  */

  // コマが置かれた右側のマスを探索していく
  searchRightSide(blockArray, row, col) {
    const childBlockArray = [...blockArray[row]];

    //一つ右が相手のコマじゃなければreturn
    if(childBlockArray[col+1] === childBlockArray[col] || childBlockArray[col+1] == null) return blockArray[row];

    childBlockArray[col+1] = childBlockArray[col];

    for(let i = col+2; i < childBlockArray.length; i++){
      if (childBlockArray[i] == null) break;
      if (childBlockArray[col] === childBlockArray[i]) return childBlockArray;
      childBlockArray[i] = childBlockArray[col];
    }
    return blockArray[row];
  }

  // コマが置かれた右側のマスを探索していく
  searchLeftSide(blockArray, row, col) {
    const childBlockArray = blockArray[row].slice();

    //一つ左が相手のコマじゃなければreturn
    if(childBlockArray[col-1] === childBlockArray[col] || childBlockArray[col-1] == null) return;

    childBlockArray[col-1] = childBlockArray[col];

    for(let i = col-2; i >= 0; i--) {
      if (childBlockArray[i] == null) break;
      if (childBlockArray[col] === childBlockArray[i]) {
        blockArray[row] = childBlockArray;
        break;
      }
      childBlockArray[i] = childBlockArray[col];
    }
    return;
  }

  //blockArrayCopyがなんとか値渡しできるように頑張ってる
  byValueRow(blockArrayCopy, currentRow, shiftedRow, col) {
    const childBlockArray = blockArrayCopy[shiftedRow].slice();
    childBlockArray[col] = blockArrayCopy[currentRow][col];
    blockArrayCopy[shiftedRow] = childBlockArray;
  }

  // コマが置かれた右側のマスを探索していく
  searchUpSide(blockArray, row, col) {
    const blockArrayCopy = blockArray.slice();

    //1行目か0か一つ上が相手のコマじゃなければreturn
    if (row === 0) return;
    if(blockArrayCopy[row-1][col] === blockArrayCopy[row][col] || blockArrayCopy[row-1][col] == null) return;

    this.byValueRow(blockArrayCopy, row, row-1, col);

    for(let i = row-2; i >= 0; i--){
      if (blockArrayCopy[i][col] == null) break;
      if (blockArrayCopy[row][col] === blockArrayCopy[i][col]){
        console.log(blockArrayCopy);

        break;
      }

      this.byValueRow(blockArrayCopy, row, i, col);
    }
    return;
  }

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
