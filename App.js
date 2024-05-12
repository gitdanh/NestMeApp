import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/Home";
import SearchScreen from "./screens/Search";
import CreateScreen from "./screens/Add";
import GroupScreen from "./screens/Group";
import GroupDetail from "./screens/GroupDetail";
import SaveScreen from "./screens/Save";
import ChangePass from "./screens/ChangePass";
import EditProfileScreen from "./screens/EditProfile";
import RegisterScreen from "./screens/auth/Register";
import LoginScreen from "./screens/auth/Login";
import VerifyOTP from "./screens/auth/VerifyOTP";
import ProfileScreen from "./screens/Profile";
import ChatScreen from "./screens/Chat";
import SingleChat from "./screens/SingleChat";
import NotifyScreen from "./screens/Notify";
import ForgotPasswordScreen from "./screens/auth/ForgotPassword";
import VerifyOTPResetPasswordScreen from "./screens/auth/VerifyOTPResetPassword";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PostDetail from "./screens/PostDetail";

const Stack = createStackNavigator();
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
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="VerifyOTPResetPassword"
        component={VerifyOTPResetPasswordScreen}
      />
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

      <Stack.Screen name="Notify" component={NotifyScreen} />
      <Stack.Screen name="SingleChat" component={SingleChat} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
      <Stack.Screen name="Save" component={SaveScreen} />
      <Stack.Screen name="Edit" component={EditProfileScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetail} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
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
            fullname: response.data.user.full_name,
            bio: response.data.user.user_info.bio,
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
            iconName = focused ? "add-circle-sharp" : "add-circle-outline";
          } else if (rn === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (rn === "Group") {
            iconName = focused ? "people" : "people-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        unmountOnBlur: true,
      })}
      backBehavior="history"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={({ navigation, route }) => ({
          focus: (e) => {
            navigation.setOptions({ unmountOnBlur: true });
          },
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        listeners={({ navigation, route }) => ({
          focus: (e) => {
            navigation.setOptions({ unmountOnBlur: true });
          },
        })}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="Group"
        component={GroupScreen}
        listeners={({ navigation, route }) => ({
          focus: (e) => {
            navigation.setOptions({ unmountOnBlur: true });
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ isOwnProfile: true, username: "" }}
        listeners={({ navigation, route }) => ({
          focus: (e) => {
            navigation.setOptions({ unmountOnBlur: true });
          },
        })}
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
        console.log("Error refreshing access token:", error);
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <Provider store={store}>
            <Navigation />
          </Provider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
}
