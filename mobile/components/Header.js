// components/Header.js
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default Header


const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#9fc5f8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    position: 'absolute',
    left: 15,
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
})
