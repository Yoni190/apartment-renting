import {StyleSheet} from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl
    },
    innerContainer: {
        backgroundColor: colors.surface,
        padding: spacing.xxl,
        borderRadius: radius.xl,
        ...shadows.md,
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        ...typography.body,
        marginBottom: spacing.sm,
        backgroundColor: colors.background
    },
    btn: {
        backgroundColor: colors.textPrimary,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        marginTop: spacing.sm    
    },
    btnText: {
        color: colors.white,
        textAlign: "center",
        ...typography.button
    },
    title: {
        ...typography.h1,
        textAlign: 'center',
    },
    subTitle: {
        textAlign: "center",
        color: colors.textSecondary,
        marginBottom: spacing.xxl,
        ...typography.body
    },
    roleInfo: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginBottom: spacing.md,
        fontWeight: '600',
        fontSize: 14,
    },
    footerText: {
        textAlign: 'center',
        marginTop: spacing.xl,
        color: colors.textSecondary
    },
    linkText: {
        color: colors.textPrimary,
        fontWeight: 'bold'
    },
    errorText: {
        color: colors.danger,
        marginBottom: spacing.xs
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.sm
    },
      orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  orText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
  googleBtn: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        marginTop: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm
    },
    googleBtnText: {
        color: colors.black,
        ...typography.button
    },
    googleIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    }
})
