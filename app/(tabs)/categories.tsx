import { View, FlatList, StyleSheet, TextInput } from "react-native";
import CategoryCard from "@/components/home/CategoryCard";
import { Spacing } from "@/theme";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { useVip } from "../../contexts/VipContext";

const categories = [
  // Primary order
  { id: "1", title: "Food", subtitle: "Restaurants & Takeaway", icon: "fast-food", color: "#FF6B6B" },
  { id: "2", title: "Healthcare", subtitle: "Hospitals & Clinics", icon: "medkit", color: "#4ECDC4" },
  { id: "4", title: "Home Services", subtitle: "Repair & Maintenance", icon: "build", color: "#FFA502" },
  { id: "8", title: "Events", subtitle: "Event Management", icon: "calendar", color: "#27AE60" },
  { id: "12", title: "Shopping", subtitle: "Malls & Fashion", icon: "shirt", color: "#7c3aed" },
  { id: "13", title: "Construction", subtitle: "Building & Materials", icon: "construct", color: "#EAB308" },
  { id: "6", title: "Beauty & Salon", subtitle: "Hair & Beauty Care", icon: "color-palette", color: "#B53471" },
  { id: "14", title: "Others", subtitle: "Custom Service Requests", icon: "add-circle", color: "#6B46C1" },
  // The rest
  { id: "3", title: "Travel", subtitle: "Hotels & Booking", icon: "airplane", color: "#45B7D1", comingSoon: true },
  { id: "5", title: "Automobiles", subtitle: "Car & Bike Services", icon: "car-sport", color: "#3742FA", comingSoon: true },
  { id: "7", title: "Bar", subtitle: "Drinks & Nightlife", icon: "wine", color: "#8E44AD", comingSoon: true },
  { id: "9", title: "Financial Services", subtitle: "Banking & Insurance", icon: "cash", color: "#16A085", comingSoon: true },
  { id: "10", title: "Education", subtitle: "Schools & Coaching", icon: "school", color: "#E67E22", comingSoon: true },
  { id: "11", title: "Electronics", subtitle: "Tech & Gadgets", icon: "phone-portrait", color: "#2C3E50", comingSoon: true },
];


export default function CategoriesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const { userMode } = useVip();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header
  }, [navigation]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery]);

  return (
      <LinearGradient
        colors={userMode === 'vip' ? ["#ffd88a", "#ffffff", "#f6f9ff"] : ["#cfe4ff", "#ffffff", "#f6f9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
      {/* Search Bar */}
      <LinearGradient
        colors={userMode === 'vip' ? ["#ffe1a6", "#ffffff"] : ["#d9ebff", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.searchContainer, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search categories..."
            style={styles.searchInput}
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>



      <LinearGradient
        colors={userMode === 'vip' ? ["#ffffff", "#f8fafc"] : ["#ffffff", "#f8fafc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 8 }}
      >
        <FlatList
          data={filteredCategories}
          renderItem={({ item }) => {
          const handlePress = () => {
            if (item.title === "Food") {
              router.push("/food");
            } else if (item.title === "Healthcare") {
              router.push("/healthcare");
            } else if (item.title === "Home Services") {
              router.push("/home-services");
            } else if (item.title === "Automobiles") {
              // router.push("/automobiles");
              router.push("/coming-soon");
            } else if (item.title === "Travel") {
              router.push("/coming-soon");
            } else if (item.title === "Events") {
              router.push("/events");
            } else if (item.title === "Financial Services") {
              // router.push("/financial-services");
              router.push("/coming-soon");
            } else if (item.title === "Education") {
              // router.push("/education");
              router.push("/coming-soon");
            } else if (item.title === "Beauty & Salon") {
              router.push("/beauty-salon");
            } else if (item.title === "Construction") {
              router.push("/construction");
            } else if (item.title === "Bar" || item.title === "Electronics") {
              router.push("/coming-soon");
            } else if (item.title === "Others") {
              router.push("/others-detail");
            } else if (item.title === "Shopping") {
              router.push("/shopping");
            }
          };

            return (
              <View style={{ width: "50%" }}>
                <CategoryCard
                  icon={item.icon as any}
                  title={item.title}
                  color={item.color}
                  onPress={handlePress}
                  comingSoon={item.comingSoon}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: "transparent",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffcc",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0,
    borderColor: "transparent",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  list: {
    padding: Spacing.md,
  },
});
