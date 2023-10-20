import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

const NumberButtons = ({ handleNumberButtonClick, numberCount, selectedNumber }) => {
  return (
    <View style={styles.buttonRow}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Pressable key={number} onPress={() => handleNumberButtonClick(number)}>
          <View style={[
            styles.button,
            selectedNumber === number && styles.selectedButton, // Highlight selected
            numberCount[number] === 9 && styles.disabledButton // Disable if no plays left
          ]}>
            <Text style={styles.buttonText}>{number}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
});

export default NumberButtons;