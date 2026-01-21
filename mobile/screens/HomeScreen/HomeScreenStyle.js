import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderRadius: 10,
        flex: 1,
        padding: 10,
        marginHorizontal: 5
    },
    recommendations: {
        width: 200,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        marginRight: 12,
        padding: 12,
        backgroundColor: '#fff',
        },
    recommendationsContainer: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        padding: 10,
    },
    recommendationsImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    placeholderImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    apartmentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 6,
        lineHeight: 20,
    },
    location: {
        fontSize: 12,
    },
    apartmentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    recommendationPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111',
    },
    apartmentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    apartments: {
        width: '48%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
        backgroundColor: '#fff',
        padding: 10,
    },
        heartWrap: {
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.3)',
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center'
        },
        msgBtn: {
            flex: 1,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: 'center'
        }
})