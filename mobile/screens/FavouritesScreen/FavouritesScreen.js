import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'

const FavouritesScreen = () => {
  return (
    <View>
      <Header 
          title='Favourites'
        />
      <Text>FavouriteScreen</Text>
    </View>
  )
}

export default FavouritesScreen

const styles = StyleSheet.create({})