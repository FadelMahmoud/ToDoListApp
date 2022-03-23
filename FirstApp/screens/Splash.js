/* eslint-disable prettier/prettier */
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PushNotification from 'react-native-push-notification';

export default function Splash( {navigation} ) {

  useEffect(() => {
    createChannels();

    setTimeout(() => {
      navigation.navigate('MyTasks');
    }, 2000);
  });

  const createChannels = () => {
    PushNotification.createChannel(
      {
        channelId: "task-channel",
        channelName: "Task Channel"
      }
    )
  }

  return (
    <View style={styles.body}>

      <View style={styles.image}>
        <Image source={require('.././assets/images/Logo.png')} 
        resizeMode='stretch'
        />
      </View>

      <View>
        <Text style={styles.title}> To Do App </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
    title: {
        color : '#D04F49',
        fontSize: 35,
        fontWeight: 'bold',
    },
    body: {
      flex: 1,
      backgroundColor: '#39C5C5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      margin: 10,
    }
});