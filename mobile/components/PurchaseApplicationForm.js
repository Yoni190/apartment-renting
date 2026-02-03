import React from 'react'
import { ScrollView, View, Text, TextInput } from 'react-native'

const PurchaseApplicationForm = ({ form, setForm, styles }) => {
  return (
    <ScrollView style={styles.templateFormScroll} contentContainerStyle={styles.templateFormContent}>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Subject</Text>
        <TextInput
          style={styles.templateFieldInput}
          value="Property Purchase Application"
          editable={false}
        />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Full Name</Text>
        <TextInput style={styles.templateFieldInput} value={form.fullName} onChangeText={(v) => setForm(prev => ({ ...prev, fullName: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Phone Number</Text>
        <TextInput style={styles.templateFieldInput} value={form.phoneNumber} onChangeText={(v) => setForm(prev => ({ ...prev, phoneNumber: v }))} keyboardType="phone-pad" />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Email (optional)</Text>
        <TextInput style={styles.templateFieldInput} value={form.email} onChangeText={(v) => setForm(prev => ({ ...prev, email: v }))} keyboardType="email-address" autoCapitalize="none" />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Apartment / Unit Interested In</Text>
        <TextInput style={styles.templateFieldInput} value={form.unit} onChangeText={(v) => setForm(prev => ({ ...prev, unit: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Intended Purchase Timeframe</Text>
        <TextInput style={styles.templateFieldInput} value={form.timeframe} onChangeText={(v) => setForm(prev => ({ ...prev, timeframe: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Budget Range</Text>
        <TextInput style={styles.templateFieldInput} value={form.budget} onChangeText={(v) => setForm(prev => ({ ...prev, budget: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Source of Funds (Cash / Loan / Mortgage)</Text>
        <TextInput style={styles.templateFieldInput} value={form.sourceOfFunds} onChangeText={(v) => setForm(prev => ({ ...prev, sourceOfFunds: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Additional Notes (optional)</Text>
        <TextInput
          style={[styles.templateFieldInput, styles.templateFieldInputMultiline]}
          value={form.notes}
          onChangeText={(v) => setForm(prev => ({ ...prev, notes: v }))}
          multiline
          textAlignVertical="top"
        />
      </View>
    </ScrollView>
  )
}

export default PurchaseApplicationForm
