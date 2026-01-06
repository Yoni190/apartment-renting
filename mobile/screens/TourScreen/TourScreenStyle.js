import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
		marginTop: 10,
	},
	searchBox: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginRight: 10,
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		color: '#333',
	},
	iconButton: {
		width: 42,
		height: 42,
		borderRadius: 12,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 8,
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 3,
	},
	bookingCard: {
		width: 280,
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 12,
		marginRight: 12,
		flexDirection: 'row',
		alignItems: 'center',
		elevation: 2,
	},
	bookingCardAlt: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 14,
		padding: 12,
		flexDirection: 'column',
		alignItems: 'flex-start',
		elevation: 3,
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowRadius: 8,
		paddingLeft: 0,
	},
	bookingThumbWrap: {
		marginRight: 12,
		width: 120,
		alignItems: 'center',
	},
	bookingThumb: {
		width: 84,
		height: 84,
		borderRadius: 10,
		backgroundColor: '#eef2f7'
	},
	bookingTitle: {
		fontSize: 15,
		fontWeight: '700',
		color: '#0f172a'
	},
	bookingMeta: {
		fontSize: 13,
		color: '#6b7280',
		marginTop: 6
	},
	bookingTime: {
		fontSize: 13,
		color: '#475569',
		marginTop: 6
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusPending: {
		backgroundColor: '#fef3c7'
	},
	statusPrimary: {
		backgroundColor: '#e0f2fe'
	},
	statusFinal: {
		backgroundColor: '#f1f5f9'
	},
	statusText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#92400e'
	},
	actionBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10,
	},
	actionText: {
		marginLeft: 6,
		fontSize: 13,
		color: '#111827'
	},
	modalBtn: {
		flex: 1,
		marginHorizontal: 6,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	modalBtnText: {
		marginLeft: 8,
		statusFinal: {
			backgroundColor: '#aaa',
		},
		fontWeight: '700'
	},
	smallBtn: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center'
	},
	smallBtnText: {
		color: '#fff',
		fontWeight: '700'
	},
	fullBtn: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	},
	fullBtnText: {
		color: '#fff',
		fontWeight: '700'
	},
	splitBtn: {
		flex: 1,
		paddingVertical: 10,
		width: '48%',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	},
	splitBtnText: {
		marginLeft: 6,
		color: '#fff',
		fontWeight: '700'
	},

		pendingActionsRow: {
			flexDirection: 'row',
			marginTop: 10,
			width: '100%',
			paddingHorizontal: 0,
		},
		pendingBtn: {
			flex: 1,
			paddingVertical: 10,
			borderRadius: 8,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row'
		},

		pendingBtnLeft: {
			flex: 1,
			paddingVertical: 10,
			borderBottomLeftRadius: 10,
			borderTopLeftRadius: 10,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row'
		},

		pendingBtnRight: {
			flex: 1,
			paddingVertical: 10,
			borderBottomRightRadius: 10,
			borderTopRightRadius: 10,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row'
		},

			/* footer style when the card has pending actions */
			pendingFooter: {
				marginTop: 12,
				borderTopWidth: 1,
				borderTopColor: '#eef2f6',
				paddingTop: 10,
				flexDirection: 'row',
				width: '100%',
				paddingHorizontal: 12,
				justifyContent: 'center'
			},

			/* Cancel button for clients when booking is pending */
			cancelBtn: {
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				paddingVertical: 12,
				paddingHorizontal: 16,
				borderRadius: 10,
				backgroundColor: '#ef4444',
				width: '100%',
				maxWidth: 420,
				shadowColor: '#000',
				shadowOpacity: 0.12,
				shadowRadius: 8,
				elevation: 4,
			},

			cancelBtnText: {
				color: '#fff',
				fontWeight: '700',
				fontSize: 15
			},

	/* MyTours styles */
	card: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 14,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'flex-start',
		elevation: 3,
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowRadius: 8,
	},
	thumbWrap: { marginRight: 12 },
	thumb: { width: 84, height: 84, borderRadius: 10, backgroundColor: '#eef2f7' },
	title: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
	meta: { fontSize: 13, color: '#6b7280', marginTop: 6 },
	time: { fontSize: 13, color: '#475569', marginTop: 6 },
	viewBtn: {
		backgroundColor: '#f97316',
		marginLeft: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	}
})

