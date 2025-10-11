import { useState, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, Animated, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { restaurantData, Restaurant, MenuCategory } from "../constants/restaurantData";

export default function TakeAwayScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Get restaurant data from params
  const restaurant: Restaurant = useMemo(() => {
    const restaurantId = params.restaurantId as string;
    return restaurantData.find(r => r.id === restaurantId) || restaurantData[0];
  }, [params.restaurantId]);

  const cartTotal = useMemo(() => {
    let total = 0;
    const menu = restaurant.menu;
    
    Object.entries(cart).forEach(([itemKey, quantity]) => {
      const [category, itemIndex] = itemKey.split('-');
      
      if (menu && typeof menu === 'object') {
        if (Array.isArray(menu)) {
          // Handle simple array format (like Shankar Chat)
          if (category === 'menu' && menu[parseInt(itemIndex)]) {
            const price = menu[parseInt(itemIndex)].price;
            const itemPrice = typeof price === 'number' ? price : price.full;
            total += itemPrice * quantity;
          }
        } else {
          // Handle object with categories format (like ICE HOUSE, Indian Fast Food)
          const categoryItems = menu[category];
          if (Array.isArray(categoryItems) && categoryItems[parseInt(itemIndex)]) {
            const price = categoryItems[parseInt(itemIndex)].price;
            const itemPrice = typeof price === 'number' ? price : price.full;
            total += itemPrice * quantity;
          }
        }
      }
    });
    return total;
  }, [cart, restaurant.menu]);

  const addToCart = (category: string, itemIndex: number) => {
    const key = `${category}-${itemIndex}`;
    setCart(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
  };

  const removeFromCart = (category: string, itemIndex: number) => {
    const key = `${category}-${itemIndex}`;
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[key] > 1) {
        newCart[key] -= 1;
      } else {
        delete newCart[key];
      }
      return newCart;
    });
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOrder = () => {
    if (cartTotal === 0) {
      Alert.alert('Error', 'Please add items to cart');
      return;
    }
    setShowConfirm(true);
  };

  const confirmOrder = () => {
    setShowConfirm(false);
    setShowProcessing(true);
    setTimeout(() => {
      setShowProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSearchResults(text.length > 0);
  };


  const getAllMenuItems = useMemo(() => {
    const menu = restaurant.menu;
    let allItems: Array<{category: string, item: any, index: number}> = [];
    
    if (menu && typeof menu === 'object') {
      if (Array.isArray(menu)) {
        // Handle simple array format (like Shankar Chat)
        menu.forEach((item, index) => {
          allItems.push({ category: 'menu', item, index });
        });
      } else {
        // Handle object with categories format (like ICE HOUSE, Indian Fast Food)
        Object.entries(menu).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            items.forEach((item, index) => {
              allItems.push({ category, item, index });
            });
          }
        });
      }
    }
    return allItems;
  }, [restaurant.menu]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return getAllMenuItems.filter(({ item }) => 
      item.item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, getAllMenuItems]);

  const cartItems = useMemo(() => {
    const items: Array<{category: string, item: any, index: number, quantity: number}> = [];
    
    Object.entries(cart).forEach(([itemKey, quantity]) => {
      const [category, itemIndex] = itemKey.split('-');
      const menu = restaurant.menu;
      
      if (menu && typeof menu === 'object') {
        if (Array.isArray(menu)) {
          // Handle simple array format (like Shankar Chat)
          if (category === 'menu' && menu[parseInt(itemIndex)]) {
            items.push({
              category,
              item: menu[parseInt(itemIndex)],
              index: parseInt(itemIndex),
              quantity
            });
          }
        } else {
          // Handle object with categories format (like ICE HOUSE, Indian Fast Food)
          const categoryItems = menu[category];
          if (Array.isArray(categoryItems) && categoryItems[parseInt(itemIndex)]) {
            items.push({
              category,
              item: categoryItems[parseInt(itemIndex)],
              index: parseInt(itemIndex),
              quantity
            });
          }
        }
      }
    });
    
    return items;
  }, [cart, restaurant.menu]);

  const filteredMenu = useMemo(() => {
    const menu = restaurant.menu;
    let filtered: MenuCategory = {};
    
    if (menu && typeof menu === 'object') {
      if (Array.isArray(menu)) {
        // Handle simple array format (like Shankar Chat)
        let filteredItems = [...menu];
        
        // Apply search filter
        if (searchQuery.trim()) {
          filteredItems = filteredItems.filter(item => 
            item.item.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Apply category filters
        if (selectedFilters.length > 0) {
          filteredItems = filteredItems.filter(item => {
            const itemName = item.item.toLowerCase();
            return selectedFilters.some(filter => {
              switch (filter) {
                case 'veg':
                  return !itemName.includes('chicken') && !itemName.includes('egg') && !itemName.includes('meat') && !itemName.includes('fish') && !itemName.includes('prawn');
                case 'non-veg':
                  return itemName.includes('chicken') || itemName.includes('egg') || itemName.includes('meat') || itemName.includes('fish') || itemName.includes('prawn');
                case 'rating':
                  return true; // All items have good ratings in our mock data
                case 'discount':
                  return true; // All items have discounts in our mock data
                default:
                  return true;
              }
            });
          });
        }
        
        if (filteredItems.length > 0) {
          filtered['menu'] = filteredItems;
        }
      } else {
        // Handle object with categories format (like ICE HOUSE, Indian Fast Food)
        Object.entries(menu).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            let filteredItems = items;
            
            // Apply search filter
            if (searchQuery.trim()) {
              filteredItems = filteredItems.filter(item => 
                item.item.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }
            
            // Apply category filters
            if (selectedFilters.length > 0) {
              filteredItems = filteredItems.filter(item => {
                const itemName = item.item.toLowerCase();
                return selectedFilters.some(filter => {
                  switch (filter) {
                    case 'veg':
                      return !itemName.includes('chicken') && !itemName.includes('egg') && !itemName.includes('meat') && !itemName.includes('fish') && !itemName.includes('prawn');
                    case 'non-veg':
                      return itemName.includes('chicken') || itemName.includes('egg') || itemName.includes('meat') || itemName.includes('fish') || itemName.includes('prawn');
                    case 'rating':
                      return true; // All items have good ratings in our mock data
                    case 'discount':
                      return true; // All items have discounts in our mock data
                    default:
                      return true;
                  }
                });
              });
            }
            
            if (filteredItems.length > 0) {
              filtered[category] = filteredItems;
            }
          }
        });
      }
    }
    return filtered;
  }, [searchQuery, restaurant.menu, selectedFilters]);

  return (
    <View style={styles.container}>
      {/* Single Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{restaurant.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerTakeAway}>Take Away</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        ref={scrollRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const offsetY = nativeEvent.contentOffset.y;
          setShowScrollTop(offsetY > 300);
        }}
        scrollEventThrottle={16}
      >

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for dishes"
              placeholderTextColor="#6b7280"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filters - Only show when not searching */}
        {!showSearchResults && (
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            <TouchableOpacity 
              style={[styles.filterChip, selectedFilters.includes('veg') && styles.filterChipSelected]}
              onPress={() => toggleFilter('veg')}
            >
              <View style={styles.vegIndicator} />
              <Text style={[styles.filterChipText, selectedFilters.includes('veg') && styles.filterChipTextSelected]}>Veg</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterChip, selectedFilters.includes('non-veg') && styles.filterChipSelected]}
              onPress={() => toggleFilter('non-veg')}
            >
              <View style={styles.nonVegIndicator} />
              <Text style={[styles.filterChipText, selectedFilters.includes('non-veg') && styles.filterChipTextSelected]}>Non-Veg</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterChip, selectedFilters.includes('rating') && styles.filterChipSelected]}
              onPress={() => toggleFilter('rating')}
            >
              <Text style={[styles.filterChipText, selectedFilters.includes('rating') && styles.filterChipTextSelected]}>Ratings 4.0+</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterChip, selectedFilters.includes('discount') && styles.filterChipSelected]}
              onPress={() => toggleFilter('discount')}
            >
              <Text style={[styles.filterChipText, selectedFilters.includes('discount') && styles.filterChipTextSelected]}>50% Off</Text>
            </TouchableOpacity>
          </ScrollView>
          {(selectedFilters.length > 0 || searchQuery.length > 0) && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Ionicons name="close" size={16} color="#ef4444" />
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        )}

        {/* Search Results */}
        {showSearchResults && (
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                {searchResults.length} results for "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={() => setShowSearchResults(false)}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchResultsList}>
              {searchResults.map(({ category, item, index }) => {
                const itemKey = `${category}-${index}`;
                const quantity = cart[itemKey] || 0;
                const price = typeof item.price === 'number' ? item.price : item.price.full;
                const discountedPrice = Math.floor(price * 0.7); // 30% discount
                
                return (
                  <View key={itemKey} style={styles.searchResultItem}>
                    <Image source={require("../assets/default.png")} style={styles.searchResultImage} />
                    <View style={styles.searchResultContent}>
                      <View style={styles.searchResultHeader}>
                        <View style={[
                          item.item.toLowerCase().includes('chicken') || 
                          item.item.toLowerCase().includes('egg') || 
                          item.item.toLowerCase().includes('meat') ||
                          item.item.toLowerCase().includes('fish') ||
                          item.item.toLowerCase().includes('prawn')
                            ? styles.nonVegIndicator 
                            : styles.vegIndicator
                        ]} />
                        <Text style={styles.searchResultCategory}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                        </Text>
                      </View>
                      <Text style={styles.searchResultName}>{item.item}</Text>
                      <View style={styles.searchResultRating}>
                        <Ionicons name="star" size={12} color="#fbbf24" />
                        <Text style={styles.searchResultRatingText}>4.6 (164)</Text>
                      </View>
                      <View style={styles.searchResultPrice}>
                        <Text style={styles.searchResultOriginalPrice}>₹{price}</Text>
                        <Text style={styles.searchResultDiscountedPrice}>₹{discountedPrice}</Text>
                      </View>
                    </View>
                    <View style={styles.searchResultActions}>
                      {quantity > 0 ? (
                        <View style={styles.quantityControls}>
                          <TouchableOpacity style={styles.quantityButton} onPress={() => removeFromCart(category, index)}>
                            <Ionicons name="remove" size={16} color="#111827" />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{quantity}</Text>
                          <TouchableOpacity style={styles.quantityButton} onPress={() => addToCart(category, index)}>
                            <Ionicons name="add" size={16} color="#111827" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity 
                          style={styles.addButton}
                          onPress={() => addToCart(category, index)}
                        >
                          <Text style={styles.addButtonText}>ADD</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Menu Categories - Only show when not searching */}
        {!showSearchResults && (
        <View style={styles.menuContainer}>
          {Object.keys(filteredMenu).length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search" size={48} color="#d1d5db" />
              <Text style={styles.noResultsTitle}>No items found</Text>
              <Text style={styles.noResultsText}>
                {searchQuery ? `No dishes match "${searchQuery}"` : 'Try adjusting your filters'}
              </Text>
              <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
                <Text style={styles.clearAllButtonText}>Clear all filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            Object.entries(filteredMenu).map(([category, items]) => {
              if (!Array.isArray(items)) return null;
              
              return (
                <View key={category} style={styles.menuCategory}>
                  <Text style={styles.categoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')} ({items.length})
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {items.map((item, index) => {
                  const itemKey = `${category}-${index}`;
                  const quantity = cart[itemKey] || 0;
                  const price = typeof item.price === 'number' ? item.price : item.price.full;
                  const discountedPrice = Math.floor(price * 0.7); // 30% discount
                  
                  return (
                    <View key={index} style={styles.menuItemCard}>
                      <Image source={require("../assets/default.png")} style={styles.menuItemImage} />
                      <View style={styles.menuItemContent}>
                        <View style={styles.menuItemHeader}>
                            <View style={[
                              item.item.toLowerCase().includes('chicken') || 
                              item.item.toLowerCase().includes('egg') || 
                              item.item.toLowerCase().includes('meat') ||
                              item.item.toLowerCase().includes('fish') ||
                              item.item.toLowerCase().includes('prawn')
                                ? styles.nonVegIndicator 
                                : styles.vegIndicator
                            ]} />
                          <Text style={styles.bestsellerBadge}>Bestseller</Text>
                        </View>
                        <Text style={styles.menuItemName}>{item.item}</Text>
                        <View style={styles.menuItemRating}>
                          <Ionicons name="star" size={12} color="#fbbf24" />
                          <Text style={styles.menuItemRatingText}>4.6 (164)</Text>
                        </View>
                        <View style={styles.menuItemPrice}>
                          <Text style={styles.originalPrice}>₹{price}</Text>
                          <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
                        </View>
                        
                        {quantity > 0 ? (
                          <View style={styles.quantityControls}>
                            <TouchableOpacity style={styles.quantityButton} onPress={() => removeFromCart(category, index)}>
                              <Ionicons name="remove" size={16} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={() => addToCart(category, index)}>
                              <Ionicons name="add" size={16} color="#111827" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => addToCart(category, index)}
                          >
                            <Text style={styles.addButtonText}>ADD</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                  })}
                  </ScrollView>
                </View>
              );
            })
          )}
        </View>
        )}

      </ScrollView>

      {/* Floating Menu Button */}
      {cartTotal > 0 && (
        <TouchableOpacity 
          style={styles.floatingMenuButton}
          onPress={() => setShowFloatingMenu(!showFloatingMenu)}
        >
          <Ionicons name="cart" size={24} color="#fff" />
          <View style={styles.floatingMenuBadge}>
            <Text style={styles.floatingMenuBadgeText}>{Object.values(cart).reduce((a, b) => a + b, 0)}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <TouchableOpacity 
          style={[
            styles.scrollTopButton,
            cartTotal > 0 ? styles.scrollTopButtonWithCart : null
          ]}
          onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          accessibilityLabel="Scroll to top"
        >
          <Ionicons name="arrow-up" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Floating Menu Overlay */}
      {showFloatingMenu && (
        <View style={styles.floatingMenuOverlay}>
          <TouchableOpacity 
            style={styles.floatingMenuBackdrop}
            onPress={() => setShowFloatingMenu(false)}
          />
          <View style={styles.floatingMenuContent}>
            <View style={styles.floatingMenuHeader}>
              <Text style={styles.floatingMenuTitle}>Your Order</Text>
              <TouchableOpacity onPress={() => setShowFloatingMenu(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.floatingMenuList}>
              {cartItems.map(({ category, item, index, quantity }) => {
                const price = typeof item.price === 'number' ? item.price : item.price.full;
                const discountedPrice = Math.floor(price * 0.7);
                
                return (
                  <View key={`${category}-${index}`} style={styles.floatingMenuItem}>
                    <View style={styles.floatingMenuItemInfo}>
                      <View style={styles.floatingMenuItemHeader}>
                        <View style={[
                          item.item.toLowerCase().includes('chicken') || 
                          item.item.toLowerCase().includes('egg') || 
                          item.item.toLowerCase().includes('meat') ||
                          item.item.toLowerCase().includes('fish') ||
                          item.item.toLowerCase().includes('prawn')
                            ? styles.nonVegIndicator 
                            : styles.vegIndicator
                        ]} />
                        <Text style={styles.floatingMenuItemName}>{item.item}</Text>
                      </View>
                      <Text style={styles.floatingMenuItemPrice}>₹{discountedPrice}</Text>
                    </View>
                    <View style={styles.floatingMenuItemActions}>
                      <TouchableOpacity 
                        style={styles.floatingMenuQuantityButton} 
                        onPress={() => removeFromCart(category, index)}
                      >
                        <Ionicons name="remove" size={16} color="#111827" />
                      </TouchableOpacity>
                      <Text style={styles.floatingMenuQuantityText}>{quantity}</Text>
                      <TouchableOpacity 
                        style={styles.floatingMenuQuantityButton} 
                        onPress={() => addToCart(category, index)}
                      >
                        <Ionicons name="add" size={16} color="#111827" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.floatingMenuFooter}>
              <View style={styles.floatingMenuTotal}>
                <Text style={styles.floatingMenuTotalText}>Total: ₹{cartTotal}</Text>
                <Text style={styles.floatingMenuItemsText}>{Object.values(cart).reduce((a, b) => a + b, 0)} items</Text>
              </View>
              <TouchableOpacity style={styles.floatingMenuOrderButton} onPress={handleOrder}>
                <Text style={styles.floatingMenuOrderText}>Place Order</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}> 
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="help-circle" size={32} color="#f97316" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.modalSubtitle}>Place order for ₹{cartTotal}?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={confirmOrder}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={showProcessing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={styles.loadingText}>Placing your order...</Text>
            <Text style={styles.loadingSubtext}>Please wait</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              </View>
            </View>
            <Text style={styles.successModalTitle}>Order Placed</Text>
            <Text style={styles.successModalSubtitle}>We'll notify you when the restaurant accepts it.</Text>
            <TouchableOpacity style={styles.successButton} onPress={() => { setShowSuccess(false); setShowFloatingMenu(false); router.back(); }}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles for take-away screen
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTakeAway: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 2,
  },
  categoryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  callText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 4,
  },
  quickInfoPills: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pillText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
    fontWeight: "500",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  filtersSection: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    flex: 1,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginRight: 8,
  },
  vegIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    marginRight: 6,
  },
  nonVegIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ef4444",
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  filterChipSelected: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  filterChipTextSelected: {
    color: "#fff",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 4,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  clearAllButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  clearAllButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  menuCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  categoryScroll: {
    paddingRight: 16,
  },
  menuItemCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  menuItemImage: {
    width: "100%",
    height: 80,
  },
  menuItemContent: {
    padding: 12,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bestsellerBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ef4444",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  menuItemRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  menuItemRatingText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  menuItemPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    paddingVertical: 6,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  cartSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
    elevation: 8,
  },
  cartContent: {
    flex: 1,
  },
  cartTotal: {
    marginBottom: 4,
  },
  cartTotalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  cartItemsText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  cartDiscount: {
    marginTop: 4,
  },
  cartDiscountText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  placeOrderButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginRight: 6,
  },
  searchResultsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  searchResultsList: {
    gap: 12,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  searchResultCategory: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 6,
    textTransform: "uppercase",
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  searchResultRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  searchResultRatingText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  searchResultPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchResultOriginalPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  searchResultDiscountedPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
  },
  searchResultActions: {
    marginLeft: 12,
  },
  floatingMenuButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  floatingMenuBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingMenuBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  floatingMenuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  floatingMenuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  floatingMenuContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
    elevation: 8,
  },
  floatingMenuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  floatingMenuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  floatingMenuList: {
    maxHeight: 300,
  },
  floatingMenuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  floatingMenuItemInfo: {
    flex: 1,
  },
  floatingMenuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  floatingMenuItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  floatingMenuItemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
  },
  floatingMenuItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  floatingMenuQuantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingMenuQuantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    minWidth: 20,
    textAlign: "center",
  },
  floatingMenuFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  floatingMenuTotal: {
    flex: 1,
  },
  floatingMenuTotalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  floatingMenuItemsText: {
    fontSize: 12,
    color: "#6b7280",
  },
  floatingMenuOrderButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  floatingMenuOrderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginRight: 6,
  },
  scrollTopButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  scrollTopButtonWithCart: {
    bottom: 140,
  },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(249,115,22,0.1)', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f97316', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successModalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  successButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});
