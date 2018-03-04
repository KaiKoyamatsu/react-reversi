import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Block (props) {
  return (
    <div></div>
  );
}

//複数のBlockを宣言する関数コンポーネント
function BlockList (props) {
  const blockArray = props.blockArray;
  const blocks = blockArray.map((value, index) => <Block key={index} />);
  return <div className='block'>{blocks}</div>;
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

  render() {
    return (
      <div className='field'>
        <BlockList blockArray = {this.state.blockArray} />
      </div>
    );
  }
}

/* ------------------------------------------------------ */

ReactDOM.render(
  <Reversi />,
  document.getElementById('root')
);
