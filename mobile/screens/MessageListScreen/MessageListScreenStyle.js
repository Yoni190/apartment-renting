import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },
  // leave space for the global header (absolute positioned)
  listContent: {
    paddingVertical: 8,
    paddingTop: 8,
  },
  // main content area: push content below absolute Header
  screenContent: {
    flex: 1,
    paddingTop: 96,
  },
  searchContainer: {
    marginHorizontal: 12,
    marginBottom: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    fontSize: 14,
    color: '#0f172a',
    elevation: 1,
  },
  searchClear: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#0f172a',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 96,
    marginBottom: 8,
  },
  toggleButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 6,
    elevation: 1,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 12,
    marginVertical: 6,
    // subtle shadow (Android/iOS differences)
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
  divider: {
    height: 0,
  },
  emptyContainer: {
    marginTop: 140,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  emptyUnreadContainer: {
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyUnreadText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6b7280',
  },
})
