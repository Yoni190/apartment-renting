import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Header from '../../components/Header'

const FavouritesScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Favourites" />

      <View style={styles.emptyState}>
        
        {/* Circle Background */}
        <View style={styles.circle}>
          <Image 
            source={require('../../assets/logo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>You have no favourites</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Tap the heart icon on any{"\n"}
          property to add it to favourites
        </Text>

      </View>
    </View>
  )
}

export default FavouritesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: -50, // to visually match the sketch proportions
  },

  circle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: '#edfbff', // soft light blue like the sketch
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  icon: {
    width: 275,
    height: 275,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
})
