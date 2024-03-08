import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RegisterScreen from "./screens/auth/Register";
import LoginScreen from "./screens/auth/Login";
import ProfileScreen from "./screens/Profile";
import ChatScreen from "./screens/Chat";
import SingleChat from "./screens/SingleChat";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native";

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
    </Stack.Navigator>
  );
}

function AuthenticatedScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: "#E8E8E8",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen
        name="SingleChat"
        component={SingleChat}
        options={{ tabBarButton: () => null, tabBarLabel: () => null }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const accessToken = useSelector((state) => state.authenticate.accessToken);
  return (
    <NavigationContainer>
      {/* {accessToken === null ? <AuthScreen /> :  */}
      <AuthenticatedScreen />
      {/* } */}
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
