import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AutomobileDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const service = useMemo(() => ({
    id: (params.id as string) || "",
    name: (params.name as string) || "Service",
    specialist: (params.specialist as string) || "",
    description: (params.description as string) || "",
    buttonType: (params.buttonType as string) || "request",
  }), [params]);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [issueNotes, setIssueNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string; date?: string }>({});
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestCode, setRequestCode] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [preferredDate, setPreferredDate] = useState("");

  const faqData = [
    {
      question: "How long does vehicle inspection or repair take?",
      answer: "Basic inspection takes 30-60 minutes, minor repairs 2-4 hours, and major repairs may take 1-3 days depending on parts availability."
    },
    {
      question: "Are genuine spare parts used?",
      answer: "We use only genuine OEM parts or high-quality aftermarket parts with manufacturer warranty. Customer preference is always considered."
    },
    {
      question: "Can I get a cost estimate before work begins?",
      answer: "Absolutely! We provide detailed cost estimates after initial inspection. No work begins without your approval of the quoted price."
    }
  ];

  const handleRequest = () => {
    const newErrors: { name?: string; phone?: string; address?: string; date?: string } = {};
    if (!userName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(userPhone.trim())) newErrors.phone = "Enter valid 10-digit phone";
    if (address.trim().length < 6) newErrors.address = "Enter full address";
    if (!preferredDate.trim()) newErrors.date = "Select preferred date";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmRequest = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    
    // Simulate API call with 2 second delay
    setTimeout(() => {
      const uniqueCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      setRequestCode(uniqueCode);
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Clear form
    setUserName("");
    setUserPhone("");
    setAddress("");
    setPreferredDate("");
    setIssueNotes("");
    setErrors({});
    router.back();
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const getButtonText = () => {
    return service.buttonType === 'request' ? 'Request Now' : 'Pay Now';
  };

  const getButtonColor = () => {
    return service.buttonType === 'request' ? '#059669' : '#dc2626';
  };

  const formatSpecialistText = (text: string) => {
    return text.replace(/\\n/g, '\n');
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const confirmDateSelection = () => {
    // Format date as DD-MM-YYYY to avoid timezone issues
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setPreferredDate(formattedDate);
    setErrors(prev => ({ ...prev, date: undefined }));
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < today && !isToday;
      
      days.push({ day, date, isToday, isSelected, isPast });
    }
    
    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>{service.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerTag}>Automobiles</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Image source={require("../assets/default.png")} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <View style={styles.heroHeader}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{getButtonText()}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="car-sport" size={14} color="#059669" />
              <Text style={styles.metaText}>Automobile Services</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="checkmark-circle" size={14} color="#6b7280" />
              <Text style={styles.metaText}>Verified & Trusted Provider</Text>
            </View>
          </View>
        </View>

        {/* Service Description */}
        <View style={styles.descriptionCard}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.sectionTitle}>Service Details</Text>
          </View>
          
          {service.specialist && (
            <View style={styles.specialistSection}>
              <Text style={styles.specialistTitle}>Specialization</Text>
              <Text style={styles.specialistText}>{formatSpecialistText(service.specialist)}</Text>
            </View>
          )}

          {service.description && (
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalTitle}>Additional Information</Text>
              <Text style={styles.additionalText}>{service.description}</Text>
            </View>
          )}
        </View>

        {/* Request Form */}
        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.sectionTitle}>Request This Service</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Professional Service</Text>
            </View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput 
              value={userName} 
              onChangeText={setUserName} 
              placeholder="Full name" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput 
              value={userPhone} 
              onChangeText={setUserPhone} 
              placeholder="10-digit mobile number" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
              keyboardType="numeric"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput 
              value={address} 
              onChangeText={setAddress} 
              placeholder="Full address with landmarks" 
              placeholderTextColor="#9ca3af" 
              style={styles.textArea} 
              multiline 
              numberOfLines={3}
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Preferred Date</Text>
            <TouchableOpacity onPress={openDatePicker} style={styles.dateInputContainer}>
              <TextInput 
                value={preferredDate} 
                placeholder="Select date" 
                placeholderTextColor="#9ca3af" 
                style={styles.dateInput}
                editable={false}
                pointerEvents="none"
              />
              <Ionicons name="calendar-outline" size={20} color="#6b7280" style={styles.calendarIcon} />
            </TouchableOpacity>
            {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
            <TextInput 
              value={issueNotes} 
              onChangeText={setIssueNotes} 
              placeholder="Any specific requirements or notes" 
              placeholderTextColor="#9ca3af" 
              style={styles.textArea} 
              multiline 
              numberOfLines={3}
            />
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={handleRequest} style={[styles.submitButton, { backgroundColor: getButtonColor() }]}>
            <Text style={styles.submitText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqData.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons 
                    name={expandedFAQ === index ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
                {expandedFAQ === index && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="help-circle" size={32} color="#059669" />
              </View>
            </View>
            
            <Text style={styles.modalTitle}>Confirm Request</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to submit this service request?</Text>
            
            <View style={styles.requestDetailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="construct" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Service:</Text>
                <Text style={styles.detailValue}>{service.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="person" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{userName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{userPhone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{preferredDate}</Text>
              </View>
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalButtonSecondary}
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButtonPrimary}
                onPress={confirmRequest}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Yes, Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#059669" />
              <Text style={styles.loadingText}>Processing your request...</Text>
              <Text style={styles.loadingSubtext}>Please wait while we submit your service request</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              </View>
            </View>
            
            <Text style={styles.successModalTitle}>Request Submitted!</Text>
            <Text style={styles.successModalSubtitle}>Your service request has been successfully submitted</Text>
            
            <View style={styles.successDetailsCard}>
              <View style={styles.requestCodeContainer}>
                <Text style={styles.requestCodeLabel}>Request Code</Text>
                <Text style={styles.requestCodeValue}>{requestCode}</Text>
                <Text style={styles.requestCodeNote}>Keep this code for reference</Text>
              </View>
              
              <View style={styles.contactInfoCard}>
                <Ionicons name="time" size={20} color="#10b981" />
                <Text style={styles.contactInfoText}>Our team will contact you within 2 hours to confirm the service</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.successButton}
              onPress={closeSuccessModal}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
                <Ionicons name="chevron-back" size={20} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    dayData?.isToday && styles.todayDay,
                    dayData?.isSelected && styles.selectedDay,
                    dayData?.isPast && styles.pastDay,
                    !dayData && styles.emptyDay
                  ]}
                  onPress={() => dayData && !dayData.isPast && selectDate(dayData.date)}
                  disabled={!dayData || dayData.isPast}
                >
                  <Text style={[
                    styles.calendarDayText,
                    dayData?.isToday && styles.todayText,
                    dayData?.isSelected && styles.selectedText,
                    dayData?.isPast && styles.pastText
                  ]}>
                    {dayData?.day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.calendarButtonContainer}>
              <TouchableOpacity
                style={styles.calendarCancelButton}
                onPress={cancelDateSelection}
              >
                <Text style={styles.calendarCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calendarConfirmButton}
                onPress={confirmDateSelection}
              >
                <Text style={styles.calendarConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerContainer: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  headerTop: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6", marginRight: 16 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  headerActions: { marginLeft: 16 },
  headerTag: { backgroundColor: "#059669", color: "#ffffff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, fontSize: 12, fontWeight: "600" },
  content: { flex: 1 },
  heroCard: { backgroundColor: "#ffffff", margin: 20, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" },
  heroImage: { width: "100%", height: 200 },
  heroBody: { padding: 20 },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  serviceName: { flex: 1, fontSize: 20, fontWeight: "700", color: "#111827", marginRight: 12 },
  badgePill: { backgroundColor: "#dcfce7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#16a34a" },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  metaText: { marginLeft: 8, fontSize: 14, color: "#6b7280" },
  descriptionCard: { backgroundColor: "#ffffff", marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  descriptionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  specialistSection: { marginBottom: 16 },
  specialistTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 8 },
  specialistText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  additionalInfo: { borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 16 },
  additionalTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 8 },
  additionalText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  requestCard: { backgroundColor: "#ffffff", marginHorizontal: 20, marginBottom: 40, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  requestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  badge: { backgroundColor: "#eff6ff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff" },
  textArea: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff", textAlignVertical: "top" },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  submitButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  submitText: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
  faqCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  
  // Date Input and Calendar Styles
  dateInputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  dateInput: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#ffffff', paddingRight: 45 },
  calendarIcon: { position: 'absolute', right: 12 },
  
  // Modal Overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  
  // Confirmation Modal
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  requestDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#6b7280', marginLeft: 6, marginRight: 8, minWidth: 65 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#059669', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  
  // Loading Modal
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingContainer: { alignItems: 'center' },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  
  // Success Modal
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successModalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  successDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 },
  requestCodeContainer: { alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  requestCodeLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  requestCodeValue: { fontSize: 24, fontWeight: '700', color: '#059669', letterSpacing: 1, marginBottom: 6 },
  requestCodeNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  contactInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10 },
  contactInfoText: { fontSize: 13, color: '#15803d', marginLeft: 10, flex: 1, fontWeight: '500' },
  successButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  
  // Calendar Modal (aligned with Automobile theme)
  calendarContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navButton: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  monthYear: { fontSize: 18, fontWeight: '700', color: '#111827' },
  weekDays: { flexDirection: 'row', marginBottom: 10 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7280', paddingVertical: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  calendarDay: { width: '14.285%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  emptyDay: { backgroundColor: 'transparent' },
  todayDay: { backgroundColor: '#f0fdf4' },
  selectedDay: { backgroundColor: '#059669' },
  pastDay: { opacity: 0.3 },
  calendarDayText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  todayText: { color: '#059669', fontWeight: '700' },
  selectedText: { color: '#ffffff', fontWeight: '700' },
  pastText: { color: '#9ca3af' },
  closeCalendarButton: { marginTop: 20, paddingVertical: 12, backgroundColor: '#f3f4f6', borderRadius: 8, alignItems: 'center' },
  closeCalendarText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  
  // Calendar Button Container
  calendarButtonContainer: { flexDirection: 'row', gap: 10, marginTop: 20 },
  calendarCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  calendarCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  calendarConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#059669', alignItems: 'center' },
  calendarConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});
