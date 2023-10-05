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
    // -1 is return value of .find() if value not found
    return puzzleArray[emptyCell.rowIndex].indexOf(num) == -1;
  };

  colSafe = (puzzleArray, emptyCell, num) => {
    return !puzzleArray.some((row) => row[emptyCell.colIndex] == num);
  };

  // puzzleArray is the game board being solved. A 9x9 matrix
  // emptyCell = {rowIndex: INT , colIndex: INT } INT = coordinates of currently empty cell
  // num = integer value 1-9 being tested

  boxSafe = (puzzleArray, emptyCell, num) => {
    // Define top left corner of box region for empty cell
    boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
    boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);
    let safe = true;

    for (boxRow of [0, 1, 2]) {
      // Each box region has 3 rows
      for (boxCol of [0, 1, 2]) {
        // Each box region has 3 columns
        // Is num is present in box region?
        if (puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] == num) {
          safe = false; // If number is found, it is not safe to place
        }
      }
    }
    return safe;
  };

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

  boxSafe = (puzzleArray, emptyCell, num) => {
    let boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
    let boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);
    let safe = true;

    for (let boxRow of [0, 1, 2]) {
      for (let boxCol of [0, 1, 2]) {
        if (puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
          safe = false;
        }
      }
    }
    return safe;
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

  // pokeHoles = () => {
  //   const newBoard = this.state.board.map(row => row.slice());
  //   const [removedVals, pokedBoard] = this.pokeHoles(newBoard, 20);
  //   this.setState({ board: pokedBoard });
  // }
  
  pokeHoles = (startingBoard, holes) => {
    // const removedVals = [];
    // const val = this.shuffle(this.range(0, 80));
    // let boardCopy = JSON.parse(JSON.stringify(startingBoard)); // Deep copy
  
    // while (removedVals.length < holes) {
    //   const nextVal = val.pop();
    //   if (nextVal === undefined) throw new Error("Impossible Game");
    //   const randomRowIndex = Math.floor(nextVal / 9);
    //   const randomColIndex = nextVal % 9;
  
    //   if (boardCopy[randomRowIndex][randomColIndex] === 0) continue;
  
    //   const tempVal = boardCopy[randomRowIndex][randomColIndex];
    //   boardCopy[randomRowIndex][randomColIndex] = 0;
  
    //   const proposedBoard = JSON.parse(JSON.stringify(boardCopy));
  
    //   if (multiplePossibleSolutions(proposedBoard)) {
    //     boardCopy[randomRowIndex][randomColIndex] = tempVal; // Restore value
    //   } else {
    //     removedVals.push({
    //       rowIndex: randomRowIndex,
    //       colIndex: randomColIndex,
    //       val: tempVal,
    //     });
    //   }
    // }
  
    // console.log("removedVals: ", removedVals);
    // console.log("boardCopy: ", boardCopy);
    // return [removedVals, boardCopy];
  };
  

  multiplePossibleSolutions (boardToCheck) {
    const possibleSolutions = []
    const emptyCellArray = emptyCellCoords(boardToCheck)
    for (let index = 0; index < emptyCellArray.length; index++) {
      // Rotate a clone of the emptyCellArray by one for each iteration
      emptyCellClone = [...emptyCellArray]
      const startingPoint = emptyCellClone.splice(index, 1);
      emptyCellClone.unshift( startingPoint[0] ) 
      thisSolution = fillFromArray( boardToCheck.map( row => row.slice() ) , emptyCellClone)
      possibleSolutions.push( thisSolution.join() )
      if (Array.from(new Set(possibleSolutions)).length > 1 ) return true
    }
    return false
  }

  handleCellPress = (row, col) => {
    const { selectedNumber } = this.state;
    console.log("row: ", row);
    console.log("col: ", col);

    if (selectedNumber !== null) {
      // Update the specific cell with the selected number
      const updatedBoard = [...this.state.board];
      updatedBoard[row][col] = selectedNumber;

      this.setState({
        board: updatedBoard,
      });
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
            onPress={() => this.pokeHoles(argument1, argument2)} // Replace argument1 and argument2 with your actual arguments
          />

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