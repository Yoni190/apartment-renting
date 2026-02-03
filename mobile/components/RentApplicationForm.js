import React, { useMemo, useState } from 'react'
import { ScrollView, View, Text, TextInput, Pressable, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

const RentApplicationForm = ({ form, setForm, styles }) => {
  const [showPicker, setShowPicker] = useState(false)
  const minDate = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const parseMoveInDate = () => {
    if (form?.moveIn) {
      const d = new Date(form.moveIn)
      if (!Number.isNaN(d.getTime())) return d
    }
    return minDate
  }

  const formatDate = (date) => {
    if (!date) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
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
        <Pressable onPress={() => setShowPicker(true)}>
          <TextInput
            style={styles.templateFieldInput}
            value={form.moveIn}
            placeholder="Select date"
            editable={false}
            pointerEvents="none"
          />
        </Pressable>
        {showPicker ? (
          <DateTimePicker
            value={parseMoveInDate()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={minDate}
            onChange={(_e, selectedDate) => {
              if (Platform.OS !== 'ios') setShowPicker(false)
              if (!selectedDate) return
              if (selectedDate < minDate) return
              setForm(prev => ({ ...prev, moveIn: formatDate(selectedDate) }))
            }}
          />
        ) : null}
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
