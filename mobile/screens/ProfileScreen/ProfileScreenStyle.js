import {StyleSheet} from 'react-native'
import { colors, spacing, radius, typography } from '../../theme'

export default StyleSheet.create({
  profileTop: {
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: spacing.lg,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    marginBottom: spacing.lg,
  },

  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  email: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },

  box: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    paddingVertical: spacing.xs,
    borderWidth: 1.3,
    borderColor: colors.border,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  rowText: {
    ...typography.body,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    flex: 1,
  },

  arrow: {
    fontSize: 18,
    color: colors.textMuted,
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: colors.dangerLight,
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.xxl,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.sm,
  },

  logoutText: {
    color: colors.danger,
    ...typography.body,
    fontWeight: "600",
  },
    // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    ...typography.h3,
    marginTop: spacing.sm,
  },
  modalMessage: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
});
