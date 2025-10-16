import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

const { width: screenWidth } = Dimensions.get('window');

interface EstadoPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  estados: Array<{ sigla: string; nome: string }>;
}

export default function EstadoPicker({ selectedValue, onValueChange, estados }: EstadoPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (sigla: string) => {
    onValueChange(sigla);
    setModalVisible(false);
  };

  const selectedEstado = estados.find(estado => estado.sigla === selectedValue);

  return (
    <>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.pickerText}>
          {selectedEstado ? selectedEstado.sigla : 'UF'}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Estado</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={Colors.blue} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={estados}
              keyExtractor={(item) => item.sigla}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.estadoItem,
                    selectedValue === item.sigla && styles.estadoItemSelected
                  ]}
                  onPress={() => handleSelect(item.sigla)}
                >
                  <Text style={[
                    styles.estadoText,
                    selectedValue === item.sigla && styles.estadoTextSelected
                  ]}>
                    {item.sigla} - {item.nome}
                  </Text>
                  {selectedValue === item.sigla && (
                    <MaterialIcons name="check" size={20} color={Colors.blue} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.estadosList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
    height: 40,
  },
  pickerText: {
    color: 'white',
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.black,
  },
  closeButton: {
    padding: 4,
  },
  estadosList: {
    flex: 1,
  },
  estadoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
  },
  estadoItemSelected: {
    backgroundColor: Colors.blue + '10',
  },
  estadoText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.black,
  },
  estadoTextSelected: {
    fontFamily: Fonts.bold,
    color: Colors.blue,
  },
});
