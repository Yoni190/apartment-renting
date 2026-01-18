import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import styles from './SearchScreenStyle'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'


const SearchScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
      {/* Add top padding so the absolute-positioned Header doesn't cover content */}
      <Header 
          title='Search'
        />
      <ScrollView showsVerticalScrollIndicator={false}> 
        <Text>SearchScreen</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SearchScreen