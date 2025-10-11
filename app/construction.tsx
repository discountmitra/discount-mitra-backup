import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import NoDataIllustration from "../assets/no-data.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import LikeButton from "../components/common/LikeButton";

type CategoryKey = "Cement" | "Steel" | "Bricks" | "Paints" | "RMC" | "Tiles & Marbles" | "Interior Services" | "Machinery";

type ConstructionItem = {
  id: string;
  name: string;
  description: string;
  category: CategoryKey;
  icon: keyof typeof Ionicons.glyphMap;
  price?: string;
  details?: string;
  rating: number;
  reviews: number;
  availability: string;
  image?: string;
  normalUserOffer?: string;
  vipUserOffer?: string;
};

export default function ConstructionScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Cement");
  const [query, setQuery] = useState("");

  const categories: CategoryKey[] = [
    "Cement",
    "Steel",
    "Bricks",
    "Paints",
    "RMC",
    "Tiles & Marbles",
    "Interior Services",
    "Machinery",
  ];

  useEffect(() => {
    const pre = (params.preselect as string) as CategoryKey | undefined;
    if (pre && (categories as string[]).includes(pre)) {
      setSelectedCategory(pre as CategoryKey);
    }
  }, [params.preselect]);

  const data = useMemo<ConstructionItem[]>(
    () => [
      // Cement
      {
        id: "ultratech-cement",
        name: "Ultratech Cement",
        description: "Ultratech Cement, Ultratech Cement Super",
        category: "Cement",
        icon: "cube",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/construction/ultratech-cement/2.png",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
        normalUserOffer: "Material supply: ₹5 off\nLabour charges: Standard rate\nBooking charges: ₹9",
        vipUserOffer: "Material supply: ₹10 off\nLabour charges: Standard rate\nBooking charges: Free",
      },
      {
        id: "birla-cement",
        name: "Birla Cement",
        description: "MP Birla Cement",
        category: "Cement",
        icon: "cube",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/construction/birla-cement/1.jpg",
        rating: 4.6,
        reviews: 820,
        availability: "Available Now",
        normalUserOffer: "Material supply: ₹5 off\nLabour charges: Standard rate\nBooking charges: ₹9",
        vipUserOffer: "Material supply: ₹10 off\nLabour charges: Standard rate\nBooking charges: Free",
      },
      {
        id: "ambuja-cement",
        name: "Ambuja Cement",
        description: "Ambuja Cement, Ambuja Plus, Ambuja Kawachi",
        category: "Cement",
        icon: "cube",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/construction/ambuja-cement/1.png",
        rating: 4.7,
        reviews: 930,
        availability: "Available Now",
      },
      {
        id: "bangur-cement",
        name: "Bangur Cement",
        description: "Bangur Cement",
        category: "Cement",
        icon: "cube",
        image: "https://ocvlqfitgajfyfgwtrar.supabase.co/storage/v1/object/public/dm-images/construction/bangur-cement/1.png",
        rating: 4.5,
        reviews: 640,
        availability: "Available Now",
      },

      // Steel
      {
        id: "psk-steel",
        name: "PSK Steel",
        description: "PSK TTM 600+ SD",
        category: "Steel",
        icon: "construct",
        image: "https://images.unsplash.com/photo-1676310149114-3f6310957ca6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlZWx8ZW58MHx8MHx8fDA%3D",
        rating: 4.7,
        reviews: 710,
        availability: "Available Now",
        normalUserOffer: "Steel: 5% off\nDelivery charges: Standard rate (market rate)\nBooking charges: ₹9",
        vipUserOffer: "Steel: 10% off\nDelivery charges: Standard rate (market rate)\nBooking charges: Free",
      },
      {
        id: "jindal-steel",
        name: "Jindal Steel",
        description: "Jindal Steel, Jindal Pantha",
        category: "Steel",
        icon: "construct",
        image: "https://plus.unsplash.com/premium_photo-1664297475950-40a4e9aefea5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN0ZWVsfGVufDB8fDB8fHww",
        rating: 4.6,
        reviews: 980,
        availability: "Available Now",
        normalUserOffer: "Steel: 5% off\nDelivery charges: Standard rate (market rate)\nBooking charges: ₹9",
        vipUserOffer: "Steel: 10% off\nDelivery charges: Standard rate (market rate)\nBooking charges: Free",
      },
      {
        id: "tata-steel",
        name: "TATA Steel",
        description: "TATA Steel",
        category: "Steel",
        icon: "construct",
        image: "https://plus.unsplash.com/premium_photo-1677612031010-5424f4ea90ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3RlZWx8ZW58MHx8MHx8fDA%3D",
        rating: 4.6,
        reviews: 860,
        availability: "Available Now",
        normalUserOffer: "Steel: 5% off\nDelivery charges: Standard rate (market rate)\nBooking charges: ₹9",
        vipUserOffer: "Steel: 10% off\nDelivery charges: Standard rate (market rate)\nBooking charges: Free",
      },

      // Bricks
      {
        id: "red-bricks",
        name: "Red Bricks",
        description: "Top Quality Red Bricks",
        category: "Bricks",
        icon: "apps",
        image: "https://plus.unsplash.com/premium_photo-1683120912204-c16b67c17008?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGJyaWNrfGVufDB8fDB8fHww",
        rating: 4.7,
        reviews: 540,
        availability: "Available Now",
        normalUserOffer: "Bricks: ₹500 off\nDelivery: Free\nBooking charges: ₹9",
        vipUserOffer: "Bricks: ₹1000 off\nDelivery: Free\nBooking charges: Free",
      },
      {
        id: "cement-bricks",
        name: "Cement Bricks",
        description: "All Sizes",
        category: "Bricks",
        icon: "apps",
        image: "https://images.unsplash.com/photo-1657007508392-d68322544f70?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNlbWVudCUyMGJyaWNrfGVufDB8fDB8fHww",
        rating: 4.6,
        reviews: 420,
        availability: "Available Now",
        normalUserOffer: "Bricks: ₹500 off\nDelivery: Free\nBooking charges: ₹9",
        vipUserOffer: "Bricks: ₹1000 off\nDelivery: Free\nBooking charges: Free",
      },

      // Paints
      {
        id: "asian-paints",
        name: "Asian Paints",
        description: "All Ranges (1ltr to 20ltrs)",
        category: "Paints",
        icon: "color-palette",
        image: "https://images.unsplash.com/photo-1658402995914-22a4ba7e1a94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
        rating: 4.8,
        reviews: 1120,
        availability: "Available Now",
      },
      {
        id: "nerolac-paints",
        name: "Nerolac Paints",
        description: "All Ranges (1ltr to 20ltrs)",
        category: "Paints",
        icon: "color-palette",
        image: "https://images.unsplash.com/photo-1711467486181-bf24c3befb3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
        rating: 4.7,
        reviews: 760,
        availability: "Available Now",
      },
      {
        id: "berger-paints",
        name: "Berger Paints",
        description: "All Ranges (1ltr to 20ltrs)",
        category: "Paints",
        icon: "color-palette",
        image: "https://images.unsplash.com/photo-1573421706309-8e71afba54a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
        rating: 4.6,
        reviews: 690,
        availability: "Available Now",
      },

      // RMC
      {
        id: "rmc-anytime",
        name: "Ready Mix Concrete – Any Time",
        description: "Professional concrete delivery service",
        category: "RMC",
        icon: "cube",
        image: "https://images.unsplash.com/photo-1573421706309-8e71afba54a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXNpYW4lMjBwYWludHN8ZW58MHx8MHx8fDA%3D",
        rating: 4.8,
        reviews: 880,
        availability: "Available Now",
      },

      // Tiles & Marbles
      {
        id: "tiles",
        name: "Tiles",
        description: "All Types",
        category: "Tiles & Marbles",
        icon: "grid",
        image: "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VGlsZXN8ZW58MHx8MHx8fDA%3D",
        rating: 4.6,
        reviews: 730,
        availability: "Available Now",
      },
      {
        id: "marbles",
        name: "Marbles",
        description: "All Types",
        category: "Tiles & Marbles",
        icon: "grid",
        image: "https://plus.unsplash.com/premium_photo-1681414728775-7aa0607c41cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFyYmxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
        rating: 4.6,
        reviews: 730,
        availability: "Available Now",
      },
      {
        id: "interior-design",
        name: "Interior Design",
        description: "Top Brands (Ashirvad, Prince, Kisan, Supreme & More)",
        category: "Interior Services",
        icon: "water",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
        rating: 4.7,
        reviews: 780,
        availability: "Available Now",
        normalUserOffer: "Free estimation\nBooking charges: ₹9",
        vipUserOffer: "Free estimation\nFree monitoring\nBooking charges: Free",
      },

      // Machinery
      {
        id: "jcb",
        name: "JCB",
        description: "On time & professional drivers",
        category: "Machinery",
        icon: "construct",
        image: "https://images.unsplash.com/photo-1690719495572-bc42843eae29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amNifGVufDB8fDB8fHww",
        rating: 4.8,
        reviews: 820,
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
    return byCategory.filter(s => matchesOrdered(query, s.name, s.description));
  }, [data, selectedCategory, query]);

  // Redirect to types tab if no type preselected
  useEffect(() => {
    if (!params.preselect) {
      router.replace({ pathname: '/category-types', params: { category: 'construction' } });
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
              placeholder="Search construction..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>
      </View>

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
          <TouchableOpacity activeOpacity={0.9} style={styles.card}
            onPress={() => {
              const constructionId = item.name.toLowerCase().replace(/\s+/g, '-');
              router.push({ pathname: "/construction-detail", params: { constructionId, image: item.image || "", normalUserOffer: item.normalUserOffer || "", vipUserOffer: item.vipUserOffer || "" } });
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
                <Text style={styles.discountText}>Best Price</Text>
              </View>
              <LikeButton 
                item={{
                  id: item.id,
                  name: item.name,
                  category: 'Construction',
                  subcategory: item.category,
                  image: item.image,
                  description: item.description,
                  price: item.price || '',
                  rating: item.rating,
                  reviews: item.reviews,
                  location: item.category,
                  address: item.category,
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

              {item.price && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  {item.details && (
                    <Text style={styles.detailsText}>{item.details}</Text>
                  )}
                </View>
              )}

              <View style={styles.availabilityRow}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>{item.availability}</Text>
              </View>

              {/* Simple text CTA instead of button */}
              <View style={styles.ctaContainer}>
                <Text style={styles.ctaText}>View details</Text>
                <Ionicons name="arrow-forward" size={16} color="#f97316" />
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
  headerGradient: { backgroundColor: "#f97316", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  filterButton: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", marginLeft: 12 },
  categoryChipsContainer: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  categoryChipsOuter: { paddingHorizontal: 16, paddingVertical: 12 },
  catChip: { borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#ffffff", paddingHorizontal: 14, height: 40, borderRadius: 20, marginRight: 12, alignItems: "center", justifyContent: "center" },
  catChipActive: { backgroundColor: "#f97316", borderColor: "#f97316" },
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
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingStars: { flexDirection: "row", marginRight: 6 },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#111827", marginRight: 4 },
  reviewsText: { fontSize: 12, color: "#6b7280" },
  priceRow: { marginTop: 8, marginBottom: 8 },
  priceText: { fontSize: 14, fontWeight: "700", color: "#f97316" },
  detailsText: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  availabilityRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#f97316", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  ctaContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#f97316', marginRight: 6 },
  favoriteButton: { position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
});


