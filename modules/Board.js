import React, { Component } from "react";
import { View, Pressable, Text, StyleSheet, Button, Modal } from "react-native";
import * as Utils from "./SudokuUtils";
import DifficultyPopup from "./DifficultyPopup";

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
      feedbackMessage: "",
      incorrectCells: [],
      filledBoard: [],
      numberCount: {
        1: 9,
        2: 9,
        3: 9,
        4: 9,
        5: 9,
        6: 9,
        7: 9,
        8: 9,
        9: 9,
      },
      disabledNumbers: new Set(),
      isPopupVisible: false,
    };
  }

  componentDidMount() {
    // Initialize the board when the component mounts
    const filledBoard = Utils.initBoard(this.state.blankBoard);
    const listOfSolutions = {};
    Utils.findAllSolutions(filledBoard, listOfSolutions);

    // Initialize numberCount based on filledBoard
    const initialNumberCount = Array(9).fill(0);
    filledBoard.forEach((row) => {
      row.forEach((num) => {
        if (num !== 0) {
          initialNumberCount[num - 1]++;
        }
      });
    });

    const numberCount = {};
    for (let i = 1; i <= 9; i++) {
      numberCount[i] = 9 - initialNumberCount[i - 1];
    }

    this.setState({ board: filledBoard, listOfSolutions, numberCount });
  }

  pokeHolesInBoard = (holes) => {
    const newBoard = Utils.pokeHoles(this.state.board, holes);
    if (newBoard) {
      // Update numberCount based on the holes poked
      const updatedNumberCount = { ...this.state.numberCount };
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (this.state.board[row][col] !== newBoard[row][col]) {
            updatedNumberCount[this.state.board[row][col]]++;
          }
        }
      }

      this.setState({ board: newBoard, numberCount: updatedNumberCount });
    }
  };

  handleCellPress = (row, col) => {
    const { selectedNumber, board, incorrectCells, listOfSolutions } =
      this.state;

    if (board[row][col] !== 0) {
      console.warn("Cell is already filled");
      return;
    }

    if (selectedNumber !== null) {
      const updatedBoard = [...board];
      updatedBoard[row][col] = selectedNumber;
      this.setState({ board: updatedBoard });

      console.log(
        `Handling cell press at (${row}, ${col}) with number ${selectedNumber}`
      );
      console.log("Current listOfSolutions:", listOfSolutions);

      const isValid = Utils.validateUserInput(
        row,
        col,
        selectedNumber,
        board,
        listOfSolutions
      );

      console.log("Is move valid?", isValid);

      this.updateNumberCount(selectedNumber, isValid); // Update the number count

      if (isValid) {
        this.setState({ feedbackMessage: "Correct move!" });
      } else {
        this.setState({
          feedbackMessage: "Incorrect move. Try again.",
          incorrectCells: [...incorrectCells, { row, col }],
        });

        setTimeout(() => {
          updatedBoard[row][col] = 0;
          this.setState({
            board: updatedBoard,
            incorrectCells: incorrectCells.filter(
              (cell) => !(cell.row === row && cell.col === col)
            ),
            feedbackMessage: "", // Clear the feedback message
          });
          this.updateNumberCount(selectedNumber, false); // Reset the number count for the invalid move
        }, 2000); // 2 seconds delay
      }
    }
  };

  handleNumberButtonClick = (number) => {
    //console.log("handleNumberButtonClick");
    this.setState({ selectedNumber: number });
  };

  updateNumberCount = (number, isValid) => {
    this.setState((prevState) => {
      const updatedNumberCount = { ...prevState.numberCount };
      if (isValid) {
        updatedNumberCount[number] -= 1;
      } else {
        updatedNumberCount[number] += 1;
      }
      return { numberCount: updatedNumberCount };
    });
  };

  
  startNewGame = (difficulty) => {
    // Close the popup
    this.setState({ isPopupVisible: false });
  
    // Log for debugging
    console.log("Starting new game with difficulty:", difficulty);
  
    // Initialize a new blank board
    const newBoard = Utils.initBoard(this.state.blankBoard);  // Assuming initBoard returns a new blank board when true is passed
    console.log("newBoard after initBoard:", newBoard);
  
    // Fill the board and poke holes based on difficulty
    const holesToPoke = difficulty;  // Assuming `difficulty` is the number of holes you want to poke
    const pokedBoard = Utils.pokeHoles(newBoard, holesToPoke);
    console.log("pokedBoard after pokeHoles:", pokedBoard);
  
    // Reinitialize list of solutions based on the newly poked board
    const newListOfSolutions = {};
    Utils.findAllSolutions(pokedBoard, newListOfSolutions);
    console.log("New list of solutions:", newListOfSolutions);
  
    // Check if pokedBoard is valid
    if (!pokedBoard || pokedBoard.length === 0) {
      console.error("Invalid pokedBoard:", pokedBoard);
      return;
    }
  
    // Reset incorrectCells, feedbackMessage, and numberCount
    const newIncorrectCells = [];
    const newFeedbackMessage = "";
    const newNumberCount = this.calculateNumberCount(pokedBoard);
  
    // Update the state
    this.setState({
      board: pokedBoard,
      incorrectCells: newIncorrectCells,
      feedbackMessage: newFeedbackMessage,
      numberCount: newNumberCount,
      listOfSolutions: newListOfSolutions,
      // ... set other state variables as needed
    });
  };
  
  
  
  
  // Custom function to calculate the count of each number on the board
  calculateNumberCount = (board) => {
    const count = {};
    for (let i = 1; i <= 9; i++) {
      count[i] = 0;
    }
    for (const row of board) {
      for (const cell of row) {
        if (cell !== 0) {
          count[cell]++;
        }
      }
    }
    return count;
  };
  

  render() {
    const {
      board,
      selectedNumber,
      feedbackMessage,
      incorrectCells,
      disabledNumbers,
    } = this.state;

    if (!board || board.length === 0) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    const rowComplete = board.map(
      (row) => new Set(row.filter((cell) => cell !== 0)).size === 9
    );

    const colComplete = Array.from(
      { length: 9 },
      (_, colIndex) =>
        new Set(board.map((row) => row[colIndex]).filter((cell) => cell !== 0))
          .size === 9
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
        <View style={styles.buttonRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Pressable
              key={number}
              disabled={this.state.numberCount[number] === 0}
              style={[
                styles.button,
                selectedNumber === number ? styles.selectedButton : null,
                this.state.numberCount[number] === 0
                  ? styles.disabledButton
                  : null,
              ]}
              onPress={() => this.handleNumberButtonClick(number)}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={styles.button}
          onPress={() => this.setState({ isPopupVisible: true })}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => this.pokeHolesInBoard(5)}
        >
          <Text style={styles.buttonText}>Poke Holes</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("this.state.board: ", this.state.board);
            console.log("this.state.filledBoard: ", this.state.filledBoard);
            console.log(
              "this.state.listOfSolutions: ",
              this.state.listOfSolutions
            );
            console.log(
              "this.state.incorrectCells: ",
              this.state.incorrectCells
            );
            console.log("this.state.numberCount: ", this.state.numberCount);
          }}
        >
          <Text style={styles.buttonText}>Debug</Text>
        </Pressable>
        <Text>{this.state.feedbackMessage}</Text>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isPopupVisible}
          onRequestClose={() => {
            this.setState({ isPopupVisible: false });
          }}
        >
          <DifficultyPopup
            onClose={() => this.setState({ isPopupVisible: false })}
            onStartNewGame={this.startNewGame}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  grid: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    // width: 40,
    // height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 5,
    borderRadius: 5,
    // color: 'blue',
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  incorrectCell: {
    backgroundColor: "#FFCDD2",
  },
  completedRow: {
    flexDirection: "row",
    backgroundColor: "lightgreen",
  },
  completedCell: {
    backgroundColor: "lightyellow",
  },
  disabledButton: {
    backgroundColor: "grey",
  },
});

export default Board;
