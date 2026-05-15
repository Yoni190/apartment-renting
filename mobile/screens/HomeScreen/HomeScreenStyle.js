import {StyleSheet} from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

export default StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderRadius: radius.sm,
        flex: 1,
        padding: spacing.md,
        marginHorizontal: spacing.xs
    },
    recommendations: {
        width: 200,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.white,
        },
    recommendationsContainer: {
        flexDirection: 'row',
    },
    title: {
        ...typography.h4,
        marginTop: spacing.lg,
        padding: spacing.md,
    },
    recommendationsImage: {
        width: '100%',
        height: 120,
        borderRadius: radius.sm,
        marginBottom: spacing.md,
    },
    placeholderImage: {
        width: '100%',
        height: 120,
        borderRadius: radius.sm,
        marginBottom: spacing.md,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center'
    },
    apartmentTitle: {
        ...typography.button,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        lineHeight: 20,
    },
    location: {
        ...typography.caption,
    },
    apartmentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    recommendationPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    apartmentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
    },
    apartments: {
        width: '48%',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
        backgroundColor: colors.white,
        padding: spacing.md,
    },
        heartWrap: {
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            backgroundColor: colors.overlay,
            width: 36,
            height: 36,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center'
        },
        msgBtn: {
            flex: 1,
            paddingVertical: spacing.sm,
            borderRadius: radius.sm,
            alignItems: 'center'
        }
})
