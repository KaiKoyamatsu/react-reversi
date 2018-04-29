import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Result(props) {
  return (<div>{props.value}</div>);
}

function Block(props) {
  return (<div onClick={props.onClick}>{props.value}</div>);
}

function Reset(props) {
  return (<button onClick={props.onClick}>{props.value}</button>);
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

  //結果の表示
  reversiResult(str) {
    return (
      <Result
        key={'result'}
        value={str}
      />
    );
  }

  //複数のBlockを宣言する関数コンポーネント
  blockList() {
    const blockArray = [...this.state.blockArray];
    const blocks = blockArray.map((rowArray, row) =>
      rowArray.map((colArray, col) =>
        <Block
          key={row + ':' + col}
          value={blockArray[row][col] == null ? '' : blockArray[row][col] ? '⚪️' : '⚫️'}
          onClick={() => this.handleClick(row, col)}
        />
      )
    );

    return <div className='block'>{blocks}</div>;
  }

  // マスをクリックした時の動作
  handleClick(row, col) {
    let blockArray = [...this.state.blockArray];

    //すでにコマが置いてある場合は弾く
    if (blockArray[row][col] != null) return;

    //コマを置く(値渡しをするため)
    const childBlockArray = [...blockArray[row]];
    childBlockArray[col] = this.state.whiteIsNext;
    blockArray[row] = childBlockArray;

    //探索
    blockArray = search(blockArray, row, col);

    //勝負の判定
    const res = winJudge(blockArray);
    if (res.isWin) {
      console.log('hoge');
      const resSentence = res.winner == 'd' ? '引き分け' : winner == 'w' ? '白の勝ち' : '黒の勝ち';
      this.reversiResult(resSentence);
      return;
    }

    this.setState({
      blockArray: blockArray,
      whiteIsNext: !this.state.whiteIsNext,
    });
  }

  //リセットボタン
  resetButton() {
    return (
      <Reset
        key={'reset'}
        value={'リセット'}
        onClick={() => this.handleClickReset()}
      />
    );
  }

  //リセット処理
  handleClickReset() {
    const blockArray = [...this.state.blockArray];
    const blockArrayCopy = blockArray.map((rowArray, row) =>
      rowArray.map((colArray, col) =>
        blockArray[row][col] = null
      )
    );

    this.setState({
      blockArray: blockArrayCopy,
      whiteIsNext: true
    });
  }

  render() {
    return (
      <div className='reversi'>
        <div className='reversi-result'>
          {this.reversiResult()}
        </div>
        <div className='reversi-field'>
          {this.blockList()}
        </div>
        <div className='reset-button'>
          {this.resetButton()}
        </div>
      </div>
    );
  }
}

/* ------------------------------------------------------ */

ReactDOM.render(<Reversi/>,document.getElementById('root'));

/* ------------------------------------------------------ */

//探索
const search = (blockArray, row, col) => {
  let blockArrayCopy = [...blockArray];
  blockArrayCopy[row] = searchRightSide(blockArrayCopy, row, col);
  blockArrayCopy[row] = searchLeftSide(blockArrayCopy, row, col);
  blockArrayCopy = searchUpSide(blockArrayCopy, row, col);
  blockArrayCopy = searchDownSide(blockArrayCopy, row, col);
  blockArrayCopy = searchUpRightSide(blockArrayCopy, row, col);
  blockArrayCopy = searchDownRightSide(blockArrayCopy, row, col);
  blockArrayCopy = searchUpLeftSide(blockArrayCopy, row, col);
  blockArrayCopy = searchDownLeftSide(blockArrayCopy, row, col);
  return blockArrayCopy;
}

// コマが置かれた右側のマスを探索していく
const searchRightSide = (blockArray, row, col) => {
  const childBlockArray = [...blockArray[row]];

  //一つ右が相手のコマじゃなければreturn
  if(
    col > childBlockArray.length -2 ||
    childBlockArray[col+1] === childBlockArray[col] ||
    childBlockArray[col+1] == null
  )
  return blockArray[row];

  childBlockArray[col+1] = childBlockArray[col];

  for(let i = col+2; i < childBlockArray.length; i++){
    if (childBlockArray[i] == null) break;
    if (childBlockArray[col] === childBlockArray[i]) return childBlockArray;
    childBlockArray[i] = childBlockArray[col];
  }
  return blockArray[row];
}

// コマが置かれた左側のマスを探索していく
const searchLeftSide = (blockArray, row, col) => {
  const childBlockArray = [...blockArray[row]];

  //一つ右が相手のコマじゃなければreturn
  if(
    col < 2 ||
    childBlockArray[col-1] === childBlockArray[col] ||
    childBlockArray[col-1] == null
  )
  return blockArray[row];

  childBlockArray[col-1] = childBlockArray[col];

  for(let i = col-2; i >= 0; i--){
    if (childBlockArray[i] == null) break;
    if (childBlockArray[col] === childBlockArray[i]) return childBlockArray;
    childBlockArray[i] = childBlockArray[col];
  }
  return blockArray[row];
}

//指定されたrowでblockArrayCopyを値渡し
const byValueRow = (blockArrayCopy, currentRow, shiftedRow, col) => {
  const childBlockArray = [...blockArrayCopy[shiftedRow]];
  childBlockArray[col] = blockArrayCopy[currentRow][col];
  blockArrayCopy[shiftedRow] = childBlockArray;
}

// コマが置かれた上側のマスを探索していく
const searchUpSide = (blockArray, row, col) => {
  const blockArrayCopy = [...blockArray];

  //1行目か0か一つ上が相手のコマじゃなければreturn
  if(
    row < 2 ||
    blockArrayCopy[row-1][col] === blockArrayCopy[row][col] ||
    blockArrayCopy[row-1][col] == null
  )
  return blockArray;

  byValueRow(blockArrayCopy, row, row-1, col);

  for(let i = row-2; i >= 0; i--){
    if (blockArrayCopy[i][col] == null) break;
    if (blockArrayCopy[row][col] === blockArrayCopy[i][col]) return blockArrayCopy;
    byValueRow(blockArrayCopy, row, i, col);
  }
  return blockArray;
}

// コマが置かれた下側のマスを探索していく
const searchDownSide = (blockArray, row, col) => {
  const blockArrayCopy = [...blockArray];

  //1行目か0か一つ上が相手のコマじゃなければreturn
  if(
    row > blockArrayCopy.length -2 ||
    blockArrayCopy[row+1][col] === blockArrayCopy[row][col] ||
    blockArrayCopy[row+1][col] == null
  )
  return blockArray;

  byValueRow(blockArrayCopy, row, row+1, col);

  for(let i = row+2; i < blockArrayCopy.length; i++){
    if (blockArrayCopy[i][col] == null) break;
    if (blockArrayCopy[row][col] === blockArrayCopy[i][col]) return blockArrayCopy;
    byValueRow(blockArrayCopy, row, i, col);
  }
  return blockArray;
}

//指定されたrowでblockArrayCopyを値渡し
const byValueRowCol = (blockArrayCopy, currentRow, shiftedRow, currentCol, shiftedCol) => {
  const childBlockArray = [...blockArrayCopy[shiftedRow]];
  childBlockArray[shiftedCol] = blockArrayCopy[currentRow][currentCol];
  blockArrayCopy[shiftedRow] = childBlockArray;
}

// コマが置かれた右上側のマスを探索していく
const searchUpRightSide = (blockArray, row, col) => {
  const blockArrayCopy = [...blockArray];
  const length = blockArrayCopy.length;

  if(
    row < 2 || col > length -2 ||
    blockArrayCopy[row-1][col+1] === blockArrayCopy[row][col] ||
    blockArrayCopy[row-1][col+1] == null
  )
  return blockArray;

  byValueRowCol(blockArrayCopy, row, row-1, col, col+1);

  for(let i = row-2, j = col+2; i >= 0 || j < length; i--, j++){
    if (blockArrayCopy[i][j] == null) break;
    if (blockArrayCopy[row][col] === blockArrayCopy[i][j]) return blockArrayCopy;
    byValueRowCol(blockArrayCopy, row, i, col, j);
  }
  return blockArray;
}

// コマが置かれた右下側のマスを探索していく
const searchDownRightSide = (blockArray, row, col) => {
  const blockArrayCopy = [...blockArray];
  const length = blockArrayCopy.length;

  if(
    row > length -2 || col > length -2 ||
    blockArrayCopy[row+1][col+1] === blockArrayCopy[row][col] ||
    blockArrayCopy[row+1][col+1] == null
  )
  return blockArray;

  byValueRowCol(blockArrayCopy, row, row+1, col, col+1);

  for(let i = row+2, j = col+2; i < length || j < length; i++, j++){
    if (blockArrayCopy[i][j] == null) break;
    if (blockArrayCopy[row][col] === blockArrayCopy[i][j]) return blockArrayCopy;
    byValueRowCol(blockArrayCopy, row, i, col, j);
  }
  return blockArray;
}

// コマが置かれた左上側のマスを探索していく
const searchUpLeftSide = (blockArray, row, col) => {
  const blockArrayCopy = [...blockArray];

  if(
    row < 2 || col < 2 ||
    blockArrayCopy[row-1][col-1] === blockArrayCopy[row][col] ||
    blockArrayCopy[row-1][col-1] == null
  )
  return blockArray;

  byValueRowCol(blockArrayCopy, row, row-1, col, col-1);

  for(let i = row-2, j = col-2; i >= 0 || j >= 0; i--, j--){
    if (blockArrayCopy[i][j] == null) break;
    if (blockArrayCopy[row][col] === blockArrayCopy[i][j]) return blockArrayCopy;
    byValueRowCol(blockArrayCopy, row, i, col, j);
  }
  return blockArray;
}

// コマが置かれた左下側のマスを探索していく
const searchDownLeftSide = (blockArray, row, col) => {
  const blockArrayCopy = [...blockArray];
  const length = blockArrayCopy.length;

  if(
    row > length -2 || col < 2 ||
    blockArrayCopy[row+1][col-1] === blockArrayCopy[row][col] ||
    blockArrayCopy[row+1][col-1] == null
  )
  return blockArray;

  byValueRowCol(blockArrayCopy, row, row+1, col, col-1);

  for(let i = row+2, j = col-2; i < length || j >= 0; i++, j--){
    if (blockArrayCopy[i][j] == null) break;
    if (blockArrayCopy[row][col] === blockArrayCopy[i][j]) return blockArrayCopy;
    byValueRowCol(blockArrayCopy, row, i, col, j);
  }
  return blockArray;
}

/* ------------------------------------------------------ */

//勝ち判定
const winJudge = (blockArray) => {
  const res = [isWin: false, winner: null];
  let whiteNum = 0;
  let blackNum = 0;

  blockArray.foreach(currentRow, row) {
    blockArray[row].foreach(currentCol, col) {
      if (blockArray[row][col]) whiteNum++;
      if (!blockArray[row][col]) blackNum++;
    }
  }

  if (whiteNum == 0) {
    res.isWin = true;
    res.winner = 'b';
  } else if (blackNum == 0) {
    res.isWin = true;
    res.winner = 'w';
  } else if (whiteNum + blackNum == 64) {
    res.isWin = true;
    res.winner = whiteNum == blackNum ? 'd' : whiteNum > blackNum ? 'w' : 'b';
  }

  return res;
}
