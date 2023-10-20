import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeedbackArea = ({ feedbackMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.feedbackText}>{feedbackMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FeedbackArea;
