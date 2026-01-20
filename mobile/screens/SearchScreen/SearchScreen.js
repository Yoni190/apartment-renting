import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import styles from './SearchScreenStyle'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import { Search, SlidersHorizontal } from 'lucide-react-native'



const SearchScreen = () => {

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])


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
          onChangeText={setQuery}
        />

        {/* Filter Icon */}
        <SlidersHorizontal size={20} color="#999" />
      </View>

      {/* Placeholder when no search */}
      {query.length === 0 ? (
        <View style={styles.placeholderContainer}>
          <Search size={48} color="#ccc" />
          <Text style={styles.placeholderTitle}>Start searching</Text>
          <Text style={styles.placeholderText}>
            Find items by typing in the search bar above
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ padding: 20 }}>
            Showing results for "{query}"
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default SearchScreen
