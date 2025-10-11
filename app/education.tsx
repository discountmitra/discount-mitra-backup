import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import NoDataIllustration from "../assets/no-data.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type CategoryKey = "Schools & Colleges" | "Coaching & Tuition" | "Career Guidance" | "Extracurricular Activities";

type EducationService = {
  id: string;
  name: string;
  specialist?: string;
  description: string;
  offers?: string;
  category: CategoryKey;
  subCategory: string;
  buttonType: 'request';
  rating: number;
  reviews: number;
  availability: string;
  features?: string[];
};

export default function EducationScreen() {
  const navigation = useNavigation();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Schools & Colleges");
  const [query, setQuery] = useState("");

  const categories: CategoryKey[] = [
    "Schools & Colleges",
    "Coaching & Tuition",
    "Career Guidance",
    "Extracurricular Activities",
  ];

  const data = useMemo<EducationService[]>(
    () => [
      // Schools & Colleges
      {
        id: "play-schools",
        name: "Best Play Schools",
        specialist: "Top Caring, Friendly Staff, New Learning Place",
        description: "Premium play schools with experienced teachers and child-friendly environment.",
        offers: "25% Discount",
        category: "Schools & Colleges",
        subCategory: "Play Schools",
        buttonType: "request",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
        features: ["Safe Environment", "Creative Learning", "Nutritious Meals"],
      },
      {
        id: "top-schools",
        name: "Top Schools",
        specialist: "Best Class Education, Playground, Friendly Staff",
        description: "Leading schools with excellent academic records and modern infrastructure.",
        offers: "10% Discount",
        category: "Schools & Colleges",
        subCategory: "Schools",
        buttonType: "request",
        rating: 4.7,
        reviews: 980,
        availability: "Available Now",
        features: ["CBSE/ICSE Board", "Sports Facilities", "Science Labs"],
      },
      {
        id: "junior-colleges",
        name: "Top Rank Colleges",
        specialist: "Friendly Staff, Best EAMCET Coaching, Special Care",
        description: "High-ranking junior colleges with excellent academic results and EAMCET coaching.",
        offers: "20% Discount",
        category: "Schools & Colleges",
        subCategory: "Junior Colleges",
        buttonType: "request",
        rating: 4.6,
        reviews: 750,
        availability: "Available Now",
        features: ["EAMCET Coaching", "Small Batch Size", "100% Results"],
      },
      {
        id: "degree-colleges",
        name: "Degree Colleges",
        specialist: "Free Education, Skill Development, Job Placements",
        description: "Quality degree colleges offering free education with skill development focus.",
        offers: "Free Education",
        category: "Schools & Colleges",
        subCategory: "Degree Colleges",
        buttonType: "request",
        rating: 4.8,
        reviews: 1100,
        availability: "Available Now",
        features: ["Free Tuition", "Internship Programs", "Placement Support"],
      },
      {
        id: "engineering-colleges",
        name: "Engineering Colleges",
        specialist: "Bus Facility, Top Professors, Job Placements, Real-Time Projects",
        description: "Premier engineering colleges with industry-experienced faculty and modern labs.",
        offers: "Management Quota - 20% Discount",
        category: "Schools & Colleges",
        subCategory: "Engineering Colleges",
        buttonType: "request",
        rating: 4.9,
        reviews: 1500,
        availability: "Available Now",
        features: ["Management Quota", "Industry Projects", "Transport Facility"],
      },
      // Coaching & Tuition
      {
        id: "tuition-services",
        name: "Tuition Services",
        specialist: "5th Class to Degree, Special Care, Easy Methods",
        description: "Comprehensive tuition services from 5th class to degree level with experienced teachers.",
        offers: "20% Discount",
        category: "Coaching & Tuition",
        subCategory: "Tuition Services",
        buttonType: "request",
        rating: 4.7,
        reviews: 890,
        availability: "Available Now",
        features: ["All Subjects", "Individual Attention", "Pass Guarantee"],
      },
      {
        id: "competitive-exams-coaching",
        name: "Competitive Exams Coaching (NEET, JEE, UPSC)",
        specialist: "Expert Faculty, Mock Tests, Study Materials",
        description: "Specialized coaching for competitive exams with experienced faculty and mock tests.",
        offers: "20% Discount",
        category: "Coaching & Tuition",
        subCategory: "Competitive Exams Coaching",
        buttonType: "request",
        rating: 4.8,
        reviews: 1300,
        availability: "Available Now",
        features: ["NEET/JEE/UPSC", "Mock Tests", "Study Materials"],
      },
      {
        id: "eamcet-coaching",
        name: "EAMCET Coaching",
        specialist: "State Board Experts, Previous Papers, Rank Improvement",
        description: "Dedicated EAMCET coaching with state board curriculum experts and previous papers.",
        offers: "20% Discount",
        category: "Coaching & Tuition",
        subCategory: "EAMCET Coaching",
        buttonType: "request",
        rating: 4.6,
        reviews: 720,
        availability: "Available Now",
        features: ["State Syllabus", "Previous Papers", "Rank Oriented"],
      },
      {
        id: "group-exams-coaching",
        name: "Group I, II, IV Coaching",
        specialist: "Government Job Focus, Current Affairs, Mock Tests",
        description: "Specialized coaching for government job exams with current affairs and mock tests.",
        offers: "20% Discount",
        category: "Coaching & Tuition",
        subCategory: "Group Exams Coaching",
        buttonType: "request",
        rating: 4.5,
        reviews: 650,
        availability: "Available Now",
        features: ["Government Jobs", "Current Affairs", "Interview Prep"],
      },
      {
        id: "computer-training",
        name: "Computer Training",
        specialist: "C, C++, Java, Tally, Basic to Advanced",
        description: "Complete computer training from basic to advanced levels including programming languages.",
        offers: "20% Discount",
        category: "Coaching & Tuition",
        subCategory: "Computer Training",
        buttonType: "request",
        rating: 4.7,
        reviews: 950,
        availability: "Available Now",
        features: ["Programming Languages", "Software Training", "Practical Labs"],
      },
      // Career Guidance
      {
        id: "career-counselling",
        name: "Career Counselling",
        specialist: "Expert Counselors, Aptitude Tests, Career Mapping",
        description: "Professional career counselling with aptitude testing and personalized guidance.",
        offers: "25% Discount",
        category: "Career Guidance",
        subCategory: "Career Counselling",
        buttonType: "request",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
        features: ["Aptitude Tests", "Expert Counselors", "Career Mapping"],
      },
      {
        id: "abroad-education-consultancy",
        name: "Abroad Education (UK, Canada, US & More)",
        specialist: "Visa Processing, University Selection, Scholarship Guidance",
        description: "Complete abroad education consultancy with university selection and visa processing.",
        offers: "20% Discount",
        category: "Career Guidance",
        subCategory: "Abroad Education Consultancy",
        buttonType: "request",
        rating: 4.7,
        reviews: 1100,
        availability: "Available Now",
        features: ["Visa Processing", "University Selection", "Scholarships"],
      },
      {
        id: "resume-interview-training",
        name: "Resume Building & Interview Training",
        specialist: "Professional Resume, Mock Interviews, Soft Skills",
        description: "Professional resume building and interview preparation with mock interviews.",
        offers: "20% Discount",
        category: "Career Guidance",
        subCategory: "Resume Building & Interview Training",
        buttonType: "request",
        rating: 4.6,
        reviews: 800,
        availability: "Available Now",
        features: ["Professional Resume", "Mock Interviews", "Soft Skills"],
      },
      {
        id: "internship-job-assistance",
        name: "Internship & Job Assistance",
        specialist: "Paid & Unpaid Internships, Job Support",
        description: "Comprehensive internship and job placement assistance with industry connections.",
        offers: "20% Discount",
        category: "Career Guidance",
        subCategory: "Internship & Job Assistance",
        buttonType: "request",
        rating: 4.5,
        reviews: 750,
        availability: "Available Now",
        features: ["Paid Internships", "Job Placements", "Industry Network"],
      },
      // Extracurricular Activities
      {
        id: "dance-music-classes",
        name: "Dance & Music Classes",
        specialist: "Classical & Modern, Professional Instructors",
        description: "Professional dance and music classes covering classical and modern forms.",
        offers: "20% Discount",
        category: "Extracurricular Activities",
        subCategory: "Dance & Music Classes",
        buttonType: "request",
        rating: 4.7,
        reviews: 900,
        availability: "Available Now",
        features: ["Classical & Modern", "Professional Instructors", "Performances"],
      },
      {
        id: "arts-crafts-training",
        name: "Arts & Crafts Training",
        specialist: "Creative Skills, Hands-on Learning",
        description: "Creative arts and crafts training with hands-on learning and skill development.",
        offers: "20% Discount",
        category: "Extracurricular Activities",
        subCategory: "Arts & Crafts Training",
        buttonType: "request",
        rating: 4.6,
        reviews: 680,
        availability: "Available Now",
        features: ["Creative Skills", "All Ages", "Hands-on Learning"],
      },
      {
        id: "sports-coaching",
        name: "Sports Coaching (Cricket, Badminton, etc.)",
        specialist: "All Sports, Special Care",
        description: "Professional sports coaching for various sports with qualified coaches.",
        offers: "20% Discount",
        category: "Extracurricular Activities",
        subCategory: "Sports Coaching",
        buttonType: "request",
        rating: 4.8,
        reviews: 1050,
        availability: "Available Now",
        features: ["Multiple Sports", "Qualified Coaches", "Proper Facilities"],
      },
      {
        id: "yoga-meditation",
        name: "Yoga & Meditation Classes (Online & Offline)",
        specialist: "Mental Wellness, Physical Health",
        description: "Comprehensive yoga and meditation classes focusing on mental wellness and physical health.",
        offers: "20% Discount",
        category: "Extracurricular Activities",
        subCategory: "Yoga & Meditation",
        buttonType: "request",
        rating: 4.9,
        reviews: 1400,
        availability: "Available Now",
        features: ["Online & Offline", "Mental Wellness", "All Levels"],
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
    return byCategory.filter(s => matchesOrdered(query, s.name, s.specialist ?? "", s.description, s.subCategory));
  }, [data, selectedCategory, query]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Education Services</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search education services..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.filterButton}>
            <Ionicons name="options-outline" size={18} color="#fff" />
          </TouchableOpacity>
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
          <TouchableOpacity activeOpacity={0.9} style={styles.card}>
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
                  {item.specialist && (
                    <Text style={styles.specialist}>{item.specialist}</Text>
                  )}
                  <View style={styles.descriptionRow}>
                    <Ionicons name="school" size={14} color="#6b7280" />
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </View>
                  <View style={styles.subCategoryRow}>
                    <Ionicons name="book" size={14} color="#6b7280" />
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

              <View style={styles.actionsRow}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {}} style={styles.requestNowBtn}>
                  <Text style={styles.requestNowText}>Request Now</Text>
                </TouchableOpacity>
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
  headerGradient: { backgroundColor: "#7c3aed", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
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
  specialist: { fontSize: 13, color: "#7c3aed", fontWeight: "600", marginTop: 4 },
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
  requestNowBtn: { flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: "#7c3aed" },
  requestNowText: { fontWeight: "700", color: "#ffffff", fontSize: 14 },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
});
