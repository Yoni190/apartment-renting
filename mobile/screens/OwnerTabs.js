import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeForPO from './HomeForPO/HomeForPO'
import AddListing from './AddListing/AddListing'
import OwnerTours from './TourScreen/TourScreen'
import MessagesScreen from './MessagesScreen/MessagesScreen'
import MessageListScreen from './MessageListScreen/MessageListScreen'
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
        name="OwnerHomeTab"
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
        name="OwnerRequestedTours"
        component={OwnerTours}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} />
          )
        }}
      />

      <Tab.Screen
        name="OwnerMessages"
        component={MessageListScreen}
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
