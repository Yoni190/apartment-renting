import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { ChatMessage } from '../types/message'
import { colors, radius, spacing } from '../theme'

interface Props {
  message: ChatMessage
  isCurrentUser: boolean
}

function ChatBubble({ message, isCurrentUser }: Props) {
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <View style={[styles.row, isCurrentUser ? styles.rowRight : styles.rowLeft]}>
      <View style={[styles.bubble, isCurrentUser ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={[styles.messageText, isCurrentUser ? styles.messageTextRight : styles.messageTextLeft]}>{message.message}</Text>
        <Text style={[styles.timeText, isCurrentUser ? styles.timeTextRight : styles.timeTextLeft]}>{time}</Text>
      </View>
    </View>
  )
}

export default ChatBubble

const styles = StyleSheet.create({
  row: {
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  bubbleRight: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 6,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  bubbleLeft: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 6,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextRight: {
    color: colors.white,
  },
  messageTextLeft: {
    color: colors.textPrimary,
  },
  timeText: {
    marginTop: spacing.sm,
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  timeTextRight: {
    color: 'rgba(255,255,255,0.85)',
  },
  timeTextLeft: {
    color: colors.textMuted,
  },
})
