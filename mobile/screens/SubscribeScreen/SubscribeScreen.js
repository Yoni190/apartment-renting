import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CheckCircle } from 'lucide-react-native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { colors, spacing, radius } from '../../theme'
import styles from './SubscribeScreenStyle'
import i18n from '../../i18n'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'

const SubscribeScreen = () => {
  const navigation = useNavigation()
  const API_URL = process.env.EXPO_PUBLIC_API_URL

  const handleSubscribe = async (amount, plan_type) => {
    try {
      const token = await SecureStore.getItemAsync('token')

      await axios.post(
        `${API_URL}/api/pay`,
        { amount, plan_type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      )

      navigation.goBack()
    } catch (error) {
      console.log(error)
    }
  }

  const PlanCard = ({ title, price, features, buttonText, onPress, buttonColor }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}</Text>

      <View style={styles.featureList}>
        {features.map((item, index) => (
          <View key={index} style={styles.featureRow}>
            <CheckCircle size={18} color={colors.success} />
            <Text style={styles.featureText}>{item}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title={i18n.t('subscribeNow')} />

      <ScrollView
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          marginBottom: spacing.md,
          color: colors.textPrimary
        }}>
          {i18n.t('choose_plan')}
        </Text>

        {/* BASIC */}
        <PlanCard
          title={i18n.t('basic_plan')}
          price={i18n.t('basic_plan_price')}
          features={[
            i18n.t('basic_plan_feature_1'),
            i18n.t('basic_plan_feature_2'),
            i18n.t('basic_plan_feature_3'),
          ]}
          buttonText={i18n.t('subscribe_to_basic')}
          buttonColor="#2563eb"
          onPress={() => handleSubscribe(2000, 'basic')}
        />

        {/* PREMIUM */}
        <PlanCard
          title={i18n.t('premium_plan')}
          price={i18n.t('premium_plan_price')}
          features={[
            i18n.t('premium_plan_feature_1'),
            i18n.t('premium_plan_feature_2'),
            i18n.t('premium_plan_feature_3'),
          ]}
          buttonText={i18n.t('subscribe_to_premium')}
          buttonColor="#16a34a"
          onPress={() => handleSubscribe(5000, 'premium')}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default SubscribeScreen