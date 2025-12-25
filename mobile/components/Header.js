// components/Header.js
import React from 'react'
import { Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Header = ({ title, short }) => {
  return (
    <SafeAreaView edges={['top']} style={[styles.header, short ? styles.headerShort : null]}>
      <Image
        source={require('../assets/logo.png')}
        style={[styles.logo, short ? styles.logoShort : null]}
      />
      <Text style={[styles.title, short ? styles.titleShort : null]}>{title}</Text>
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
    height: 90,
    backgroundColor: '#9fc5f8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  headerShort: {
    height: 64,
    paddingTop: 6,
  },

  logo: {
    position: 'absolute',
    top: 30,
    left: 15,
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },

  logoShort: {
    top: 12,
    width: 44,
    height: 44,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  titleShort: {
    fontSize: 16,
  },
})
