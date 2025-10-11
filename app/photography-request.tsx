import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const EVENT_TYPES = [
  "Birthday",
  "Saree function",
  "21day",
  "Wedding",
  "Function",
  "Event",
  "Photoshoot",
];

export default function PhotographyRequestScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [openType, setOpenType] = useState(false);

  // Calendar modal state (replicates healthcare style)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal flow state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);

  const canSubmit = name.trim() && /^\d{10}$/.test(phone) && eventDate.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setRequestCode(Math.random().toString(36).slice(2, 8).toUpperCase());
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const closeSuccess = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  // Calendar helpers (borrowed pattern from healthcare)
  const openDatePicker = () => setShowDatePicker(true);
  const cancelDateSelection = () => setShowDatePicker(false);
  const selectDate = (date: Date) => setSelectedDate(date);
  const confirmDateSelection = () => {
    // Format DD-MM-YYYY to match other services
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    setEventDate(`${day}-${month}-${year}`);
    setShowDatePicker(false);
  };
  const navigateMonth = (dir: "prev" | "next") => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + (dir === "next" ? 1 : -1));
    setSelectedDate(d);
  };
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const items: any[] = [];
    for (let i = 0; i < startDay; i++) items.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      items.push({ day: d, date, isToday, isSelected, isPast });
    }
    return items;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Photography Request</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            placeholder="10-digit phone"
            placeholderTextColor="#6b7280"
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Event type</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setOpenType(!openType)} style={styles.select}>
            <Text style={styles.selectText}>{eventType}</Text>
            <Ionicons name={openType ? "chevron-up" : "chevron-down"} size={18} color="#374151" />
          </TouchableOpacity>
          {openType && (
            <View style={styles.dropdown}>
              {EVENT_TYPES.map((t) => (
                <TouchableOpacity key={t} onPress={() => { setEventType(t); setOpenType(false); }} style={styles.option}>
                  <Text style={[styles.optionText, t === eventType && { color: "#e91e63", fontWeight: "700" }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Event date</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={openDatePicker} style={styles.select}>
            <Text style={styles.selectText}>{eventDate || "DD-MM-YYYY"}</Text>
            <Ionicons name="calendar" size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Budget</Text>
          <TextInput
            placeholder="Approximate budget"
            placeholderTextColor="#6b7280"
            keyboardType="number-pad"
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.submitButton, !canSubmit && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Submit Request</Text>
        </TouchableOpacity>
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.modalIconCircle}><Ionicons name="help-circle" size={32} color="#e91e63" /></View></View>
            <Text style={styles.modalTitle}>Confirm Request</Text>
            <Text style={styles.modalSubtitle}>Please confirm your details before submitting</Text>
            <View style={styles.requestDetailsCard}>
              <View style={styles.detailRow}><Ionicons name="person" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{name}</Text></View>
              <View style={styles.detailRow}><Ionicons name="call" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Phone:</Text><Text style={styles.detailValue}>{phone}</Text></View>
              <View style={styles.detailRow}><Ionicons name="camera" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Type:</Text><Text style={styles.detailValue}>{eventType}</Text></View>
              <View style={styles.detailRow}><Ionicons name="calendar" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Date:</Text><Text style={styles.detailValue}>{eventDate}</Text></View>
              {budget ? (<View style={styles.detailRow}><Ionicons name="cash" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Budget:</Text><Text style={styles.detailValue}>{budget}</Text></View>) : null}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowConfirmModal(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmSubmit}><Text style={styles.modalConfirmText}>Confirm</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}><View style={styles.loadingCard}><ActivityIndicator size="large" color="#e91e63" /><Text style={{ marginTop: 12, color: '#374151' }}>Submitting...</Text></View></View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}><View style={[styles.modalIconCircle,{ backgroundColor: '#10b98122', borderColor: '#10b981' }]}><Ionicons name="checkmark-circle" size={32} color="#10b981" /></View></View>
            <Text style={styles.modalTitle}>Request Submitted</Text>
            <Text style={styles.modalSubtitle}>Your request has been placed successfully</Text>
            {requestCode ? <Text style={{ marginTop: 6, fontWeight: '700', color: '#111827' }}>Ref: {requestCode}</Text> : null}
            <TouchableOpacity style={[styles.modalConfirmButton,{ marginTop: 14 }]} onPress={closeSuccess}><Text style={styles.modalConfirmText}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide" onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.monthNavButton}><Ionicons name="chevron-back" size={20} color="#6b7280" /></TouchableOpacity>
              <Text style={styles.monthYearText}>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.monthNavButton}><Ionicons name="chevron-forward" size={20} color="#6b7280" /></TouchableOpacity>
            </View>
            <View style={styles.weekDaysContainer}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (<Text key={d} style={styles.weekDayText}>{d}</Text>))}</View>
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, idx) => dayData ? (
                <TouchableOpacity key={idx} style={[styles.calendarDay, dayData.isToday && styles.todayDay, dayData.isSelected && styles.selectedDay, dayData.isPast && styles.pastDay]} onPress={() => !dayData.isPast && selectDate(dayData.date)} disabled={dayData.isPast}>
                  <Text style={[styles.dayText, dayData.isToday && styles.todayText, dayData.isSelected && styles.selectedText, dayData.isPast && styles.pastText]}>{dayData.day}</Text>
                </TouchableOpacity>
              ) : (<View key={idx} style={styles.emptyDay} />))}
            </View>
            <View style={styles.calendarButtonContainer}>
              <TouchableOpacity style={styles.calendarCancelButton} onPress={cancelDateSelection}><Text style={styles.calendarCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.calendarConfirmButton} onPress={confirmDateSelection}><Text style={styles.calendarConfirmText}>Done</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  headerGradient: { backgroundColor: "#e91e63", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: "#fff", height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 14, color: "#111827", fontSize: 15 },
  select: { backgroundColor: "#fff", height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 14, color: "#111827", fontSize: 15, alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  selectText: { color: "#111827", fontSize: 15, fontWeight: "600" },
  dropdown: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", marginTop: 8, overflow: "hidden" },
  option: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  optionText: { color: "#374151", fontSize: 15 },
  submitButton: { marginTop: 8, backgroundColor: "#111827", height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  // Modals shared styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  confirmModalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  successModalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center' },
  loadingCard: { width: '70%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center' },
  modalIconContainer: { alignItems: 'center', marginBottom: 8 },
  modalIconCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#e91e63', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fde7ef' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginTop: 4 },
  modalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 4 },
  requestDetailsCard: { marginTop: 12, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailLabel: { marginLeft: 6, color: '#6b7280', fontSize: 12 },
  detailValue: { marginLeft: 6, color: '#111827', fontWeight: '600', fontSize: 12 },
  modalButtonContainer: { flexDirection: 'row', gap: 10, marginTop: 12 },
  modalCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center' },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  // Calendar styles
  calendarModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthNavButton: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  monthYearText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  weekDaysContainer: { flexDirection: 'row', marginBottom: 10 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7280', paddingVertical: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  emptyDay: { width: '14.285%', height: 40 },
  calendarDay: { width: '14.285%', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  todayDay: { backgroundColor: '#fef2f2' },
  selectedDay: { backgroundColor: '#ef4444' },
  pastDay: { opacity: 0.3 },
  dayText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  todayText: { color: '#ef4444', fontWeight: '700' },
  selectedText: { color: '#ffffff', fontWeight: '700' },
  pastText: { color: '#9ca3af' },
  calendarButtonContainer: { flexDirection: 'row', gap: 10 },
  calendarCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  calendarCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  calendarConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center' },
  calendarConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});


