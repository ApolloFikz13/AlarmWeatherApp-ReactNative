import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from 'react-native';
import TimePicker from '../components/TimePicker';
import ListAlarms from '../components/ListAlarms';
import Clock from '../components/Clock';
import {
  BG_COLOR,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  largeFont,
  mediumFont,
} from '../styles';

class HomeScreen extends Component {
  render() {
    return (
      <ImageBackground
        source={require('../images/logo/background.jpeg')}
        resizeMode="cover"
        style={styles.mainContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.listAlarms}>
            <Clock />
            <ListAlarms />
          </View>

          <View style={styles.timePicker}>
            <TimePicker />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    width: WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
    position: 'relative',
  },
  timePicker: {
    flex: 0.2,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: WINDOW_HEIGHT * 0.12,
    zIndex: 100,
  },
  listAlarms: {
    flex: 0.76,
    overflow: 'hidden',
    width: '100%',
  },
});

export default HomeScreen;
