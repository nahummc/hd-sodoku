import React from "react";
import { View, StyleSheet } from "react-native";
import Cell from "./Cell";
import * as Utils from './SudokuUtils'; 


const Row = ({ row, rowIndex, handleCellPress, incorrectCells, board }) => {
  return (
    <View style={styles.row}>
      {row.map((cell, colIndex) => {
        console.log("ROW: Board before isColComplete:", board);

        const isColComplete = Utils.isColComplete(board, colIndex);
        const gridRowStart = Math.floor(rowIndex / 3) * 3;
        const gridColStart = Math.floor(colIndex / 3) * 3;
        const isGridComplete = Utils.isSingleGridComplete(
          board,
          gridRowStart,
          gridColStart
        );

        return (
          <Cell
            key={colIndex}
            cell={cell}
            rowIndex={rowIndex}
            colIndex={colIndex}
            handleCellPress={handleCellPress}
            incorrectCells={incorrectCells}
            isColComplete={isColComplete}
            isGridComplete={isGridComplete}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  completedRow: {
    backgroundColor: "lightgreen",
  },
});

export default Row;
