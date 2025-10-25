import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
const navigation = useNavigation()
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    >
    <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subTitle}>Login to Continue</Text>

      <TextInput 
        placeholder='Email Address'
        keyboardType='email-address'
        style={styles.textInput}
        placeholderTextColor="#999"
      />
      <TextInput 
        placeholder='Password'
        secureTextEntry={true}
        style={styles.textInput}
        placeholderTextColor="#999"
      />
      <TouchableOpacity 
      style={styles.btn}
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.linkText} onPress={() => navigation.navigate("Register")}>Sign Up</Text>
      </Text>
    </View>
    </KeyboardAvoidingView>
    
  )
}

export default LoginScreen

const styles = StyleSheet.create({
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
        marginBottom: 15,
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
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666'
    },
    linkText: {
        color: '#111',
        fontWeight: 'bold'
    }
})