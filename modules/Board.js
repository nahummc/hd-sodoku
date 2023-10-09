import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
// import * as SudokuUtils from './modules/SudokuUtils';

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
    this.initBoard(true);
  }

  initBoard = (blank) => {
    try {
      const filledBoard = SudokuUtils.fillPuzzle(
        JSON.parse(JSON.stringify(this.state.blankBoard)),
        this.state.numArray,
        this.state.counter
      );
      this.setState({ board: filledBoard });
      console.log("filledBoard: ", filledBoard);
    } catch (error) {
      console.error("Error generating board:", error);
    }
  };

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
          onPress={() =>
            SudokuUtils.pokeHoles(
              this.state.board,
              30,
              SudokuUtils.countSolutions
            )
          }
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

export default Board;