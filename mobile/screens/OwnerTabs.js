import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeForPO from './HomeForPO/HomeForPO'
import AddListing from './AddListing/AddListing'
import SearchScreen from './SearchScreen/SearchScreen'
import MessagesScreen from './MessagesScreen/MessagesScreen'
import ProfileScreen from './ProfileScreen/ProfileScreen'

const Tab = createBottomTabNavigator()

const OwnerTabs = () => {
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
        name="OwnerHome"
        component={HomeForPO}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} />
          )
        }}
      />

      <Tab.Screen
        name="OwnerAdd"
        component={AddListing}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={28} />
          )
        }}
      />

      <Tab.Screen
        name="OwnerSearch"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} />
          )
        }}
      />

      <Tab.Screen
        name="OwnerMessages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={24} />
          )
        }}
      />

      <Tab.Screen
        name="OwnerProfile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default OwnerTabs
