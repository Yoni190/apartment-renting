import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'

const MessagesScreen = () => {
  return (
    <View>
        <Header 
          title='Messages'
        />
      <Text>MessagesScreen</Text>
    </View>
  )
}

export default MessagesScreen

const styles = StyleSheet.create({})