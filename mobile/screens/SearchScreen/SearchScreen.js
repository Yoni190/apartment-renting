import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { ArrowUpDown, SlidersHorizontal, Search } from 'lucide-react-native'

const SearchScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <Header title="Search" />

      <View style={styles.searchContainer}>
        
        {/* Search Box */}
        <View style={styles.searchBox}>
          <Search size={18} color="#777" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Search..."
            placeholderTextColor="#999"
            style={styles.textInput}
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity style={styles.iconButton}>
          <SlidersHorizontal size={20} color="#333" />
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity style={styles.iconButton}>
          <ArrowUpDown size={20} color="#333" />
        </TouchableOpacity>

      </View>

      <View style={styles.emptyState}>
            <Search size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>Start Searching</Text>
            <Text style={styles.emptySubtitle}>
                Type something in the search box to find results.
            </Text>
        </View>

    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    elevation: 2,           // Shadow Android
    shadowColor: '#000',    // Shadow iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },

  emptySubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
})
