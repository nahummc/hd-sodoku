import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Utils from './SudokuUtils';

const Board = ({ board, handleCellPress, incorrectCells }) => {
  return (
    <View style={styles.grid}>
      {board.map((row, rowIndex) => {
        const isRowComplete = Utils.isRowComplete(board, rowIndex);
        return (
          <View key={rowIndex} style={[styles.row, isRowComplete ? styles.completedRow : null]}>
            {row.map((cell, colIndex) => {
              const isColComplete = Utils.isColComplete(board, colIndex);
              const gridRowStart = Math.floor(rowIndex / 3) * 3;
              const gridColStart = Math.floor(colIndex / 3) * 3;
              const isGridComplete = Utils.isSingleGridComplete(board, gridRowStart, gridColStart);
              const isIncorrect = incorrectCells.some((ic) => ic.row === rowIndex && ic.col === colIndex);

              const isBoundaryRow = rowIndex % 3 === 2;
              const isBoundaryCol = colIndex % 3 === 2;

              return (
                <Pressable key={colIndex} onPress={() => handleCellPress(rowIndex, colIndex)}>
                  <View
                    style={[
                      styles.cell,
                      isIncorrect ? styles.incorrectCell : null,
                      isColComplete ? styles.completedCol : null,
                      isGridComplete ? styles.completedGrid : null,
                      isBoundaryRow ? styles.boundaryRow : null,
                      isBoundaryCol ? styles.boundaryCol : null,
                    ]}
                  >
                    <Text style={styles.cellText}>{cell !== 0 ? cell : ''}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
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
  incorrectCell: {
    backgroundColor: '#FFCDD2',
  },
  completedRow: {
    backgroundColor: 'lightblue',
  },
  completedCol: {
    backgroundColor: 'lightblue',
  },
  completedGrid: {
    backgroundColor: 'lightblue',
  },
  boundaryRow: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  boundaryCol: {
    borderRightWidth: 3,
    borderRightColor: '#000',
  },
});

export default Board;
