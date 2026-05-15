import { StyleSheet } from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl,
        paddingTop: 100,
        backgroundColor: colors.white,
        alignItems: 'stretch',
        justifyContent: 'flex-start'
    },
    subTitle: {
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        fontWeight: '500'
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: 14,
        paddingRight: 44,
        marginBottom: spacing.md,
        backgroundColor: colors.background,
        fontSize: 16,
        color: colors.textPrimary
    },
    linkText: {
        color: colors.primary,
        fontWeight: '600'
    },
    btn: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 14,
        paddingHorizontal: spacing.lg,
        marginTop: spacing.md,
        ...shadows.sm,
    },
    btnText: {
        color: colors.white,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16
    },
    errorText: {
        color: colors.danger,
        marginBottom: spacing.sm,
        fontSize: 13
    },
    deleteBtn: {
        marginTop: 14,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.dangerLight
    },
    deleteBtnText: {
        color: colors.danger,
        fontWeight: '700'
    }
    ,
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md
    }
    ,
    eyeButton: {
        position: 'absolute',
        right: spacing.md,
        top: spacing.md,
        padding: spacing.xs
    }
})
