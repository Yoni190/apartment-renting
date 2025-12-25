import { StyleSheet, Platform, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc'
  },
  scrollContent: { 
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statIconActive: {
    backgroundColor: '#d1fae5',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  statNumberActive: {
    color: '#10b981',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Section Header
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#1778f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#1778f2',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Listings Container
  listingsContainer: {
    alignItems: 'center',
    gap: 20,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1778f2',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1778f2',
        shadowOpacity: 0.4,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
})
