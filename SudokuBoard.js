import React, { Component } from 'react';
import { View, Pressable, Text, StyleSheet, Button } from 'react-native';


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
    this.initBoard(true);

    //console.log("componentDidMount");
    // //console.log("this.state.blankBoard: ", this.state.blankBoard);
    // //console.log("this.state.board: ", this.state.board);
    //console.log("filledBoard: ", this.state.filledBoard);
  }

  initBoard = (blank) => {
    try {
      // //console.log("initBoard");
      // if (blank) {
      //   this.setState({ board: this.state.blankBoard });
      //   return;
      // }
      const filledBoard = this.fillPuzzle(
        JSON.parse(JSON.stringify(this.state.blankBoard))
      );
      this.setState({ board: filledBoard });
      this.setState({ filledBoard: filledBoard });
      //console.log("filledBoard: ", filledBoard);
      //console.log("this.state.board in initboard: ", this.state.board);
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
  }

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
  }

  pokeHoles(fb, holes) {
    // Make sure filledBoard is valid before deep cloning
    // if (!fb || !Array.isArray(fb) || fb.length !== 9) {
    //   console.error("Invalid fb");
    //   return;
    // }

    try {
      //console.log("fb: ", fb);
      //console.log("holes: ", holes);
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

      //console.log("board with holes: ", board);
      this.setState({ board });
      this.findMultipleSolutions(board);
      return board;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // multiplePossibleSolutions(boardToCheck) {
  //   const possibleSolutions = [];
  //   const emptyCellArray = emptyCellCoords(boardToCheck);
  //   for (let index = 0; index < emptyCellArray.length; index++) {
  //     // Rotate a clone of the emptyCellArray by one for each iteration
  //     emptyCellClone = [...emptyCellArray];
  //     const startingPoint = emptyCellClone.splice(index, 1);
  //     emptyCellClone.unshift(startingPoint[0]);
  //     thisSolution = fillFromArray(
  //       boardToCheck.map((row) => row.slice()),
  //       emptyCellClone
  //     );
  //     possibleSolutions.push(thisSolution.join());
  //     if (Array.from(new Set(possibleSolutions)).length > 1) return true;
  //   }
  //   return false;
  // }

  

  
  findMultipleSolutions = (startingBoard) => {
    let solutions = {};
    let counter = 0;
    
    const solve = (board) => {
      if (counter >= 15) return;
      
      const emptyCell = this.nextEmptyCell(board);
      if (!emptyCell) {
        solutions[`solution${counter + 1}`] = JSON.parse(JSON.stringify(board));
        //console.log(`solution${counter + 1}`);
        //console.log(solutions[`solution${counter + 1}`] = JSON.parse(JSON.stringify(board)));
        counter++;
        return;
      }
      
      for (const num of this.state.numArray) {
        if (this.safeToPlace(board, emptyCell, num)) {
          board[emptyCell.rowIndex][emptyCell.colIndex] = num;
          solve(board);
          board[emptyCell.rowIndex][emptyCell.colIndex] = 0;
        }
      }
    };
    
    solve(startingBoard);
    this.setState({ listOfSolutions: solutions });
  };
  

  isCompleteAndCorrect = (arr) => {
    const numbers = new Set(arr);
    return numbers.size === 9 && !numbers.has(0);
  };
  
  checkRow = (rowIndex) => {
    return this.isCompleteAndCorrect(this.state.board[rowIndex]);
  };
  
  checkColumn = (colIndex) => {
    const col = this.state.board.map(row => row[colIndex]);
    return this.isCompleteAndCorrect(col);
  };
  
  checkGrid = (rowIndex, colIndex) => {
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;
    const grid = [];
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        grid.push(this.state.board[i][j]);
      }
    }
    return this.isCompleteAndCorrect(grid);
  };


  isGridComplete = (board) => {
    for (let gridRow = 0; gridRow < 9; gridRow += 3) {
      for (let gridCol = 0; gridCol < 9; gridCol += 3) {
        const grid = [];
        for (let row = gridRow; row < gridRow + 3; row++) {
          for (let col = gridCol; col < gridCol + 3; col++) {
            grid.push(board[row][col]);
          }
        }
        if (new Set(grid.filter(cell => cell !== 0)).size !== 9) {
          return false;
        }
      }
    }
    return true;
  };
  
  
  validateUserInput = (row, col, num) => {
    const { listOfSolutions } = this.state;
  
    if (!listOfSolutions) {
      console.warn("listOfSolutions is not yet initialized.");
      return false;
    }
  
    let validSolutions = {};
    for (const [key, solution] of Object.entries(listOfSolutions)) {
      if (solution[row][col] === num) {
        validSolutions[key] = solution;
      }
    }
  
    if (Object.keys(validSolutions).length === 0) {
      this.setState({ feedbackMessage: 'Incorrect move' });
      return false;
    } else {
      this.setState({
        listOfSolutions: validSolutions,
        feedbackMessage: 'Correct move',
      });
      return true;
    }
  };
  

  
  handleCellPress = (row, col) => {
    const { selectedNumber, board, incorrectCells } = this.state;
  
    if (board[row][col] !== 0) {
      console.warn("Cell is already filled");
      return;
    }
  
    if (selectedNumber !== null) {
      const updatedBoard = [...board];
      updatedBoard[row][col] = selectedNumber;
      this.setState({ board: updatedBoard });
  
      const isValid = this.validateUserInput(row, col, selectedNumber);
  
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
    
    const gridComplete = this.isGridComplete(this.state.board);
  
    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={rowComplete[rowIndex] ? styles.completedRow : styles.row}>
              {row.map((cell, colIndex) => (
                <Pressable
                  key={colIndex}
                  style={[
                    styles.cell,
                    rowIndex % 3 === 2 ? { borderBottomWidth: 2, borderBottomColor: "black" } : {},
                    colIndex % 3 === 2 ? { borderRightWidth: 2, borderRightColor: "black" } : {},
                    incorrectCells.some((ic) => ic.row === rowIndex && ic.col === colIndex)
                      ? styles.incorrectCell
                      : null,
                    rowComplete[rowIndex] || colComplete[colIndex] || gridComplete ? styles.completedCell : null,
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
        <Pressable style={styles.button} onPress={this.initBoard}>
          <Text style={styles.buttonText}>Generate Sudoku Board</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => this.pokeHoles(this.state.board, 10)}
        >
          <Text style={styles.buttonText}>Poke Holes</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            // debug logic
            console.log("this.state.board: ", this.state.board);
            console.log("this.state.filledBoard: ", this.state.filledBoard);
            console.log("this.state.listOfSolutions: ", this.state.listOfSolutions);
            // console.log("this.state.feedbackMessage: ", this.state.feedbackMessage);
            console.log("this.state.incorrectCells: ", this.state.incorrectCells);
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

export default SudokuBoard;