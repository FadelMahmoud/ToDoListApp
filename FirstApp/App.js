/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Provider } from 'react-redux';
import { Store } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Splash from './screens/Splash';
import ToDo from './screens/ToDo';
import Done from './screens/Done';
import Task from './screens/Task';
import Camera from './screens/Camera';

const Tap = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTaps(){
  return(
    <Tap.Navigator
    screenOptions={
      ({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if ( route.name === 'ToDo') {
            iconName = 'clipboard-list';
            size = focused ? 25 : 20;
          } else if ( route.name === 'Done' ){
            iconName = 'clipboard-check';
            size = focused ? 25 : 20;
          }
          return (
            <FontAwesome5 
              name={iconName}
              size={size}
              color={color} />
          );
        }
      })
    }

    tabBarOptions= {{
      activeTintColor: '#39C5C5',
      inactiveTintColor: '#777',
      labelStyle: { fontSize: 15, fontWeight: 'bold' }
    }}
    
    >

        <Tap.Screen name={'ToDo'} component={ToDo} 
            options={{
              headerShown: false,
          }} />
        <Tap.Screen name={'Done'} component={Done}
            options={{
              headerShown: false,
        }} />
    </Tap.Navigator>
  )
}

function App() {
  
  return (
    <Provider store={ Store }>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#39C5C5',
            },
            headerTintColor: '#fff'
          }}
        > 

          <Stack.Screen name="Splash" component={Splash} 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="MyTasks" component={HomeTaps} />
          <Stack.Screen name="Task" component={Task} />
          <Stack.Screen name="Camera" component={Camera} />
          
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
  );
}



export default App;
