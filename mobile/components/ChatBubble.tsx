import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { ChatMessage } from '../types/message'

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
    marginVertical: 6,
    paddingHorizontal: 12,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  bubbleRight: {
    backgroundColor: '#1778f2',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  bubbleLeft: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextRight: {
    color: '#fff',
  },
  messageTextLeft: {
    color: '#111',
  },
  timeText: {
    marginTop: 6,
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  timeTextRight: {
    color: 'rgba(255,255,255,0.85)',
  },
  timeTextLeft: {
    color: '#888',
  },
})
