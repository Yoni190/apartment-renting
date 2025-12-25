import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Header from '../../components/Header'
import styles from './ApartmentDetailsStyle'

const { width } = Dimensions.get('window')
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'

/**
 * ApartmentDetails (ListingDetails)
 * - Expects route.params.listingId
 * - Fetches `/apartments/{id}` and renders only owner-provided fields.
 */
export default function ApartmentDetails() {
  const route = useRoute()
  const navigation = useNavigation()
  const listingId = route.params?.listingId || route.params?.id

  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState(null)
  const [user, setUser] = useState(null)
  const [owner, setOwner] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [isFavourite, setIsFavourite] = useState(false)
  const [favouriteLoading, setFavouriteLoading] = useState(false)
  const flatListRef = useRef(null)

  useEffect(() => {
    if (!listingId) return

    const load = async () => {
      setLoading(true)
      try {
        const token = await SecureStore.getItemAsync('token')

        // fetch listing
        const res = await axios.get(`${API_URL}/apartments/${listingId}`, {
          headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
        })
        setListing(res.data)
        setIsFavourite(res.data.is_favorite || false)

        // Owner data should be included in the listing response
        if (res.data.owner) {
          setOwner(res.data.owner)
        }

        // fetch user if token available (to determine owner controls)
        if (token) {
          try {
            const u = await axios.get(`${API_URL}/user`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
            setUser(u.data)
          } catch (e) {
            // ignore; user remains null
          }
        }
      } catch (e) {
        console.warn('Failed to load listing', e.message)
        Alert.alert('Error', 'Could not load listing')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [listingId])

  const isOwner = useMemo(() => {
    if (!listing || !user) return false
    return listing.user_id === user.id || (listing.user && listing.user.id === user.id)
  }, [listing, user])

  function getImageUrl(img) {
    if (!img) return null
    if (img.url) return img.url
    if (img.path) return `${API_URL}/storage/${img.path}`
    return img
  }

  // Get all images from listing
  const images = useMemo(() => {
    if (!listing?.images || !Array.isArray(listing.images)) return []
    return listing.images.map(img => getImageUrl(img)).filter(Boolean)
  }, [listing])

  // Format date string as dd-MM-yyyy
  const formatDate = (input) => {
    if (!input) return ''
    const d = new Date(input)
    if (isNaN(d.getTime())) return input
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  // Address composition: prefer structured meta.location fields when present
  const addressText = useMemo(() => {
    const loc = listing?.meta?.location || listing?.location || {}
    const parts = []
    if (loc.city) parts.push(loc.city)
    if (loc.subcity) parts.push(loc.subcity)
    if (loc.area) parts.push(loc.area)
    if (loc.landmark) parts.push(loc.landmark)
    if (parts.length > 0) return parts.join(', ')
    return listing?.address || ''
  }, [listing])

  // Map coordinates
  const coords = useMemo(() => {
    const loc = listing?.meta?.location || listing?.location || {}
    const lat = loc.lat || loc.latitude || loc.lat_dd || null
    const lng = loc.lng || loc.longitude || loc.lon || loc.lng_dd || null
    if (lat && lng) return { lat, lng }
    return null
  }, [listing])

  // Owner name - try multiple sources
  const ownerName = useMemo(() => {
    if (owner?.name) return owner.name
    if (listing?.owner?.name) return listing.owner.name
    if (listing?.user?.name) return listing.user.name
    return 'N/A'
  }, [owner, listing])

  // Owner phone
  const ownerPhone = useMemo(() => {
    return listing?.meta?.contact_phone || listing?.contact_phone || owner?.phone_number || listing?.owner?.phone_number || listing?.user?.phone_number || null
  }, [listing, owner])

  const openMap = async () => {
    if (coords) {
      const { lat, lng } = coords
      const url = Platform.select({
        ios: `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
        android: `google.navigation:q=${lat},${lng}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      })
      try {
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
          await Linking.openURL(url)
        } else {
          // Fallback to Google Maps web
          await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`)
        }
      } catch (e) {
        console.warn('Error opening maps', e)
        Alert.alert('Error', 'Could not open maps application')
      }
    } else if (addressText) {
      // Use address for search if coordinates not available
      const encodedAddress = encodeURIComponent(addressText)
      const url = Platform.select({
        ios: `maps://maps.apple.com/?q=${encodedAddress}`,
        android: `geo:0,0?q=${encodedAddress}`,
        default: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      })
      try {
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
          await Linking.openURL(url)
        } else {
          await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`)
        }
      } catch (e) {
        console.warn('Error opening maps', e)
        Alert.alert('Error', 'Could not open maps application')
      }
    } else {
      Alert.alert('No location', 'No location information available for this property')
    }
  }

  // Parse utilities - handle both array and string
  const utilitiesList = useMemo(() => {
    const utils = listing?.meta?.utilities
    if (!utils) return []
    if (Array.isArray(utils)) return utils
    if (typeof utils === 'string') {
      try {
        const parsed = JSON.parse(utils)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return [utils]
      }
    }
    return []
  }, [listing])

  // Parse amenities - handle both array and string
  const amenitiesList = useMemo(() => {
    const amens = listing?.meta?.amenities
    if (!amens) return []
    if (Array.isArray(amens)) return amens
    if (typeof amens === 'string') {
      try {
        const parsed = JSON.parse(amens)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return [amens]
      }
    }
    return []
  }, [listing])

  const handleFavourite = async () => {
    if (!user || !listingId) return
    
    setFavouriteLoading(true)
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) {
        Alert.alert('Error', 'Please log in to save favorites')
        return
      }

      if (isFavourite) {
        // Remove from favorites
        await axios.delete(`${API_URL}/apartments/${listingId}/favorite`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        setIsFavourite(false)
      } else {
        // Add to favorites
        await axios.post(`${API_URL}/apartments/${listingId}/favorite`, {}, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        setIsFavourite(true)
      }
    } catch (error) {
      console.warn('Failed to toggle favorite', error)
      Alert.alert('Error', 'Failed to update favorite')
    } finally {
      setFavouriteLoading(false)
    }
  }

  const handleTour = () => {
    Alert.alert('Request Tour', 'Tour request feature coming soon')
  }

  const handleMessage = () => {
    navigation.navigate('Messages', { apartmentId: listingId })
  }

  const handleCall = () => {
    if (!ownerPhone) {
      Alert.alert('No phone', 'No contact phone provided')
      return
    }
    const phoneUrl = `tel:${ownerPhone}`
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Error', 'Could not make phone call')
    })
  }

  // Get floor plan data (first one or default values)
  const floorPlan = useMemo(() => {
    const plans = listing?.floor_plans || []
    if (plans.length > 0) {
      const plan = plans[0]
      return {
        name: plan.name || 'No name',
        beds: plan.beds ?? plan.bedrooms ?? 0,
        baths: plan.baths ?? plan.bathrooms ?? 0,
        price: plan.price_range || plan.price || listing?.price || listing?.meta?.price_range || 'N/A',
        available_from: plan.available_from || plan.available_units || listing?.meta?.available_from || listing?.meta?.availability || null,
        image: plan.image || (images.length > 0 ? images[0] : null),
      }
    }
    // If no floor plans, use listing data
    const price = listing?.price || listing?.meta?.price_range || 'N/A'
    const formattedPrice = typeof price === 'number' ? `$${price.toLocaleString()}` : price
    return {
      name: listing?.title || 'No name',
      beds: listing?.bedrooms || 0,
      baths: listing?.bathrooms || 0,
      price: formattedPrice,
      available_from: listing?.meta?.available_from || listing?.meta?.availability || null,
      image: images.length > 0 ? images[0] : null,
    }
  }, [listing, images])

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Listing Details" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Listing Details" />
        <View style={{ padding: 20 }}>
          <Text>Listing not found.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header title={listing.title || 'Listing Details'} />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        {images.length > 0 && (
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => String(index)}
              onMomentumScrollEnd={(e) => {
                const contentOffsetX = e.nativeEvent.contentOffset.x
                const index = Math.round(contentOffsetX / width)
                setImageIndex(index)
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.heroImage} resizeMode="cover" />
              )}
            />
            {images.length > 1 && (
              <View style={styles.imageDots}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.dot, index === imageIndex && styles.activeDot]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <Text style={styles.listingTitle}>{listing.title || 'No Title'}</Text>
            {!isOwner && (
              <TouchableOpacity onPress={handleFavourite} style={styles.favouriteButton}>
                <Ionicons 
                  name={isFavourite ? 'heart' : 'heart-outline'} 
                  size={28} 
                  color={isFavourite ? '#e0245e' : '#666'} 
                />
              </TouchableOpacity>
            )}
          </View>

          {addressText ? <Text style={styles.headerAddress}>{addressText}</Text> : null}

          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <Ionicons name="map-outline" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>View Map</Text>
          </TouchableOpacity>

          <View style={styles.ownerSection}>
            <Text style={styles.ownerLabel}>OWNED/MANAGED BY:</Text>
            <Text style={styles.ownerName}>{ownerName}</Text>
          </View>
        </View>

        {/* Pricing and Floor Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Floor Plans</Text>
          <View style={styles.floorPlanCard}>
            {floorPlan.image && (
              <Image source={{ uri: floorPlan.image }} style={styles.floorPlanImage} resizeMode="cover" />
            )}
            <View style={styles.floorPlanContent}>
              <Text style={styles.floorPlanName}>{floorPlan.name || 'No name'}</Text>
              <View style={styles.floorPlanDetails}>
                <Text style={styles.floorPlanMeta}>
                  {floorPlan.beds || 0} Bed{floorPlan.beds !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.floorPlanSeparator}>•</Text>
                <Text style={styles.floorPlanMeta}>
                  {floorPlan.baths || 0} Bath{floorPlan.baths !== 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={styles.floorPlanPrice}>{floorPlan.price}</Text>
              {floorPlan.available_from && (
                <Text style={styles.availableDate}>
                  Available on: {formatDate(floorPlan.available_from)}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {addressText ? <Text style={styles.aboutText}>{addressText}</Text> : null}
          <View style={styles.propertyInfoRow}>
            <Text style={styles.propertyInfoLabel}>Property ID:</Text>
            <Text style={styles.propertyInfoValue}>{listing.id || 'N/A'}</Text>
          </View>
          <View style={styles.propertyInfoRow}>
            <Text style={styles.propertyInfoLabel}>Purpose:</Text>
            <Text style={styles.propertyInfoValue}>
              {listing.meta?.purpose || listing.purpose || 'Rent'}
            </Text>
          </View>
          {listing.description ? (
            <Text style={styles.descriptionText}>{listing.description}</Text>
          ) : null}
        </View>

        {/* Unique Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unique Features</Text>
          
          {/* Owner's unique features description with bullets */}
          {listing.meta?.unique_features && (
            <View style={styles.uniqueFeaturesDescription}>
              {Array.isArray(listing.meta.unique_features) ? (
                listing.meta.unique_features.map((feature, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{feature}</Text>
                  </View>
                ))
              ) : typeof listing.meta.unique_features === 'string' ? (
                listing.meta.unique_features.split('\n').map((feature, index) => {
                  const trimmed = feature.trim()
                  if (!trimmed) return null
                  // Remove bullet if already present
                  const cleanFeature = trimmed.replace(/^[•\-\*]\s*/, '')
                  return (
                    <View key={index} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>{cleanFeature}</Text>
                    </View>
                  )
                })
              ) : null}
            </View>
          )}

          {/* Structured unique features */}
          <View style={styles.featuresGrid}>
            {listing.meta?.floor && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Floor</Text>
                <Text style={styles.featureValue}>{listing.meta.floor}</Text>
              </View>
            )}
            {(listing.meta?.furnishing_status || listing.meta?.furnishing) && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Furnishing Status</Text>
                <Text style={styles.featureValue}>{listing.meta.furnishing_status || listing.meta.furnishing}</Text>
              </View>
            )}
            {(listing.meta?.availability || listing.meta?.available_from) && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Availability</Text>
                <Text style={styles.featureValue}>
                  {listing.meta.availability || formatDate(listing.meta.available_from)}
                </Text>
              </View>
            )}
            {listing.meta?.min_stay && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Min Stay</Text>
                <Text style={styles.featureValue}>{listing.meta.min_stay}</Text>
              </View>
            )}
            {utilitiesList.length > 0 && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Utilities</Text>
                <Text style={styles.featureValue}>{utilitiesList.join(', ')}</Text>
              </View>
            )}
            {listing.meta?.payment_period && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Payment Period</Text>
                <Text style={styles.featureValue}>{listing.meta.payment_period}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amenities Section */}
        {amenitiesList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {amenitiesList.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={18} color="#0ea5a4" style={styles.amenityIcon} />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contacts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts</Text>
          {ownerPhone ? (
            <Text style={styles.contactPhone}>{ownerPhone}</Text>
          ) : (
            <Text style={styles.contactPhone}>No phone number provided</Text>
          )}
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButtonPrimary} onPress={handleTour}>
              <Text style={styles.contactButtonText}>Request Tour</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButtonSecondary} onPress={handleMessage}>
              <Text style={styles.contactButtonTextSecondary}>Message</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ownerContactSection}>
            <Text style={styles.ownerContactLabel}>Owned/Managed by:</Text>
            <Text style={styles.ownerContactName}>{ownerName}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.bottomNavButton} onPress={handleTour}>
          <Ionicons name="calendar-outline" size={22} color="#1778f2" />
          <Text style={styles.bottomNavButtonText}>Tour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavButton} onPress={handleMessage}>
          <Ionicons name="chatbubble-outline" size={22} color="#1778f2" />
          <Text style={styles.bottomNavButtonText}>Message</Text>
        </TouchableOpacity>
        {ownerPhone && (
          <TouchableOpacity style={styles.bottomNavButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={22} color="#1778f2" />
            <Text style={styles.bottomNavButtonText}>Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}
