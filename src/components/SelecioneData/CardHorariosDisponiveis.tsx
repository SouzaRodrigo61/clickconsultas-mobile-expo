import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import Moment from "moment";
import "moment/locale/pt-br";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

interface Data {
  atendimento: any;
  loading: boolean;
  endereco: boolean;
  data: boolean;
  index: any;
  id_endereco: any;
  id_gerente: any;
  id_medico: any;
  valor_real: any;
  convenio: any;
  setStep: any;
}

export default function CardHorariosDisponiveis({
  atendimento,
  loading,
  index,
  id_endereco,
  id_gerente,
  id_medico,
  valor_real,
  convenio,
  endereco,
  data,
  setStep
}: Data) {
  const [dateDisplay, setDateDisplay] = useState(moment().clone());

  const navigation = useNavigation();

  function handleNavigateToDetalhePaciente(horario) {
    let data_consulta =
      moment(dateDisplay).format("YYYY-MM-DD") +
      " " +
      moment(horario, "HH:mm").format("HH:mm:ssZZ");
    let data = {
      data_consulta,
      id_endereco,
      id_medico,
      id_gerente,
      valor_real,
      index,
      convenio
    };
    navigation.navigate("DetalhePaciente", { data });
  }

  function getTimeStops(start, end, duration) {
    var startTime = moment(start, "HH:mm");
    var endTime = moment(end, "HH:mm");

    if (endTime.isBefore(startTime)) {
      endTime.add(1, "day");
    }

    var timeStops: string[] = [];

    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format("HH:mm"));
      startTime.add(duration, "minutes");
    }
    return timeStops;
  }

  const array_Horarios = getTimeStops(
    moment(atendimento.from, "HH:mm:ss").format("HH:mm:ss"),
    moment(atendimento.to, "HH:mm:ss").format("HH:mm:ss"),
    atendimento.duration
  );

  function CardDatePicker() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      if (endereco) setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
      setDateDisplay(date);
      setStep((state) => ({ ...state, data: true }));
    };

    return (
      <View style={{ ...styles.dateCardContainer, opacity: endereco ? 1 : 0.4 }}>
        <View>
          <Text style={styles.textDateHeader}>Alterar data</Text>
        </View>
        <View style={styles.datePicker}>
          <TouchableOpacity
            style={styles.dateButtonContainer}
            disabled={!endereco}
            onPress={showDatePicker}
          >
            <MaterialIcons name="date-range" size={23} color={Colors.blue} />
            <View style={styles.dateButtonTextContainer}>
              {!data ? (
                <Text style={{ ...styles.textDateButton, textTransform: "none" }}>
                  Selecione uma data
                </Text>
              ) : (
                <Text style={styles.textDateButton}>
                  {moment(dateDisplay).format("dddd" + ", DD" + " MMM")}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />
        </View>
        <View
          style={{
            borderBottomColor: Colors.softGray,
            borderBottomWidth: 1,
            paddingBottom: 10
          }}
        />
        {data &&
          (atendimento.semana[moment(dateDisplay).format("ddd")] ? (
            <CardHorariosDisponiveis />
          ) : (
            <CardHorariosIndisponiveis />
          ))}
      </View>
    );
  }

  function CardHorariosDisponiveis() {
    return (
      <View>
        <View style={styles.containerHourView}>
          <View style={styles.layerTextHorarios}>
            <Text style={{ ...styles.textHour }}>Selecione um horário</Text>
          </View>
          <View style={styles.hourContainer}>
            {array_Horarios.filter((horario) =>
              moment(horario + moment(dateDisplay).format("YYYY-MM-DD"), "HH:mmYYYY-MM-DD").isAfter(
                moment().clone()
              )
            ).length > 0 ? (
              array_Horarios
                .filter((horario) =>
                  moment(
                    horario + moment(dateDisplay).format("YYYY-MM-DD"),
                    "HH:mmYYYY-MM-DD"
                  ).isAfter(moment().clone())
                )
                .map((horario, index) => (
                  <TouchableOpacity
                    style={styles.button}
                    key={index}
                    onPress={() => handleNavigateToDetalhePaciente(horario)}
                  >
                    <Text style={styles.textButon}>{horario}</Text>
                  </TouchableOpacity>
                ))
            ) : (
              <CardHorariosIndisponiveis />
            )}
          </View>
        </View>
      </View>
    );
  }

  function CardHorariosIndisponiveis() {
    return (
      <View>
        <View style={styles.containerAdvisor}>
          <Text style={styles.textAdvisor}>Nenhum horário disponível para o dia escolhido</Text>
        </View>
        {/* <TouchableOpacity
          style={{ ...styles.buttonAdivisor, backgroundColor: Colors.blue }}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textFirstButton}>Próximo dia disponível </Text>
            <Text style={styles.textFirstButton}>Sábado, </Text>
            <Text style={styles.textFirstButton}>23 </Text>
            <Text style={styles.textFirstButton}>Nov</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.containerAdvisor}>
          <Text style={styles.textAdvisor}>Ou</Text>
        </View> */}
        {atendimento.enderecos[index].telefone_fixo !== null && (
          <TouchableOpacity
            style={{ ...styles.buttonAdivisor, backgroundColor: Colors.white }}
            onPress={() => Linking.openURL(`tel:${atendimento.enderecos[index].telefone_fixo}`)}
            activeOpacity={0.5}
          >
            <View style={styles.buttonWrap}>
              <FontAwesome name="phone" size={20} color={Colors.blue} style={{ marginRight: 8 }} />
              <Text style={styles.textSecondButton}>Ligue para o telefone da clínica</Text>
            </View>
          </TouchableOpacity>
        )}

        {atendimento.enderecos[index].telefone_cel !== null && (
          <>
            <View style={styles.containerAdvisor}>
              <Text style={styles.textAdvisor}>Ou</Text>
            </View>
            <TouchableOpacity
              style={{
                ...styles.buttonAdivisor,
                backgroundColor: Colors.white
              }}
              onPress={() => Linking.openURL(`tel:${atendimento.enderecos[index].telefone_cel}`)}
              activeOpacity={0.5}
            >
              <View style={styles.buttonWrap}>
                <FontAwesome
                  name="phone"
                  size={20}
                  color={Colors.blue}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.textSecondButton}>Ligue para o celular da clínica</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.containerPrincipal}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator size="large" color={Colors.blue} /> : <CardDatePicker />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    width: 375,
    alignSelf: "center"
  },
  container: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 20,
    width: screenWidth - 20,
    // height: '100%',
    borderWidth: 1.5,
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderColor: Colors.softGray,
    padding: 20,
    shadowColor: Colors.softGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.4
  },

  /* Style Hour Button  */
  containerHourView: {
    width: screenWidth - 60
  },
  layerTextHorarios: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15
  },

  hourContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  hourView: {
    width: 70,
    height: 45,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.blue,
    margin: 4
  },
  textHour: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17
  },
  button: {
    width: 70,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.blue,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 8
  },
  textButon: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.blue
  },

  /* Style Componente Advisor */
  containerAdvisor: {
    marginTop: 28,
    marginBottom: 28,
    justifyContent: "center",
    alignSelf: "center"
  },
  textAdvisor: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.primaryGray
  },
  buttonAdivisor: {
    alignSelf: "center",
    width: screenWidth - 70,
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.blue
  },
  textFirstButton: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.white,
    textAlign: "center"
  },
  textSecondButton: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.blue,
    textAlign: "center"
  },

  buttonWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 5
  },

  /* Styles Componente DatePicker */
  dateCardContainer: {},
  datePicker: {},
  dateButtonContainer: {
    marginTop: 10,
    width: screenWidth - 40,
    flexDirection: "row",
    height: 32,
    alignItems: "center"
  },
  dateButtonTextContainer: {
    flexDirection: "row",
    marginLeft: 10
  },
  textDateHeader: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17
  },
  textDateButton: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 21,
    color: Colors.blue,
    textTransform: "capitalize"
  }
});
