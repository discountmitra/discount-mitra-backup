import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface FinancialService {
  'Sub-Categorie': string;
  Name: string;
  Specialist: string;
  Description: string;
  Button: string;
}

export default function FinancialDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { serviceId } = params;
  
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const financialData: FinancialService[] = [
    {
      "Sub-Categorie": "Banking",
      "Name": "Loans",
      "Specialist": "Any Loan, Personal Loan, Home Loan, Gold Loan, Business Loan, Education Loan Assistance, Agriculture Loan Guidance",
      "Description": "On Time, No extra Charges",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Banking",
      "Name": "Credit Card",
      "Specialist": "Any Credit Card, SBI - ICICI - HDFC & More",
      "Description": "On Time, Spl Gifts",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Banking",
      "Name": "Debit Card",
      "Specialist": "Any Debit Card",
      "Description": "Less process",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Banking",
      "Name": "Current Account",
      "Specialist": "Current Account",
      "Description": "Less Paper Work",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Banking",
      "Name": "FD",
      "Specialist": "Best advice and best interest rates",
      "Description": "On Time",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Insurance - Policy",
      "Name": "Life Insurance Policies",
      "Specialist": "",
      "Description": "Provides financial support to the family in case of unexpected situations in life.",
      "Button": "25% Discount"
    },
    {
      "Sub-Categorie": "Insurance - Policy",
      "Name": "Health Insurance Policies",
      "Specialist": "",
      "Description": "Covers hospital expenses and medical treatment costs.",
      "Button": "25% Discount"
    },
    {
      "Sub-Categorie": "Insurance - Policy",
      "Name": "Motor Insurance Policies",
      "Specialist": "",
      "Description": "Protection against accidents, theft, or damage for cars, bikes, or autos.",
      "Button": "25% Discount"
    },
    {
      "Sub-Categorie": "Insurance - Policy",
      "Name": "Home & Property Insurance Policies",
      "Specialist": "",
      "Description": "Covers damage to houses, shops, or property from fire, theft, or natural calamities.",
      "Button": "25% Discount"
    },
    {
      "Sub-Categorie": "Insurance - Policy",
      "Name": "Travel Insurance Policies",
      "Specialist": "",
      "Description": "Covers accidents, medical emergencies, or luggage loss while traveling.",
      "Button": "25% Discount"
    },
    {
      "Sub-Categorie": "Insurance - Policy",
      "Name": "Personal Accident Policies",
      "Specialist": "",
      "Description": "Compensation for injury or death caused by accidents.",
      "Button": "25% Discount"
    },
    {
      "Sub-Categorie": "Insurance - Policy",
      "Name": "Business/Commercial Insurance Policies",
      "Specialist": "",
      "Description": "Provides protection for property loss, employee safety, and liability for businesses.",
      "Button": "25% Discount"
    },
    {
      "Sub-Categorie": "Tax & Compliance",
      "Name": "Income Tax Filing",
      "Specialist": "Fast Service",
      "Description": "10% Discount",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Tax & Compliance",
      "Name": "GST Registration & Filing",
      "Specialist": "Fast Service",
      "Description": "10% Discount",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Tax & Compliance",
      "Name": "Pan & Tan Services",
      "Specialist": "Fast Service",
      "Description": "10% Discount",
      "Button": "Request Now"
    },
    {
      "Sub-Categorie": "Tax & Compliance",
      "Name": "Professional Tax Filing",
      "Specialist": "Fast Service",
      "Description": "10% Discount",
      "Button": "Request Now"
    }
  ];

  // Find the specific service data with better matching logic
  const currentService = useMemo(() => {
    // Map the serviceId back to our financial data
    const serviceMap: { [key: string]: string } = {
      'any-loan-personal-home-gold-business-education-agriculture': 'Loans',
      'any-credit-card-sbi-icici-hdfc--more': 'Credit Card',
      'any-debit-card': 'Debit Card',
      'current-account': 'Current Account',
      'best-fd-advice--interest-rates': 'FD',
      'life-insurance-policies': 'Life Insurance Policies',
      'health-insurance-policies': 'Health Insurance Policies',
      'motor-insurance-policies': 'Motor Insurance Policies',
      'home--property-insurance': 'Home & Property Insurance Policies',
      'travel-insurance-policies': 'Travel Insurance Policies',
      'personal-accident-policies': 'Personal Accident Policies',
      'business--commercial-policies': 'Business/Commercial Insurance Policies',
      'income-tax-filing': 'Income Tax Filing',
      'gst-registration--filing': 'GST Registration & Filing',
      'pan--tan-services': 'Pan & Tan Services',
      'professional-tax-filing': 'Professional Tax Filing'
    };
    
    // Find by mapped name
    const mappedName = serviceMap[serviceId as string];
    if (mappedName) {
      const service = financialData.find(s => s.Name === mappedName);
      if (service) return service;
    }
    
    // Fallback: try direct name matching
    const service = financialData.find(s => 
      s.Name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === serviceId
    );
    
    return service || financialData[0]; // fallback to first item
  }, [serviceId]);

  const service = useMemo(() => ({
    id: serviceId as string || '',
    name: currentService.Name,
    category: currentService['Sub-Categorie'],
    specialist: currentService.Specialist,
    description: currentService.Description,
    rating: 4.7,
    reviews: 156,
  }), [currentService, serviceId]);

  const handleRequest = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(phoneNumber.trim())) newErrors.phone = 'Enter valid 10-digit phone';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter valid email';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setRequestId(Math.random().toString(36).slice(2, 8).toUpperCase());
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };
  const closeSuccess = () => { setShowSuccessModal(false); router.back(); };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Banking': return 'card';
      case 'Insurance - Policy': return 'shield-checkmark';
      case 'Tax & Compliance': return 'document-text';
      default: return 'briefcase';
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How long does the process take?",
      answer: "Most applications are processed within 24-48 hours with all required documents."
    },
    {
      question: "What documents are required?",
      answer: "Basic KYC documents like ID proof, address proof, and income documents as applicable."
    },
    {
      question: "Is there any hidden charges?",
      answer: "No, we believe in complete transparency. All charges are disclosed upfront."
    }
  ];

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
            <Text style={styles.headerTag}>Financial Services</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Image source={require('../assets/default.png')} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <View style={styles.heroHeader}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.ratingText}>{service.rating}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name={getCategoryIcon(service.category)} size={14} color="#6b7280" />
              <Text style={styles.metaText}>{service.category}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{service.reviews} clients served</Text>
            </View>
            {service.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{service.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Service Details */}
        {service.specialist && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.specialistContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#1e40af" />
              <Text style={styles.specialistText}>{service.specialist}</Text>
            </View>
          </View>
        )}

        {/* Process & Timeline */}
        <View style={styles.processCard}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.processList}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Submit Request</Text>
                <Text style={styles.stepDescription}>Fill out the form with your requirements</Text>
              </View>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Expert Review</Text>
                <Text style={styles.stepDescription}>Our specialists review your application</Text>
              </View>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Quick Approval</Text>
                <Text style={styles.stepDescription}>Get approved with minimal documentation</Text>
              </View>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Service Delivery</Text>
                <Text style={styles.stepDescription}>Receive your service on time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Request Form */}
        <View style={styles.requestCard}>
          <Text style={styles.sectionTitle}>Request Service</Text>
          
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput 
              value={customerName} 
              onChangeText={setCustomerName} 
              placeholder="Full name" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput 
              value={phoneNumber} 
              onChangeText={setPhoneNumber} 
              placeholder="10-digit mobile number" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
              keyboardType="numeric"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput 
              value={email} 
              onChangeText={setEmail} 
              placeholder="your.email@example.com" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Service Type</Text>
            <TextInput 
              value={serviceType} 
              onChangeText={setServiceType} 
              placeholder="Specify the type of service needed" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Requirements</Text>
            <TextInput 
              value={requirements} 
              onChangeText={setRequirements} 
              placeholder="Describe your requirements or any specific details..." 
              placeholderTextColor="#9ca3af" 
              style={[styles.input, styles.textArea]} 
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={handleRequest} 
            style={styles.requestButton}
          >
            <Text style={styles.requestButtonText}>{currentService.Button}</Text>
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
      </ScrollView>
      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.modalIconCircle}><Ionicons name="help-circle" size={32} color="#16A085" /></View></View>
            <Text style={styles.modalTitle}>Confirm Request</Text>
            <Text style={styles.modalSubtitle}>Please confirm your details before submitting</Text>
            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}><Ionicons name="business" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Service:</Text><Text style={styles.detailValue}>{service.name}</Text></View>
              <View style={styles.detailRow}><Ionicons name="person" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{customerName}</Text></View>
              <View style={styles.detailRow}><Ionicons name="call" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Phone:</Text><Text style={styles.detailValue}>{phoneNumber}</Text></View>
              <View style={styles.detailRow}><Ionicons name="mail" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Email:</Text><Text style={styles.detailValue}>{email}</Text></View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirmModal(false)} activeOpacity={0.8}><Text style={styles.modalButtonSecondaryText}>Edit</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonPrimary, { backgroundColor: '#16A085' }]} onPress={confirmSubmit} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#16A085" />
            <Text style={styles.loadingText}>Submitting your request...</Text>
            <Text style={styles.loadingSubtext}>Please wait a moment</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.successIconCircle}><Ionicons name="checkmark-circle" size={48} color="#10b981" /></View></View>
            <Text style={styles.successModalTitle}>Request Submitted</Text>
            <View style={styles.successDetailsCard}>
              <View style={styles.bookingCodeContainer}>
                <Text style={styles.bookingCodeLabel}>Request ID</Text>
                <Text style={styles.bookingCodeValue}>{requestId}</Text>
                <Text style={styles.bookingCodeNote}>Our advisor will contact you within 24 hours</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.successButton, { backgroundColor: '#16A085' }]} onPress={closeSuccess} activeOpacity={0.8}><Text style={styles.successButtonText}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerContainer: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', marginRight: 16 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerActions: { marginLeft: 16 },
  headerTag: { backgroundColor: '#1e40af', color: '#ffffff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, fontSize: 12, fontWeight: '600' },
  content: { flex: 1 },
  heroCard: { backgroundColor: '#ffffff', margin: 20, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  heroImage: { width: '100%', height: 200 },
  heroBody: { padding: 20 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  serviceName: { flex: 1, fontSize: 20, fontWeight: '700', color: '#111827', marginRight: 12 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingText: { marginLeft: 4, fontSize: 14, fontWeight: '600', color: '#d97706' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { marginLeft: 8, fontSize: 14, color: '#6b7280' },
  descriptionContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  descriptionText: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  detailsCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  specialistContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  specialistText: { marginLeft: 8, fontSize: 14, color: '#374151', lineHeight: 20, flex: 1 },
  featuresCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  featuresList: { gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureText: { marginLeft: 8, fontSize: 14, color: '#374151', fontWeight: '500' },
  requestCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 40, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#ffffff' },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: '#dc2626', marginTop: 4 },
  requestButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e40af' },
  requestButtonText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  // Modals (borrowed from healthcare styling)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  bookingDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#6b7280', marginLeft: 6, marginRight: 8, minWidth: 65 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 },
  bookingCodeContainer: { alignItems: 'center', marginBottom: 4 },
  bookingCodeLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  bookingCodeValue: { fontSize: 24, fontWeight: '700', color: '#16A085', letterSpacing: 1, marginBottom: 6 },
  bookingCodeNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  successButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#10b981' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  // Process Section Styles
  processCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  processList: { gap: 16 },
  processStep: { flexDirection: 'row', alignItems: 'flex-start' },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1e40af', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNumberText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  stepDescription: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  // Benefits Section Styles
  benefitsCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  benefitsList: { gap: 16 },
  benefitItem: { flexDirection: 'row', alignItems: 'flex-start' },
  benefitContent: { flex: 1, marginLeft: 12 },
  benefitTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  benefitDescription: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  // FAQ Section Styles
  faqCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
});
