import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

function PrimaryButton({
  children,
  onPress,
  overwriteButtonStyle = {},
  overwriteTextStyle = {},
  isLoading = false,
  disabled = false,
}) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: "#0088E1" }}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text style={[styles.buttonText, overwriteTextStyle]}>
            {children}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: "#0095f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  pressed: {
    backgroundColor: "#0088E1",
  },
});
