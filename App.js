import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./Screens/HomeScreens/HomeScreen";
import NotificationScreen from "./Screens/NotificationScreens/NotificationScreen";
import MenuScreen from "./Screens/MenuScreen/MenuScreen";
import ProfileScreen from "./Screens/ProfileScreen/ProfileScreen";
import LoginScreen from "./Screens/LoginScreens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Screens
const MainTabs = ({ user, setUser }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Home") iconName = "home-outline";
        else if (route.name === "Notifications") iconName = "notifications-outline";
        else if (route.name === "Menu") iconName = "restaurant-outline";
        else if (route.name === "Profile") iconName = "person-outline";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarShowLabel: true,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home">
      {() => <HomeScreen user={user} />}
    </Tab.Screen>
    <Tab.Screen name="Notifications" component={NotificationScreen} />
    <Tab.Screen name="Menu" component={MenuScreen} />
    <Tab.Screen name="Profile">
      {() => <ProfileScreen user={user} setUser={setUser} />}
    </Tab.Screen>
  </Tab.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main">
            {() => <MainTabs user={user} setUser={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {() => <LoginScreen setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
