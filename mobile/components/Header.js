// components/Header.js
import React from 'react'
import { Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography } from '../theme'

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: colors.navBg,
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
    top: 36,
    left: 16,
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },

  logoShort: {
    top: 18,
    width: 36,
    height: 36,
  },

  title: {
    ...typography.h4,
    color: colors.white,
  },

  titleShort: {
    fontSize: 16,
  },
})
