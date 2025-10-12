import { useMemo, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import LikeButton from "../components/common/LikeButton";
import OfferCards from "../components/common/OfferCards";
import { categoryOffers } from "../constants/offerData";
import { salonServices, SalonLocation } from "../constants/salonData";
import { defaultImage } from "../constants/assets";

type UserType = 'normal' | 'vip';

interface ServicePrice {
  name: string;
  original: number;
  discounted: number;
  discount: number;
}

const serviceCategories = {
  haircuts: [
    { name: "Haircut", original: 130, normal: { discounted: 110, discount: 20 }, vip: { discounted: 99, discount: 31 } },
    { name: "Haircut + Shaving", original: 170, normal: { discounted: 150, discount: 20 }, vip: { discounted: 129, discount: 41 } },
    { name: "Haircut + Shaving + Head Massage", original: 200, normal: { discounted: 180, discount: 20 }, vip: { discounted: 149, discount: 51 } }
  ],
  facial: [
    { name: "Facial", original: 200, normal: { discounted: 180, discount: 20 }, vip: { discounted: 149, discount: 51 } },
    { name: "De-Tan Treatment", original: 300, normal: { discounted: 270, discount: 30 }, vip: { discounted: 249, discount: 51 } },
    { name: "Face Masks & Skin Therapy", original: 500, normal: { discounted: 450, discount: 50 }, vip: { discounted: 399, discount: 101 } }
  ],
  tattoo: [
    { name: "Tattoo Starting Price", original: 499, normal: { discounted: 449, discount: 10 }, vip: { discounted: 399, discount: 20 } }
  ]
};

export default function SalonDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const salon = useMemo(() => {
    const salonId = (params.id as string) || "";
    const salonData = salonServices.find((s: SalonLocation) => s.id === salonId);
    
    return {
      id: salonId,
      name: (params.name as string) || salonData?.name || "Hair Zone Makeover",
      address: (params.address as string) || salonData?.address || "Near Gandhi Nagar, Subash Nagar Road, Sircilla",
      rating: parseFloat((params.rating as string) || salonData?.rating?.toString() || "4.8"),
      reviews: parseInt((params.reviews as string) || salonData?.reviews?.toString() || "234"),
      image: typeof params.image === 'string' ? (params.image as string) : (salonData?.image || ""),
    };
  }, [params]);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [userType, setUserType] = useState<UserType>('normal');
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; services?: string; date?: string; time?: string }>({});
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const faqData = [
    {
      question: "How far in advance should I book an appointment?",
      answer: "We recommend booking 2-3 days in advance for regular services and 1 week for special occasions to ensure your preferred time slot."
    },
    {
      question: "What if I need to cancel or reschedule my appointment?",
      answer: "You can cancel or reschedule up to 4 hours before your appointment time without any charges. Last-minute cancellations may incur a fee."
    },
    {
      question: "What should I do to prepare for my appointment?",
      answer: "Come with clean skin for facial services, avoid caffeine before treatments, and inform us of any allergies or skin sensitivities in advance."
    }
  ];

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(serviceCategories).forEach(category => {
      category.forEach(service => {
        if (selectedServices.includes(service.name)) {
          total += userType === 'vip' ? service.vip.discounted : service.normal.discounted;
        }
      });
    });
    return total;
  };

  const handleBooking = () => {
    const newErrors: { name?: string; phone?: string; services?: string; date?: string; time?: string } = {};
    if (!userName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(userPhone.trim())) newErrors.phone = "Enter valid 10-digit phone";
    if (selectedServices.length === 0) newErrors.services = "Select at least one service";
    if (!appointmentDate.trim()) newErrors.date = "Select appointment date";
    if (!appointmentTime.trim()) newErrors.time = "Select appointment time";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Show confirmation modal
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
    setUserName("");
    setUserPhone("");
    setSelectedServices([]);
    setAppointmentDate("");
    setAppointmentTime("");
    setErrors({});
    router.back();
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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
    setAppointmentDate(formattedDate);
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

  const onScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 100);
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

  const renderServiceCategory = (title: string, icon: string, services: any[]) => (
    <View key={title} style={styles.section}>
      <View style={styles.categoryHeader}>
        <Ionicons name={icon as any} size={20} color="#111827" />
        <Text style={styles.categoryTitle}>{title}</Text>
      </View>
      {services.map((service, index) => {
        const isSelected = selectedServices.includes(service.name);
        const pricing = userType === 'vip' ? service.vip : service.normal;
        return (
          <TouchableOpacity 
            key={index} 
            style={[styles.serviceItem, isSelected && styles.serviceItemSelected]}
            onPress={() => toggleService(service.name)}
          >
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>{service.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>₹{service.original}</Text>
                <Text style={[styles.discountedPrice, isSelected && styles.discountedPriceSelected]}>₹{pricing.discounted}</Text>
                <Text style={styles.savings}>Save ₹{pricing.discount}</Text>
              </View>
            </View>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

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
              <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{salon.name}</Text>
              <View style={styles.stickyHeaderDetails}>
                <Text style={styles.stickyHeaderRating}>Beauty & Salon</Text>
                <Text style={styles.stickyHeaderPrice}>⭐ {salon.rating}</Text>
          </View>
          </View>
            <TouchableOpacity style={styles.heroCallButton} onPress={() => {}}>
                <Ionicons name="call" size={20} color="#111827" />
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
            source={salon.image && /^https?:\/\//.test(salon.image) ? { uri: salon.image } : defaultImage} 
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
              <TouchableOpacity style={styles.heroCallButton} onPress={() => {}}>
                <Ionicons name="call" size={20} color="#111827" />
              </TouchableOpacity>
              <LikeButton 
                item={{
                  id: salon.id,
                  name: salon.name,
                  category: 'Beauty',
                  subcategory: 'Salon',
                  image: salon.image,
                  description: salon.address,
                  rating: salon.rating,
                  reviews: salon.reviews,
                  location: salon.address,
                  address: salon.address,
                }}
                size={24}
                style={[styles.heroLikeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              />
            </View>
          </View>
        </View>
          
        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Salon Info Card */}
          <View style={styles.salonInfoCard}>
            <View style={styles.salonInfoHeader}>
              <View style={styles.salonIcon}>
                <Ionicons name="cut" size={24} color="#b53471" />
              </View>
              <View style={styles.salonInfoMain}>
              <Text style={styles.salonName}>{salon.name}</Text>
                <View style={styles.salonLocation}>
                  <Ionicons name="location" size={12} color="#ef4444" />
                  <Text style={styles.salonLocationText}>{salon.address}</Text>
                </View>
                <View style={styles.salonMeta}>
                  <Text style={styles.salonPrice}>Beauty & Salon</Text>
                  <View style={styles.salonStatus}>
                    <Text style={styles.salonStatusText}>Open Now</Text>
                    <Ionicons name="chevron-down" size={14} color="#6b7280" />
                  </View>
                </View>
                <View style={styles.salonRating}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={styles.ratingText}>{salon.rating}</Text>
                    <Text style={styles.reviewsText}>({salon.reviews})</Text>
              </View>
                  <View style={styles.budgetTag}>
                    <Text style={styles.budgetTagText}>Beauty & Salon</Text>
            </View>
            </View>
            </View>
          </View>
        </View>


        {/* Services */}
        {renderServiceCategory("Haircuts", "cut", serviceCategories.haircuts)}
        {renderServiceCategory("Facial", "flower", serviceCategories.facial)}
        {renderServiceCategory("Tattoo", "brush", serviceCategories.tattoo)}

        {/* Normal & VIP Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Benefits</Text>
          <OfferCards 
            category="beauty"
            serviceType="Haircuts"
          />
        </View>

        {/* Booking Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book Your Appointment</Text>
          
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
            <Text style={styles.inputLabel}>Phone Number</Text>
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
            <Text style={styles.inputLabel}>Appointment Date</Text>
            <TouchableOpacity onPress={openDatePicker} style={styles.dateInputContainer}>
              <TextInput 
                value={appointmentDate} 
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
            <Text style={styles.inputLabel}>Appointment Time</Text>
            <TextInput 
              value={appointmentTime} 
              onChangeText={setAppointmentTime} 
              placeholder="e.g., 10:00 AM" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
          </View>

          {errors.services ? <Text style={styles.errorText}>{errors.services}</Text> : null}

          {selectedServices.length > 0 && (
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
            </View>
          )}

          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={handleBooking} 
            style={[styles.bookButton, selectedServices.length === 0 && styles.bookButtonDisabled]}
          >
            <Text style={styles.bookButtonText}>Pay and Book</Text>
          </TouchableOpacity>
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
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.monthNavButton}>
                <Ionicons name="chevron-back" size={20} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.monthNavButton}>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekDaysContainer}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
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
                      isPast && styles.pastDay
                    ]}
                    onPress={() => !isPast && selectDate(date)}
                    disabled={isPast}
                  >
                    <Text style={[
                      styles.dayText,
                      isToday && styles.todayText,
                      isSelected && styles.selectedText,
                      isPast && styles.pastText
                    ]}>
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
                <Ionicons name="help-circle" size={32} color="#b53471" />
              </View>
            </View>
            
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to book this appointment?</Text>
            
            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="business" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Salon:</Text>
                <Text style={styles.detailValue}>{salon.name}</Text>
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
                <Text style={styles.detailValue}>{appointmentDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="cash" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.detailValue}>₹{calculateTotal()}</Text>
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
                onPress={confirmBooking}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Yes, Book Now</Text>
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
              <ActivityIndicator size="large" color="#b53471" />
              <Text style={styles.loadingText}>Processing your booking...</Text>
              <Text style={styles.loadingSubtext}>Please wait while we confirm your appointment</Text>
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
            <Text style={styles.successModalSubtitle}>Your appointment has been successfully booked</Text>
            
            <View style={styles.successDetailsCard}>
              <View style={styles.bookingCodeContainer}>
                <Text style={styles.bookingCodeLabel}>Booking Code</Text>
                <Text style={styles.bookingCodeValue}>{bookingCode}</Text>
                <Text style={styles.bookingCodeNote}>Show this code at the salon</Text>
              </View>
              
              <View style={styles.contactInfoCard}>
                <Ionicons name="time" size={20} color="#10b981" />
                <Text style={styles.contactInfoText}>Our team will contact you soon to confirm the appointment time</Text>
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
  salonInfoCard: {
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
  salonInfoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  salonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fdf2f8",
    alignItems: "center",
    justifyContent: "center",
  },
  salonInfoMain: {
    flex: 1,
  },
  salonName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  salonLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  salonLocationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  salonMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  salonPrice: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  salonStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  salonStatusText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  salonRating: {
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
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 },
  userTypeButtons: { flexDirection: "row", gap: 12 },
  userTypeButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", alignItems: "center" },
  userTypeButtonActive: { borderColor: "#b53471", backgroundColor: "#b53471" },
  userTypeText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  userTypeTextActive: { color: "#ffffff" },
  categoryHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  categoryTitle: { marginLeft: 12, fontSize: 18, fontWeight: "700", color: "#111827" },
  serviceItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  serviceItemSelected: { borderColor: "#b53471", backgroundColor: "#fdf2f8" },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 4 },
  serviceNameSelected: { color: "#b53471" },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  originalPrice: { fontSize: 14, color: "#9ca3af", textDecorationLine: "line-through" },
  discountedPrice: { fontSize: 16, fontWeight: "700", color: "#111827" },
  discountedPriceSelected: { color: "#b53471" },
  savings: { fontSize: 12, color: "#16a34a", fontWeight: "600" },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  checkboxSelected: { borderColor: "#b53471", backgroundColor: "#b53471" },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff" },
  dateInputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  dateInput: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff", flex: 1, paddingRight: 40 },
  calendarIcon: { position: 'absolute', right: 12 },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  totalCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#f8fafc", borderRadius: 12, marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  totalAmount: { fontSize: 20, fontWeight: "700", color: "#b53471" },
  bookButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#b53471" },
  bookButtonDisabled: { backgroundColor: "#d1d5db" },
  bookButtonText: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  
  // Calendar Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  calendarModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthNavButton: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  monthYearText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  weekDaysContainer: { flexDirection: 'row', marginBottom: 10 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7280', paddingVertical: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  emptyDay: { width: '14.285%', height: 40 },
  calendarDay: { width: '14.285%', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  todayDay: { backgroundColor: '#fdf2f8' },
  selectedDay: { backgroundColor: '#b53471' },
  pastDay: { opacity: 0.3 },
  dayText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  todayText: { color: '#b53471', fontWeight: '700' },
  selectedText: { color: '#ffffff', fontWeight: '700' },
  pastText: { color: '#9ca3af' },
  calendarButtonContainer: { flexDirection: 'row', gap: 10 },
  calendarCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  calendarCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  calendarConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#b53471', alignItems: 'center' },
  calendarConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  
  // Professional Modal Styles
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fdf2f8', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  bookingDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#6b7280', marginLeft: 6, marginRight: 8, minWidth: 65 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#b53471', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  
  // Loading Modal
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingContainer: { alignItems: 'center' },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  
  // Success Modal
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successModalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  successDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 },
  bookingCodeContainer: { alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  bookingCodeLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  bookingCodeValue: { fontSize: 24, fontWeight: '700', color: '#b53471', letterSpacing: 1, marginBottom: 6 },
  bookingCodeNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  contactInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10 },
  contactInfoText: { fontSize: 13, color: '#15803d', marginLeft: 10, flex: 1, fontWeight: '500' },
  successButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});