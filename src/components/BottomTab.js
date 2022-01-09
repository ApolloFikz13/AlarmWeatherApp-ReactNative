import React from 'react';
import HomeScreen from '../screen/home'
import WeatherScreen from '../screen/weather'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BG_COLOR, mediumFont, WINDOW_HEIGHT } from '../styles';

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{...styles.btnNav, backgroundColor: isFocused ? 'white' : 'transparent'}}
          >
            <Text style={{ ...mediumFont, fontWeight: '500', color: isFocused ? BG_COLOR : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator 
        screenOptions={{headerShown: false}}
        tabBar={props => <MyTabBar {...props}/>}
    >
      <Tab.Screen name="Alarm" component={HomeScreen}/>
      <Tab.Screen name="Weather"component={WeatherScreen}/>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        width: '90%',
        height: WINDOW_HEIGHT * 0.08,
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
        backgroundColor: '#acacac',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: WINDOW_HEIGHT * 0.02
    },
    btnNav: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '80%',
        width: '47%',
        borderRadius: 10
    }
})

export default BottomTab