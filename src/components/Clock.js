import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text,} from 'react-native';
import {
  WINDOW_HEIGHT,
  largeFont,
  mediumFont,
} from '../styles';
import moment from 'moment';

const Clock = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    setInterval(() => {
      const current = moment().format('dddd, MMMM DD');
      const time = moment().format('h:mm a');
      setDate(current.toString());
      setTime(time.toString());
    }, 1000);
  }, []);

  return (
    <View style={styles.clockContainer}>
      <Text style={[largeFont, styles.heading]}>{time}</Text>
      <Text style={mediumFont}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  clockContainer: {
    marginTop: WINDOW_HEIGHT * 0.05,
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default Clock;
