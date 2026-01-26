import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import { useTranslation } from 'react-i18next'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import ListingCard from '../../components/ListingCard'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

const FavouritesScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFavorites = async () => {
    setLoading(true)
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) {
        setFavorites([])
        setLoading(false)
        return
      }

      const response = await axios.get(`${API_URL}/favorites`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      setFavorites(response.data || [])
    } catch (error) {
      console.warn('Failed to load favorites', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadFavorites()
    }, [])
  )

  const handleSave = async (apartment) => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) return
      
      await axios.post(`${API_URL}/apartments/${apartment.id}/favorite`, {}, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      })
      loadFavorites()
    } catch (error) {
      console.warn('Failed to save favorite', error)
    }
  }

  const handleUnsave = async (apartment) => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) return
      
      await axios.delete(`${API_URL}/apartments/${apartment.id}/favorite`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      })
      loadFavorites()
    } catch (error) {
      console.warn('Failed to unsave favorite', error)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={t("favourites")} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={t("favourites")} />
        <View style={styles.emptyState}>
          {/* Circle Background */}
          <View style={styles.circle}>
            <Image 
              source={require('../../assets/logo.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{t("you_have_no_favourites")}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {t('favouritesSubtitle')}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t("favourites")} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listingsContainer}>
          {favorites.map((apartment) => {
            const images = (apartment.images || []).map(img => 
              img.url || (img.path ? `${API_URL}/storage/${img.path}` : null)
            ).filter(Boolean)
            const meta = apartment.meta || {}

            return (
              <ListingCard
                key={apartment.id}
                images={images.length ? images : undefined}
                hasVideo={!!meta.hasVideo}
                hasVirtualTour={!!meta.hasVirtualTour}
                priceRange={meta.price_range || apartment.price || undefined}
                bedroomRange={meta.bedroom_range || (apartment.bedrooms ? `${apartment.bedrooms} Beds` : undefined)}
                title={apartment.title || undefined}
                address={apartment.address || (meta.location ? `${meta.location.area ?? ''} ${meta.location.city ?? ''}` : undefined)}
                amenities={meta.amenities || undefined}
                phoneEnabled={!!meta.allow_phone}
                contactPhone={meta.contact_phone || apartment.contact_phone || undefined}
                saved={true}
                onSave={() => handleSave(apartment)}
                onUnsave={() => handleUnsave(apartment)}
                onMessage={() => navigation.navigate('Messages', { apartmentId: apartment.id })}
                onCall={(phone) => {
                  if (phone) {
                    const phoneUrl = `tel:${phone}`
                    Linking.openURL(phoneUrl).catch(() => {})
                  }
                }}
                onPress={() => navigation.navigate('ApartmentDetails', { listingId: apartment.id })}
              />
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FavouritesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // ensure Header (absolute) does not cover content
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  listingsContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: -50,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: '#edfbff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    width: 275,
    height: 275,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
})
