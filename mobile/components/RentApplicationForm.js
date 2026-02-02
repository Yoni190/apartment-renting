import React from 'react'
import { ScrollView, View, Text, TextInput } from 'react-native'

const RentApplicationForm = ({ form, setForm, styles }) => {
  return (
    <ScrollView style={styles.templateFormScroll} contentContainerStyle={styles.templateFormContent}>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Subject</Text>
        <TextInput
          style={styles.templateFieldInput}
          value="Property Rent Application"
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
        <Text style={styles.templateFieldLabel}>Preferred Move-in Date</Text>
        <TextInput style={styles.templateFieldInput} value={form.moveIn} onChangeText={(v) => setForm(prev => ({ ...prev, moveIn: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Lease Duration</Text>
        <TextInput style={styles.templateFieldInput} value={form.leaseDuration} onChangeText={(v) => setForm(prev => ({ ...prev, leaseDuration: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Employment Status</Text>
        <TextInput style={styles.templateFieldInput} value={form.employmentStatus} onChangeText={(v) => setForm(prev => ({ ...prev, employmentStatus: v }))} />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Estimated Monthly Income</Text>
        <TextInput style={styles.templateFieldInput} value={form.income} onChangeText={(v) => setForm(prev => ({ ...prev, income: v }))} keyboardType="numeric" />
      </View>
      <View style={styles.templateFieldRow}>
        <Text style={styles.templateFieldLabel}>Number of Occupants</Text>
        <TextInput style={styles.templateFieldInput} value={form.occupants} onChangeText={(v) => setForm(prev => ({ ...prev, occupants: v }))} keyboardType="numeric" />
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

export default RentApplicationForm
