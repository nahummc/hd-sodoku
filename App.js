import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SudokuBoard from './SudokuBoard';
// import Board from './modules/Board';
import Game from './modules/Game';


class SudokuGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNumber: null,
    };
  }

  handleCellPress = (row, col) => {
    const { selectedNumber } = this.state;

    if (selectedNumber !== null) {
      // Update the grid cell with the selected number in your GameBoard component
      // You should have a reference to your GameBoard component to call its methods
      // Example: this.gameBoardRef.updateCell(row, col, selectedNumber);

      // Clear the selected number
      this.setState({ selectedNumber: null });
    }
  };

  render() {
    const { selectedNumber } = this.state;

    return (
      <View style={styles.container}>
        {/* <SudokuBoard /> */}
        {/* <Board /> */}
        <Game />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SudokuGame;
