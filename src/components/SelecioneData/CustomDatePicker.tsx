import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import moment from 'moment';
import 'moment/locale/pt-br';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CustomDatePickerProps {
  isVisible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  selectedDate?: Date;
}

export default function CustomDatePicker({
  isVisible,
  onConfirm,
  onCancel,
  minimumDate = new Date(),
  maximumDate = moment().add(1, 'year').toDate(),
  selectedDate = new Date(),
}: CustomDatePickerProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const generateDateOptions = () => {
    const dates = [];
    const startDate = moment(minimumDate);
    const endDate = moment(maximumDate);
    
    let current = startDate.clone();
    while (current.isSameOrBefore(endDate)) {
      dates.push(current.clone());
      current.add(1, 'day');
    }
    
    return dates.slice(0, 90); // Limitar a 90 dias para performance
  };

  const formatDateDisplay = (date: moment.Moment) => {
    return {
      day: date.format('DD'),
      month: date.format('MMM'),
      year: date.format('YYYY'),
      weekday: date.format('dddd'),
    };
  };

  const handleConfirm = () => {
    onConfirm(currentDate);
  };

  const handleDateSelect = (date: moment.Moment) => {
    setCurrentDate(date.toDate());
  };

  const dateOptions = generateDateOptions();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Data</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.blue} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.subtitle}>Escolha uma data disponível</Text>
            
            <ScrollView 
              style={styles.dateList}
              showsVerticalScrollIndicator={false}
            >
              {dateOptions.map((date, index) => {
                const isSelected = moment(currentDate).isSame(date, 'day');
                const isToday = date.isSame(moment(), 'day');
                const isTomorrow = date.isSame(moment().add(1, 'day'), 'day');
                const dateInfo = formatDateDisplay(date);
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateItem,
                      isSelected && styles.selectedDateItem,
                    ]}
                    onPress={() => handleDateSelect(date)}
                  >
                    <View style={styles.dateItemContent}>
                      <View style={styles.dateLeft}>
                        <Text style={[
                          styles.dateNumber,
                          isSelected && styles.selectedDateNumber
                        ]}>
                          {dateInfo.day}
                        </Text>
                        <Text style={[
                          styles.dateMonth,
                          isSelected && styles.selectedDateMonth
                        ]}>
                          {dateInfo.month}
                        </Text>
                      </View>
                      
                      <View style={styles.dateRight}>
                        <Text style={[
                          styles.dateWeekday,
                          isSelected && styles.selectedDateWeekday
                        ]}>
                          {dateInfo.weekday}
                        </Text>
                        <Text style={[
                          styles.dateYear,
                          isSelected && styles.selectedDateYear
                        ]}>
                          {dateInfo.year}
                        </Text>
                        {isToday && (
                          <Text style={styles.todayLabel}>Hoje</Text>
                        )}
                        {isTomorrow && !isToday && (
                          <Text style={styles.tomorrowLabel}>Amanhã</Text>
                        )}
                      </View>
                      
                      {isSelected && (
                        <View style={styles.selectedIndicator}>
                          <MaterialIcons name="check" size={20} color={Colors.white} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
    minHeight: screenHeight * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.black,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateList: {
    flex: 1,
  },
  dateItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.softGray,
    overflow: 'hidden',
  },
  selectedDateItem: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  dateItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dateLeft: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  dateNumber: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.black,
    lineHeight: 28,
  },
  selectedDateNumber: {
    color: Colors.white,
  },
  dateMonth: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.gray,
    textTransform: 'uppercase',
  },
  selectedDateMonth: {
    color: Colors.white,
  },
  dateRight: {
    flex: 1,
  },
  dateWeekday: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 2,
  },
  selectedDateWeekday: {
    color: Colors.white,
  },
  dateYear: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.gray,
  },
  selectedDateYear: {
    color: Colors.white,
  },
  todayLabel: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.blue,
    backgroundColor: Colors.blue + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  tomorrowLabel: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.green,
    backgroundColor: Colors.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  selectedIndicator: {
    backgroundColor: Colors.white + '30',
    borderRadius: 12,
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.softGray,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.softGray,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.gray,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.blue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
});
