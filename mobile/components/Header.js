// components/Header.js
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
})
