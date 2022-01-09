import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  BG_COLOR,
  WINDOW_WIDTH,
  largeFont,
  smallFont,
  WINDOW_HEIGHT,
  mediumFont,
} from '../styles';
import {SvgCss} from 'react-native-svg';
import {sunnyWeather} from '../images/svg';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

class WeatherScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dialy: [],
    };
  }

  getWeather = () => {
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall?'; // check openweather.org
    const API_KEY = ' '; //your API key
    const lat = ' '; //your location 
    const long = ' '; //your location 

    return fetch(
      `${BASE_URL}appid=${API_KEY}&lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric`,
    )
      .then(response => response.json())
      .then(json => {
        return this.setState({data: json, dialy: json.daily});
      })
      .catch(error => {
        console.error(error);
      });
  };

  formatDateToDay = date => {
    return moment.unix(date).format('dddd');
  };

  componentDidMount() {
    this.getWeather();
  }

  render() {
    return (
      <ImageBackground
        source={require('../images/logo/background.jpeg')}
        resizeMode="cover"
        style={styles.mainContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.location}>
              <Image
                source={require('../images/logo/marker.png')}
                style={styles.smallLogo}
              />
              <Text style={{...smallFont}}>{this.state.data.timezone}</Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={{...largeFont}}>
                {this.state.data.current?.temp}°
              </Text>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../images/logo/sun.png')}
                  style={styles.smallLogo}
                />
                <Text style={{...smallFont}}>
                  {this.state.data.current?.weather[0].description}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.carousel}>
            {this.state.dialy.length > 0 ? (
              <ScrollView
                style={{width: WINDOW_WIDTH}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {this.state.dialy.map((item, index) => {
                  return (
                    <View key={index} style={styles.card}>
                      <View style={{flex: 0.6}}>
                        <SvgCss xml={sunnyWeather} width={40} height={40} />
                      </View>
                      <View style={styles.bottomSection}>
                        <Text style={{...mediumFont}}>
                          {item.temp.min}° - {item.temp.max}°
                        </Text>
                        <View style={styles.divider} />
                        <Text style={{...mediumFont, color: '#000'}}>
                          {this.formatDateToDay(item.dt)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            ) : null}
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
    justifyContent: 'space-between',
    marginBottom: WINDOW_HEIGHT * 0.25,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: WINDOW_HEIGHT * 0.07,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,
  },
  smallLogo: {
    width: 25,
    height: 25,
  },
  card: {
    borderRadius: 15,
    position: 'relative',
    alignItems: 'center',
    padding: 10,
    width: WINDOW_WIDTH * 0.38,
    backgroundColor: '#5750af',
    transform: [{scale: 0.9}],
  },
  carousel: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT * 0.3,
  },
  divider: {
    height: 7,
    width: '100%',
    marginVertical: 5,
    backgroundColor: '#00a128',
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 20,
  },
  bottomSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});

export default WeatherScreen;
