import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

class GameBoard extends Component {
    constructor(props) {
        super(props);
      
        this.state = {
          board: Array(9).fill(Array(9).fill('')),
          selectedNumber: null,
          selectedCell: null,
        };
      }
      

      handleCellPress = (row, col) => {
        const { selectedNumber } = this.state;
      
        if (selectedNumber !== null) {
          // Update the grid cell with the selected number
          const updatedBoard = [...this.state.board];
          updatedBoard[row][col] = selectedNumber;
      
          this.setState({
            board: updatedBoard,
            selectedNumber: null,
            selectedCell: { row, col },
          });
        }
      };
      

  render() {
    const { board } = this.state;

    return (
      <View style={styles.container}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.cell}
                onPress={() => this.handleCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default GameBoard;
