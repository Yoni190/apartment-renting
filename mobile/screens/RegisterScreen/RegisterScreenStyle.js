import {StyleSheet} from 'react-native'

export default StyleSheet.create({
     container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 25
    },
    innerContainer: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1, //?
        shadowRadius: 8,//?
        shadowOffset: {width: 0, height: 3} //?
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#F5F5F5'
    },
    btn: {
        backgroundColor: '#111',
        borderRadius: 12,
        paddingVertical: 15,
        marginTop: 10    
    },
    btnText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: '800'
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '700',
        color: "#111"
    },
    subTitle: {
        textAlign: "center",
        color: '#666',
        marginBottom: 30
    },
    roleInfo: {
        textAlign: 'center',
        color: '#444',
        marginBottom: 14,
        fontWeight: '600'
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666'
    },
    linkText: {
        color: '#111',
        fontWeight: 'bold'
    },
    errorText: {
        color: "red",
        marginBottom: 5
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        marginBottom: 10
        },

})