import React, { Component } from "react";
import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import * as Utils from "./SudokuUtils";
import NumberButtons from "./NumberButtons";
import FeedbackArea from "./FeedbackArea";
import DifficultyPopup from "./DifficultyPopup";
import Board from "./Board";
import VictoryPopup from "./VictoryPopup";

class Game extends Component {
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
      isGameInitialized: false,
      isVictoryPopupVisible: false,
      gameTime: 0,
      gameScore: 0,
      gameTimer: null,
      incorrectMoves: 0,
    };
  }

  componentDidMount() {
    // Initialize the board when the component mounts
    // const filledBoard = Utils.initBoard(this.state.blankBoard);
    // const listOfSolutions = {};
    // Utils.findAllSolutions(filledBoard, listOfSolutions);
    // // Initialize numberCount based on filledBoard
    // const initialNumberCount = Array(9).fill(0);
    // filledBoard.forEach((row) => {
    //   row.forEach((num) => {
    //     if (num !== 0) {
    //       initialNumberCount[num - 1]++;
    //     }
    //   });
    // });
    // const numberCount = {};
    // for (let i = 1; i <= 9; i++) {
    //   numberCount[i] = 9 - initialNumberCount[i - 1];
    // }
    // this.setState({ board: filledBoard, listOfSolutions, numberCount });
    // console.log("Initial numberCount:", numberCount);
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
      // console.warn("Cell is already filled");
      this.setState({ feedbackMessage: "Invalid Move" });
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

      // console.log("Is move valid?", isValid);

      if (isValid) {
        this.updateNumberCount(selectedNumber);
        this.setState({ feedbackMessage: "Correct move!" });
        this.checkGameCompletion();
      } else {
        this.setState((prevState) => ({
          feedbackMessage: "Incorrect move. Try again.",
          incorrectCells: [...incorrectCells, { row, col }],
          incorrectMoves: prevState.incorrectMoves + 1,
        }));

        // log number counts
        // console.log(" handle press numberCount:", this.state.numberCount);
        // log game score, timer and incorrect moves
        console.log("Game Score:", this.state.gameScore);
        console.log("Game Time:", this.state.gameTime);
        console.log("Incorrect Moves:", this.state.incorrectMoves);

        setTimeout(() => {
          updatedBoard[row][col] = 0;
          this.setState({
            board: updatedBoard,
            incorrectCells: incorrectCells.filter(
              (cell) => !(cell.row === row && cell.col === col)
            ),
            feedbackMessage: "", // Clear the feedback message
          });
        }, 2000); // 2 seconds delay
      }
    }
  };

  handleNumberButtonClick = (number) => {
    //console.log("handleNumberButtonClick");
    this.setState({ selectedNumber: number });
  };

  updateNumberCount = (selectedNumber) => {
    const { numberCount } = this.state;

    // Update the count for the selectedNumber
    const updatedNumberCount = { ...numberCount };
    updatedNumberCount[selectedNumber] =
      (updatedNumberCount[selectedNumber] || 0) + 1;

    this.setState({ numberCount: updatedNumberCount });
  };

  startNewGame = (difficulty) => {
    // Close the popup
    this.setState({ isPopupVisible: false });

    // Log for debugging
    // console.log("Starting new game with difficulty:", difficulty);

    // Initialize a new blank board
    const newBoard = Utils.initBoard(this.state.blankBoard); // Assuming initBoard returns a new blank board when true is passed
    // console.log("newBoard after initBoard:", newBoard);

    // Fill the board and poke holes based on difficulty
    const holesToPoke = difficulty;
    const pokedBoard = Utils.pokeHoles(newBoard, holesToPoke);
    // console.log("pokedBoard after pokeHoles:", pokedBoard);

    // Reinitialize list of solutions based on the newly poked board
    const newListOfSolutions = {};
    Utils.findAllSolutions(pokedBoard, newListOfSolutions);
    // console.log("New list of solutions:", newListOfSolutions);

    // Check if pokedBoard is valid
    if (!pokedBoard || pokedBoard.length === 0) {
      console.error("Invalid pokedBoard:", pokedBoard);
      return;
    }

    // Reset incorrectCells, feedbackMessage, and numberCount
    const newIncorrectCells = [];
    const newFeedbackMessage = "";
    const newNumberCount = this.calculateNumberCount(pokedBoard);

    // console.log("New game numberCount:", this.state.numberCount);
    // console.log("New game numberCount:", newNumberCount);

    // Clear existing timer
    if (this.state.gameTimer) {
      clearInterval(this.state.gameTimer);
    }

    // Start a new timer
    const newTimer = setInterval(() => {
      this.setState((prevState) => ({
        gameTime: prevState.gameTime + 1,
      }));
    }, 1000);

    // Update the state
    this.setState({
      board: pokedBoard,
      incorrectCells: newIncorrectCells,
      feedbackMessage: newFeedbackMessage,
      numberCount: newNumberCount,
      listOfSolutions: newListOfSolutions,
      isGameInitialized: true,
      gameTimer: newTimer,
      gameTime: 0,
      gameScore: 0,
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

  checkGameCompletion = () => {
    const { board } = this.state;

    const isComplete = board.every((row, rowIndex) => {
      const isRowComplete = Utils.isRowComplete(board, rowIndex);
      const isEveryColComplete = Array.from({ length: 9 }, (_, colIndex) =>
        Utils.isColComplete(board, colIndex)
      ).every(Boolean);
      const isEveryGridComplete = Utils.isGridComplete(board);
      return isRowComplete && isEveryColComplete && isEveryGridComplete;
    });

    if (isComplete) {
      this.setState({ isVictoryPopupVisible: true });
      clearInterval(this.state.gameTimer);
    }
  };

  render() {
    const {
      board,
      selectedNumber,
      feedbackMessage,
      incorrectCells,
      disabledNumbers,
    } = this.state;

    // if (!board || board.length === 0) {
    //   return (
    //     <View>
    //       <Text>Loading...</Text>
    //     </View>
    //   );
    // }

    if (!this.state.isGameInitialized) {
      return (
        <View style={styles.container}>
          <Text>Welcome to the Sudoku Game!</Text>
          <Pressable
            style={styles.button}
            onPress={() => this.setState({ isPopupVisible: true })}
          >
            <Text style={styles.buttonText}>New Game</Text>
          </Pressable>
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
      <View>
        <Text>Time: {this.state.gameTime} seconds</Text>
        <Text>Incorrect Moves: {this.state.incorrectMoves}</Text>
        
        {/* <Grid
          board={this.state.board}
          handleCellPress={this.handleCellPress}
          incorrectCells={this.state.incorrectCells}
        /> */}
        <Board
          board={this.state.board}
          handleCellPress={this.handleCellPress}
          incorrectCells={this.state.incorrectCells}
        />
        <NumberButtons
          handleNumberButtonClick={this.handleNumberButtonClick}
          numberCount={this.state.numberCount}
          selectedNumber={this.state.selectedNumber} // Pass down selectedNumber
        />
        {/* <DebugButtons pokeHolesInBoard={this.pokeHolesInBoard} /> */}
        <FeedbackArea feedbackMessage={this.state.feedbackMessage} />
        <Pressable
          style={styles.button}
          onPress={() => this.setState({ isPopupVisible: true })}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </Pressable>
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
        <VictoryPopup
          isVisible={this.state.isVictoryPopupVisible}
          onClose={() => this.setState({ isVictoryPopupVisible: false })}
          onStartNewGame={() => this.setState({ isPopupVisible: true })}
          gameTime={this.state.gameTime}
          gameScore={this.state.gameScore}
        />
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

export default Game;
