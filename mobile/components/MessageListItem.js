import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function MessageListItem({ recipientName, lastMessage, timestamp, onPress, onLongPress, id, unreadCount, lastMessageFromMe, lastMessageIsRead, lastMessageId, lastMessageWasReceived, lastMessageReadAt, lastMessageTimestamp, lastMessageLocallyRead, selected }) {
  const name = recipientName || `User ${id ?? ''}`
  const lastAt = timestamp || ''

  return (
    <TouchableOpacity
      style={[styles.itemRow, selected && styles.itemRowSelected]}
      delayLongPress={250}
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
      onLongPress={() => {
        if (onLongPress) onLongPress()
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(name || 'U').slice(0, 1).toUpperCase()}</Text>
        {selected ? (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {(() => {
              // If the latest message was RECEIVED by the current user, hide any tick icons.
              if (lastMessageWasReceived) return null
              // Only show double-check when the last message was sent by the current user,
              // is marked read (we require an actual read timestamp), the read timestamp
              // corresponds to that message (or later), and we have a concrete message id.
              // Otherwise show a single check for sent messages.
              let showDouble = false
              try {
                if (lastMessageFromMe && lastMessageId) {
                  // local override (immediate UX) — if we marked this message read locally, honor it
                  if (lastMessageLocallyRead === true) showDouble = true
                  else if (lastMessageReadAt) {
                    const ra = new Date(lastMessageReadAt).getTime()
                    const ca = lastMessageTimestamp ? new Date(lastMessageTimestamp).getTime() : null
                    // require read_at to be a valid time and not older than the message created_at
                    if (!isNaN(ra) && (!ca || ra >= ca)) showDouble = true
                  }
                }
              } catch (e) { showDouble = false }
              const showSingle = Boolean(lastMessageFromMe) && !showDouble
              const iconName = showDouble ? 'checkmark-done' : (showSingle ? 'checkmark' : null)
              if (iconName) return <Ionicons name={iconName} size={16} color={'#0b63d6'} style={{ marginRight: 6 }} />
              return null
            })()}
            <Text style={styles.time}>{lastAt}</Text>
          </View>
        </View>

        <View style={styles.rowBottom}>
          <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">{lastMessage}</Text>
        </View>
      </View>
      <View style={styles.rightMeta}>
        {/* Only show unread badge when the latest message was RECEIVED by the current user
            and there are unread messages. Do not show badge for messages sent by the
            current user. */}
        {(lastMessageWasReceived && Number(unreadCount) > 0) ? (
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
  itemRowSelected: {
    borderWidth: 2,
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
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
