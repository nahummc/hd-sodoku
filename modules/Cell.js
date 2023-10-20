import { StyleSheet, Pressable, Text, View } from 'react-native';
import * as Utils from './SudokuUtils';

const Cell = ({ cell, rowIndex, colIndex, handleCellPress, incorrectCells, isColComplete, isGridComplete }) => {
  const isIncorrect = incorrectCells.some(
    (ic) => ic.row === rowIndex && ic.col === colIndex
  );

  const isBoundaryRow = rowIndex % 3 === 2;
  const isBoundaryCol = colIndex % 3 === 2;

  return (
    <Pressable onPress={() => handleCellPress(rowIndex, colIndex)}>
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
};

const styles = StyleSheet.create({
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incorrectCell: {
    backgroundColor: '#FFCDD2',
  },
  completedCol: {
    backgroundColor: 'lightblue',
  },
  completedGrid: {
    backgroundColor: 'lightyellow',
  },
  boundaryRow: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  boundaryCol: {
    borderRightWidth: 3,
    borderRightColor: '#000',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Cell;
