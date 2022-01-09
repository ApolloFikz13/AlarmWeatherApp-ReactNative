import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {deleteAlarm, updateAlarm} from '../../redux/actions/alarm';
import ReactNativeAN from 'react-native-alarm-notification';
import {WINDOW_HEIGHT, WINDOW_WIDTH, mediumFont, smallFont} from '../styles';
import Modal from 'react-native-modal';
import moment from 'moment';
import {NativeModules} from 'react-native';

const {RNAlarmNotification} = NativeModules;

const ListAlarms = props => {
  const [enabled, setEnabled] = useState(true);
  const [ticker, setTicker] = useState('');
  const [modalVisible, setModalVisible] = useState(true);

  function toggleAlarm(id) {
    var data = props.alarms.find(item => item.alarmNotifData.id === id);
    if (data) {
      data.alarmNotifData.toggle = !data.alarmNotifData.toggle;

      if (data.alarmNotifData.toggle) {
        const fireDate = data.alarmNotifData.fire_date;
        const initTime = new Date(
          fireDate.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'),
        );

        const init = moment(initTime).add(1, 'days');
        const fireDateValue = init.format('DD-MM-YYYY HH:mm:ss');

        if (data.alarmNotifData.data.value < Date.now()) {
          const contain = {
            ...data.alarmNotifData,
            data: {...data, value: init.toString()},
            fire_date: fireDateValue,
          };
          const setAlarm = async () => {
            const alarm = await ReactNativeAN.scheduleAlarm({...contain, toggle: true});
            data.alarmNotifData.id = alarm.id
          }
          setAlarm();
        } else {
          const setAlarm = async () => {
            const alarm = await ReactNativeAN.scheduleAlarm({...data.alarmNotifData, toggle: true});;
            data.alarmNotifData.id = alarm.id
          }
          setAlarm();
        }
      } else {
        ReactNativeAN.deleteAlarm(parseInt(id));
      }
    }
  }

  return (
    <ScrollView>
      {props.alarms &&
        props.alarms.map((item, index) => {
          const fireDate = item.alarmNotifData.fire_date;
          const initTime = new Date(
            fireDate.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'),
          ).getTime();
          let interval = initTime - new Date().getTime();

          if (interval < 0) {
            null;
          } else {
            setTimeout(function () {
              setModalVisible(true);
              setTicker(item.alarmNotifData.id);
            }, interval);
          }

          return (
            <View key={index} style={styles.list}>
              <View>
                <Text style={{...smallFont, position: 'absolute', top: -23}}>
                  {item.alarmNotifData.title}
                </Text>
                <Text style={{...mediumFont, fontSize: 22, fontWeight: '500'}}>
                  {item.time.toString()}
                </Text>
                <Text style={{...smallFont, position: 'absolute', bottom: -23}}>
                  {moment(item.alarmNotifData.data.fire_date).format(
                    'DD/MM/YYYY',
                  )}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => {
                  ReactNativeAN.deleteAlarm(item.alarmNotifData.id);
                  props.delete(item.value);
                }}>
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  x
                </Text>
              </TouchableOpacity>

              <View>
                <Switch
                  trackColor={{false: 'gray', true: 'teal'}}
                  thumbColor="white"
                  ios_backgroundColor="gray"
                  onValueChange={() => {
                    setEnabled(!enabled);
                    toggleAlarm(item.alarmNotifData.id);
                  }}
                  value={item.alarmNotifData.toggle}
                />
              </View>

              {item.alarmNotifData.toggle === true &&
              ticker === item.alarmNotifData.id ? (
                <Modal
                  isVisible={modalVisible}
                  onBackdropPress={() => setModalVisible(false)}>
                  <View style={styles.modal}>
                    <View style={styles.modalBody}>
                      <Text
                        style={{
                          color: '#222',
                          fontSize: 26,
                          fontWeight: 'bold',
                        }}>
                        {item.alarmNotifData.title}
                      </Text>
                      <View style={styles.imgContain}>
                        <Image
                          source={{
                            uri: item.alarmNotifData.pathImage,
                          }}
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <Text style={{marginTop: 20}}>
                        {item.alarmNotifData.message}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'red',
                          paddingVertical: 15,
                          borderRadius: 5,
                          width: '100%',
                          marginTop: 20,
                        }}
                        onPress={() => {
                          ReactNativeAN.removeFiredNotification(
                            parseInt(item.alarmNotifData.id),
                          );
                          ReactNativeAN.stopAlarmSound();
                          setModalVisible(false);
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}>
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              ) : null}
            </View>
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: WINDOW_HEIGHT * 0.11,
    borderRadius: 5,
    elevation: 4,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#acacac',
    marginBottom: 20,
    position: 'relative',
  },
  modal: {
    height: WINDOW_HEIGHT,
    justifyContent: 'center',
    width: WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
  },
  modalBody: {
    backgroundColor: 'white',
    height: WINDOW_HEIGHT * 0.55,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 30,
    position: 'relative',
    alignItems: 'center',
  },
  btnCancel: {
    position: 'absolute',
    right: 10,
    top: 0,
    width: 30,
    alignItems: 'flex-end',
  },
  titleStyle: {fontWeight: 'bold', fontSize: 30},
  imgContain: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 5,
    marginTop: 20,
  },
});

const mapStateToProps = state => {
  return {
    alarms: state.alarms.alarms,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    delete: value => {
      dispatch(deleteAlarm(value));
    },
    update: id => {
      dispatch(updateAlarm(id));
    },
  };
};

// eslint-disable-next-line prettier/prettier
export default connect(mapStateToProps, mapDispatchToProps)(ListAlarms);
