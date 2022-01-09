import {ADD_ALARM, DELETE_ALARM, UPDATE_ALARM} from '../actions';
import Moment from 'moment';

const initialState = {
  alarms: [],
};

const alarmReducer = (state = initialState, action) => {

  function salmon(id){
    const dataAlarm = state.alarms.find(data => data.alarmNotifData.id === id);
    
    if(dataAlarm){
      dataAlarm.alarmNotifData.toggle = !dataAlarm.alarmNotifData.toggle;
    }
    return dataAlarm;
  }

  function editState(alarmId){
    const test = state.alarms.map(obj => salmon(alarmId) || obj);
    return test;
  }

  switch (action.type) {
    case ADD_ALARM:
      Moment.locale('en');
      const payload = action.payload;
      const time = Moment(payload.data.value).format('hh:mm A');
      const date = Moment(payload.data.value).format('d/M/YY');
      const alarm = {
        alarmNotifData: payload,
        value: payload.data.value,
        time: time,
        date: date,
      };
      return {
        ...state,
        alarms: state.alarms.concat(alarm),
      };

    case DELETE_ALARM:
      return {
        ...state,
        alarms: state.alarms.filter(v => {
          return v.value !== action.payload;
        }),
      };

    case UPDATE_ALARM:
      return {
        ...state,
        alarms: editState(action.payload),
      };

    default:
      return state;
  }
};

export default alarmReducer;
