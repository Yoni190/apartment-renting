import { StyleSheet, Platform } from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

export default StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxxl,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
    color: colors.textPrimary,
    letterSpacing: 0.2
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.textPrimary,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 14,
    marginTop: spacing.xxl,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 0,
  },
  btnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    color: colors.textPrimary,
    letterSpacing: 0.3
  },
  rowOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md
  },
  optionPill: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  optionPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  optionText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14
  },
  optionTextActive: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14
  },
  radio: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  radioActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  radioText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14
  },
  radioTextActive: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  toggle: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  toggleOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  toggleText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14
  },
  toggleTextOn: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14
  },
  rowOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md
  },
  checkbox: {
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  checkboxText: { 
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14
  },
  checkboxTextChecked: { 
    color: colors.white,
    fontWeight: '700',
    fontSize: 14
  },
  amenityPill: {
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: spacing.xl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  amenityPillActive: { 
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  amenityText: { 
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14
  },
  amenityTextActive: { 
    color: colors.white,
    fontWeight: '700',
    fontSize: 14
  },
  /* Unique feature UI */
  featureInput: {
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.textPrimary,
  },
  addFeatureBtn: {
    marginLeft: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addFeatureBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14
  },
  /* Form layout helpers */
  formCard: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.xl,
    padding: spacing.xxl,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 0,
  },
  /* subtle spacing to separate header */
  formCardTopSpacer: { marginTop: spacing.sm },
  sectionCard: {
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  /* Verification / identity */
  verificationCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  docTile: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    minHeight: 170,
  },
  docTileLast: {
    marginRight: 0,
  },
  docTileLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center'
  },
  docTileActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: spacing.sm,
  },
  docActionButton: {
    marginRight: 14,
  },
  docActionText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  docActionTextRemove: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  docSmallNote: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  /* Agent-specific card (mirrors verification card) */
  agentCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  fieldHalf: {
    flex: 1,
  },
  /* Map button styling */
  mapBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15
  },
  imagesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: spacing.md 
  },
  thumb: { 
    width: 80, 
    height: 80, 
    borderRadius: radius.md, 
    marginRight: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageAdd: { 
    width: 80, 
    height: 80, 
    borderRadius: radius.md, 
    borderWidth: 2, 
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  imageAddText: { 
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14
  },
  errorBox: { 
    backgroundColor: colors.dangerLight, 
    padding: 14, 
    borderRadius: radius.md, 
    marginBottom: spacing.lg, 
    borderWidth: 1.5, 
    borderColor: colors.dangerLight,
    ...Platform.select({
      ios: {
        shadowColor: colors.danger,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  errorText: { 
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500'
  },
  datePickerButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  datePickerText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500'
  },
  datePickerPlaceholder: {
    color: colors.textMuted,
    fontWeight: '400'
  }
  ,
  /* Preview modal styles */
  previewModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl
  },
  previewModalCloseArea: {
    flex: 1,
    width: '100%'
  },
  previewModalContent: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewImage: {
    width: '100%',
    height: 420,
    borderRadius: radius.sm,
    backgroundColor: colors.white
  },
  previewCloseBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.primary
  },
  previewCloseText: {
    color: colors.white,
    fontWeight: '700'
  }
})
