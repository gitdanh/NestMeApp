import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/Home";
import CreateScreen from "./screens/Add";
import RegisterScreen from "./screens/auth/Register";
import LoginScreen from "./screens/auth/Login";
import VerifyOTP from "./screens/auth/VerifyOTP";
import ProfileScreen from "./screens/Profile";
import ChatScreen from "./screens/Chat";
import SingleChat from "./screens/SingleChat";
import NotifyScreen from "./screens/Notify";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, Alert, Image, SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCallback, useEffect, useState } from "react";
import usePrivateHttpClient from "./axios/private-http-hook";
import { setLoginInfo } from "./store/redux/slices/authSlice";
import useRefreshToken from "./axios/refresh-token";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAvatarSource } from "./utils/getImageSource";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />

    </Stack.Navigator>
  );
}

function MainScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="TabScreens"
    >
      <Stack.Screen name="TabScreens" component={AuthenticatedScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Notify" component={NotifyScreen} />
      <Stack.Screen name="SingleChat" component={SingleChat} />
    </Stack.Navigator>
  );
}

function AuthenticatedScreen() {
  const { privateRequest } = usePrivateHttpClient();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState("");

  const getLoginUserInfo = async () => {
    try {
      const response = await privateRequest("/users/auth-user");
      if (response) {
        dispatch(
          setLoginInfo({
            username: response.data.user.username,
            userId: response.data.user._id,
            avatar: response.data.user.profile_picture,
          })
        );
        setAvatar(response.data.user.profile_picture);
      }
    } catch (err) {
      Alert.alert("Error get login username", err.message);
    }
  };

  useEffect(() => {
    getLoginUserInfo();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "black",
          padding: 10,
          height: 65,
          borderColor: "#262626",
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#888888",
        tabBarLabelStyle: {
          // paddingBottom: 10,
          fontSize: 10,
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === "Profile") {
            return (
              <Image
                style={{ width: 26, height: 26, borderRadius: 50 }}
                source={getAvatarSource(avatar)}
              />
            );
            //iconName = focused ? "list" : "list-outline";
          } else if (rn === "Create") {
            iconName = focused ? "settings" : "settings-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        unmountOnBlur: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ isOwnProfile: true, username: "" }}
      />
      {/* <Tab.Screen
        name="SingleChat"
        component={SingleChat}
        options={{ tabBarButton: () => null, tabBarLabel: () => null }}
      /> */}
      <Tab.Screen
        name="OtherProfile"
        component={ProfileScreen}
        options={{ tabBarButton: () => null, tabBarLabel: () => null }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const [refreshing, setRefreshing] = useState(true);
  const { refresh } = useRefreshToken();
  const accessToken = useSelector((state) => state.authenticate.accessToken);

  useEffect(() => {
    async function refreshAccessToken() {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          await refresh(refreshToken);
        }
        setRefreshing(false);
      } catch (error) {
        setRefreshing(false);
        console.error("Error refreshing access token:", error);
      }
    }
    refreshAccessToken();
  }, []);

  return (
    <NavigationContainer>
      {refreshing ? (
        <ActivityIndicator size={50} />
      ) : accessToken === null ? (
        <AuthScreen />
      ) : (
        <MainScreen />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar style="light" />
        <Provider store={store}>
          <Navigation />
        </Provider>
      </SafeAreaView>
    </>
  );
}
