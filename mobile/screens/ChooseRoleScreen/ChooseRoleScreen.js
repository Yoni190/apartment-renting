import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ArrowRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import styles from './ChooseRoleScreenStyle'

const ChooseRoleScreen = () => {
    const navigation = useNavigation()

    const handleApartment = () => {
        console.log("Owner")
    }

    const handleRenter = () => {
        navigation.navigate('Login')
    }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={handleApartment}>
        <Text>Continue as Property Owner</Text>
        <ArrowRight />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleRenter}>
        <Text>Continue as Tenant</Text>
        <ArrowRight />
      </TouchableOpacity>
    </View>
  )
}

export default ChooseRoleScreen