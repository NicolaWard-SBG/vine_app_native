import React from "react";
import { TextInput, StyleSheet } from "react-native";

interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
  editable?: boolean;
  onPressIn?: () => void;
}

export function FormInput({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  editable = true,
  onPressIn,
}: FormInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
      onPressIn={onPressIn}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
});
