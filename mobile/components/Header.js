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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#9fc5f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginLeft: '15%'
  },
  logo: {
    width: 100,
    height: 100
  }
})
