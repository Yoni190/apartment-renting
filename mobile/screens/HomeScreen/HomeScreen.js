import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './HomeScreenStyle'
import { Ionicons } from '@expo/vector-icons'
import Header from '../../components/Header'
import { SlidersHorizontal, ToolCase } from 'lucide-react-native'
import ListingCard from '../../components/ListingCard'

const HomeScreen = () => {
    const [user, setUser] = useState(null)
    const [apartments, setApartments] = useState([])

    const navigation = useNavigation()

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const dummy_recommendations = [
      {
        name: 'Villa',
        location: 'CMC',
        price: '90,000 Birr'
      },
      {
        name: 'ANother Villa',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Villa Sui',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Villa Si',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Vi Sui',
        location: 'Summit',
        price: '50,000 Birr'
      },
      {
        name: 'ANother Vila Si',
        location: 'Summit',
        price: '50,000 Birr'
      },
    ]


    useEffect(() => {
      const getApartments = async () => {
        try {
          const token = await SecureStore.getItemAsync('token')
          const response = await axios.get(`${API_URL}/apartment-list`, {
            headers: {
              Accept: 'application/json',
              Authorization: token ? `Bearer ${token}` : undefined
            }
          })

          setApartments(response.data || [])
        } catch (error) {
          console.log(error)
        }
      }

      getApartments()
    }, [])
    
    

    useEffect(() => {
      const getUser = async () => {
        const access_token = await SecureStore.getItemAsync("token")
        if(!access_token) navigation.replace('Login')

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


    const navigateToDetails = () => {
      navigation.navigate("ApartmentDetails")
    }
    
    const toggleFavorite = (title) => {
      // naive favorite toggle by title for demo; replace with persistent store
      setApartments(prev => prev.map(a => a.title === title ? { ...a, fav: !a.fav } : a))
    }

    const openContacts = (apartment) => {
      Alert.alert('Contact', apartment.contact_phone ?? 'No contact')
    }

    const openMessage = (apartment) => {
      navigation.navigate('Messages')
    }

    // ListingCard handlers used by the card component
    const handleSave = async (apartment) => {
      try {
        const token = await SecureStore.getItemAsync('token')
        if (!token) {
          Alert.alert('Error', 'Please log in to save favorites')
          return
        }
        
        await axios.post(`${API_URL}/apartments/${apartment.id}/favorite`, {}, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        
        setApartments(prev => prev.map(a => a.id === apartment.id ? { ...a, fav: true, is_favorite: true } : a))
      } catch (error) {
        console.warn('Failed to save favorite', error)
        Alert.alert('Error', 'Failed to save favorite')
      }
    }

    const handleUnsave = async (apartment) => {
      try {
        const token = await SecureStore.getItemAsync('token')
        if (!token) return
        
        await axios.delete(`${API_URL}/apartments/${apartment.id}/favorite`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        
        setApartments(prev => prev.map(a => a.id === apartment.id ? { ...a, fav: false, is_favorite: false } : a))
      } catch (error) {
        console.warn('Failed to unsave favorite', error)
        Alert.alert('Error', 'Failed to remove favorite')
      }
    }

    const handleMessage = (apartment) => openMessage(apartment)

    const handleCall = (phone) => {
      // For mobile: use Linking.openURL(`tel:${phone}`) in production
      Alert.alert('Call', phone ?? 'No phone number')
    }

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header 
          title='Home'
        />
      <ScrollView showsVerticalScrollIndicator={false}> 
        
        <Text style={styles.title}>Recommended</Text>
        <ScrollView 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.recommendationsContainer} 
          horizontal={true}
          >
          {dummy_recommendations.map((dummy) => 
            <TouchableOpacity 
              style={styles.recommendations} 
              key={dummy.name} 
              activeOpacity={0.8}
              onPress={navigateToDetails}>
              {/* Top Part */}
              <View>
                <Image 
                  source={require('../../assets/apartment_dummy.jpeg')}
                  resizeMode='cover'
                  style={styles.recommendationsImage}
                />
              </View>
              {/* Bottom Part */}
              <View>
                <Text style={styles.apartmentTitle}>{dummy.name}</Text>
                <View style={styles.apartmentInfo}>
                  <Text style={styles.location}>{dummy.location}</Text>
                  <Text>{dummy.price}</Text>
                </View>
              </View>
              
            </TouchableOpacity>
          )}
        </ScrollView>
        
        <Text style={styles.title}>Apartments</Text>

        {/* Show listings using ListingCard only */}
        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
          {apartments.map((a) => {
            const images = (a.images || []).map(img => img.url || (img.path ? `${API_URL}/storage/${img.path}` : null)).filter(Boolean)
            const meta = a.meta || {}

            return (
              <ListingCard
                key={a.id}
                images={images.length ? images : undefined}
                hasVideo={!!meta.hasVideo}
                hasVirtualTour={!!meta.hasVirtualTour}
                priceRange={meta.price_range || a.price || undefined}
                bedroomRange={meta.bedroom_range || (a.bedrooms ? `${a.bedrooms} Beds` : undefined)}
                title={a.title || undefined}
                address={a.address || (meta.location ? `${meta.location.area ?? ''} ${meta.location.city ?? ''}` : undefined)}
                amenities={meta.amenities || undefined}
                phoneEnabled={!!meta.allow_phone}
                contactPhone={meta.contact_phone || a.contact_phone || undefined}
                saved={a.is_favorite || a.fav || false}
                onSave={() => handleSave(a)}
                onUnsave={() => handleUnsave(a)}
                onMessage={() => openMessage(a)}
                onCall={(phone) => openContacts(a)}
                onPress={() => navigation.navigate('ApartmentDetails', { listingId: a.id })}
              />
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

