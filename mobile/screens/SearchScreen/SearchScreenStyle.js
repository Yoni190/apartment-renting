import {StyleSheet} from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

export default StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        marginTop: spacing.xxxl,
        paddingHorizontal: spacing.md,
        height: 50,
        borderRadius: radius.md,
        backgroundColor: colors.background,
    },
    input: {
        flex: 1,
        marginHorizontal: spacing.md,
        fontSize: 16,
        color: colors.black,
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xxxxl,
        },

        placeholderTitle: {
        marginTop: spacing.lg,
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        },

        placeholderText: {
        marginTop: spacing.sm,
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        },
        resultsContainer: {
            marginTop: spacing.xxxxl
        },
        filterOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.overlay,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            },

            filterMenu: {
            width: '80%',
            backgroundColor: colors.white,
            borderRadius: radius.md,
            padding: spacing.xl,
            elevation: 5,
            },

            filterTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: spacing.md,
            },

            filterLabel: {
            marginTop: spacing.md,
            fontWeight: '600',
            },

            filterOptions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: spacing.xs,
            },

            filterOption: {
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.sm,
            },

            closeButton: {
            marginTop: spacing.xl,
            backgroundColor: colors.primary,
            padding: spacing.md,
            borderRadius: radius.sm,
            alignItems: 'center',
            },

})
