import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {plus, camera, gallery} from '../images/svg';
import {SvgCss} from 'react-native-svg';
import {mediumFont, WINDOW_HEIGHT, WINDOW_WIDTH} from '../styles';
import Modal from 'react-native-modal';
import {calender} from '../images/svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReactNativeAN from 'react-native-alarm-notification';
import moment from 'moment';
import {connect} from 'react-redux';
import {addAlarm} from '../../redux/actions/alarm';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const ModalAlarm = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const formatDate = () => {
    if (!date || !time) {
      return '-';
    }
    const initDate = moment(date).format('DD/MM/YYYY');
    const initTime = moment(time).format('HH:mm');

    const dateTime = moment(initDate + '' + initTime, 'DD/MM/YYYY HH:mm');
    return dateTime.format('DD/MM/YYYY HH:mm a');
  };

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [option, setOption] = useState(false);

  let path =
    'https://sales.kencanaindonesia.co.id/wp-content/uploads/2021/04/placeholder-3.png';
  const [resourceImage, setResourceImage] = useState(path);

  const onChange = selectedValue => {
    setShow(Platform.OS === 'ios');
    if (selectedValue.type === 'dismissed') {
      setStatus(false);
      setShow(false);
      return;
    } else if (mode == 'date') {
      setDate(selectedValue.nativeEvent.timestamp);
      setMode('time');
      setShow(Platform.OS !== 'ios'); // to show time
    } else {
      setTime(selectedValue.nativeEvent.timestamp);
      setShow(Platform.OS === 'ios'); // to hide back the picker
      setMode('date'); // defaulting to date for next open
      setStatus(true);
    }
  };
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const makeid = () => {
    var length = 5;
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleDatePicked = async () => {
    if (!status) {
      return Alert.alert('Please choose time');
    }

    const initDate = moment(date).format('DD/MM/YYYY');
    const initTime = moment(time).format('HH:mm');

    const dateTime = moment(initDate + '' + initTime, 'DD/MM/YYYY HH:mm');
    const formatAN = moment(dateTime).format('DD-MM-YYYY HH:mm:ss');

    if (dateTime < Date.now()) {
      Alert.alert('Please choose future time');
      return;
    }

    const alarmNotifData = {
      title: title.trim() === '' ? 'Alarm' : title, // Required
      message: description.trim() === '' ? initTime : description, // Required
      channel: 'alarm-channel', // Required. Same id as specified in MainApplication's onCreate method
      ticker: 'My Notification Ticker',
      auto_cancel: true, // default: true
      vibrate: true,
      vibration: 100, // default: 100, no vibration if vibrate: false
      small_icon: 'ic_launcher', // Required
      large_icon: 'ic_launcher',
      play_sound: true,
      sound_name: null, // Plays custom notification ringtone if sound_name: null
      color: 'red',
      tag: 'some_tag',
      fire_date: formatAN, // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
      has_button: true,

      // You can add any additional data that is important for the notification
      // It will be added to the PendingIntent along with the rest of the bundle.
      // e.g.
      data: {value: dateTime.toString()},
    };

    let pathImage;
    if (resourceImage === path) {
      pathImage =
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Alarm_Clock_Animation_High_Res.png/969px-Alarm_Clock_Animation_High_Res.png';
    } else {
      pathImage = resourceImage;
    }

    const alarm = await ReactNativeAN.scheduleAlarm(alarmNotifData);
    setResourceImage(path);
    props.add({...alarmNotifData, pathImage, toggle: true, id: alarm.id});
    setModalVisible(false);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const chooseImage = type => {
    if (type === 1) {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setResourceImage(response.uri);
          setOption(false);
        }
      });
    } else {
      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setResourceImage(response.uri);
          setOption(false);
        }
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{position: 'relative', zIndex: 99}}
        onPress={toggleModal}>
        <SvgCss style={styles.addBtn} xml={plus} width={60} height={60} />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        swipeDirection={['left', 'right']}
        onSwipeComplete={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        propagateSwipe={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <ScrollView style={{marginBottom: 20}}>
              <View style={styles.inputSection}>
                <View>
                  <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                    Date
                  </Text>
                  <Text>{formatDate()}</Text>
                </View>
                <TouchableOpacity onPress={showDatePicker}>
                  <SvgCss xml={calender} width={30} height={30} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginBottom: 10,
                }}>
                <Text style={{fontWeight: 'bold', marginBottom: 5}}>Title</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => setTitle(e)}
                />
              </View>

              <View
                style={{
                  marginBottom: 10,
                }}>
                <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                  Description
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => setDescription(e)}
                />
              </View>

              <View
                style={{
                  marginBottom: 20,
                }}>
                <Text style={{fontWeight: 'bold', marginBottom: 5}}>Image</Text>
                <TouchableOpacity
                  onPress={() => setOption(true)}
                  style={styles.pickImg}>
                  <Image
                    source={{uri: resourceImage}}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>

              {option ? (
                <Modal
                  isVisible={option}
                  swipeDirection={['bottom']}
                  onSwipeComplete={() => setOption(false)}
                  onBackdropPress={() => setOption(false)}
                  propagateSwipe={true}>
                  <View style={styles.modalContainer2}>
                    <View style={styles.modalBody2}>
                      <TouchableOpacity onPress={() => chooseImage(1)} style={styles.pickFrom}>
                        <SvgCss xml={gallery} width={70} height={70} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => chooseImage(2)} style={styles.pickFrom}>
                        <SvgCss xml={camera} width={70} height={70} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              ) : null}
            </ScrollView>

            <TouchableOpacity
              onPress={() => handleDatePicked()}
              style={styles.btnSet}>
              <Text style={styles.textBtn}>Set Alarm</Text>
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              value={new Date()}
              minimumDate={Date.parse(new Date())}
              display="default"
              mode={mode}
              onChange={onChange}
            />
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
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
    justifyContent: 'space-between',
  },
  addBtn: {
    marginVertical: 20,
    borderRadius: 30,
    marginLeft: WINDOW_WIDTH * 0.05,
    backgroundColor: 'white',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    backgroundColor: 'whitesmoke',
    padding: 10,
  },
  pickImg: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'lightgray',
  },
  btnSet: {
    backgroundColor: '#00c717',
    borderRadius: 10,
    paddingVertical: 20,
    marginBottom: 20,
  },
  textBtn: {
    textAlign: 'center',
    ...mediumFont,
    fontWeight: 'bold',
  },
  modalContainer2: {
    height: WINDOW_HEIGHT,
    justifyContent: 'flex-end',
    width: WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
  },
  modalBody2: {
    backgroundColor: 'white',
    height: WINDOW_HEIGHT * 0.15,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  pickFrom: {
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    add: alarmNotifObj => {
      dispatch(addAlarm(alarmNotifObj));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAlarm);
