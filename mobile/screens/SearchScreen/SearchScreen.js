import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import styles from './SearchScreenStyle'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import axios from 'axios'
import ListingCard from '../../components/ListingCard'
import { useNavigation } from '@react-navigation/native'


const SearchScreen = () => {

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

    const [bedroomFilter, setBedroomFilter] = useState(null)
    const [priceFilter, setPriceFilter] = useState(null) 

    const navigation = useNavigation()

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

      const searchApartments = async (text, filters = {}) => {
            setQuery(text)

            if (text.length < 2) {
            setResults([])
            return
            }

            try {
            setLoading(true)

            // Build query params for API
            const params = {
                q: text,
                ...(filters.bedrooms ? { bedrooms: filters.bedrooms } : {}),
                ...(filters.price ? { price_range: filters.price } : {}),
            }

            const response = await axios.get(`${API_URL}/search`, { params })
            setResults(response.data)
            } catch (error) {
            console.log(error)
            } finally {
            setLoading(false)
            }
        }

        // Handle filter change
        const applyFilters = () => {
            setShowFilters(false)
            searchApartments(query, {
            bedrooms: bedroomFilter,
            price: priceFilter,
            })
        }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
      <Header title="Search" />

      <View style={styles.searchContainer}>
        {/* Search Icon */}
        <Search size={20} color="#999" />

        {/* Input */}
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#999"
          style={styles.input}
          value={query}
          onChangeText={searchApartments}
        />

        {/* Filter Icon */}
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal
            size={20}
            color="#999" />
        </TouchableOpacity>
      </View>

      {/* Filter Menu */}
      {showFilters && (
        <View style={styles.filterOverlay}>
          <View style={styles.filterMenu}>
            <Text style={styles.filterTitle}>Filters</Text>

            {/* Bedrooms */}
            <Text style={styles.filterLabel}>Bedrooms</Text>
            <View style={styles.filterOptions}>
              {[1, 2, 3].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.filterOption,
                    bedroomFilter === n && { backgroundColor: '#007AFF' }
                  ]}
                  onPress={() => setBedroomFilter(n)}
                >
                  <Text style={{ color: bedroomFilter === n ? 'white' : 'black' }}>{n}+</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price */}
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.filterOptions}>
              {['low', 'medium', 'high'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.filterOption,
                    priceFilter === p && { backgroundColor: '#007AFF' }
                  ]}
                  onPress={() => setPriceFilter(p)}
                >
                  <Text style={{ color: priceFilter === p ? 'white' : 'black' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Apply & Close Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: '#ccc', flex: 1, marginRight: 10 }]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.closeButton, { flex: 1 }]}
                onPress={applyFilters}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}


      {query.length === 0 ? (
        <View style={styles.placeholderContainer}>
            <Search size={48} color="#ccc" />
            <Text style={styles.placeholderTitle}>Start searching</Text>
            <Text style={styles.placeholderText}>
            Find apartments by title or location
            </Text>
        </View>
        ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.resultsContainer}>
            {loading && (
            <Text style={{ padding: 20 }}>Searching...</Text>
            )}

            {!loading && results.length === 0 && (
            <Text style={{ padding: 20 }}>No results found</Text>
            )}

            {results.map((a) => {
                const imgs = Array.isArray(a.images)
                    ? a.images
                    : (a.images && Array.isArray(a.images.data)
                        ? a.images.data
                        : [])

                const images = (imgs || [])
                    .map(img =>
                    img.url ||
                    (img.path ? `${API_URL}/storage/${img.path}` : null)
                    )
                    .filter(Boolean)

                const meta = a.meta || {}

                return (
                    <ListingCard
                    key={a.id}
                    images={images.length ? images : undefined}
                    hasVideo={!!meta.hasVideo}
                    hasVirtualTour={!!meta.hasVirtualTour}
                    priceRange={meta.price_range || a.price || undefined}
                    bedroomRange={
                        meta.bedroom_range ||
                        (a.bedrooms ? `${a.bedrooms} Beds` : undefined)
                    }
                    title={a.title || undefined}
                    address={
                        a.address ||
                        (meta.location
                        ? `${meta.location.area ?? ''} ${meta.location.city ?? ''}`
                        : undefined)
                    }
                    amenities={meta.amenities || undefined}
                    phoneEnabled={!!meta.allow_phone}
                    contactPhone={meta.contact_phone || a.contact_phone || undefined}
                    saved={a.is_favorite || a.fav || false}
                    onSave={() => handleSave(a)}
                    onUnsave={() => handleUnsave(a)}
                    onMessage={() => openMessage(a)}
                    onCall={(phone) => handleCall(phone)}
                    onPress={() =>
                        navigation.navigate('ApartmentDetails', {
                        listingId: a.id,
                        })
                    }
                    />
                )
                })}

        </ScrollView>
        )}

    </SafeAreaView>
  )
}

export default SearchScreen
