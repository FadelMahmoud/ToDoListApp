import { ScrollView, Image, Modal, TextInput, Alert, StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';;
import { useSelector, useDispatch } from 'react-redux';
import { setTasks, setTaskId , setTaskFirstImage } from '../src/redux/actions';
import taskReducer from '../src/redux/reducers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import CheckBox from '@react-native-community/checkbox';


export default function Task( { navigation, route }) {

  const { tasks, taskId , taskFirstImage } = useSelector( state => state.taskReducer);
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [showBellModal, setShowBellModal] = useState(false);
  const [bellTime, setBellTime] = useState('1');
  const [done, setDone] = useState(false);
  const [image, setImage] = useState('');
  
  useEffect( () => {
    navigation.addListener('focus', () => {
      getTask();
    })
  }, [] )

  const getTask = () => {
    const Task = tasks.find( task => task.id === taskId );
    if ( Task ){
        setTitle( Task.title );
        setDescription( Task.description );
        setColor( Task.color);
        setDone( Task.Done);
        setImage( Task.Image);
    }
  }

  const setTask = () => {
    
    if ( title.length == 0 ){
      Alert.alert('Warning', 'Title is mandatory');
    }else 
    {
      try {
        var Task = {
          id : taskId ,
          title : title,
          description : description,
          color : color,
          Done: done,
          Image : image,
        }
        const index = tasks.findIndex( task => task.id === taskId );
        let newTasks = [];

        if ( index > -1 )
        {
          newTasks = [...tasks];
          newTasks[index] = Task;
        } else 
        {
          Task.Image = taskFirstImage;
          newTasks = [...tasks, Task];
          dispatch ( setTaskFirstImage ('') );
        }

        AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(() => {
          dispatch(setTasks(newTasks));

          Alert.alert('Success!!!', 'Task saved successfully');
          navigation.goBack();
        })
        .catch ( err => console.log(err))
      } catch (error) {
          console.log(error)
      }
    }
    
  }

  const setTaskAlarm = () => {
    setShowBellModal(false)

    PushNotification.localNotificationSchedule({
      channelId: 'task-channel',
      title: title ,
      message: description,
      date: new Date( Date.now() + parseInt(bellTime) * 1000 ),
      allowWhileIdle: true,
    })

 }

 const deleteImage = (id) => {
    const index = tasks.findIndex( task => task.id === id);
    if ( index > -1 ){
      let newTasks = [...tasks];
      newTasks[index].Image = '';
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then( () => {
          dispatch( setTasks(newTasks));
          getTask();
          Alert.alert('Success!', 'Task image deleted');
    })
      .catch ( err => console.log(err) )
  }
     else {
       dispatch ( setTaskFirstImage ('') );
       getTask();
       Alert.alert('Success!', 'Task image deleted');
    }
 }

  return (
    <ScrollView style={styles.scroll_View}>
      <View style={styles.body}>
        <Modal
          visible={showBellModal}
          transparent
          onRequestClose={ () => setShowBellModal(false) }
          animationType= 'slide'
          hardwareAccelerated
        >
          <View style={styles.centered_view}>
            <View style={styles.bell_modal}>

              <View style={styles.bell_body}>
                <Text style={styles.bell_body_text}> Remind me after </Text>
                <TextInput 
                  style={styles.remind_textInput}
                  keyboardType= 'numeric'
                  value={bellTime}
                  onChangeText={ (value) => setBellTime(value) }
                />
                <Text style={styles.bell_body_text}> second(s) </Text>
              </View>

              <View style={styles.bell_buttons}>
                <TouchableOpacity 
                  style={styles.bell_cancel_button}
                  onPress={ () => setShowBellModal(false) }
                  >
                  <Text style={styles.bell_button_text}> Cancel </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.bell_ok_button}
                  onPress={ setTaskAlarm }
                >
                  <Text style={styles.bell_button_text}> Ok </Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </Modal>

        <TextInput
        style={styles.textInput}
        placeholder= 'Title'
        value={title}
        onChangeText={ ( value ) => setTitle(value)}
        />
        
        <TextInput
        multiline
        style={styles.textInput}
        placeholder= 'Description'
        value={description}
        onChangeText={ ( value ) => setDescription(value)}
        />

        <View style={styles.colorPicker}>
          <TouchableOpacity 
            style={styles.white}
            onPress={ () => {
              setColor('#fff')
            }}
          >
            { color === '#fff' &&
              <FontAwesome5 
                name= {'check'}
                size= {25}
                color= {'#000000'} />
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.red}
            onPress={ () => {
              setColor('#E24B64')
            }}
          >
            { color === '#E24B64' &&
              <FontAwesome5 
                name= {'check'}
                size= {25}
                color= {'#000000'} />
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.blue}
            onPress={ () => {
              setColor('#7C4FE5')
            }}
          >
            { color === '#7C4FE5' &&
              <FontAwesome5 
                name= {'check'}
                size= {25}
                color= {'#000000'} />
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.green}
            onPress={ () => {
              setColor('#56DC65')
            }}
          >
            { color === '#56DC65' &&
              <FontAwesome5 
                name= {'check'}
                size= {25}
                color= {'#000000'} />
            }
          </TouchableOpacity>
        </View>

        <View style={styles.featuresRow}>
          <Pressable style={styles.feature}          
            onPress={ () => setShowBellModal(true) }
          >
            <FontAwesome5
              name='bell'
              size={22}
              color= '#fff'
            />
          </Pressable>
          <Pressable 
          style={styles.feature}
          onPress={ () => { navigation.navigate('Camera' , { id : taskId }) } }
          >
            <FontAwesome5
                name='camera'
                size={22}
                color= '#fff'
              />
          </Pressable>
        </View>

        { image? 
          <View 
          style={styles.image_View}>
            <Image 
              style={styles.image}
              source= {{ uri: image }}
              resizeMode= 'stretch'
            />

            <TouchableOpacity 
              style={styles.trash_area}
              onPress= {() => deleteImage(taskId) }
            >
              <FontAwesome5
                name='trash'
                size={25}
                color= '#E24B64'
              />
            </TouchableOpacity>
          </View>
          :
          taskFirstImage? 
          <View 
          style={styles.image_View}>
            <Image 
              style={styles.image}
              source= {{ uri: taskFirstImage }}
              resizeMode= 'stretch'
            />

            <TouchableOpacity 
              style={styles.trash_area}
              onPress= {() => deleteImage(taskId) }
            >
              <FontAwesome5
                name='trash'
                size={25}
                color= '#E24B64'
              />
            </TouchableOpacity>
          </View>
          :
          null
        }

        <View style={styles.checkBox}>
          <CheckBox
            value={done}
            onValueChange={ (newValue) => setDone(newValue)}
          />
          <Text> Done ?</Text>
        </View>

        <Pressable 
        style={styles.button}
        onPress={setTask}
        >
          <Text style={styles.buttonText}> Save Task </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll_View: {
    flex: 1,
    backgroundColor: '#d9d7d6'
  },
  body: {
    flex: 1,
    paddingTop:20,
    padding: 10,
  },
  textInput: {
    width: 'auto',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#141413',
    borderWidth: 2,
    fontSize: 20,
    color: '#141413',
    padding: 15,
    marginBottom: 15,
    fontFamily: 'DMSans-Italic'
  },
  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3fc72a',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Montserrat-Regular'
  },
  colorPicker: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10,
  },
  white: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  red: {
    flex: 1,
    backgroundColor: '#E24B64',
    alignItems: 'center',
    justifyContent: 'center'
  },
  blue: {
    flex: 1,
    backgroundColor: '#7C4FE5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  green: {
    flex: 1,
    backgroundColor: '#56DC65',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  featuresRow: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    marginBottom: 10,
  },
  feature: {
    flex: 1,
    backgroundColor: '#0080ff',
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centered_view: {
    flex: 1,
    backgroundColor: '#00000099',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell_modal: {
    height: 200,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  bell_body: {
    height: 150,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bell_body_text: {
    fontSize: 20,
    color: '#0A080D'
  },
  remind_textInput: {
    height: 50,
    width: 50,
    borderRadius: 10,
    borderColor: '#1D1827',
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 20,
    justifyContent: 'center',
  },
  bell_buttons: {
    flexDirection: 'row',
    flex: 1,
    borderTopColor: '#1D1827',
    borderTopWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bell_cancel_button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRightColor: '#1D1827',
    borderRightWidth: 2,
    borderBottomLeftRadius: 20,
  },
  bell_ok_button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomRightRadius: 20,
  },
  bell_button_text: {
    fontSize: 20,
    color: '#1D1827',
  },
  image_View: {
    height: 220,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  image: {
    height: 220,
    width: '70%',
    borderRadius: 20,
  },
  trash_area: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 70,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000068',
    borderRadius: 8,
  },
  checkBox: {
    flexDirection: 'row',
    height:40 ,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
})