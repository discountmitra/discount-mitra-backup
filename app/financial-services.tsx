import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import NoDataIllustration from "../assets/no-data.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, router } from "expo-router";

type CategoryKey = "Banking" | "Insurance - Policy" | "Tax & Compliance";

type FinancialService = {
  id: string;
  name: string;
  specialist: string;
  description: string;
  offers?: string;
  category: CategoryKey;
  subCategory: string;
  buttonType: 'request';
  rating: number;
  reviews: number;
  availability: string;
};

export default function FinancialServicesScreen() {
  const navigation = useNavigation();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Banking");
  const [query, setQuery] = useState("");

  const categories: CategoryKey[] = [
    "Banking",
    "Insurance - Policy",
    "Tax & Compliance",
  ];

  const data = useMemo<FinancialService[]>(
    () => [
      // Banking Services
      {
        id: "any-loan",
        name: "Any Loan (Personal, Home, Gold, Business, Education, Agriculture)",
        specialist: "On Time, No Extra Charges",
        description: "Get approved for any type of loan with competitive rates and minimal documentation.",
        category: "Banking",
        subCategory: "Loans",
        buttonType: "request",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
      },
      {
        id: "credit-card",
        name: "Any Credit Card (SBI, ICICI, HDFC & More)",
        specialist: "On Time, Special Gifts",
        description: "Apply for credit cards from all major banks with special welcome gifts and rewards.",
        category: "Banking",
        subCategory: "Credit Card",
        buttonType: "request",
        rating: 4.7,
        reviews: 980,
        availability: "Available Now",
      },
      {
        id: "debit-card",
        name: "Any Debit Card",
        specialist: "Less Process",
        description: "Get debit cards with enhanced features including contactless payments and rewards.",
        category: "Banking",
        subCategory: "Debit Card",
        buttonType: "request",
        rating: 4.6,
        reviews: 750,
        availability: "Available Now",
      },
      {
        id: "current-account",
        name: "Current Account",
        specialist: "Less Paper Work",
        description: "Open current accounts for your business with minimal documentation and free transactions.",
        category: "Banking",
        subCategory: "Current Account",
        buttonType: "request",
        rating: 4.8,
        reviews: 1100,
        availability: "Available Now",
      },
      {
        id: "fixed-deposit",
        name: "Best FD Advice & Interest Rates",
        specialist: "On Time",
        description: "Get expert advice on fixed deposits with the highest interest rates available.",
        category: "Banking",
        subCategory: "FD (Fixed Deposit)",
        buttonType: "request",
        rating: 4.9,
        reviews: 1500,
        availability: "Available Now",
      },
      // Insurance Services
      {
        id: "life-insurance",
        name: "Life Insurance Policies",
        specialist: "Financial support for family in unexpected situations",
        description: "Secure your family's financial future with comprehensive life insurance policies.",
        offers: "25% Discount",
        category: "Insurance - Policy",
        subCategory: "Life Insurance",
        buttonType: "request",
        rating: 4.8,
        reviews: 1300,
        availability: "Available Now",
      },
      {
        id: "health-insurance",
        name: "Health Insurance Policies",
        specialist: "Covers hospital expenses & medical treatments",
        description: "Protect yourself and your family with comprehensive health insurance coverage.",
        offers: "25% Discount",
        category: "Insurance - Policy",
        subCategory: "Health Insurance",
        buttonType: "request",
        rating: 4.7,
        reviews: 1200,
        availability: "Available Now",
      },
      {
        id: "motor-insurance",
        name: "Motor Insurance Policies",
        specialist: "Protection against accidents, theft, damage (car, bike, auto)",
        description: "Comprehensive motor insurance for all types of vehicles with roadside assistance.",
        offers: "25% Discount",
        category: "Insurance - Policy",
        subCategory: "Motor Insurance",
        buttonType: "request",
        rating: 4.6,
        reviews: 950,
        availability: "Available Now",
      },
      {
        id: "home-property-insurance",
        name: "Home & Property Insurance",
        specialist: "Covers fire, theft, natural calamities",
        description: "Protect your home and property against unexpected events and natural disasters.",
        offers: "25% Discount",
        category: "Insurance - Policy",
        subCategory: "Home & Property Insurance",
        buttonType: "request",
        rating: 4.5,
        reviews: 800,
        availability: "Available Now",
      },
      {
        id: "travel-insurance",
        name: "Travel Insurance Policies",
        specialist: "Accidents, medical emergencies, luggage loss while traveling",
        description: "Travel with confidence with comprehensive travel insurance coverage.",
        offers: "25% Discount",
        category: "Insurance - Policy",
        subCategory: "Travel Insurance",
        buttonType: "request",
        rating: 4.7,
        reviews: 1100,
        availability: "Available Now",
      },
      {
        id: "personal-accident-insurance",
        name: "Personal Accident Policies",
        specialist: "Compensation for injury/death due to accident",
        description: "Personal accident insurance providing financial protection and immediate compensation.",
        offers: "25% Discount",
        category: "Insurance - Policy",
        subCategory: "Personal Accident Insurance",
        buttonType: "request",
        rating: 4.6,
        reviews: 900,
        availability: "Available Now",
      },
      {
        id: "business-commercial-insurance",
        name: "Business & Commercial Policies",
        specialist: "Property loss, employee safety, liability protection",
        description: "Comprehensive business insurance solutions for property and liability coverage.",
        offers: "25% Discount",
        category: "Insurance - Policy",
        subCategory: "Business / Commercial Insurance",
        buttonType: "request",
        rating: 4.8,
        reviews: 1000,
        availability: "Available Now",
      },
      // Tax & Compliance Services
      {
        id: "income-tax-filing",
        name: "Income Tax Filing",
        specialist: "Fast Service",
        description: "Professional income tax filing services with expert guidance and maximum refunds.",
        offers: "10% Discount",
        category: "Tax & Compliance",
        subCategory: "Income Tax Filing",
        buttonType: "request",
        rating: 4.9,
        reviews: 1800,
        availability: "Available Now",
      },
      {
        id: "gst-registration-filing",
        name: "GST Registration & Filing",
        specialist: "Fast Service",
        description: "Complete GST registration and monthly filing services with expert assistance.",
        offers: "10% Discount",
        category: "Tax & Compliance",
        subCategory: "GST Registration & Filing",
        buttonType: "request",
        rating: 4.8,
        reviews: 1500,
        availability: "Available Now",
      },
      {
        id: "pan-tan-services",
        name: "PAN & TAN Services",
        specialist: "Fast Service",
        description: "Quick and hassle-free PAN card and TAN registration services.",
        offers: "10% Discount",
        category: "Tax & Compliance",
        subCategory: "PAN & TAN Services",
        buttonType: "request",
        rating: 4.7,
        reviews: 1200,
        availability: "Available Now",
      },
      {
        id: "professional-tax-filing",
        name: "Professional Tax Filing",
        specialist: "Fast Service",
        description: "Professional tax filing and compliance services for individuals and businesses.",
        offers: "10% Discount",
        category: "Tax & Compliance",
        subCategory: "Professional Tax Filing",
        buttonType: "request",
        rating: 4.6,
        reviews: 950,
        availability: "Available Now",
      },
    ],
    []
  );

  const matchesOrdered = (q: string, ...fields: string[]) => {
    const queryStr = q.trim().toLowerCase();
    if (!queryStr) return true;
    const hay = fields.join(" ").toLowerCase();
    const tokens = queryStr.split(/\s+/);
    let pos = 0;
    for (const token of tokens) {
      const idx = hay.indexOf(token, pos);
      if (idx === -1) return false;
      pos = idx + token.length;
    }
    return true;
  };

  const filtered = useMemo(() => {
    const byCategory = data.filter(s => s.category === selectedCategory);
    if (!query.trim()) return byCategory;
    return byCategory.filter(s => matchesOrdered(query, s.name, s.specialist, s.description, s.subCategory));
  }, [data, selectedCategory, query]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Financial Services</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search financial services..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>
      </View>

      {/* Category chips outside of the header */}
      <View style={styles.categoryChipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChipsOuter}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} activeOpacity={0.9}>
              <View style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}>
                <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustrationWrapper}>
              <NoDataIllustration width="100%" height="100%" />
            </View>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>Try a different search query.</Text>
          </View>
        )}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          if (!showScrollTop && y > 300) setShowScrollTop(true);
          if (showScrollTop && y <= 300) setShowScrollTop(false);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={styles.card}
            onPress={() => {
              const serviceId = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              router.push(`/financial-detail?serviceId=${serviceId}`);
            }}
          >
            <View style={{ position: "relative" }}>
              <Image source={require("../assets/default.png")} style={styles.image} resizeMode="cover" />
              {item.offers && (
                <View style={styles.discountRibbon}>
                  <Text style={styles.discountText}>{item.offers}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.specialist}>{item.specialist}</Text>
                  <View style={styles.descriptionRow}>
                    <Ionicons name="document-text" size={14} color="#6b7280" />
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </View>
                  <View style={styles.subCategoryRow}>
                    <Ionicons name="folder" size={14} color="#6b7280" />
                    <Text style={styles.subCategoryText}>{item.subCategory}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <View style={styles.ratingStars}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Ionicons
                          key={idx}
                          name={idx < Math.floor(item.rating) ? "star" : idx < item.rating ? "star-half" : "star-outline"}
                          size={12}
                          color="#f59e0b"
                          style={{ marginRight: 1 }}
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewsText}>({item.reviews})</Text>
                  </View>
                </View>
              </View>

              <View style={styles.availabilityRow}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>{item.availability}</Text>
              </View>

              <View style={styles.ctaContainer}>
                <Text style={styles.ctaText}>View & Request Service</Text>
                <Ionicons name="arrow-forward" size={16} color="#1e40af" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (<View style={{ height: 88 }} />)}
      />

      {showScrollTop && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          style={styles.scrollTopFab}
        >
          <Ionicons name="arrow-up" size={20} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  headerGradient: { backgroundColor: "#1e40af", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  filterButton: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", marginLeft: 12 },
  categoryChipsContainer: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  categoryChipsOuter: { paddingHorizontal: 16, paddingVertical: 12 },
  catChip: { borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#ffffff", paddingHorizontal: 14, height: 40, borderRadius: 20, marginRight: 12, alignItems: "center", justifyContent: "center" },
  catChipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  catChipText: { fontWeight: "700", color: "#111827", fontSize: 12 },
  catChipTextActive: { color: "#ffffff" },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 },
  emptyContainer: { padding: 24, alignItems: "center", justifyContent: "center" },
  emptyIllustrationWrapper: { width: "100%", aspectRatio: 1.2, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", textAlign: "center", marginTop: 4 },
  emptySubtitle: { fontSize: 14, color: "#475569", textAlign: "center", marginTop: 6 },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  image: { width: "100%", height: 160 },
  discountRibbon: { position: "absolute", right: 0, top: 0, backgroundColor: "#ef4444", paddingHorizontal: 14, paddingVertical: 8, borderBottomLeftRadius: 14 },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardBody: { padding: 16 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  specialist: { fontSize: 13, color: "#1e40af", fontWeight: "600", marginTop: 4 },
  descriptionRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  descriptionText: { marginLeft: 6, fontSize: 12, color: "#6b7280", flex: 1 },
  subCategoryRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  subCategoryText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingStars: { flexDirection: "row", marginRight: 6 },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#111827", marginRight: 4 },
  reviewsText: { fontSize: 12, color: "#6b7280" },
  availabilityRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  requestNowBtn: { flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: "#1e40af" },
  requestNowText: { fontWeight: "700", color: "#ffffff", fontSize: 14 },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  ctaContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 },
  ctaText: { fontSize: 14, fontWeight: '600', color: '#1e40af', marginRight: 6 },
});
