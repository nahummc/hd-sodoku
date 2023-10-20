import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const DifficultyPopup = ({ onClose, onStartNewGame }) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Choose your difficulty:</Text>
        
        <Pressable style={styles.button} onPress={() => { onStartNewGame(2); onClose(); }}>
          <Text style={styles.buttonText}>Testing</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => { onStartNewGame(20); onClose(); }}>
          <Text style={styles.buttonText}>Very Easy</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => { onStartNewGame(30); onClose(); }}>
          <Text style={styles.buttonText}>Easy</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => { onStartNewGame(45); onClose(); }}>
          <Text style={styles.buttonText}>Medium</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => { onStartNewGame(55); onClose(); }}>
          <Text style={styles.buttonText}>Hard</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => { onStartNewGame(64); onClose(); }}>
          <Text style={styles.buttonText}>Extreme</Text>
        </Pressable>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};

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
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
    width: 150, // Fixed width for all buttons
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: 150, // Fixed width for the close button
  },
});

export default DifficultyPopup;
