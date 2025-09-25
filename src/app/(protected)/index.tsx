import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useAuthLogout } from "../../shared/hooks/useAuth";
import FavoritesScreen from "../../screens/protected/Favorites/FavoritesScreen";
import HomeScreen from "../../screens/protected/Home/HomeScreen";

const Tab = createMaterialTopTabNavigator();

function CustomHeader() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter();
  const logout = useAuthLogout();

  const handleMenuPress = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleSignOut = () => {
    setIsMenuVisible(false);
    logout();
    router.replace("/(logged-out)");
  };

  const handleBackdropPress = () => {
    setIsMenuVisible(false);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>BRQ Movies</Text>
      <TouchableOpacity
        style={[styles.menuButton, isMenuVisible && styles.menuButtonActive]}
        onPress={handleMenuPress}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={isMenuVisible ? "#FFFFFF" : "#FFFFFF"}
        />
      </TouchableOpacity>

      {/* Popup Menu */}
      {isMenuVisible && (
        <Modal
          visible={isMenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
            <View style={styles.popupContainer}>
              <View style={styles.popupMenu}>
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.signOutText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

export default function ProtectedIndex() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16171B" />
      <CustomHeader />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: "#EC8B00",
          tabBarInactiveTintColor: "#A9A9A9",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Todos os Filmes" }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ title: "Filmes Favoritos" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.neutral,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.neutral,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.secondary,
  },
  menuButton: {
    padding: 4,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonActive: {
    backgroundColor: colors.primary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  popupContainer: {
    position: "absolute",
    top: 70,
    right: 20,
    zIndex: 1000,
  },
  popupMenu: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 8,
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  signOutText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "500",
  },
  tabBar: {
    backgroundColor: colors.neutral,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "none",
  },
  tabBarIndicator: {
    backgroundColor: colors.primary,
    height: 3,
  },
}));
