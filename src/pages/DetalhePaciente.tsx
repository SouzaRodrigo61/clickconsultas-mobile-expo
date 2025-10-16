import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import moment from "moment";
import "moment/locale/pt-br";

import DoctorHeader from "../components/DoctorHeader";
import Paciente from "../components/DetalhePaciente/Paciente";
import OutraPessoa from "../components/DetalhePaciente/OutraPessoa";
import api from "../services/api.js";

import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function DetalheMedico({ route }) {
  const [firstSelected, setFirstSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allValid, setAllValid] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [infoPaciente, setInfoPaciente] = useState({
    id_paciente: "",
    cidade: "",
    cpf: "",
    email: "",
    genero: "",
    nascimento: "",
    nome: "",
    telefone: "",
  });

  const [infoNovoPaciente, setInfoNovoPaciente] = useState({
    id_paciente: "",
    cidade: "",
    cpf: "",
    email: "",
    genero: "",
    nascimento: "",
    nome: "",
    telefone: "",
  });

  const [error, setError] = useState({
    nome: { error: false, message: "" },
    telefone: { error: false, message: "" },
    genero: { error: false, message: "" },
    nascimento: { error: false, message: "" },
    email: { error: false, message: "" },
  });

  function selected() {
    setFirstSelected(!firstSelected);
  }

  const navigation = useNavigation();

  function handleNavigateToResumoConsulta() {
    let dataResumoConsulta = {
      data_consulta: route.params.data.data_consulta,
      modificado_em: moment(new Date()).format("YYYY-MM-DD HH:mm:ssZZ"),
      convenio: route.params.data.convenio,
      valor_real: route.params.data.valor_real,
      nome_paciente: firstSelected ? infoPaciente.nome : infoNovoPaciente.nome,
      telefone_paciente: firstSelected
        ? infoPaciente.telefone
        : infoNovoPaciente.telefone,
      genero_paciente: firstSelected
        ? infoPaciente.genero
        : infoNovoPaciente.genero,
      nascimento_paciente: firstSelected
        ? infoPaciente.nascimento
        : infoNovoPaciente.nascimento,
      email_paciente: firstSelected
        ? infoPaciente.email
        : infoNovoPaciente.email,
      id_medico: route.params.data.id_medico,
      id_paciente: infoPaciente.id_paciente,
      id_endereco: route.params.data.id_endereco,
      index: route.params.data.index,
    };
    navigation.navigate("ResumoConsulta", { dataResumoConsulta });
  }

  const data_consulta = route.params.data.data_consulta;

  const fetch = async () => {
    setLoading(true);
    await api
      .get(`/pacientes/profile`)
      .then(({ data: data }) => {
        setInfoPaciente(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar perfil do paciente:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetch();
    return () => {
      isMounted = false;
    };
  }, []);

  const naoVazia = (type, text) => {
    const test = text.trim() !== "";
    !test &&
      setError((state) => ({
        ...state,
        [type]: {
          error: true,
          message: "Campo requerido!",
        },
      }));
    return test;
  };

  /****************************  Validação Nome ************************************* */
  const apenasLetras = (text) => {
    const test = /^[a-zA-Z\u00C0-\u017F\s]+$/.test(text.trim());
    !test &&
      setError((state) => ({
        ...state,
        nome: {
          error: true,
          message: "Digite apenas letras, maiúsculas ou minúsculas!",
        },
      }));
    return test;
  };

  function validateName() {
    let valid = [
      apenasLetras(infoNovoPaciente.nome), // ! Apenas letras
      naoVazia("nome", infoNovoPaciente.nome), // ! Não permite vazio
    ].every((e) => e === true);

    return valid;
  }
  /* ******************************************************************************** */

  /* ***************************  Validação Telefone ******************************** */
  const tamanhoEntre = (min, max) => (text) => {
    const test = text.length >= min && text.length <= max;
    !test &&
      setError((state) => ({
        ...state,
        telefone: {
          error: true,
          message: "Digite um numero válido!",
        },
      }));
    return test;
  };

  function validatePhone() {
    let valid = [
      tamanhoEntre(10, 11)(infoNovoPaciente.telefone), // ! Tamanho entre 14 e 15
      naoVazia("telefone", infoNovoPaciente.telefone), // ! Não permite vazio
    ].every((e) => e === true);

    return valid;
  }
  /* ******************************************************************************** */

  /* ***************************  Validação Gênero ******************************** */
  function validateGenero() {
    let valid = [
      naoVazia("genero", infoNovoPaciente.genero), // ! Não permite vazio
    ].every((e) => e === true);

    return valid;
  }
  /* ******************************************************************************** */

  /* ***************************  Validação Data Nascimento ************************* */
  function validateNascimento() {
    let valid = [
      naoVazia("nascimento", infoNovoPaciente.nascimento), // ! Não permite vazio
    ].every((e) => e === true);

    return valid;
  }
  /* ******************************************************************************** */

  /****************************  Validação Email ************************************ */
  async function validateEmail() {
    const validaEmail = (text) => {
      const test = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text);
      !test &&
        setError((state) => ({
          ...state,
          email: {
            error: true,
            message: "Digite um email válido",
          },
        }));
      return test;
    };

    let valid = [
      validaEmail(infoNovoPaciente.email),
      naoVazia("email", infoNovoPaciente.email), // ! Não permite vazio
    ].every((e) => e === true);

    return valid;
  }
  /********************************************************************************** */

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    if (!firstSelected) {
      const valid = await Promise.all([
        validateName(),
        validatePhone(),
        validateGenero(),
        validateNascimento(),
        validateEmail(),
      ]);

      if (!valid.every((e) => e === true)) return setLoadingSubmit(false);
    }

    // Validações antes de enviar
    const nomePaciente = firstSelected ? infoPaciente.nome : infoNovoPaciente.nome;
    const telefonePaciente = firstSelected ? infoPaciente.telefone : infoNovoPaciente.telefone;
    const generoPaciente = firstSelected ? infoPaciente.genero : infoNovoPaciente.genero;
    const emailPaciente = firstSelected ? infoPaciente.email : infoNovoPaciente.email;
    
    // Validar campos obrigatórios
    if (!nomePaciente || nomePaciente.trim() === '') {
      console.error('Nome do paciente é obrigatório');
      setLoadingSubmit(false);
      return;
    }
    
    if (!telefonePaciente || telefonePaciente.trim() === '') {
      console.error('Telefone do paciente é obrigatório');
      setLoadingSubmit(false);
      return;
    }

    // Validar id_medico
    const idMedico = route.params.data.id_medico || route.params.id_medico;
    if (!idMedico) {
      console.error('ID do médico é obrigatório');
      console.error('route.params.data:', route.params.data);
      console.error('route.params:', route.params);
      setLoadingSubmit(false);
      return;
    }

    const payload = {
      data_consulta: moment(
        route.params.data.data_consulta,
        "YYYY-MM-DD HH:mm:ssZZ"
      ).format("YYYY-MM-DD HH:mm:ssZZ"),
      modificado_em: moment(new Date()).format("YYYY-MM-DD HH:mm:ssZZ"),
      status_consulta: "Solicitada",
      convenio: route.params.data.convenio || null,
      valor_real: route.params.data.valor_real || 0,
      nome_paciente: nomePaciente.trim(),
      telefone_paciente: telefonePaciente.trim(),
      genero_paciente: generoPaciente || null,
      nascimento_paciente: firstSelected
        ? (infoPaciente.nascimento ? moment(infoPaciente.nascimento).format("YYYY-MM-DD") : null)
        : (infoNovoPaciente.nascimento ? moment(infoNovoPaciente.nascimento, "DD/MM/YYYY").format("YYYY-MM-DD") : null),
      email_paciente: emailPaciente || null,
      id_medico: idMedico,
      id_paciente: infoPaciente.id_paciente || null,
      id_endereco: route.params.data.id_endereco,
    };

    console.log('Payload enviado para API:', JSON.stringify(payload, null, 2));
    console.log('Route params:', route.params);

    await api
      .post("/consult", payload)
      .then((res) => {
        setLoadingSubmit(false);
        handleNavigateToResumoConsulta();
      })
      .catch((error) => {
        console.error('Erro ao agendar consulta:', error);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Headers:', error.response?.headers);
        
        setLoadingSubmit(false);
        
        // Mostrar detalhes do erro 422
        if (error.response?.status === 422) {
          const validationErrors = error.response?.data;
          console.error('Erros de validação:', validationErrors);
          // Aqui você pode mostrar os erros específicos para o usuário
        }
      });
  };

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={Colors.blue} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.flex}>
            {/* <DoctorHeader consulta={}/> */}

            <View style={styles.section}>
              <View style={styles.wrapper}>
                <Text style={styles.titleText}>Data e horário</Text>
                <View style={styles.grid}>
                  <Text style={styles.boldText}>
                    {moment(data_consulta, "YYYY-MM-DD HH:mm:ssZZ").format(
                      "LLLL"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.wrapper}>
                <View>
                  <Text style={styles.boldText}>Esta consulta é para:</Text>
                  <View>
                    <View style={styles.gridSelect1}>
                      <RectButton onPress={selected}>
                        {firstSelected ? (
                          <MaterialCommunityIcons
                            name="circle-slice-8"
                            size={24}
                            color={Colors.blue}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="circle-outline"
                            size={24}
                            color={Colors.blue}
                          />
                        )}
                      </RectButton>
                      <Text style={styles.gridText}>{infoPaciente.nome}</Text>
                    </View>
                    <View style={styles.gridSelect2}>
                      <RectButton onPress={selected}>
                        {firstSelected ? (
                          <MaterialCommunityIcons
                            name="circle-outline"
                            size={24}
                            color={Colors.blue}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="circle-slice-8"
                            size={24}
                            color={Colors.blue}
                          />
                        )}
                      </RectButton>
                      <Text style={styles.gridText}>Outra pessoa</Text>
                    </View>
                  </View>
                </View>
                {firstSelected ? (
                  <>
                    <Paciente paciente={infoPaciente} />
                  </>
                ) : (
                  <OutraPessoa
                    infoNovoPaciente={infoNovoPaciente}
                    setInfoNovoPaciente={setInfoNovoPaciente}
                    error={error}
                    setError={setError}
                  />
                )}
              </View>
            </View>

            <View style={styles.gridTermos}>
              <Text style={styles.termosText}>
                Agendando esta consulta você concorda com os{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Termos")}>
                <Text style={styles.termosLink}>Termos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonWrapper}>
              <RectButton
                style={styles.botaoAzul}
                onPress={() => handleSubmit()}
              >
                {loadingSubmit ? (
                  <ActivityIndicator size={"small"} color={Colors.white} />
                ) : (
                  <Text style={styles.botaoAzulText}>Confirmar</Text>
                )}
              </RectButton>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  titleText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Fonts.regular,
    color: Colors.black,
    opacity: 0.5,
  },

  boldText: {
    fontSize: 16,
    lineHeight: 19,
    color: Colors.black,
    fontFamily: Fonts.regular,

    marginRight: 6,
  },

  dataText: {
    fontSize: 15,
    lineHeight: 19,
    fontFamily: Fonts.regular,
    color: Colors.black,
    opacity: 0.5,
  },

  data: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: 3,
    padding: 20,
    width: "100%",
    backgroundColor: Colors.white,
  },

  section: {
    width: "100%",
    backgroundColor: Colors.white,
    marginTop: 3,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  wrapper: {
    width: screenWidth - 40,
    paddingTop: 20,
    paddingBottom: 20,
  },

  buttonWrapper: {
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    backgroundColor: Colors.white,
    alignItems: "center",
  },

  grid: {
    marginTop: 5,
    flexDirection: "row",
    width: screenWidth - 40,
    alignSelf: "center",
  },

  gridTermos: {
    marginTop: 5,
    flexDirection: "row",
    alignSelf: "center",
    paddingBottom: 12,
    paddingTop: 7,
    width: screenWidth - 40,
    flexWrap: "wrap",
  },

  gridSelect1: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",

    borderColor: Colors.softGray,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    padding: 16,

    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  gridSelect2: {
    flexDirection: "row",
    alignItems: "center",

    borderColor: Colors.softGray,
    borderWidth: 1.5,
    padding: 16,

    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },

  gridText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,

    color: "black",
    marginLeft: 10,
  },

  termosText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,
    color: "#9D9D9D",
  },

  termosLink: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,
    color: Colors.blue,
  },

  botaoAzul: {
    backgroundColor: Colors.blue,

    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",

    width: screenWidth - 40,
    height: 59,

    marginTop: 8,
    marginBottom: 8,
  },

  botaoAzulText: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.white,
    fontFamily: Fonts.bold,
  },
});
