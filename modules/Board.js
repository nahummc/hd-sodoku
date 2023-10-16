import React, { Component } from 'react';
import { View, Pressable, Text, StyleSheet, Button } from 'react-native';
import * as Utils from './SudokuUtils'; 

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blankBoard: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      board: [],
      numArray: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      selectedNumber: null,
      counter: 0,
      listOfSolutions: {},
      feedbackMessage : "",
      incorrectCells: [], 
      filledBoard: [],
    };
  }

  componentDidMount() {
    // Initialize the board when the component mounts
    const filledBoard = Utils.initBoard(this.state.blankBoard);
    this.setState({ board: filledBoard });
  }

  pokeHolesInBoard = (holes) => {
    const newBoard = Utils.pokeHoles(this.state.board, holes);
    if (newBoard) {
      this.setState({ board: newBoard });
    }
  };
  
  
  handleCellPress = (row, col) => {
    const { selectedNumber, board, incorrectCells, numArray } = this.state;

    if (board[row][col] !== 0) {
      console.warn("Cell is already filled");
      return;
    }

    if (selectedNumber !== null) {
      const updatedBoard = [...board];
      updatedBoard[row][col] = selectedNumber;
      this.setState({ board: updatedBoard });

      const isValid = Utils.validateUserInput(
        row, col, selectedNumber, board, this.state.listOfSolutions
      );

      if (!isValid) {
        this.setState({
          incorrectCells: [...incorrectCells, { row, col }],
        });

        setTimeout(() => {
          updatedBoard[row][col] = 0;
          this.setState({ 
            board: updatedBoard,
            incorrectCells: incorrectCells.filter(cell => !(cell.row === row && cell.col === col)),
          });
        }, 2000); // 2 seconds delay
      }
    }
  };
  
  
  

  handleNumberButtonClick = (number) => {
    //console.log("handleNumberButtonClick");
    this.setState({ selectedNumber: number });
  };

  render() {
    const { board, selectedNumber, feedbackMessage, incorrectCells } = this.state;

    if (!board || board.length === 0) {
      return <View><Text>Loading...</Text></View>;
    }
    
    const rowComplete = board.map(row => 
      new Set(row.filter(cell => cell !== 0)).size === 9
    );
    
    const colComplete = Array.from({ length: 9 }, (_, colIndex) => 
      new Set(board.map(row => row[colIndex]).filter(cell => cell !== 0)).size === 9
    );
    
    const gridComplete = Utils.isGridComplete(this.state.board);

    
  
    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          {board.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={rowComplete[rowIndex] ? styles.completedRow : styles.row}
            >
              {row.map((cell, colIndex) => (
                <Pressable
                  key={colIndex}
                  style={[
                    styles.cell,
                    rowIndex % 3 === 2
                      ? { borderBottomWidth: 2, borderBottomColor: "black" }
                      : {},
                    colIndex % 3 === 2
                      ? { borderRightWidth: 2, borderRightColor: "black" }
                      : {},
                    incorrectCells.some(
                      (ic) => ic.row === rowIndex && ic.col === colIndex
                    )
                      ? styles.incorrectCell
                      : null,
                    rowComplete[rowIndex] ||
                    colComplete[colIndex] ||
                    gridComplete
                      ? styles.completedCell
                      : null,
                  ]}
                  onPress={() => this.handleCellPress(rowIndex, colIndex)}
                >
                  <Text style={styles.cellText}>{cell !== 0 ? cell : ""}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        {/* // comment out below */}

        {/* // <View style={styles.container}>
      // <View style={styles.grid}>
      //   {board.map((row, rowIndex) => (
      //     <View key={rowIndex} style={styles.row}>
      //       {row.map((cell, colIndex) => (
      //         <Pressable
      //           key={colIndex}
      //           style={[
      //             styles.cell,
      //             rowIndex % 3 === 2
      //               ? { borderBottomWidth: 2, borderBottomColor: "black" }
      //               : {},
      //             colIndex % 3 === 2
      //               ? { borderRightWidth: 2, borderRightColor: "black" }
      //               : {},
      //             incorrectCells.some(
      //               (ic) => ic.row === rowIndex && ic.col === colIndex
      //             )
      //               ? styles.incorrectCell
      //               : null,
      //           ]}
      //           onPress={() => this.handleCellPress(rowIndex, colIndex)}
      //         >
      //           <Text style={styles.cellText}>{cell !== 0 ? cell : ""}</Text>
      //         </Pressable>
      //       ))}
      //     </View>
      //   ))}
      // </View> */}

        {/* comment out above */}

        <View style={styles.buttonRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Pressable
              key={number}
              style={[
                styles.button,
                selectedNumber === number ? styles.selectedButton : null,
              ]}
              onPress={() => this.handleNumberButtonClick(number)}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.button} onPress={Utils.initBoard}>
          <Text style={styles.buttonText}>Generate Sudoku Board</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => this.pokeHolesInBoard(10)}
        >
          <Text style={styles.buttonText}>Poke Holes</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => {
            // debug logic
            console.log("this.state.board: ", this.state.board);
            console.log("this.state.filledBoard: ", this.state.filledBoard);
            console.log(
              "this.state.listOfSolutions: ",
              this.state.listOfSolutions
            );
            // console.log("this.state.feedbackMessage: ", this.state.feedbackMessage);
            console.log(
              "this.state.incorrectCells: ",
              this.state.incorrectCells
            );
            // console.log("this.state.selectedNumber: ", this.state.selectedNumber);
            // console.log("this.state.counter: ", this.state.counter);
            // console.log("this.state.numArray: ", this.state.numArray);
            // console.log("this.state.blankBoard: ", this.state.blankBoard);
            // console.log("this.state.completedBoard: ", this.state.completedBoard);
          }}
        >
          <Text style={styles.buttonText}>Debug</Text>
        </Pressable>
        <Text>{this.state.feedbackMessage}</Text>
      </View>
    );
    
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    // width: 40,
    // height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 5,
    borderRadius: 5,
    // color: 'blue',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  incorrectCell: {
    backgroundColor: '#FFCDD2',
  },
  completedRow: {
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
  },
  completedCell: {
    backgroundColor: 'lightyellow',
  },
});

export default Board;