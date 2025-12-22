import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Building2, User } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import styles from './ChooseRoleScreenStyle'
import Header from '../../components/Header'

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

<<<<<<< Updated upstream
=======
  
>>>>>>> Stashed changes
  return (
    <View style={styles.container}>
      <Header title="Gojoye" />

      <Text style={styles.screenTitle}>Choose Your Role</Text>

      {/* Property Owner Card */}
<<<<<<< Updated upstream
      <TouchableOpacity style={styles.card} onPress={handleApartment}>
=======
      <TouchableOpacity style={styles.card}>
>>>>>>> Stashed changes
        <View style={styles.iconCircle}>
          <Building2 size={32} color="#000" />
        </View>
        <Text style={styles.cardTitle}>Property Owner</Text>
        <Text style={styles.cardDesc}>
          List your property and find reliable tenants
        </Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Client Card */}
<<<<<<< Updated upstream
      <TouchableOpacity style={styles.card} onPress={handleRenter}>
=======
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Login')}
      >
>>>>>>> Stashed changes
        <View style={styles.iconCircle}>
          <User size={32} color="#000" />
        </View>
        <Text style={styles.cardTitle}>Client</Text>
        <Text style={styles.cardDesc}>
          Find your dream apartment with ease
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ChooseRoleScreen
