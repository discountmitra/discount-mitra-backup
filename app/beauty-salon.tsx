import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SvgUri } from "react-native-svg";
import { noDataSvgUrl } from "../constants/assets";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import LikeButton from "../components/common/LikeButton";
import { salonServices, salonCategories } from "../constants/salonData";

type SalonCategoryKey = 'men' | 'women' | 'unisex';

type FlatService = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  locationId: string;
  locationName: string;
  rating: number;
  reviews: number;
  address: string;
};

export default function BeautySalonScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SalonCategoryKey>('men');
  const [query, setQuery] = useState("");

  const flatData = useMemo<FlatService[]>(() => {
    const result: FlatService[] = [];
    for (const loc of salonServices) {
      for (const s of loc.services) {
        result.push({ ...s, locationId: loc.id, locationName: loc.name, rating: loc.rating, reviews: loc.reviews, address: loc.address });
      }
    }
    return result;
  }, []);

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
    const byCat = salonServices.filter(l => l.category === selectedCategory).flatMap(loc => loc.services.map(s => ({
      ...s,
      locationId: loc.id,
      locationName: loc.name,
      rating: loc.rating,
      reviews: loc.reviews,
      address: loc.address,
    })) as FlatService[]);
    if (!query.trim()) return byCat;
    return byCat.filter(s => matchesOrdered(query, s.name, s.description, s.subcategory));
  }, [selectedCategory, query]);

  useEffect(() => {
    const pre = (params.preselect as string) as SalonCategoryKey | undefined;
    if (pre && ['men','women','unisex'].includes(pre)) {
      setSelectedCategory(pre);
    }
  }, [params.preselect]);

  // Redirect to types tab if no type preselected
  useEffect(() => {
    if (!params.preselect) {
      router.replace({ pathname: '/category-types', params: { category: 'beauty-salon' } });
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Beauty & Salon</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search salon services..."
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
              <SvgUri uri={noDataSvgUrl} width="100%" height="100%" />
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
          <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => router.push({ pathname: "/salon-detail", params: { id: item.locationId, name: item.locationName, address: item.address, rating: item.rating.toString(), reviews: item.reviews.toString(), image: item.image || '' } })}>
            <View style={{ position: "relative" }}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              <View style={styles.discountRibbon}>
                <Text style={styles.discountText}>Popular</Text>
              </View>
              <LikeButton 
                item={{
                  id: item.id,
                  name: item.name,
                  category: 'Beauty',
                  subcategory: item.subcategory,
                  image: item.image,
                  description: item.description,
                  price: item.price,
                  rating: item.rating,
                  reviews: item.reviews,
                  location: item.locationName,
                  address: item.address,
                }}
                style={styles.favoriteButton}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.descriptionRow}>
                    <Ionicons name="cut" size={14} color="#6b7280" />
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="storefront" size={14} color="#6b7280" />
                    <Text style={styles.locationText}>{item.locationName}</Text>
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

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>Starting at ₹{item.price}</Text>
                <Text style={styles.detailsText}>{item.category} • {item.subcategory}</Text>
              </View>

              <View style={styles.actionsRow}>
                <View style={styles.availabilityRow}>
                  <View style={styles.availabilityDot} />
                  <Text style={styles.availabilityText}>Available Now</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={styles.ctaContainer}>
                  <Text style={styles.ctaText}>Pay and booking</Text>
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
  headerGradient: { backgroundColor: "#b53471", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
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
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingStars: { flexDirection: "row", marginRight: 6 },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#111827", marginRight: 4 },
  reviewsText: { fontSize: 12, color: "#6b7280" },
  priceRow: { marginTop: 8, marginBottom: 8 },
  priceText: { fontSize: 14, fontWeight: "700", color: "#111827" },
  detailsText: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  availabilityRow: { flexDirection: "row", alignItems: "center" },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  ctaContainer: { flexDirection: "row", alignItems: "center" },
  ctaText: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  favoriteButton: { position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
});


