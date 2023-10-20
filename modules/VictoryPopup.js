import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';

const VictoryPopup = ({ isVisible, onClose, onStartNewGame, gameTime, gameScore }) => {
    const [isDifficultyPopupVisible, setDifficultyPopupVisible] = useState(false);

  const handleNewGamePress = () => {
    onClose();  // Close the VictoryPopup
    onStartNewGame();  // This should now handle opening the DifficultyPopup
  };

  const handleDifficultySelected = (difficulty) => {
    setDifficultyPopupVisible(false);
    onStartNewGame(difficulty);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Congratulations, you won!</Text>
          <Text>Time: {gameTime}</Text>
          <Text>Incorrect Moves: {gameScore}</Text>
          <Pressable style={styles.button} onPress={handleNewGamePress}>
            <Text style={styles.buttonText}>New Game</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default VictoryPopup;

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent background
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      elevation: 5,
      width: 300, // Width added
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 20, // Font size increased
    },
    button: {
      width: '100%', // Add this line for equal width buttons
      padding: 10,
      margin: 5,
      backgroundColor: '#2196F3',
    },
    buttonText: {
      textAlign: 'center',
      color: 'white',
    }
  });
