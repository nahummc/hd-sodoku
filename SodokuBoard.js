import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';

class SudokuBoard extends Component {
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
      stringBoard: [
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
      ],
      board: [],
      numArray: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      selectedNumber: null,
      counter: 0,
    };
  }

  componentDidMount() {
    // Initialize the board when the component mounts
    this.initBoard(true);
  }

  initBoard = (blank) => {
    try {
      // if (blank) {
      //   this.setState({ board: this.state.blankBoard });
      //   return;
      // }
      const filledBoard = this.fillPuzzle(
        JSON.parse(JSON.stringify(this.state.blankBoard))
      );
      this.setState({ board: filledBoard });
      console.log("filledBoard: ", filledBoard);
    } catch (error) {
      console.error("Error generating board:", error);
    }
  };

  safeToPlace = (puzzleArray, emptyCell, num) => {
    return (
      this.rowSafe(puzzleArray, emptyCell, num) &&
      this.colSafe(puzzleArray, emptyCell, num) &&
      this.boxSafe(puzzleArray, emptyCell, num)
    );
  };
  rowSafe = (puzzleArray, emptyCell, num) => {
    return !puzzleArray[emptyCell.rowIndex].includes(num);
  };

  colSafe = (puzzleArray, emptyCell, num) => {
    return !puzzleArray.some((row) => row[emptyCell.colIndex] === num);
  };

  boxSafe = (puzzleArray, emptyCell, num) => {
    let boxStartRow = Math.floor(emptyCell.rowIndex / 3) * 3;
    let boxStartCol = Math.floor(emptyCell.colIndex / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleArray[boxStartRow + i][boxStartCol + j] === num) {
          return false;
        }
      }
    }
    return true;
  };

  // puzzleArray is the game board being solved. A 9x9 matrix
  // emptyCell = {rowIndex: INT , colIndex: INT } INT = coordinates of currently empty cell
  // num = integer value 1-9 being tested


  nextEmptyCell = (puzzleArray) => {
    const emptyCell = { rowIndex: "", colIndex: "" };

    puzzleArray.forEach((row, rowIndex) => {
      // If this key has already been assigned, skip iteration
      if (emptyCell.colIndex !== "") return;

      // find first zero-element
      let firstZero = row.find((col) => col === 0);

      // if no zero present, skip to next row
      if (firstZero === undefined) return;
      emptyCell.rowIndex = rowIndex;
      emptyCell.colIndex = row.indexOf(firstZero);
    });

    if (emptyCell.colIndex !== "") return emptyCell;
    // If emptyCell was never assigned, there are no more zeros
    return false;
  };

  shuffle = (array) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };


  fillPuzzle = (startingBoard) => {
    const emptyCell = this.nextEmptyCell(startingBoard);

    if (!emptyCell) {
      return startingBoard;
    }

    for (const num of this.shuffle(this.state.numArray)) {
      this.state.counter++;
      if (this.state.counter > 20_000_000) throw new Error("Recursion Timeout");

      if (this.safeToPlace(startingBoard, emptyCell, num)) {
        startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;

        if (this.fillPuzzle(startingBoard)) {
          return startingBoard;
        }

        startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
      }
    }
    return false;
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };
  isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (
        board[row][x] === num ||
        board[x][col] === num ||
        board[3 * Math.floor(row / 3) + Math.floor(x / 3)][
          3 * Math.floor(col / 3) + (x % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  };

  countSolutions(board, count) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              count = this.countSolutions(board, count);
              board[row][col] = 0;
            }
          }
          return count;
        }
      }
    }
    return count + 1;
  };

  pokeHoles(fb, holes) {
    // Make sure filledBoard is valid before deep cloning
    // if (!fb || !Array.isArray(fb) || fb.length !== 9) {
    //   console.error("Invalid fb");
    //   return;
    // }
  
    try {
      console.log("fb: ", fb);
      console.log("holes: ", holes)
      const board = JSON.parse(JSON.stringify(fb));
      let pokedHoles = 0;
  
      while (pokedHoles < holes) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
  
        if (board[row][col] !== 0) {
          const temp = board[row][col];
          board[row][col] = 0;
  
          if (this.countSolutions(JSON.parse(JSON.stringify(board)), 0) === 1) {
            pokedHoles++;
          } else {
            board[row][col] = temp;
          }
        }
      }
  
      console.log("board: ", board)
      this.setState({ board });
      return board;
  
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  

  multiplePossibleSolutions(boardToCheck) {
    const possibleSolutions = [];
    const emptyCellArray = emptyCellCoords(boardToCheck);
    for (let index = 0; index < emptyCellArray.length; index++) {
      // Rotate a clone of the emptyCellArray by one for each iteration
      emptyCellClone = [...emptyCellArray];
      const startingPoint = emptyCellClone.splice(index, 1);
      emptyCellClone.unshift(startingPoint[0]);
      thisSolution = fillFromArray(
        boardToCheck.map((row) => row.slice()),
        emptyCellClone
      );
      possibleSolutions.push(thisSolution.join());
      if (Array.from(new Set(possibleSolutions)).length > 1) return true;
    }
    return false;
  }

  handleCellPress = (row, col) => {
    const { selectedNumber, board } = this.state;
    if (selectedNumber !== null) {
      const updatedBoard = [...board];
      updatedBoard[row][col] = selectedNumber;
      this.setState({ board: updatedBoard });
    }
  };

  handleNumberButtonClick = (number) => {
    this.setState({ selectedNumber: number });
  };

  render() {
    const { board, selectedNumber } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={styles.cell}
                  onPress={() => this.handleCellPress(rowIndex, colIndex)}
                >
                  <Text style={styles.cellText}>{cell !== 0 ? cell : ""}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttonRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.button,
                selectedNumber === number ? styles.selectedButton : null,
              ]}
              onPress={() => this.handleNumberButtonClick(number)}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Generate Sudoku Board" onPress={this.initBoard} />
        <Button
          title="Poke Holes"
          onPress={() => this.pokeHoles(this.state.board, 30)} 
        />
        <Button title="debug" onPress={() => console.log(this.state.board)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: 'black',
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
  },
  button: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SudokuBoard;