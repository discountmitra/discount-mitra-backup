import { View, Text, StyleSheet, TextInput } from "react-native";
import { Colors, FontSizes, Spacing, FontWeights } from "../../theme";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome back, John Doe!</Text>
      <Text style={styles.subtext}>Save money with every purchase</Text>

      <TextInput
        style={styles.search}
        placeholder="Search for services, restaurants.."
        placeholderTextColor={Colors.secondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    backgroundColor: "#2563EB", // Blue gradient top → replace with linear gradient later
  },
  greeting: { fontSize: FontSizes.subtitle, color: "white", fontFamily: FontWeights.semibold },
  subtext: {
    fontSize: FontSizes.small,
    color: "white",
    marginBottom: Spacing.md,
  },
  search: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.input,
    lineHeight: FontSizes.input + 6,
  },
});
