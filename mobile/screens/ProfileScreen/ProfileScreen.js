import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { BadgeQuestionMark, History, Lock, LogOut, Settings, UserPen, X, AlertTriangle } from 'lucide-react-native'
import styles from './ProfileScreenStyle'
import Header from '../../components/Header'
import i18n from '../../i18n'
import { Picker } from '@react-native-picker/picker'

const LANGUAGE_KEY = 'appLanguage'

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentLang, setCurrentLang] = useState(i18n.language)

  const [selectedLanguage, setSelectedLanguage] = useState(currentLang);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token")
      .then(() => navigation.replace("Gojoye"))
      .catch(err => console.error(err))
  }

  const changeLanguage = async (lang) => {
    i18n.changeLanguage(lang)
    setCurrentLang(lang)
    await SecureStore.setItemAsync(LANGUAGE_KEY, lang)
  }

  useEffect(() => {
    const getUser = async () => {
      const access_token = await SecureStore.getItemAsync("token")
      if (!access_token) navigation.replace("Login")

      try {
        const response = await axios.get(`${API_URL}/api/user`, {
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

    const getLanguage = async () => {
      const lang = await SecureStore.getItemAsync(LANGUAGE_KEY)
      if (lang && lang !== currentLang) {
        changeLanguage(lang)
      }
    }

    getUser()
    getLanguage()
  }, [])

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <Header title={i18n.t('profile')} />

    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Profile Top */}
      <View style={styles.profileTop}>
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Box (Edit Profile / History / Settings) */}
      <View style={styles.box}>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("EditProfile")}>
          <UserPen size={20} color="#333" />
          <Text style={styles.rowText}>{i18n.t('editProfile')}</Text>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <History size={20} color="#333" />
          <Text style={styles.rowText}>{i18n.t('history')}</Text>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Settings size={20} color="#333" />
          <Text style={styles.rowText}>{i18n.t('settings')}</Text>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selection */}
      <View style={styles.box}>
        <Text style={[styles.rowText, { fontWeight: '600', marginBottom: 10 }]}>
          {i18n.t('chooseLanguage')}
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={async (itemValue) => {
              setSelectedLanguage(itemValue);
              await changeLanguage(itemValue);
            }}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="ኣማርኛ" value="am" />
            <Picker.Item label="ትግርኛ" value="tg" />
          </Picker>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => setShowModal(true)}
      >
        <LogOut size={18} color="#d00000" style={{ marginRight: 6 }} />
        <Text style={styles.logoutText}>{i18n.t('logout')}</Text>
      </TouchableOpacity>

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
              <Text style={styles.modalTitle}>{i18n.t('logout')}?</Text>
              <Text style={styles.modalMessage}>
                {i18n.t('logoutConfirmation')}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#eee' }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={{ color: '#333', fontWeight: '500' }}>{i18n.t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#e63946' }]}
                onPress={handleLogout}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>{i18n.t('logout')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  </SafeAreaView>
);
}

export default ProfileScreen
