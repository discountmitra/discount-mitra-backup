import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, ActivityIndicator, Animated, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { defaultImage } from "../constants/assets";
import { healthcareData, HealthcareProvider } from "../constants/healthcareData";
import LikeButton from "../components/common/LikeButton";

export default function VeterinaryDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const id = (params.id as string) || "";
  const headerImage = typeof params.image === 'string' ? (params.image as string) : "";

  const vet: HealthcareProvider | undefined = useMemo(() => healthcareData.find(h => h.id === id), [id]);

  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [petType, setPetType] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; pet?: string }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  const shimmerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmerAnim]);

  if (!vet) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#111827', fontWeight: '700', fontSize: 16 }}>Service not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: '#ef4444', fontWeight: '700' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayImage = headerImage || vet.image || "";

  const handleCall = async () => {
    const phone = 'tel:' + (vet.phone || '');
    if (!vet.phone) return;
    const supported = await Linking.canOpenURL(phone);
    if (supported) Linking.openURL(phone);
  };

  const handleRequest = () => {
    const newErrors: { name?: string; phone?: string; pet?: string } = {};
    if (!ownerName.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(ownerPhone.trim())) newErrors.phone = 'Enter valid 10-digit phone';
    if (!petType.trim()) newErrors.pet = 'Pet/Animal type is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setShowConfirmModal(true);
  };

  const confirmRequest = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setTimeout(() => {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      setBookingCode(code);
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const closeSuccess = () => {
    setShowSuccessModal(false);
    setOwnerName("");
    setOwnerPhone("");
    setPetType("");
    setNotes("");
    setErrors({});
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#ef4444" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Veterinary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.heroCard}>
          <Animated.View pointerEvents="none" style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-200, 400] }) }] } ]}>
            <View style={{ flex: 1 }} />
          </Animated.View>
          <Image source={displayImage && /^https?:\/\//.test(displayImage) ? { uri: displayImage } : defaultImage} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroMeta}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{vet.name}</Text>
              <Text style={styles.location}>{vet.location}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                <Ionicons name="call" size={16} color="#111827" />
              </TouchableOpacity>
              <LikeButton
                item={{ id: vet.id, name: vet.name, category: 'Healthcare', subcategory: 'Veterinary', image: displayImage, description: vet.location, location: vet.location, address: vet.location, phone: vet.phone }}
                style={styles.likeBtn}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.infoText}>{vet.specialOffers.join(' • ') || 'Veterinary pharmacy and supplies for pets and livestock.'}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.bookingHeader}>
            <Text style={styles.sectionTitle}>Request Medicines/Items</Text>
            <View style={styles.modeBadge}><Text style={styles.modeBadgeText}>Healthcare</Text></View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Owner Name</Text>
            <TextInput value={ownerName} onChangeText={setOwnerName} placeholder="Enter full name" placeholderTextColor="#9ca3af" style={styles.input} />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Phone</Text>
            <TextInput value={ownerPhone} onChangeText={(t) => { const d = t.replace(/\D/g, ''); if (d.length <= 10) setOwnerPhone(d); }} placeholder="10-digit mobile number" placeholderTextColor="#9ca3af" keyboardType="phone-pad" style={styles.input} />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Pet / Animal Type</Text>
            <TextInput value={petType} onChangeText={setPetType} placeholder="e.g., Dog, Cow, Goat, Hen" placeholderTextColor="#9ca3af" style={styles.input} />
            {errors.pet ? <Text style={styles.errorText}>{errors.pet}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Required Medicines / Notes</Text>
            <TextInput value={notes} onChangeText={setNotes} placeholder="List items and quantities (if known)" placeholderTextColor="#9ca3af" style={[styles.input, { height: 90, textAlignVertical: 'top' }]} multiline />
          </View>

          <TouchableOpacity style={styles.requestBtn} onPress={handleRequest}>
            <Ionicons name="send" size={16} color="#fff" />
            <Text style={styles.requestBtnText}>Send Request</Text>
          </TouchableOpacity>
          <Text style={styles.note}>We will forward your request to the store and contact you shortly.</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Confirm Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}><Ionicons name="help-circle" size={32} color="#ef4444" /></View>
            <Text style={styles.modalTitle}>Send Request?</Text>
            <Text style={styles.modalSubtitle}>We will forward your request to {vet.name}.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setShowConfirmModal(false)}><Text style={styles.modalBtnSecondaryText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={confirmRequest}><Ionicons name="send" size={18} color="#fff" /><Text style={styles.modalBtnPrimaryText}>Send</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#ef4444" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      </Modal>

      {/* Success */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}><Ionicons name="checkmark-circle" size={48} color="#10b981" /></View>
            <Text style={styles.successTitle}>Request Sent!</Text>
            <Text style={styles.successSubtitle}>Your request has been forwarded</Text>
            <View style={styles.codeBox}><Text style={styles.codeLabel}>Ref Code</Text><Text style={styles.codeValue}>{bookingCode}</Text></View>
            <TouchableOpacity style={styles.successBtn} onPress={closeSuccess}><Text style={styles.successBtnText}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ef4444' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },

  heroCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  shimmerOverlay: { position: 'absolute', top: 0, bottom: 0, width: 180, opacity: 0.15 },
  heroImage: { width: '100%', height: 200 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  name: { fontSize: 18, fontWeight: '900', color: '#111827' },
  location: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  likeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 14, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#374151' },

  bookingHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  modeBadge: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  modeBadgeText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  formRow: { marginTop: 12 },
  label: { fontSize: 12, color: '#374151', marginBottom: 6, fontWeight: '700' },
  input: { height: 44, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, color: '#111827', fontWeight: '600' },
  requestBtn: { marginTop: 16, height: 48, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  requestBtnText: { color: '#fff', fontWeight: '800', marginLeft: 8 },
  note: { marginTop: 10, fontSize: 12, color: '#6b7280' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIcon: { alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 18 },
  modalButtons: { flexDirection: 'row', gap: 10 },
  modalBtnSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalBtnSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalBtnPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalBtnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  loadingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  successCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIcon: { alignItems: 'center', marginBottom: 12 },
  successTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 },
  codeBox: { alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', marginBottom: 16 },
  codeLabel: { fontSize: 12, color: '#6b7280' },
  codeValue: { fontSize: 22, fontWeight: '900', color: '#ef4444', marginTop: 4 },
  successBtn: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  successBtnText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});








