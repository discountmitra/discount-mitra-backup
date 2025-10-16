import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Linking,
  Modal,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { getHospitalById } from "../constants/hospitalData";
import { defaultImage } from "../constants/assets";
import { useState, useMemo, useRef, useEffect } from "react";
import { useVip } from "../contexts/VipContext";
import LikeButton from "../components/common/LikeButton";
import { LinearGradient } from 'expo-linear-gradient';
import OfferCards from "../components/common/OfferCards";
import { hospitalFaq as faqData } from "../constants/faqData";

export default function HospitalDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { userMode, isVip } = useVip();
  const hospitalId = (params.id as string) || "";
  const headerImage = typeof params.image === 'string' ? (params.image as string) : "";
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    age?: string;
    date?: string;
    pet?: string;
  }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  // Removed payment popup flow (₹9). Booking is now free in-app; OP fee is payable at hospital as per mode.
  
  // Shimmer animation for VIP card
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmerAnim]);



  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const hospital = useMemo(() => getHospitalById(hospitalId), [hospitalId]);
  const isPharmacy = hospital?.category === 'Pharmacy';
  const isYaminiVeterinary = hospital?.id === 'yamini-veterinary';
  const [petType, setPetType] = useState("");
  
  // Use hospital's first photo if no headerImage is provided
  const displayImage = headerImage || (hospital?.photos && hospital.photos.length > 0 ? hospital.photos[0] : "");

  // Function to summarize offer text
  const summarizeOffer = (offerText: string) => {
    const lines = offerText.split('\n');
    return lines.map(line => {
      const trimmed = line.trim();
      // Shorten common patterns
      if (trimmed.includes('Book OP for ₹') && trimmed.includes('(No discount in OP)')) {
        const price = trimmed.match(/₹(\d+)/)?.[1];
        return `OP: ₹${price}`;
      }
      if (trimmed.includes('OP: ₹') && trimmed.includes('OFF - Pay only')) {
        const finalPrice = trimmed.match(/Pay only (\d+)/)?.[1];
        return `OP: ₹${finalPrice}`;
      }
      if (trimmed.includes('Get') && trimmed.includes('Discount on Lab & IP Services')) {
        const discount = trimmed.match(/(\d+)%/)?.[1];
        return `Lab & IP: ${discount}% off`;
      }
      if (trimmed.includes('Plus') && trimmed.includes('Discount on Pharmacy')) {
        const discount = trimmed.match(/(\d+)%/)?.[1];
        return `Pharmacy: ${discount}% off`;
      }
      if (trimmed.includes('Discount on Spectacles')) {
        const discount = trimmed.match(/(\d+)%/)?.[1];
        return `Spectacles: ${discount}% off`;
      }
      // Keep original if no pattern matches
      return trimmed;
    });
  };

  if (!hospital) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text style={{ color: "#111827", fontWeight: "700", fontSize: 16 }}>
          Hospital not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: "#ef4444", fontWeight: "700" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCall = async () => {
    const phone =
      "tel:" + ("phone" in hospital ? (hospital as any).phone || "" : "");
    if (!phone || phone === "tel:") {
      return;
    }
    const supported = await Linking.canOpenURL(phone);
    if (supported) {
      Linking.openURL(phone);
    }
  };

  const handleBook = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      age?: string;
      date?: string;
      pet?: string;
    } = {};
    if (!patientName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(patientPhone.trim()))
      newErrors.phone = "Enter valid 10-digit phone";
    if (!isPharmacy) {
      if (!/^\d{1,3}$/.test(patientAge.trim())) newErrors.age = "Enter valid age";
      if (!/^\d{2}-\d{2}-\d{4}$/.test(preferredDate.trim()))
        newErrors.date = "Use DD-MM-YYYY";
    }
    if (isYaminiVeterinary && !petType.trim()) newErrors.pet = 'Pet/Animal type is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Directly show confirmation modal (no in-app fee). OP amount is payable at hospital.
    setShowConfirmModal(true);
  };


  const confirmBooking = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    // Simulate API call with 2 second delay
    setTimeout(() => {
      const uniqueCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      setBookingCode(uniqueCode);
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Clear form
    setPatientName("");
    setPatientPhone("");
    setPatientAge("");
    setPreferredDate("");
    setNotes("");
    setErrors({});
    router.back();
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      setPreferredDate(formattedDate);
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < today && !isToday;

      days.push({ day, date, isToday, isSelected, isPast });
    }

    return days;
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const confirmDateSelection = () => {
    // Format date as DD-MM-YYYY to avoid timezone issues
    const day = selectedDate.getDate().toString().padStart(2, "0");
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setPreferredDate(formattedDate);
    setErrors((prev) => ({ ...prev, date: undefined }));
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const onScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 100);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      {showStickyHeader && (
        <View style={styles.stickyHeader}>
          <View style={styles.stickyHeaderContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.stickyHeaderInfo}>
              <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{hospital.name}</Text>
              <View style={styles.stickyHeaderDetails}>
                <Text style={styles.stickyHeaderRating}>Healthcare</Text>
                <Text style={styles.stickyHeaderPrice}>{hospital.specialist}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.likeButton}
              onPress={handleCall}
            >
              <Ionicons 
                name="call" 
                size={24} 
                color="#111827" 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Background */}
        <View style={styles.heroSection}>
          <Image 
            source={displayImage && /^https?:\/\//.test(displayImage) ? { uri: displayImage } : defaultImage} 
            style={styles.heroBackgroundImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          
          {/* Top Action Buttons */}
          <View style={styles.heroTopActions}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.heroBackButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.heroRightActions}>
              <TouchableOpacity style={styles.heroCallButton} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#111827" />
              </TouchableOpacity>
              <LikeButton 
                item={{
                  id: hospital.id,
                  name: hospital.name,
                  category: 'Healthcare',
                  subcategory: hospital.category,
                  image: displayImage,
                  description: hospital.description,
                  location: hospital.description.split("\n")[1] || "",
                  address: hospital.description.split("\n")[1] || "",
                  phone: "phone" in hospital ? (hospital as any).phone || "" : "",
                }}
                size={24}
                style={[styles.heroLikeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              />
            </View>
          </View>
        </View>
          
        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Hospital Info Card */}
          <View style={styles.hospitalInfoCard}>
            <View style={styles.hospitalInfoHeader}>
              <View style={styles.hospitalIcon}>
                <Ionicons name="medkit" size={24} color="#ef4444" />
              </View>
              <View style={styles.hospitalInfoMain}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <View style={styles.hospitalLocation}>
                  <Ionicons name="location" size={12} color="#ef4444" />
                  <Text style={styles.hospitalLocationText}>
                    {hospital.description.split("\n")[1] || ""}
                  </Text>
                </View>
                <View style={styles.hospitalMeta}>
                  <Text style={styles.hospitalPrice}>{hospital.specialist}</Text>
                </View>
                <View style={styles.hospitalRating}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>4.5</Text>
                    <Text style={styles.reviewsText}>(250)</Text>
                  </View>
                  <View style={styles.budgetTag}>
                    <Text style={styles.budgetTagText}>Healthcare</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

        {/* About / Specialty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Services</Text>
          <Text style={styles.infoText}>
            {hospital.specialist} – Expert care and patient-first approach.
          </Text>
          <Text style={styles.infoText}>
            {hospital.description.split("\n")[0]}
          </Text>
        </View>

        {/* Normal & VIP Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Benefits</Text>
          <OfferCards 
            normalOffers={summarizeOffer(hospital.normalUserOffer)}
            vipOffers={summarizeOffer(hospital.vipUserOffer)}
            category="hospital"
            serviceType={hospital.category}
          />
        </View>

        {/* Booking */}
        <View style={styles.section}>
          <View style={styles.bookingHeader}>
            <Text style={styles.sectionTitle}>{hospital.category === 'Pharmacy' ? 'Request Items' : 'Book OP'}</Text>
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>{userMode === 'vip' ? 'VIP' : 'Normal'}</Text>
            </View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>{isYaminiVeterinary ? 'Owner Name' : 'Patient Name'}</Text>
            <TextInput
              value={patientName}
              onChangeText={setPatientName}
              placeholder="Enter full name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              value={patientPhone}
              onChangeText={(t) => {
                const digits = t.replace(/\D/g, "");
                if (digits.length <= 10) setPatientPhone(digits);
              }}
              placeholder="10-digit mobile number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              style={styles.input}
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>
          {!isPharmacy && (
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                value={patientAge}
                onChangeText={setPatientAge}
                placeholder="e.g., 28"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                style={styles.input}
              />
              {errors.age ? (
                <Text style={styles.errorText}>{errors.age}</Text>
              ) : null}
            </View>
          )}
          {isYaminiVeterinary && (
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Pet / Animal Type</Text>
              <TextInput
                value={petType}
                onChangeText={setPetType}
                placeholder="e.g., Dog, Cow, Goat, Hen"
                placeholderTextColor="#9ca3af"
                style={styles.input}
              />
              {errors.pet ? <Text style={styles.errorText}>{errors.pet}</Text> : null}
            </View>
          )}
          {hospital.category !== 'Pharmacy' && (
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Preferred Date</Text>
              <TouchableOpacity onPress={openDatePicker} activeOpacity={0.8} style={styles.dateInputContainer}>
                <TextInput
                  value={preferredDate}
                  placeholder="Select date"
                  placeholderTextColor="#9ca3af"
                  style={styles.dateInput}
                  editable={false}
                  pointerEvents="none"
                />
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#6b7280"
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
              {errors.date ? (
                <Text style={styles.errorText}>{errors.date}</Text>
              ) : null}
            </View>
          )}
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>{isPharmacy ? (isYaminiVeterinary ? 'Required Medicines / Notes' : 'Notes (Items/Details)') : 'Notes (Problem/Details)'}</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Briefly describe the issue"
              placeholderTextColor="#9ca3af"
              multiline
              style={[styles.input, { height: 84, textAlignVertical: "top" }]}
            />
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <Ionicons name={hospital.category === 'Pharmacy' ? 'send' : 'calendar'} size={16} color="#fff" />
            {hospital.category === 'Pharmacy' ? (
              <Text style={styles.bookBtnText}>Send Request</Text>
            ) : (
              <View style={styles.bookBtnContentRow}>
                <Text style={styles.bookBtnText}>Book OP</Text>
                {isVip ? (
                  <View style={styles.priceRow}>
                    {!!hospital.normalOpPrice && (
                      <Text style={styles.originalPrice}>₹{hospital.normalOpPrice}</Text>
                    )}
                    {!!hospital.vipOpPrice && (
                      <Text style={styles.vipGlowPrice}>₹{hospital.vipOpPrice}</Text>
                    )}
                  </View>
                ) : (
                  !!hospital.normalOpPrice && (
                    <Text style={styles.normalPriceInline}>– ₹{hospital.normalOpPrice}</Text>
                  )
                )}
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.noteText}>
            {hospital.category === 'Pharmacy' ? 'Your request will be sent to the pharmacy team. We will contact you shortly.' : 'A unique booking code will be generated. Pay OP fee at hospital as per your mode.'}
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
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
        </View>
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
                <Ionicons name="help-circle" size={32} color="#ef4444" />
              </View>
            </View>

            <Text style={styles.modalTitle}>{hospital.category === 'Pharmacy' ? 'Send Request' : 'Confirm Booking'}</Text>
            <Text style={styles.modalSubtitle}>
              {hospital.category === 'Pharmacy' ? 'We will forward your request to the pharmacy team.' : 'Are you sure you want to book this appointment? OP fee is payable at the hospital.'}
            </Text>
            
            {/* VIP promotion for normal users in confirmation modal */}
            {!isVip && hospital.category !== 'Pharmacy' && (
              <View style={styles.vipPromotionCard}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.vipPromotionCardText}>
                  You can get this for free using VIP
                </Text>
              </View>
            )}

            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="business" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>{hospital.category === 'Pharmacy' ? 'Pharmacy:' : 'Hospital:'}</Text>
                <Text style={styles.detailValue}>{hospital.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="person" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Patient:</Text>
                <Text style={styles.detailValue}>{patientName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{patientPhone}</Text>
              </View>
              {hospital.category !== 'Pharmacy' && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={16} color="#6b7280" />
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{preferredDate}</Text>
                </View>
              )}
              {hospital.category !== 'Pharmacy' && (
                <View style={styles.detailRow}>
                  <Ionicons name="cash" size={16} color="#6b7280" />
                  <Text style={styles.detailLabel}>OP Fee:</Text>
                  <Text style={styles.detailValue}>
                    {userMode === 'vip' ? (hospital.vipOpPrice ? `₹${hospital.vipOpPrice}` : 'As per hospital') : (hospital.normalOpPrice ? `₹${hospital.normalOpPrice}` : 'As per hospital')}
                  </Text>
                </View>
              )}
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
                onPress={confirmBooking}
                activeOpacity={0.8}
              >
                <Ionicons name={hospital.category === 'Pharmacy' ? 'send' : 'checkmark-circle'} size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>{hospital.category === 'Pharmacy' ? 'Send Request' : 'Yes, Book Now'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ef4444" />
              <Text style={styles.loadingText}>Processing your booking...</Text>
              <Text style={styles.loadingSubtext}>
                Please wait while we confirm your appointment
              </Text>
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

            <Text style={styles.successModalTitle}>Booking Confirmed!</Text>
            <Text style={styles.successModalSubtitle}>
              Your appointment has been successfully booked
            </Text>

            <View style={styles.successDetailsCard}>
              <View style={styles.bookingCodeContainer}>
                <Text style={styles.bookingCodeLabel}>Booking Code</Text>
                <Text style={styles.bookingCodeValue}>{bookingCode}</Text>
                <Text style={styles.bookingCodeNote}>
                  Show this code at the reception
                </Text>
              </View>

              <View style={styles.contactInfoCard}>
                <Ionicons name="time" size={20} color="#10b981" />
                <Text style={styles.contactInfoText}>
                  Our team will contact you soon to confirm the appointment time
                </Text>
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

      {/* Payment popup removed */}

      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => navigateMonth("prev")}
                style={styles.monthNavButton}
              >
                <Ionicons name="chevron-back" size={20} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity
                onPress={() => navigateMonth("next")}
                style={styles.monthNavButton}
              >
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysContainer}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, index) => {
                if (!dayData) {
                  return <View key={index} style={styles.emptyDay} />;
                }

                const { day, date, isToday, isSelected, isPast } = dayData;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      isToday && styles.todayDay,
                      isSelected && styles.selectedDay,
                      isPast && styles.pastDay,
                    ]}
                    onPress={() => !isPast && selectDate(date)}
                    disabled={isPast}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isToday && styles.todayText,
                        isSelected && styles.selectedText,
                        isPast && styles.pastText,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  stickyHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  stickyHeaderInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  stickyHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  stickyHeaderDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  stickyHeaderRating: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 12,
  },
  stickyHeaderPrice: {
    fontSize: 12,
    color: "#6b7280",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    position: "relative",
    overflow: "hidden",
  },
  heroBackgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroTopActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    zIndex: 10,
  },
  heroRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroLikeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  hospitalInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginTop: -25,
  },
  hospitalInfoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  hospitalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  hospitalInfoMain: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  hospitalLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  hospitalLocationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  hospitalMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  hospitalPrice: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  hospitalStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hospitalStatusText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  hospitalRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  reviewsText: {
    fontSize: 12,
    color: "#6b7280",
  },
  budgetTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  budgetTagText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  purchaseHistory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  purchaseText: {
    fontSize: 12,
    color: "#6b7280",
  },
  purchaseCount: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  mainContent: {
    backgroundColor: "#f8fafc",
    marginTop: -100, // Overlap with hero section
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 5,
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  offerBody: { marginTop: 8 },
  offerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginRight: 8,
  },
  offerText: { fontSize: 13, color: "#374151", lineHeight: 18 },
  infoText: { fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 18 },

  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modeBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modeBadgeText: { fontSize: 12, fontWeight: "700", color: "#111827" },
  formRow: { marginTop: 12 },
  inputLabel: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "700",
  },
  input: {
    height: 44,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#111827",
    fontWeight: "600",
  },
  dateInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    height: 44,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#111827",
    fontWeight: "600",
    flex: 1,
    paddingRight: 40,
  },
  calendarIcon: { position: "absolute", right: 12 },
  bookBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
  },
  bookBtnText: { color: "#fff", fontWeight: "800", marginLeft: 8 },
  bookBtnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalPrice: {
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'line-through',
    fontWeight: '700',
  },
  vipGlowPrice: {
    color: '#fbbf24',
    fontWeight: '900',
    textShadowColor: 'rgba(251,191,36,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  normalPriceInline: {
    color: '#fff',
    fontWeight: '800',
  },
  vipPromotionBadge: {
    position: "absolute",
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251,191,36,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  vipPromotionText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fbbf24",
  },
  vipPromotionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251,191,36,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.3)",
  },
  vipPromotionCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fbbf24",
    marginLeft: 8,
    flex: 1,
  },
  noteText: { marginTop: 10, fontSize: 12, color: "#6b7280" },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6", paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: "600", color: "#111827", flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: "#6b7280", lineHeight: 20 },

  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#bae6fd",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  infoNoteText: {
    marginLeft: 8,
    color: "#075985",
    fontSize: 12,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "700",
  },
  fallbackOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  fallbackBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  fallbackCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fallbackBtnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fallbackBtnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ef4444",
  },

  // Modal Styles - Enhanced Simple & Professional
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  // Confirmation Modal - Simplified
  confirmModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconContainer: { alignItems: "center", marginBottom: 16 },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  bookingDetailsCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  detailLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginLeft: 6,
    marginRight: 8,
    minWidth: 65,
  },
  detailValue: { fontSize: 13, fontWeight: "600", color: "#111827", flex: 1 },
  modalButtonContainer: { flexDirection: "row", gap: 10 },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Loading Modal - Simplified
  loadingModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingContainer: { alignItems: "center" },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
    textAlign: "center",
  },

  // Success Modal - Simplified
  successModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  successModalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  successDetailsCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  bookingCodeContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  bookingCodeLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  bookingCodeValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ef4444",
    letterSpacing: 1,
    marginBottom: 6,
  },
  bookingCodeNote: { fontSize: 11, color: "#9ca3af", textAlign: "center" },
  contactInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 10,
  },
  contactInfoText: {
    fontSize: 13,
    color: "#15803d",
    marginLeft: 10,
    flex: 1,
    fontWeight: "500",
  },
  successButton: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#10b981",
    alignItems: "center",
  },
  successButtonText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Calendar Modal
  calendarModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthNavButton: { padding: 8, borderRadius: 8, backgroundColor: "#f3f4f6" },
  monthYearText: { fontSize: 18, fontWeight: "700", color: "#111827" },
  weekDaysContainer: { flexDirection: "row", marginBottom: 10 },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    paddingVertical: 8,
  },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  emptyDay: { width: "14.285%", height: 40 },
  calendarDay: {
    width: "14.285%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  todayDay: { backgroundColor: "#fef2f2" },
  selectedDay: { backgroundColor: "#ef4444" },
  pastDay: { opacity: 0.3 },
  dayText: { fontSize: 14, fontWeight: "500", color: "#111827" },
  todayText: { color: "#ef4444", fontWeight: "700" },
  selectedText: { color: "#ffffff", fontWeight: "700" },
  pastText: { color: "#9ca3af" },
  calendarButtonContainer: { flexDirection: "row", gap: 10 },
  calendarCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  calendarCancelText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  calendarConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    alignItems: "center",
  },
  calendarConfirmText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Payment Popup Styles
  paymentPopupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  paymentPopupContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  paymentPopupHeader: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  paymentCloseButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  paymentPopupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 6,
  },
  paymentPopupSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentPricingInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  paymentPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentNormalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  paymentVipPriceLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  paymentVipPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  paymentSavingsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
  paymentPopupButtons: {
    gap: 12,
  },
  paymentContinueButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  paymentContinueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  paymentUpgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentUpgradeGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paymentUpgradeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
