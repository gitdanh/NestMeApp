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
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: 'black',padding: 10, height: 65, borderColor: '#262626' },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === "Home") {
            iconName = focused ? 'home' : 'home-outline';

          } else if (rn === "Profile") {
            iconName = focused ? 'list' : 'list-outline';

          } else if (rn === "Chat") {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#888888',
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { padding: 10, height: 70}
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
