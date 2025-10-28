import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ArrowRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

const ChooseRoleScreen = () => {
    const navigation = useNavigation()

    const handleApartment = () => {
        navigation.navigate('Login')
    }

    const handleRenter = () => {
        console.log("Renter")
    }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={handleApartment}>
        <Text>Continue as Apartment Owner</Text>
        <ArrowRight />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleRenter}>
        <Text>Continue as Renter</Text>
        <ArrowRight />
      </TouchableOpacity>
    </View>
  )
}

export default ChooseRoleScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 12,
        marginTop: 100
    },
    btn: {
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})