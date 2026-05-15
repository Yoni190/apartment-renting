import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, shadows, typography } from '../theme'

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
            <Ionicons name="checkmark" size={14} color={colors.white} />
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {(() => {
              if (lastMessageWasReceived) return null
              let showDouble = false
              try {
                if (lastMessageFromMe && lastMessageId) {
                  if (lastMessageLocallyRead === true) showDouble = true
                  else if (lastMessageReadAt) {
                    const ra = new Date(lastMessageReadAt).getTime()
                    const ca = lastMessageTimestamp ? new Date(lastMessageTimestamp).getTime() : null
                    if (!isNaN(ra) && (!ca || ra >= ca)) showDouble = true
                  }
                }
              } catch (e) { showDouble = false }
              const showSingle = Boolean(lastMessageFromMe) && !showDouble
              const iconName = showDouble ? 'checkmark-done' : (showSingle ? 'checkmark' : null)
              if (iconName) return <Ionicons name={iconName} size={16} color={colors.primary} style={{ marginRight: spacing.sm }} />
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
    elevation: 1,
  },
  itemRowSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
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
    borderRadius: radius.sm,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    elevation: 2,
  },
  avatarText: {
    color: colors.navBg,
    fontWeight: '700',
    fontSize: typography.h4.fontSize,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...typography.body,
    fontWeight: '700',
    color: colors.navBg,
    flex: 1,
    marginRight: spacing.md,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rowBottom: {
    marginTop: spacing.xs,
  },
  lastMessage: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  rightMeta: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  badge: {
    backgroundColor: colors.primary,
    minWidth: 28,
    height: 28,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  badgeText: { color: colors.white, fontWeight: '700' },
})
