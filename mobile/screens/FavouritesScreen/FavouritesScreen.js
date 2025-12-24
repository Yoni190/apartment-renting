import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { useTranslation } from 'react-i18next'

const FavouritesScreen = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Header title={t("favourites")}/>

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
    </View>
  )
}

export default FavouritesScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: -50, // to visually match the sketch proportions
  },

  circle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: '#edfbff', // soft light blue like the sketch
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
