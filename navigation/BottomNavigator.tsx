import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import CRUDScreen from '../screens/CRUDScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#FFE4F2', height: 90, paddingBottom: 10, paddingTop: 10, borderTopLeftRadius: 25, borderTopRightRadius: 25, borderColor: '#DAB88B', borderWidth: 1 },
        tabBarActiveTintColor: '#C27BA0',
        tabBarInactiveTintColor: '#FFB3D9',
        tabBarLabelStyle: { fontSize: 12, marginTop: 4 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'CRUD') {
            iconName = 'addfile';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Schedule') {
            iconName = 'table';
            return <AntDesign name={iconName} size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CRUD" component={CRUDScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
