import React from 'react';
import { View, StyleSheet } from 'react-native';
import Row from './Row';
import * as Utils from './SudokuUtils'; 

const Grid = ({ board, handleCellPress, incorrectCells }) => {
  return (
    <View style={styles.grid}>
      {board.map((row, rowIndex) => {
        const isRowComplete = Utils.isRowComplete(board, rowIndex);
        return (
          <Row
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            handleCellPress={handleCellPress}
            incorrectCells={incorrectCells}
            isRowComplete={isRowComplete}
            board={board}  // Pass down the board to Row
          />
        );
      })}
    </View>
  );
};


const styles = StyleSheet.create({
  grid: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Grid;