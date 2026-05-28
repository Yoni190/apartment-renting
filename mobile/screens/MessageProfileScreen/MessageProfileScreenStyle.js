import { StyleSheet, Platform } from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary,
	},
	panel: {
		flex: 1,
		backgroundColor: colors.primaryLight,
	},
	header: {
		height: 96,
		paddingTop: 22,
		paddingHorizontal: spacing.md,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: colors.primaryDark,
		backgroundColor: colors.primary
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: spacing.xl,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,0.12)',
	},
	headerTitle: {
		color: colors.white,
		fontSize: 16,
		fontWeight: '700',
	},
	headerRight: {
		width: 32,
	},
	content: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 24,
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: colors.primaryDark,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
		...Platform.select({
			ios: {
				shadowColor: colors.black,
				shadowOpacity: 0.2,
				shadowRadius: 12,
				shadowOffset: { width: 0, height: 6 },
			},
			android: {
				elevation: 6,
			},
		}),
	},
	avatarText: {
		color: colors.white,
		fontSize: 42,
		fontWeight: '700',
	},
	nameText: {
		color: colors.primaryDark,
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 14,
	},
	infoCard: {
		width: '88%',
		height: '20%',
		backgroundColor: colors.primary,
		borderRadius: radius.lg,
		paddingVertical: spacing.md,
		paddingHorizontal: 14,
		gap: 25,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	infoLabel: {
		color: colors.textMuted,
		fontSize: 16,
		fontWeight: '600',
	},
	infoValue: {
		color: colors.white,
		fontSize: 18,
		fontWeight: '600',
	},
})

export default styles
