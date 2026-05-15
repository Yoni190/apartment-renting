import { StyleSheet } from 'react-native'
import { colors, spacing, radius, shadows, typography } from '../../theme'

export default StyleSheet.create({
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
		marginTop: spacing.md,
	},
	searchBox: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.white,
		borderRadius: radius.md,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		marginRight: spacing.md,
		...shadows.sm,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		color: colors.textPrimary,
	},
	iconButton: {
		width: 42,
		height: 42,
		borderRadius: radius.md,
		backgroundColor: colors.white,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: spacing.sm,
		...shadows.sm,
	},
	bookingCard: {
		width: 280,
		backgroundColor: colors.white,
		borderRadius: radius.md,
		padding: spacing.md,
		marginRight: spacing.md,
		flexDirection: 'row',
		alignItems: 'center',
		elevation: 2,
	},
	bookingCardAlt: {
		width: '100%',
		backgroundColor: colors.white,
		borderRadius: 14,
		padding: spacing.md,
		flexDirection: 'column',
		alignItems: 'flex-start',
		...shadows.sm,
		paddingLeft: 0,
	},
	bookingThumbWrap: {
		marginRight: spacing.md,
		width: 120,
		alignItems: 'center',
	},
	bookingThumb: {
		width: 84,
		height: 84,
		borderRadius: radius.sm,
		backgroundColor: colors.background
	},
	bookingTitle: {
		fontSize: 15,
		fontWeight: '700',
		color: colors.textPrimary
	},
	bookingMeta: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: spacing.xs
	},
	bookingTime: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: spacing.xs
	},
	statusBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: radius.md,
	},
	statusPending: {
		backgroundColor: colors.statusPending
	},
	statusPrimary: {
		backgroundColor: colors.statusPrimary
	},
	statusFinal: {
		backgroundColor: colors.background
	},
	statusText: {
		fontSize: 12,
		fontWeight: '700',
		color: colors.statusPendingText
	},
	actionBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: spacing.md,
	},
	actionText: {
		marginLeft: spacing.xs,
		fontSize: 13,
		color: colors.textPrimary
	},
	modalBtn: {
		flex: 1,
		marginHorizontal: spacing.xs,
		paddingVertical: spacing.md,
		borderRadius: radius.sm,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	modalBtnText: {
		marginLeft: spacing.sm,
		statusFinal: {
			backgroundColor: colors.textMuted,
		},
		fontWeight: '700'
	},
	smallBtn: {
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.md,
		borderRadius: radius.sm,
		alignItems: 'center',
		justifyContent: 'center'
	},
	smallBtnText: {
		color: colors.white,
		fontWeight: '700'
	},
	fullBtn: {
		flex: 1,
		paddingVertical: spacing.md,
		borderRadius: radius.sm,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	},
	fullBtnText: {
		color: colors.white,
		fontWeight: '700'
	},
	splitBtn: {
		flex: 1,
		paddingVertical: spacing.md,
		width: '48%',
		borderRadius: radius.sm,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	},
	splitBtnText: {
		marginLeft: spacing.xs,
		color: colors.white,
		fontWeight: '700'
	},

		pendingActionsRow: {
			flexDirection: 'row',
			marginTop: spacing.md,
			width: '100%',
			paddingHorizontal: 0,
		},
		pendingBtn: {
			flex: 1,
			paddingVertical: spacing.md,
			borderRadius: radius.sm,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row'
		},

		pendingBtnLeft: {
			flex: 1,
			paddingVertical: spacing.md,
			borderBottomLeftRadius: radius.sm,
			borderTopLeftRadius: radius.sm,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row'
		},

		pendingBtnRight: {
			flex: 1,
			paddingVertical: spacing.md,
			borderBottomRightRadius: radius.sm,
			borderTopRightRadius: radius.sm,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row'
		},

			/* footer style when the card has pending actions */
			pendingFooter: {
				marginTop: spacing.md,
				borderTopWidth: 1,
				borderTopColor: colors.borderLight,
				paddingTop: spacing.md,
				flexDirection: 'row',
				width: '100%',
				paddingHorizontal: spacing.md,
				justifyContent: 'center'
			},

			/* Cancel button for clients when booking is pending */
			cancelBtn: {
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				paddingVertical: spacing.md,
				paddingHorizontal: spacing.lg,
				borderRadius: radius.sm,
				backgroundColor: colors.danger,
				width: '100%',
				maxWidth: 420,
				...shadows.md,
			},

			cancelBtnText: {
				color: colors.white,
				fontWeight: '700',
				fontSize: 15
			},

	/* MyTours styles */
	card: {
		width: '100%',
		backgroundColor: colors.white,
		borderRadius: 14,
		padding: spacing.md,
		flexDirection: 'row',
		alignItems: 'flex-start',
		...shadows.sm,
	},
	thumbWrap: { marginRight: spacing.md },
	thumb: { width: 84, height: 84, borderRadius: radius.sm, backgroundColor: colors.background },
	title: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
	meta: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs },
	time: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs },
	viewBtn: {
		backgroundColor: colors.accent,
		marginLeft: spacing.sm,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		borderRadius: radius.sm,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	}
})
