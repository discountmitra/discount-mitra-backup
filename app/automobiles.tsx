import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import NoDataIllustration from "../assets/no-data.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";

type CategoryKey = "Car Showroom" | "Batteries" | "Car Wash" | "Engine Services" | "Spare Parts" | "Tyres" | "Oils & Lubricants";

type AutomobileService = {
  id: string;
  name: string;
  specialist?: string;
  location?: string;
  description: string;
  offers?: string;
  pricing?: Array<{
    service: string;
    price: number;
    cashback?: number;
  }>;
  features?: string[];
  cashback?: string;
  voucher?: string;
  buttonType: 'request' | 'pay';
  category: CategoryKey;
  rating: number;
  reviews: number;
  availability: string;
};

export default function AutomobilesScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Car Showroom");
  const [query, setQuery] = useState("");

  const categories: CategoryKey[] = [
    "Car Showroom",
    "Batteries", 
    "Car Wash",
    "Engine Services",
    "Spare Parts",
    "Tyres",
    "Oils & Lubricants",
  ];

  const data = useMemo<AutomobileService[]>(
    () => [
      {
        id: "car-showroom",
        name: "Car Showroom",
        specialist: "Want to Buy a Car? Call Us Today! No Bargaining Needed, Lowest Price Guarantee",
        description: "",
        buttonType: "request",
        category: "Car Showroom",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
      },
      {
        id: "bike-showrooms",
        name: "Bike Showrooms",
        specialist: "Want to Buy a Bike? Call Us Today! No Bargaining Needed, Lowest Price Guarantee",
        description: "",
        buttonType: "request",
        category: "Car Showroom",
        rating: 4.7,
        reviews: 980,
        availability: "Available Now",
      },
      {
        id: "amron-battery",
        name: "Amron Battery",
        specialist: "Amaron Batteries - ALL Bike, Auto & Car Batteries Available, Low Price Guarantee, Upto 35% Discount",
        description: "Door Delivery available",
        buttonType: "request",
        category: "Batteries",
        rating: 4.6,
        reviews: 750,
        availability: "Available Now",
      },
      {
        id: "sri-manjunatha-hydraulic",
        name: "Sri Manjunatha Hydraulic Water Servicing Center",
        specialist: "Sri Manjunatha Hydraulic Water Servicing Center, Hydraulic Services, Location: Karimnagar Road, Srinagar Colony, Beside Common, Cashback: Upto 100",
        description: "Bike Wash - 100, Car Wash (swift, dzire, ford, ertiga, creta, brezza) 500/-, Car Wash (Innova, Fortuner, Bolero & Carnival) 600/-",
        buttonType: "pay",
        category: "Car Wash",
        rating: 4.9,
        reviews: 1500,
        availability: "Available Now",
      },
      {
        id: "a1-engine-carbon-cleaning",
        name: "A1 Engine Carbon Cleaning Services",
        specialist: "Location: Next to Adarsh Motor Showroom, Shantinagar Road, Sircilla, Cashback: Upto 500",
        description: "Bike Carbon Cleaning - 400 (100 cashback), Car Carbon Cleaning - Basic Cars - 999 (200 Cashback), Car Carbon Cleaning - high-End Cars 1999 (300 Cashback), Auto Carbon Cleaning - Mini - 599 (100 Cashback), Auto Carbon Cleaning - Big - 799 (150 Cashback)",
        buttonType: "pay",
        category: "Engine Services",
        rating: 4.8,
        reviews: 1100,
        availability: "Available Now",
      },
      {
        id: "vasavi-automobiles",
        name: "Vasavi Automobiles",
        specialist: "Auto Mobiles - Car & Bike Spare Parts, Auto Care, Location: Karimnagar Road, Sircilla - 505301, Phone: 9876543222",
        description: "Pay 950, get 1000 Rs voucher",
        buttonType: "pay",
        category: "Spare Parts",
        rating: 4.7,
        reviews: 890,
        availability: "Available Now",
      },
      {
        id: "mrf-tyres",
        name: "MRF tyres",
        specialist: "All Types of MRF Tyres Available",
        description: "10% Discount",
        buttonType: "request",
        category: "Tyres",
        rating: 4.5,
        reviews: 650,
        availability: "Available Now",
      },
      {
        id: "appolo-tyres",
        name: "Appolo Tyres",
        specialist: "All Types of Apollo Tyres Available",
        description: "10% Discount",
        buttonType: "request",
        category: "Tyres",
        rating: 4.6,
        reviews: 720,
        availability: "Available Now",
      },
      {
        id: "normal-tyres",
        name: "Normal Tyres",
        specialist: "All Types of Tyres Available",
        description: "20% Discount",
        buttonType: "request",
        category: "Tyres",
        rating: 4.4,
        reviews: 580,
        availability: "Available Now",
      },
      {
        id: "oil-shop",
        name: "Oil shop",
        specialist: "All Types of brand Oil Shops",
        description: "25% Discount",
        buttonType: "request",
        category: "Oils & Lubricants",
        rating: 4.5,
        reviews: 620,
        availability: "Available Now",
      },
    ],
    []
  );

  const matchesOrdered = (q: string, ...fields: Array<string | undefined>) => {
    const queryStr = q.trim().toLowerCase();
    if (!queryStr) return true;
    const hay = fields.filter(Boolean).join(" ").toLowerCase();
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
    return byCategory.filter(s => matchesOrdered(query, s.name, s.specialist, s.location, s.description));
  }, [data, selectedCategory, query]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Automobiles</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search automobile services..."
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
          <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => router.push({ pathname: "/automobile-detail", params: { id: item.id, name: item.name, specialist: item.specialist, description: item.description, buttonType: item.buttonType } })}>
            <View style={{ position: "relative" }}>
              <Image source={require("../assets/default.png")} style={styles.image} resizeMode="cover" />
              {item.description && item.description.includes('Discount') && (
                <View style={styles.discountRibbon}>
                  <Text style={styles.discountText}>{item.description.split(' ')[0]}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  {item.specialist && (
                    <Text style={styles.subtitle} numberOfLines={2}>{item.specialist.split('\\n')[0]}</Text>
                  )}
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  <Text style={styles.reviewsText}>({item.reviews})</Text>
                </View>
              </View>

              {/* {(item.cashback || item.voucher) && (
                <View style={styles.offerInfo}>
                  {item.cashback && (
                    <Text style={styles.cashbackText}>{item.cashback}</Text>
                  )}
                  {item.voucher && (
                    <Text style={styles.voucherText}>{item.voucher}</Text>
                  )}
                </View>
              )} */}

              <View style={styles.footerRow}>
                <View style={styles.availabilityRow}>
                  <View style={styles.availabilityDot} />
                  <Text style={styles.availabilityText}>{item.availability}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={styles.ctaRow}>
                  <Text style={styles.ctaText}>
                    {item.buttonType === 'request' ? 'Request Now' : 'Pay Now'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#6b7280" style={{ marginLeft: 6 }} />
                </View>
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
  headerGradient: { backgroundColor: "#059669", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
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
  subtitle: { fontSize: 13, color: "#4b5563", marginTop: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  ratingStarsRow: { flexDirection: "row", marginTop: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, fontSize: 12, fontWeight: "700", color: "#111827" },
  reviewsText: { marginLeft: 4, fontSize: 12, color: "#6b7280" },
  offerInfo: { marginTop: 8, marginBottom: 8 },
  cashbackText: { fontSize: 12, color: "#16a34a", fontWeight: "600", marginBottom: 2 },
  voucherText: { fontSize: 12, color: "#dc2626", fontWeight: "600" },
  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  availabilityRow: { flexDirection: "row", alignItems: "center" },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  ctaRow: { flexDirection: "row", alignItems: "center" },
  ctaText: { fontSize: 12, color: "#6b7280", marginRight: 4 },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
});
