import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import NoDataIllustration from "../assets/no-data.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import LikeButton from "../components/common/LikeButton";

type CategoryKey = "Decoration" | "Tent House" | "DJ & Lighting" | "Thadakala Pandiri" | "Function Halls" | "Catering" | "Mehendi Art" | "Photography" | "Chef";

type EventService = {
  id: string;
  name: string;
  description: string;
  category: CategoryKey;
  icon: keyof typeof Ionicons.glyphMap;
  price: string;
  details?: string;
  capacity?: string;
  location?: string;
  rating: number;
  reviews: number;
  availability: string;
  image?: string;
  normalUserOffer?: string;
  vipUserOffer?: string;
};

export default function EventsScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Decoration");
  const [query, setQuery] = useState("");

  const categories: CategoryKey[] = [
    "Decoration",
    "Tent House",
    "DJ & Lighting",
    "Thadakala Pandiri",
    "Function Halls",
    "Catering",
    "Mehendi Art",
    "Photography",
    "Chef",
  ];

  useEffect(() => {
    const pre = (params.preselect as string) as CategoryKey | undefined;
    if (pre && (categories as string[]).includes(pre)) {
      setSelectedCategory(pre as CategoryKey);
    }
  }, [params.preselect]);

  const data = useMemo<EventService[]>(
    () => [
      // Decoration
      {
        id: "birthday-decoration",
        name: "Birthday Decoration",
        description: "Celebrate More, Spend Less! We customize decorations to fit your budget",
        category: "Decoration",
        icon: "gift",
        price: "Starting at ₹1,499",
        details: "Custom decorations for all budgets",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/bdy/1.jpg",
        normalUserOffer: "Basic decoration: ₹1,499\nStandard theme: 15% off\nPhotography: ₹2,000\nCatering: 10% off",
        vipUserOffer: "Premium decoration: 30% off\nLuxury theme: 25% off\nProfessional photography: 20% off\nPremium catering: 20% off\nFree event coordination",
      },
      {
        id: "haldi-decoration",
        name: "Haldi Decoration",
        description: "Celebrate with Elegance! Custom decorations for your special day",
        category: "Decoration",
        icon: "flower",
        price: "Starting at ₹2,999",
        details: "Elegant haldi ceremony decorations",
        rating: 4.7,
        reviews: 980,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/haldi/1.jpg",
        normalUserOffer: "Haldi decoration: ₹2,999\nTraditional theme: 15% off\nPhotography: ₹2,500\nCatering: 10% off",
        vipUserOffer: "Premium haldi decoration: 30% off\nLuxury traditional theme: 25% off\nProfessional photography: 20% off\nPremium catering: 20% off\nFree event coordination",
      },
      {
        id: "wedding-decoration",
        name: "Wedding Decoration",
        description: "Make Your Big Day Special! Custom wedding decor to suit your style",
        category: "Decoration",
        icon: "heart",
        price: "Starting at ₹9,999",
        details: "Complete wedding decoration packages",
        rating: 4.9,
        reviews: 1500,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/wedding/4.jpg",
      },
      {
        id: "reception-decoration",
        name: "Reception Decoration",
        description: "Customized reception themes for all budgets",
        category: "Decoration",
        icon: "sparkles",
        price: "Starting at ₹5,999",
        details: "Elegant reception setups",
        rating: 4.6,
        reviews: 750,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1676734627786-a3662ff6a243?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "premium-decorations",
        name: "Premium Decorations",
        description: "Premium Decorations at Budget-Friendly Prices",
        category: "Decoration",
        icon: "diamond",
        price: "Guaranteed Lowest Price",
        details: "Elegant premium setups",
        rating: 4.8,
        reviews: 1100,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/decoration/wedding/2.jpg",
      },
      // Tent House
      {
        id: "tent-house-services",
        name: "Tent House Services",
        description: "Complete tent setup for all your outdoor events",
        category: "Tent House",
        icon: "home",
        price: "Lowest Price Guarantee",
        details: "Professional tent house services",
        rating: 4.7,
        reviews: 890,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1655409735952-cb5220efca54?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      // DJ & Lighting
      {
        id: "dj-services",
        name: "DJ Services",
        description: "Premium Sound Systems at Budget-Friendly Prices",
        category: "DJ & Lighting",
        icon: "musical-notes",
        price: "Starting at ₹2,999",
        details: "Professional DJ with latest equipment",
        rating: 4.8,
        reviews: 1300,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/dj-lighting/dj/1.jpeg",
      },
      {
        id: "lighting-services",
        name: "Lighting Services",
        description: "LED lights for Home & Street events",
        category: "DJ & Lighting",
        icon: "bulb",
        price: "Starting at ₹999",
        details: "Professional lighting solutions",
        rating: 4.6,
        reviews: 720,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/dj-lighting/lighting/2.jpg",
      },
      // Thadakala Pandiri
      {
        id: "thadakala-pandiri",
        name: "Thadakala Pandiri",
        description: "Traditional Pandiri Setup for Weddings",
        category: "Thadakala Pandiri",
        icon: "leaf",
        price: "Budget Friendly & Lowest Price",
        details: "Authentic traditional setup",
        rating: 4.9,
        reviews: 950,
        availability: "Available Now",
        image: "https://5.imimg.com/data5/ANDROID/Default/2020/12/AK/ID/JL/31748740/product-jpeg-500x500.jpg",

      },
      // Function Halls
      {
        id: "vasavi-kalyana-mandapam",
        name: "VASAVI Kalyana Mandapam (A/C)",
        description: "Weddings, Functions & Meetings",
        category: "Function Halls",
        icon: "business",
        price: "Starting at ₹29,999",
        capacity: "Capacity: 400-600 People",
        location: "Gandhi Nagar, Sircilla",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/function-halls/vasavi-kalyana-mandapam-a-c/2.webp",
      },
      {
        id: "padmashali-kalyana-mandapam",
        name: "Padmashali Kalyana Mandapam",
        description: "Weddings, Functions & Meetings",
        category: "Function Halls",
        icon: "business",
        price: "Starting at ₹29,999",
        capacity: "Capacity: 400-600 People",
        location: "Gandhi Nagar, Sircilla",
        rating: 4.7,
        reviews: 980,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/function-halls/vasavi-kalyana-mandapam-a-c/1.webp",

      },
      {
        id: "sai-manikanta-gardens",
        name: "Sai Manikanta Gardens (A/C)",
        description: "Weddings, Functions & Meetings",
        category: "Function Halls",
        icon: "business",
        price: "Contact for Quote",
        capacity: "Capacity: 1000-1500 People",
        location: "Ragudu, Karimnagar Road, Sircilla",
        rating: 4.9,
        reviews: 1500,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/function-halls/lahari-function-hall/3.webp",
      },
      {
        id: "lahari-grand-function-hall",
        name: "Lahari Grand Function Hall",
        description: "Weddings, Functions & Meetings",
        category: "Function Halls",
        icon: "business",
        price: "Contact for Quote",
        capacity: "Capacity: 800-1000 People",
        location: "Siddipet Road, Sircilla",
        rating: 4.8,
        reviews: 1100,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/function-halls/lahari-function-hall/2.webp",
      },
      {
        id: "k-convention-hall",
        name: "K Convention Hall",
        description: "Weddings, Functions & Meetings",
        category: "Function Halls",
        icon: "business",
        price: "Contact for Quote",
        capacity: "Capacity: 800-1000 People",
        location: "Bypass Road, Sircilla",
        rating: 4.6,
        reviews: 750,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/function-halls/k-function-hall/1.webp",
      },
      {
        id: "maanya-banquet-hall",
        name: "Maanya A/C Banquet Hall",
        description: "Weddings, Functions & Meetings",
        category: "Function Halls",
        icon: "business",
        price: "Contact for Quote",
        capacity: "Capacity: 800-1000 People",
        location: "Goldsmith Street, Main Bazar, Sircilla",
        rating: 4.7,
        reviews: 890,
        availability: "Available Now",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/events-services/function-halls/maanya-a-c-banquet-hall/2.jpg",
      },
      // Catering
      {
        id: "vinayaka-catering",
        name: "Vinayaka Catering",
        description: "Delicious Catering for Weddings & Functions",
        category: "Catering",
        icon: "restaurant",
        price: "Starting from ₹99 per person",
        details: "Minimum 200 People | Veg & Non-Veg available | Professional staff",
        rating: 4.8,
        reviews: 1800,
        availability: "Available Now",
        image: "https://plus.unsplash.com/premium_photo-1686239357900-febfb958f33c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0ZXJpbmd8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: "catering-staff-service",
        name: "Catering Staff Service",
        description: "Trained serving staff for weddings & functions",
        category: "Catering",
        icon: "people",
        price: "Starting from ₹499 per person",
        details: "30% lower than market rates",
        rating: 4.6,
        reviews: 650,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1518619745898-93e765966dcd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2F0ZXJpbmd8ZW58MHx8MHx8fDA%3D",
      },
      // Mehendi Art
      {
        id: "mehendi-art",
        name: "Mehendi Art",
        description: "Beautiful Mehendi Art Services",
        category: "Mehendi Art",
        icon: "brush",
        price: "Starting from ₹299 per hand",
        details: "Natural & Chemical-Free Mehendi Paste",
        rating: 4.7,
        reviews: 950,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVoZW5kaXxlbnwwfHwwfHx8MA%3D%3D",
      },
      // Photography (New)
      {
        id: "photography-service",
        name: "Professional Photography",
        description: "Birthday, Wedding, Functions & More",
        category: "Photography",
        icon: "camera",
        price: "Custom Quote",
        details: "Select event type and submit a request",
        rating: 4.8,
        reviews: 540,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
      },
      // Chef (New)
      {
        id: "chef-service",
        name: "Chef Service",
        description: "Home or Function Hall – 1 to 5 Days",
        category: "Chef",
        icon: "restaurant",
        price: "Custom Quote",
        details: "Tell us venue type, days and date",
        rating: 4.7,
        reviews: 410,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop&q=60",
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
    return byCategory.filter(s => matchesOrdered(query, s.name, s.description, s.details ?? "", s.location ?? ""));
  }, [data, selectedCategory, query]);

  // Redirect to types tab if no type preselected
  useEffect(() => {
    if (!params.preselect) {
      router.replace({ pathname: '/category-types', params: { category: 'events' } });
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCategory}</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search events services..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>
      </View>

      {/* Category chips outside of the header */}
      {/* Types are now shown in a dedicated tab; horizontal chips removed */}

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
              if (item.category === 'Photography') {
                router.push({ pathname: "/photography-request" });
                return;
              }
              if (item.category === 'Chef') {
                router.push({ pathname: "/chef-request" });
                return;
              }
              const eventId = item.name.toLowerCase().replace(/\s+/g, '-');
              router.push({ pathname: "/event-detail", params: { eventId, image: item.image || "", normalUserOffer: item.normalUserOffer || "", vipUserOffer: item.vipUserOffer || "" } });
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={
                  item.image && /^https?:\/\//.test(item.image)
                    ? { uri: item.image }
                    : require("../assets/default.png")
                }
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.discountRibbon}>
                <Text style={styles.discountText}>Lowest Price</Text>
              </View>
              <LikeButton 
                item={{
                  id: item.id,
                  name: item.name,
                  category: 'Events',
                  subcategory: item.category,
                  image: item.image,
                  description: item.description,
                  price: item.price,
                  rating: item.rating,
                  reviews: item.reviews,
                  location: item.location || '',
                  address: item.location || '',
                }}
                style={styles.favoriteButton}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.descriptionRow}>
                    <Ionicons name={item.icon} size={14} color="#6b7280" />
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </View>
                  {item.capacity && (
                    <View style={styles.capacityRow}>
                      <Ionicons name="people" size={14} color="#6b7280" />
                      <Text style={styles.capacityText}>{item.capacity}</Text>
                    </View>
                  )}
                  {item.location && (
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={14} color="#6b7280" />
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                  )}
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

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{item.price}</Text>
                {item.details && (
                  <Text style={styles.detailsText}>{item.details}</Text>
                )}
              </View>

              <View style={styles.availabilityRow}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>{item.availability}</Text>
              </View>

              <View style={styles.ctaContainer}>
                <Text style={styles.ctaText}>View & Book Service</Text>
                <Ionicons name="arrow-forward" size={16} color="#e91e63" />
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
  headerGradient: { backgroundColor: "#e91e63", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
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
  descriptionRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  descriptionText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  capacityRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  capacityText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingStars: { flexDirection: "row", marginRight: 6 },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#111827", marginRight: 4 },
  reviewsText: { fontSize: 12, color: "#6b7280" },
  priceRow: { marginTop: 8, marginBottom: 8 },
  priceText: { fontSize: 14, fontWeight: "700", color: "#e91e63" },
  detailsText: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  availabilityRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  ctaContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 },
  ctaText: { fontSize: 14, fontWeight: '600', color: '#e91e63', marginRight: 6 },
  favoriteButton: { position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
});
