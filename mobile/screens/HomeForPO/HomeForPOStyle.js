import { StyleSheet, Platform, Dimensions } from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background
  },
  scrollContent: { 
    paddingTop: 70,
    paddingHorizontal: spacing.xl,
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
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statIconActive: {
    backgroundColor: colors.successLight,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  statNumberActive: {
    color: colors.success,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Section Header
  sectionHeader: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Tabs for filtering listings by verification status
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: spacing.sm,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabButtonTextActive: {
    color: colors.white,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
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
    marginRight: spacing.sm,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Listings Container
  listingsContainer: {
    alignItems: 'center',
    gap: spacing.xl,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
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
