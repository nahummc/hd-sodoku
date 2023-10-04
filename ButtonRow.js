import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

class ButtonRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNumber: null,
    };
  }

  handleButtonClick = (number) => {
    this.setState({ selectedNumber: number });
  };

  render() {
    const { selectedNumber } = this.state;
    const { onGridCellClick } = this.props;

    return (
      <View style={styles.container}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.button,
              selectedNumber === number ? styles.selectedButton : null,
            ]}
            onPress={() => this.handleButtonClick(number)}
          >
            <Text style={styles.buttonText}>{number}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => this.handleButtonClick(null)}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red', // Change color as needed
  },
});

export default ButtonRow;
