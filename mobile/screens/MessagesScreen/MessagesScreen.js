import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { MessageCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

const MessagesScreen = () => {

  const { t } = useTranslation()

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <Header title={t("messages")} />

      <View style={styles.emptyState}>
        <MessageCircle size={60} color="#ccc" strokeWidth={1.2} />

        <Text style={styles.emptyTitle}>{t("no_messages_yet")}</Text>

        <Text style={styles.emptySubtitle}>
          {t("no_messages_subtitle")}
        </Text>
      </View>
    </View>
  )
}

export default MessagesScreen

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -40
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
})
