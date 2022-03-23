import { Alert, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks , setTaskFirstImage } from '../src/redux/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';;
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Camera( { navigation , route }) {

    const [{ cameraRef } , { takePicture }] = useCamera(null);
    const { tasks , taskFirstImage } = useSelector( state => state.taskReducer);
    const dispatch = useDispatch();

    const captureHandle = async () => {
        try {
            const data = await takePicture();
            const filePath = data.uri;
            updateTask( route.params.id , filePath); 
        } catch (error) {
            console.log( error);
        }
    }

    const updateTask = ( id , path) => {
        const index = tasks.findIndex( task => task.id === id);
        if ( index > -1 ){
            let newTasks = [...tasks];
            newTasks[index].Image = path;
            AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
            .then( () => {
                dispatch( setTasks(newTasks));
                Alert.alert('Success!', 'Task image is saved');
                navigation.goBack();
            })
            .catch ( err => console.log(err) )
        }else {
            dispatch( setTaskFirstImage(path));
            navigation.goBack();
            Alert.alert('Success!', 'Task image is saved');
            console.log( path);
        }

    }

  return (
    <View style={styles.body}>
        <RNCamera
            ref={cameraRef}
            type={RNCamera.Constants.Type.back}
            style={styles.preview}
        >
            <TouchableOpacity
                style={styles.captue}
                onPress={() => captureHandle() }
            >
                <Text> Capture </Text>
            </TouchableOpacity>

        </RNCamera>
    </View>
  )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    preview: {
        flex: 1,
        alignItems: 'center',
    },
    captue: {
        position: 'absolute',
        height: 50,
        width: 150,
        backgroundColor: '#3fc72a',
        bottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    }
})