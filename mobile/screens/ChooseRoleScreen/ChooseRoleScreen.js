import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Building2, User, Globe } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import styles from './ChooseRoleScreenStyle'
import Header from '../../components/Header'

const ChooseRoleScreen = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)

    const changeLanguage = async (lang) => {
      setLanguage(lang)
      await i18n.changeLanguage(lang)
    }


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
      <Header title="Gojoye" />
      {/* 🌍 Language Selector */}
      <View style={styles.languageWrapper}>
        <Globe size={18} color="#555" />
        <Picker
          selectedValue={language}
          style={styles.languagePicker}
          onValueChange={(value) => changeLanguage(value)}
          dropdownIconColor="#555"
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="አማርኛ" value="am" />
          <Picker.Item label="ትግርኛ" value="tg" />
        </Picker>
      </View>

      <Text style={styles.screenTitle}>{t('chooseYourRole')}</Text>

      {/* Property Owner Card */}
      <TouchableOpacity style={styles.card} onPress={handleApartment}>
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
      <TouchableOpacity style={styles.card} onPress={handleRenter}>
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
