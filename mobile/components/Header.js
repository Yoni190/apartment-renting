// components/Header.js
import React from 'react'
import { Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Header = ({ title }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>{title}</Text>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    position: 'absolute',   // 🔑 STICK IT
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: '#9fc5f8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  logo: {
    position: 'absolute',
    top: 30,
    left: 15,
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
})
