import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import { useTranslation } from 'react-i18next'
import Ionicons from '@expo/vector-icons/Ionicons'
import styles from './SearchScreenStyle'


const SearchScreen = () => {
	const { t } = useTranslation()

	return (
		<SafeAreaView style={styles.container}>
			<Header title={t("search")} />

			{/* Search Bar */}
			<View style={styles.searchContainer}>
				<Ionicons name="search-outline" size={20} color="#9ca3af" />
				<TextInput
					placeholder={t("searchPlaceholder")}
					placeholderTextColor="#9ca3af"
					style={styles.input}
				/>
			</View>

			{/* Empty State */}
			<View style={styles.emptyState}>
				<View style={styles.illustration}>
					<Image
						source={require('../../assets/logo.png')}
						style={styles.image}
						resizeMode="contain"
					/>
				</View>

				<Text style={styles.title}>
					{t("noResultsFound")}
				</Text>

				<Text style={styles.subtitle}>
					{t("searchSubtitle")}
				</Text>
			</View>
		</SafeAreaView>
	)
}

export default SearchScreen
