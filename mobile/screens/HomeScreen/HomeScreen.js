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
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
      location: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      property_type: '',
      furnished: ''
    })

    const navigation = useNavigation()

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    // NOTE: Home now fetches recommendations from the backend. No dummy data here.


    // Fetch recommendations (default: no filters) on mount
    useEffect(() => {
      fetchRecommendations({})
    }, [])

    const fetchRecommendations = async (q = {}) => {
      setLoading(true)
      try {
        const token = await SecureStore.getItemAsync('token')
        const response = await axios.get(`${API_URL}/recommendations`, {
          params: q,
          headers: {
            Accept: 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined
          }
        })

        setApartments(response.data || [])
      } catch (error) {
        console.log('Failed to fetch recommendations', error)
        setApartments([])
      } finally {
        setLoading(false)
      }
    }
    
    

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

    const onSearchSubmit = () => {
      // perform search by calling recommendations with location (and any shown filters)
      const q = { ...filters }
      if (searchText) q.location = searchText
      // remove empty keys
      Object.keys(q).forEach(k => { if (q[k] === '' || q[k] === null || typeof q[k] === 'undefined') delete q[k] })
      fetchRecommendations(q)
    }

    const onClearFilters = () => {
      setSearchText('')
      setFilters({ location: '', min_price: '', max_price: '', bedrooms: '', property_type: '', furnished: '' })
      fetchRecommendations({})
    }

    return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 100 }}>
      {/* Add top padding so the absolute-positioned Header doesn't cover content */}
      <Header 
          title='Home'
        />
      <ScrollView showsVerticalScrollIndicator={false}> 
        
        {/* Search + Filters (Home only) */}
        <View style={{ paddingHorizontal: 12, paddingTop: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            placeholder="Search location..."
            placeholderTextColor="#999"
            style={styles.textInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearchSubmit}
          />
          <TouchableOpacity onPress={() => setShowFilters(v => !v)} style={{ marginLeft: 8, padding: 10, backgroundColor: '#eee', borderRadius: 8 }}>
            <Text>Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSearchSubmit} style={{ marginLeft: 8, padding: 10, backgroundColor: '#9fc5f8', borderRadius: 8 }}>
            <Text style={{ color: 'white' }}>Search</Text>
          </TouchableOpacity>
        </View>

        {showFilters ? (
          <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput placeholder="Min price" value={filters.min_price} onChangeText={(v) => setFilters(f => ({ ...f, min_price: v }))} style={[styles.textInput, { flex: 1 }]} />
              <TextInput placeholder="Max price" value={filters.max_price} onChangeText={(v) => setFilters(f => ({ ...f, max_price: v }))} style={[styles.textInput, { flex: 1 }]} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
              <TextInput placeholder="Bedrooms" value={filters.bedrooms} onChangeText={(v) => setFilters(f => ({ ...f, bedrooms: v }))} style={[styles.textInput, { flex: 1 }]} />
              <TextInput placeholder="Property type" value={filters.property_type} onChangeText={(v) => setFilters(f => ({ ...f, property_type: v }))} style={[styles.textInput, { flex: 1 }]} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
              <TextInput placeholder="Furnished (yes/no)" value={filters.furnished} onChangeText={(v) => setFilters(f => ({ ...f, furnished: v }))} style={[styles.textInput, { flex: 1 }]} />
              <TouchableOpacity onPress={onClearFilters} style={{ marginLeft: 8, padding: 10, backgroundColor: '#eee', borderRadius: 8 }}>
                <Text>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <Text style={styles.title}>Recommended</Text>

        <ScrollView 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.recommendationsContainer} 
          horizontal={true}
          >
          {/* show top 6 recommended thumbnails */}
          {apartments.slice(0,6).map((a) => (
            <TouchableOpacity 
              style={styles.recommendations} 
              key={a.id} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ApartmentDetails', { listingId: a.id })}>
              <View>
                { (a.images || []).length ? (
                  <Image 
                    source={{ uri: (a.images[0].url || (a.images[0].path ? `${API_URL}/storage/${a.images[0].path}` : null)) }}
                    resizeMode='cover'
                    style={styles.recommendationsImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}><Text>No image</Text></View>
                )}
              </View>
              <View>
                <Text style={styles.apartmentTitle}>{a.title}</Text>
                <View style={styles.apartmentInfo}>
                  <Text style={styles.location}>{a.address || (a.meta?.location?.city ?? '')}</Text>
                  <Text>{a.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.title}>Apartments</Text>

        {/* Show listings using ListingCard only */}
        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
          {loading ? (
            <View style={{ padding: 40 }}>
              <Text>Loading...</Text>
            </View>
          ) : apartments.length === 0 ? (
            <View style={{ padding: 40 }}>
              <Text>No listings found</Text>
            </View>
          ) : (
            apartments.map((a) => {
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
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

