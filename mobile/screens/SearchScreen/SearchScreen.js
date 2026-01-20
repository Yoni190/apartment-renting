import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
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

    const navigation = useNavigation()

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const searchApartments = async (text) => {
        setQuery(text)

        if(text.length < 2) {
            setResults([])
            return
        }

        try {
            setLoading(true)
            const response = await axios.get(
                `${API_URL}/search?q=${text}`
            )

            setResults(response.data)
            console.log(results)
        } catch(error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
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
        <SlidersHorizontal size={20} color="#999" />
      </View>

      {query.length === 0 ? (
        <View style={styles.placeholderContainer}>
            <Search size={48} color="#ccc" />
            <Text style={styles.placeholderTitle}>Start searching</Text>
            <Text style={styles.placeholderText}>
            Find apartments by title or location
            </Text>
        </View>
        ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
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
