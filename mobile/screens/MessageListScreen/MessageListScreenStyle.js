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
  selectionBar: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 1,
  },
  selectionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  selectionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  selectionBtnDanger: {
    backgroundColor: '#fee2e2',
  },
  selectionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  selectionBtnTextDanger: {
    color: '#b91c1c',
  },
  selectionBtnGhost: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  selectionBtnGhostText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
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
  emptyAllContainer: {
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAllText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#6b7280',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1778f2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0f172a',
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  modalError: {
    marginTop: 6,
    color: '#ef4444',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  modalBtnGhost: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  modalBtnGhostText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  modalBtnPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#1778f2',
    borderRadius: 8,
  },
  modalBtnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
  },
})
