import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

const DebugButtons = ({ pokeHolesInBoard }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => pokeHolesInBoard(5)} style={styles.button}>
        <Text>Poke Holes</Text>
      </Pressable>
      {/* Add more debug buttons here if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default DebugButtons;
