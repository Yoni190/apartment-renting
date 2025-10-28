import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { BadgeQuestionMark, History, Lock, LogOut, Settings, UserPen, X, AlertTriangle } from 'lucide-react-native'
import styles from './ProfileScreenStyle'

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;
    
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token")
      .then(() => navigation.replace("Login"))
      .catch(err => console.error(err))
  }

  const handleHelp = async () => {
    const url = `${WEB_URL}/help`
    const supported = await Linking.canOpenURL(url)

    if(supported) {
        await Linking.openURL(url)
    } else {
        console.error("Error opening: " + url)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const access_token = await SecureStore.getItemAsync("token")
      if (!access_token) navigation.replace("Login")

      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`
          }
        })
        setUser(response.data)
      } catch (error) {
        console.log(error)
        navigation.navigate("Login")
      }
    }
    getUser()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: user?.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user ? user.name : 'Loading...'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Profile Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <UserPen />
            <Text style={styles.label}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <History />
            <Text style={styles.label}>Order History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Settings />
            <Text style={styles.label}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Lock />
            <Text style={styles.label}>Privacy</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Help & Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={handleHelp}>
            <BadgeQuestionMark />
            <Text style={styles.label}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { backgroundColor: '#ffecec' }]}
            onPress={() => setShowModal(true)}
          >
            <LogOut color="#e63946" />
            <Text style={[styles.label, { color: '#e63946', fontWeight: '600' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AlertTriangle color="#e63946" size={40} />
              <Text style={styles.modalTitle}>Log Out?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to log out from your account?
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#eee' }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={{ color: '#333', fontWeight: '500' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#e63946' }]}
                onPress={handleLogout}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ProfileScreen
