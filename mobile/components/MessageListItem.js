import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function MessageListItem({ recipientName, lastMessage, timestamp, onPress, id }) {
  const name = recipientName || `User ${id ?? ''}`
  const lastAt = timestamp || ''

  return (
    <TouchableOpacity
      style={styles.itemRow}
      onPress={() => {
        console.log('MessageListItem pressed', { id, name, hasOnPress: !!onPress })
        if (onPress) {
          try {
            // call without args — parent may expect no params
            onPress()
          } catch (e) {
            // fallback: call with a small payload
            onPress({ id, recipientName: name })
          }
        }
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(name || 'U').slice(0, 1).toUpperCase()}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.time}>{lastAt}</Text>
        </View>

        <View style={styles.rowBottom}>
          <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">{lastMessage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 18,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
  },
  rowBottom: {
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 13,
    color: '#6b7280',
  },
})
