import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons' // optional icons
import LoginScreen from './LoginScreen/LoginScreen'
import RegisterScreen from './RegisterScreen/RegisterScreen'
import ProfileScreen from './ProfileScreen/ProfileScreen'
import HomeScreen from './HomeScreen/HomeScreen'
import RequestedToursScreen from './RequestedToursScreen/RequestedToursScreen'
import MessagesScreen from './MessagesScreen/MessagesScreen'
import FavouritesScreen from './FavouritesScreen/FavouritesScreen'
import SearchScreen from './SearchScreen/SearchScreen'

const Tab = createBottomTabNavigator()

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#9fc5f8',
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Requested Tours" 
        component={RequestedToursScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? 'calendar' : 'calendar-outline'} 
              size={24} 
            />
          )
        }}
      />

      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? 'search' : 'search-outline'} 
              size={24} 
            />
          )
        }}
      />

      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? 'chatbubble' : 'chatbubble-outline'} 
              size={24}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Favourites" 
        component={FavouritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? 'heart' : 'heart-outline'} 
              size={24}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24}
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeTabs
