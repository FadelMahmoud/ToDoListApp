import { FlatList, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace'
import { forHorizontalIOS } from 'react-navigation-stack/lib/typescript/src/vendor/TransitionConfigs/CardStyleInterpolators'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks, setTaskId } from '../src/redux/actions';
import taskReducer from '../src/redux/reducers';
import CheckBox from '@react-native-community/checkbox';

export default function ToDo( {navigation} ) {

  const { tasks } = useSelector( state => state.taskReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    getTasks();
  }, [] )

  const getTasks = () => {
    AsyncStorage.getItem('Tasks')
      .then( tasks => { {
          const parsedTasks = JSON.parse(tasks);
          if ( parsedTasks && typeof parsedTasks === 'object'){
              dispatch( setTasks( parsedTasks ));
          }
        }
      })
      .catch(err =>  console.log(err))
    
  }

  const deleteTask = ( id ) => {
    const filteredTasks = tasks.filter( task => task.id !== id );
    AsyncStorage.setItem( 'Tasks', JSON.stringify ( filteredTasks ) )
    .then( () => {
      dispatch ( setTasks ( filteredTasks ) );
      Alert.alert('Success!!!', 'Task removed successfully');
    }).catch(err => console.log (err))
  }

  const addTaskHandler = () => {
    dispatch( setTaskId(tasks.length + 1 ));
    navigation.navigate('Task');
  }

  const updateCheckBox = ( id , newValue ) => {
    const index = tasks.findIndex( task => task.id === id );
    if ( index > -1 )
        {
          let newTasks = [...tasks];
          newTasks[index].Done = newValue;

          AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(() => {
          dispatch(setTasks(newTasks));
          Alert.alert('Success!!!', 'Task state changed successfully');
        })
        .catch ( err => console.log(err));
        }

  }

  return (
    <View style={styles.body}>

      <View style={styles.rowItem}>
        <FlatList 
          data={tasks.filter( task => task.Done === false )}
          renderItem={ ({item}) => (

            <Pressable style={styles.taskInfo} 
              onPress={ () => {
                dispatch( setTaskId( item.id ) );
                navigation.navigate('Task');
              }}>

              <View style={[ styles.color, {backgroundColor:item.color} ]}>  
              </View>

              <View style={styles.checkBox}>
              <CheckBox
                  value={item.Done}
                  onValueChange={ (newValue) => updateCheckBox( item.id, newValue )}
                />
              </View>

              <View style={styles.textSection}>
                <Text 
                  style={styles.title}
                  numberOfLines={1}
                  >
                    {item.title}
                </Text>
                <Text 
                  style={styles.description}
                  numberOfLines={1}
                  >
                    {item.description}
                  </Text>
              </View>

              <TouchableOpacity 
                style={styles.image}
                onPress={() => deleteTask( item.id ) }
              >
                <FontAwesome5 
                  name='trash'
                  color= '#eb240a'
                  size={26} />
              </TouchableOpacity>

            </Pressable>
          )}
          keyExtractor={ ( item, index ) => index.toString() }
        />
      
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={addTaskHandler}
        >
          <FontAwesome5
          name= 'plus'
          size={25}
          color='#fff'/>
        </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 0,
    backgroundColor: '#dfdce3'
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#0080ff',
    borderRadius: 30,
    position: 'absolute',
    right: 10,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  rowItem: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 5,
  },
  taskInfo: {
    flex: 1,
    height: 80,
    marginBottom: 15,
    flexDirection: 'row',
    backgroundColor: '#ffff',
    borderRadius: 10,
  },
  color: { 
    width: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  checkBox: {
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: 10,
  },
  textSection: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
  },
  title: {
    width: '95%',
    fontFamily: 'Courgette-Regular',
    fontSize: 23,
    fontWeight: 'bold',
  },
  description: {
    width: '95%',
    fontFamily: 'Barlow-ExtraLight',
    fontSize: 16,
    color: '#928fe8',
  },
  image: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  }

})