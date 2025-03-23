// app/components/WineTypeModal.tsx
import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export interface WineTypeModalProps {
  visible: boolean;
  selectedType: string;
  onSelect: (type: string) => void;
  onClose: () => void;
}

export const WineTypeModal: React.FC<WineTypeModalProps> = ({
  visible,
  selectedType,
  onSelect,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPressOut={onClose}
    >
      <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
        <Text style={styles.modalTitle}>Select Wine Type</Text>
        <Picker selectedValue={selectedType} onValueChange={onSelect}>
          <Picker.Item label="Select a type" value="" />
          <Picker.Item label="Red" value="Red" />
          <Picker.Item label="White" value="White" />
          <Picker.Item label="Rose" value="Rose" />
          <Picker.Item label="Sparkling" value="Sparkling" />
          <Picker.Item label="Fortified" value="Fortified" />
        </Picker>
        <Button title="Done" onPress={onClose} />
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
