import { StyleSheet, Dimensions, Platform } from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  // Image Slider
  imageContainer: {
    width: width,
    height: 320,
    position: 'relative',
    backgroundColor: colors.black,
  },
  heroImage: {
    width: width,
    height: 320,
  },
  imageDots: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 12,
    height: 8,
    borderRadius: 4,
  },

  // Header Section
  headerSection: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  listingTitle: {
    ...typography.h1,
    flex: 1,
    marginRight: spacing.md,
  },
  favouriteButton: {
    padding: spacing.sm,
    borderRadius: spacing.xl,
    backgroundColor: colors.background,
  },
  headerAddress: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  ownerSection: {
    marginTop: spacing.lg,
  },
  updatedText: {
    ...typography.caption,
    marginTop: spacing.sm,
    marginLeft: 2,
  },
  ownerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Section Styles
  section: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },

  // Floor Plan Card
  floorPlanCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        ...shadows.sm,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  floorPlanImage: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  floorPlanContent: {
    flex: 1,
  },
  floorPlanName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  floorPlanDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  floorPlanMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  floorPlanSeparator: {
    fontSize: 14,
    color: colors.textMuted,
  },
  floorPlanPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.teal,
    marginBottom: spacing.sm,
  },
  availableDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // About Section
  aboutText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  propertyInfoRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  propertyInfoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 110,
  },
  propertyInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
    marginTop: spacing.md,
  },

  // Unique Features Section
  uniqueFeaturesDescription: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 18,
    color: colors.teal,
    marginRight: spacing.md,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    flex: 1,
  },
  featuresGrid: {
    gap: spacing.lg,
  },
  featureItem: {
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  // Amenities Section
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusSuccess,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: spacing.xl,
    borderWidth: 1,
    borderColor: colors.statusSuccessBorder,
  },
  amenityIcon: {
    marginRight: spacing.xs,
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  amenityEmoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },

  // Contacts Section
  contactPhone: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  contactButtonPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contactButtonSecondary: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  contactButtonTextSecondary: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  ownerContactSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ownerContactLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  ownerContactName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Bottom Navigation Bar
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...Platform.select({
      ios: {
        ...shadows.md,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bottomNavButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  bottomNavButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  // Tour panel styles (date pills + time pills)
  tourPanelOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  tourPanel: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.lg,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        ...shadows.lg,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tourPanelHeader: {
    marginBottom: spacing.md,
  },
  tourPanelBody: {
    paddingVertical: spacing.xs,
  },
  tourPanelContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tourPanelFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
  },
  datesColumn: {
    flex: 1,
    maxHeight: 320,
  },
  timesColumn: {
    flex: 1,
    maxHeight: 320,
  },
  dateList: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  dateListItem: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  dateListItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateListItemText: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  dateListItemTextActive: {
    color: colors.white,
  },
  dateListItemSub: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  timeList: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  timeListItem: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  timeListItemActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  timeListItemText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeListItemTextActive: {
    color: colors.white,
  },
  cancelBtnFooter: {
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtnFooterText: {
    color: colors.danger,
    fontWeight: '700',
  },
  datePillsRow: {
    paddingBottom: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
  },
  datePill: {
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: spacing.xl,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  datePillActive: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.16,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  showMoreButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMoreText: {
    color: colors.primary,
    fontWeight: '700',
  },
  timePillsWrap: {
    marginTop: spacing.md,
  },
  timePill: {
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  timePillActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  confirmBtn: {
    backgroundColor: colors.textPrimary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.textPrimary,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  confirmBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },

  ratingSummary: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  ratingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  starsRow: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },

  starsRowSmall: {
    flexDirection: 'row',
  },

  reviewCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  reviewerName: {
    fontWeight: '600',
    color: colors.textPrimary,
  },

  reviewText: {
    color: colors.textPrimary,
    lineHeight: 20,
  },

  viewAllReviewsBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },

  viewAllReviewsText: {
    color: colors.primary,
    fontWeight: '600',
  },
  writeReviewCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },

  writeReviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },

  writeStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  reviewInputMock: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    minHeight: 80,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },

  reviewPlaceholder: {
    color: colors.textMuted,
    fontSize: 14,
  },

  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    opacity: 0.85,
  },

  submitReviewText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },


})
