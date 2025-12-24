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
        borderColor: '#ddd',
        marginRight: 10,
        padding: 15,
        backgroundColor: '#fff',
        },
    recommendationsContainer: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 100
    },
    recommendationsImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    apartmentTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    location: {
        fontSize: 12,
    },
    apartmentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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