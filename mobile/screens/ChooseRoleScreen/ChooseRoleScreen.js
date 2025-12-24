import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ArrowRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import styles from './ChooseRoleScreenStyle'

const ChooseRoleScreen = () => {
    const navigation = useNavigation()

  const handleApartment = () => {
  // navigate to the shared Login screen but indicate role = 0 (property owner)
  navigation.navigate('Login', { role: 0 })
  }

  const handleRenter = () => {
  // navigate to Login with role = 1 (client/renter)
  navigation.navigate('Login', { role: 1 })
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={handleApartment}>
        <Text>Continue as Property Owner</Text>
        <ArrowRight />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleRenter}>
        <Text>Continue as Client</Text>
        <ArrowRight />
      </TouchableOpacity>
    </View>
  )
}

export default ChooseRoleScreen