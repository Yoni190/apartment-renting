import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function MessageListItem({ recipientName, lastMessage, timestamp, onPress, id, unreadCount, lastMessageFromMe, lastMessageIsRead }) {
  const name = recipientName || `User ${id ?? ''}`
  const lastAt = timestamp || ''

  return (
    <TouchableOpacity
      style={styles.itemRow}
      onPress={() => {
        console.log('MessageListItem pressed', { hasOnPress: !!onPress, id, name })
        if (onPress) {
          try {
            onPress()
          } catch (e) {
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {lastMessageFromMe ? (
              <Ionicons name={lastMessageIsRead ? 'checkmark-done' : 'checkmark'} size={16} color={'#0b63d6'} style={{ marginRight: 6 }} />
            ) : null}
            <Text style={styles.time}>{lastAt}</Text>
          </View>
        </View>

        <View style={styles.rowBottom}>
          <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">{lastMessage}</Text>
        </View>
      </View>
      <View style={styles.rightMeta}>
        {unreadCount ? (
          <View style={styles.badge}><Text style={styles.badgeText}>{String(unreadCount)}</Text></View>
        ) : null}
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
  rightMeta: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#1778f2',
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 6,
  },
  badgeText: { color: '#fff', fontWeight: '700' },
})
