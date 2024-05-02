import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

const OTPInput = ({ length, value, disabled, onChange }) => {
  const inputRefs = useRef([]);

  const onChangeValue = (text, index) => {
    let valueArray = value.split("");
    valueArray.push("");
    const newValue = valueArray.map((char, charIndex) => {
      if (charIndex === index) {
        return text;
      }
      return char;
    });

    onChange(newValue.join(""));
  };

  const handleChange = (text, index) => {
    onChangeValue(text, index);
    if (text.length !== 0) {
      return inputRefs?.current[index + 1]?.focus();
    }
    return inputRefs?.current[index - 1]?.focus();
  };

  const handleBackSpace = (event, index) => {
    const { nativeEvent } = event;
    if (nativeEvent.key === "Backspace") {
      handleChange("", index);
    }
  };

  return (
    <View style={styles.container}>
      {[...new Array(length)].map((item, i) => (
        <TextInput
          ref={(ref) => {
            if (ref && !inputRefs.current.includes(ref)) {
              inputRefs.current = [...inputRefs.current, ref];
            }
          }}
          key={i}
          style={styles.input}
          maxLength={1}
          contextMenuHidden
          selectTextOnFocus
          editable={!disabled}
          keyboardType="decimal-pad"
          testID={`OTPInput-${i}`}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(event) => handleBackSpace(event, i)}
        />
      ))}
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  input: {
    fontSize: 24,
    textAlign: "center",
    width: 45,
    height: 50,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
