import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import CountDown from 'react-native-countdown-component'
import { RectButton } from 'react-native-gesture-handler'
import { TextInputMask } from 'react-native-masked-text'
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from 'react-native-webview/lib/WebViewTypes'
import api from '../services/api.js'

// import Pdf from 'react-native-pdf' // Removido - não compatível com Expo Go
import StatusBar from '../components/StatusBar'
import Colors from '../styles/Colors'
import Fonts from '../styles/Fonts'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function Cadastro() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [required, setRequired] = useState(false as boolean)
  const [loading, setLoading] = useState(false as Boolean)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false as boolean)
  const [step, setStep] = useState('nome')
  const [data, setData] = useState({
    nome: { value: '', error: '' },
    sobrenome: { value: '', error: '' },
    telefone: { value: '', error: '' },
    email: { value: '', error: '' },
    codigo: { value: '', error: '' },
    senha: { value: '', error: '' },
    confirmasenha: { value: '', error: '' },
    cpf: { value: '', error: '' },
  })

  function toStep(step: string) {
    setStep(step)
  }

  /* TIMER CODIGO */
  const [timer, setButton] = useState(true)
  function timerButton() {
    setButton(!timer)
  }

  /* VISIBILIDADE SENHA */
  const [isVisible, setIsVisible] = useState(true)
  function showPassword() {
    setIsVisible(!isVisible)
  }

  const naoVazia = (text) => {
    const test = text.trim() !== ''
    !test && setErrorMessage('Campo requerido!')
    return test
  }

  /****************************  Validação Nome ************************************* */
  const apenasLetras = (text) => {
    const test = /^[a-zA-Z\u00C0-\u017F\s]+$/.test(text.trim())
    data.nome.error = 'Digite apenas letras, maiúsculas ou minúsculas!'
    !test && setErrorMessage(data.nome.error)
    return test
  }

  const apenasLetrasSobrenome = (text) => {
    const test = /^[a-zA-Z\u00C0-\u017F\s]+$/.test(text.trim())
    data.sobrenome.error = 'Digite apenas letras, maiúsculas ou minúsculas!'
    !test && setErrorMessage(data.sobrenome.error)
    return test
  }

  function validateName() {
    let valid = [
      apenasLetras(data.nome.value), // ! Apenas letras
      naoVazia(data.nome.value), // ! Não permite vazio
      apenasLetrasSobrenome(data.sobrenome.value), // ! Apenas letras no sobrenome
      naoVazia(data.sobrenome.value), // ! Não permite vazio no sobrenome
    ].every((e) => e === true)

    valid ? (toStep('contato'), setRequired(false)) : setRequired(true)
  }
  /* ******************************************************************************** */

  /* ***************************  Validação Telefone ******************************** */
  const tamanhoEntre = (min, max) => (text) => {
    const test = text.length >= min && text.length <= max
    data.telefone.error = 'Digite um numero válido!'
    !test && setErrorMessage(data.telefone.error)
    return test
  }
  function validatePhone() {
    let valid = [
      tamanhoEntre(10, 11)(data.telefone.value), // ! Tamanho entre 14 e 15
      naoVazia(data.telefone.value), // ! Não permite vazio
    ].every((e) => e === true)

    valid ? (toStep('email'), setRequired(false)) : setRequired(true)
  }
  /* ******************************************************************************** */

  /****************************  Validação Email *********************************** */
  const verificaEmail = async (email) => {
    let isNew = false
    await api
      .get(`/pacientes/check/${email}`)
      .then(({ data: { exists } }) => (isNew = !exists))
      .catch((err) => {
        toStep('erro')
        return err
      })

    if (!isNew) setErrorMessage('Email já cadastrado!')
    return isNew
  }

  const validaEmail = (text) => {
    const test = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text)
    data.email.error = 'Digite um email válido!'
    !test && setErrorMessage(data.email.error)
    return test
  }

  async function validateEmail() {
    const validating = await Promise.all([
      verificaEmail(data.email.value), // ! Verifica se email existe no bd
      validaEmail(data.email.value), // ! Valida o email
      naoVazia(data.email.value), // ! Não permite vazio
    ])

    const valid = validating.every((e) => e === true)

    valid ? (toStep('senha'), setRequired(false)) : setRequired(true)
  }
  /* ********************************************************************************* */

  /****************************  Validação Codigo *********************************** */
  const validaCodigo = async (codigo) => {
    const test = await new Promise((resolve) =>
      setTimeout(() => resolve(true), 5000),
    )
    data.codigo.error = 'Código Inválido!'
    !test && setErrorMessage(data.codigo.error)
    return test
  }
  async function validateCodigo() {
    setLoading(true)
    let valid = [
      await validaCodigo(data.codigo.value), // ! Valida o codigo
      naoVazia(data.codigo.value), // ! Não permite vazio
    ].every((e) => e === true)

    valid
      ? (toStep('senha'), setRequired(false))
      : (setRequired(true), setLoading(false))
  }
  /* ********************************************************************************* */

  /****************************  Validação Senha ************************************* */
  const validaSenha = (text) => {
    const test = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})[\S]+$/.test(
      text.trim(),
    )
    data.senha.error =
      'A senha deve conter, no mínimo:\n\t• Um número.\n\t• Uma letra maiúscula.\n\t• Uma letra minúscula.\n\t• Oito caracteres.'
    !test && setErrorMessage(data.senha.error)
    return test
  }
  const compSenha = (textSenha, textConfSenha) => {
    if (textSenha.normalize() === textConfSenha.normalize()) return true
    else {
      data.senha.error = 'As senhas devem ser iguais'
      setErrorMessage(data.senha.error)
      return false
    }
  }
  function validateSenha() {
    let valid = [
      validaSenha(data.senha.value),
      naoVazia(data.senha.value), // ! Não permite vazio
      compSenha(data.senha.value, data.confirmasenha.value),
    ].every((e) => e === true)

    valid ? (toStep('cpf'), setRequired(false)) : setRequired(true)
  }
  /* ******************************************************************************** */

  /****************************  Validação CPF ************************************* */

  function validateCPF() {
    let valid = [
      naoVazia(data.cpf.value), // ! Não permite vazio
    ].every((e) => e === true)

    valid ? (toStep('termos'), setRequired(false)) : setRequired(true)
  }
  /* ********************************************************************************* */

  /****************************  Validação Termos *********************************** */
  const [modalVisibleTermos, setModalVisibleTermos] = useState(false)

  const [isAccepted, setIsAccepted] = useState(false)
  function acceptedTerms() {
    setIsAccepted(!isAccepted)
  }

  /* ******************************************************************************** */

  const [pdf, setPdf] = useState({
    file_url: '',
    criado_em: '',
  })

  const [error, setError] = useState<
    WebViewErrorEvent | WebViewHttpErrorEvent | string | undefined
  >(undefined)

  const fetch = async () => {
    api.get(`/pdf`).then(({ data: pdf }) => {
      setPdf(pdf)
    })
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetch()
    return () => {
      isMounted = false
    }
  }, [])

  const source_fetch = {
    uri: pdf.file_url,
    cache: true,
  }

  /* ******************************************************************************** */

  function handleChange(field, text) {
    setData((state) => ({ ...state, [field]: { value: text, error: '' } }))
  }

  const submit = async () => {
    setIsSubmit(true)

    // Unificar nome e sobrenome para envio
    const nomeCompleto = `${data.nome.value.trim()} ${data.sobrenome.value.trim()}`.trim()

    await api
      .post('/pacientes', {
        nome: nomeCompleto,
        telefone: data.telefone.value,
        email: data.email.value,
        senha: data.senha.value,
        cpf: data.cpf.value,
      })
      .then((res) => {
        toStep('sucesso')
        setIsSubmit(false)
      })
      .catch((err) => {
        console.log('Erro no cadastro:', err.response?.data || err.message)
        
        // Melhorar feedback de erro com mensagens específicas
        let errorMessage = 'Erro no cadastro!'
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error
        } else if (err.response?.status === 400) {
          errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.'
        } else if (err.response?.status === 409) {
          errorMessage = 'Email ou CPF já cadastrado. Tente fazer login ou recuperar senha.'
        } else if (err.response?.status >= 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.'
        }

        toStep('erro')
        return setData((state) => ({
          ...state,
          email: { value: data.email.value, error: errorMessage },
        }))
      })
  }

  const renderStep = () => {
    switch (step) {
      case 'nome':
        return (
          <>
            <View style={[styles.header, { paddingTop: insets.top }]}>
              <RectButton
                style={styles.buttonContainerIcon}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="close" size={19.5} color={Colors.white} />
              </RectButton>
              <View style={styles.gridHeader}>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.text}>Voltar</Text>
                </RectButton>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => validateName()}
                >
                  <Text style={styles.text}>Próximo</Text>
                </RectButton>
              </View>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.question}>Qual é seu nome?</Text>
            </View>
            <View style={styles.nameContainer}>
              <TextInput
                placeholder="Nome"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                style={[styles.input, styles.nameInput]}
                onChangeText={(e) => handleChange('nome', e)}
                value={data.nome.value}
                maxLength={100}
              />
              <TextInput
                placeholder="Sobrenome"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                style={[styles.input, styles.nameInput]}
                onChangeText={(e) => handleChange('sobrenome', e)}
                value={data.sobrenome.value}
                maxLength={100}
              />
            </View>
            {required && (
              <View style={styles.requiredContainer}>
                <AntDesign
                  name="warning"
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={styles.textRequired}>{errorMessage}</Text>
              </View>
            )}
          </>
        )
      case 'contato':
        return (
          <>
            <View style={[styles.header, { paddingTop: insets.top }]}>
              <RectButton
                style={styles.buttonContainerIcon}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="close" size={19.5} color={Colors.white} />
              </RectButton>
              <View style={styles.gridHeader}>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => toStep('nome')}
                >
                  <Text style={styles.text}>Voltar</Text>
                </RectButton>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => validatePhone()}
                >
                  <Text style={styles.text}>Próximo</Text>
                </RectButton>
              </View>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.question}>Qual é seu telefone?</Text>
            </View>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) ',
              }}
              placeholder="Entre com seu telefone e DDD "
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={styles.input}
              includeRawValueInChangeText
              onChangeText={(maskedPhone, phone) =>
                handleChange('telefone', phone)
              }
              maxLength={15}
              value={data.telefone.value}
            />
            {required && (
              <View style={styles.requiredContainer}>
                <AntDesign
                  name="warning"
                  size={12}
                  color={Colors.white}
                />
                <Text style={styles.textRequired}>{errorMessage}</Text>
              </View>
            )}
          </>
        )
      case 'email':
        return (
          <>
            <View style={[styles.header, { paddingTop: insets.top }]}>
              <RectButton
                style={styles.buttonContainerIcon}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="close" size={19.5} color={Colors.white} />
              </RectButton>
              <View style={styles.gridHeader}>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => toStep('contato')}
                >
                  <Text style={styles.text}>Voltar</Text>
                </RectButton>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => validateEmail()}
                >
                  <Text style={styles.text}>Próximo</Text>
                </RectButton>
              </View>
            </View>

            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.containermodal}>
                <View style={styles.modalView}>
                  <Text style={styles.modalViewText}>
                    Por favor verifique seu email
                  </Text>
                </View>

                <View style={styles.modalView2}>
                  <Text style={styles.modalViewText2}>
                    Enviamos um código para{' '}
                    <Text style={styles.modalViewText2Bold}>
                      {data.email.value}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setModalVisible(!modalVisible)
                    }}
                    onPressIn={() => toStep('verificacao')}
                  >
                    <Text style={styles.modalButtonText}>Entendi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View>
              <View style={styles.questionContainer}>
                <Text style={styles.question}>Qual é seu email?</Text>
              </View>
              <TextInput
                placeholder="Digite seu email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                style={styles.input}
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                onChangeText={(e) => handleChange('email', e)}
                value={data.email.value}
                autoCapitalize="none"
              />

              {required && (
                <View style={styles.requiredContainer}>
                  <AntDesign
                    name="warning"
                    size={12}
                    color={Colors.white}
                  />
                  <Text style={styles.textRequired}>{errorMessage}</Text>
                </View>
              )}
            </View>
          </>
        )
      case 'verificacao':
        return (
          <>
            <View style={[styles.header, { paddingTop: insets.top }]}>
              <RectButton
                style={styles.buttonContainerIcon}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="close" size={19.5} color={Colors.white} />
              </RectButton>
              <View style={styles.gridHeader}>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => toStep('email')}
                >
                  <Text style={styles.text}>Voltar</Text>
                </RectButton>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => validateCodigo()}
                >
                  {loading ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      <Text style={styles.text}>Verificando...</Text>
                      <ActivityIndicator size="small" color={Colors.white} />
                    </View>
                  ) : (
                    <Text style={styles.text}>Verificar</Text>
                  )}
                </RectButton>
              </View>
            </View>

            <View>
              <View style={styles.questionContainer}>
                <Text style={styles.question}>Verificar sua identidade</Text>
              </View>
              <TextInput
                placeholder="Entre com o código"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(e) => handleChange('codigo', e)}
                value={data.codigo.value}
                maxLength={6}
              />

              {required && (
                <View style={styles.requiredContainer}>
                  <AntDesign
                    name="warning"
                    size={12}
                    color={Colors.white}
                  />
                  <Text style={styles.textRequired}>{errorMessage}</Text>
                </View>
              )}

              {timer ? (
                <View style={styles.gridTimer}>
                  <Text style={styles.instruction}>Reenviar código em </Text>
                  <CountDown
                    size={9}
                    until={30}
                    onFinish={setButton}
                    digitStyle={{ backgroundColor: Colors.blue }}
                    digitTxtStyle={styles.timer}
                    separatorStyle={styles.timer}
                    timeToShow={['M', 'S']}
                    timeLabels={{ m: null, s: null }}
                    showSeparator
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.timerReenviarButton}
                  onPress={timerButton}
                >
                  <Text style={styles.timerReenviarText}>Reenviar</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )
      case 'senha':
        return (
          <>
            <View style={[styles.header, { paddingTop: insets.top }]}>
              <RectButton
                style={styles.buttonContainerIcon}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="close" size={19.5} color={Colors.white} />
              </RectButton>
              <View style={styles.gridHeader}>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => toStep('email')}
                >
                  <Text style={styles.text}>Voltar</Text>
                </RectButton>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => validateSenha()}
                >
                  <Text style={styles.text}>Próximo</Text>
                </RectButton>
              </View>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.question}>Digite uma senha</Text>
            </View>
            <TextInput
              placeholder="Entre com uma senha"
              autoCapitalize="none"
              secureTextEntry={isVisible}
              autoCompleteType="password"
              textContentType="password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={styles.input}
              onChangeText={(e) => handleChange('senha', e)}
              value={data.senha.value}
              maxLength={250}
            />
            <TextInput
              placeholder="Confirme a senha"
              autoCapitalize="none"
              secureTextEntry={isVisible}
              autoCompleteType="password"
              textContentType="password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={styles.input}
              onChangeText={(e) => handleChange('confirmasenha', e)}
              value={data.confirmasenha.value}
              maxLength={250}
            />
            <View style={styles.inputVisibleContainer}>
              <TouchableOpacity
                onPress={showPassword}
                style={styles.inputVisible}
              >
                {isVisible ? (
                  <View style={styles.grid}>
                    <MaterialCommunityIcons
                      name="checkbox-blank"
                      size={24}
                      color={Colors.white}
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.inputVisibleText}>Mostrar senha</Text>
                  </View>
                ) : (
                  <View style={styles.grid}>
                    <MaterialCommunityIcons
                      name="checkbox-marked"
                      size={24}
                      color={Colors.white}
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.inputVisibleText}>Mostrar senha</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {required && (
              <View
                style={{
                  ...styles.requiredContainer,
                  alignItems: 'flex-start',
                }}
              >
                <AntDesign
                  name="warning"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginTop: 1 }}
                />
                <Text style={styles.textRequired}>{errorMessage}</Text>
              </View>
            )}
          </>
        )
      case 'cpf':
        return (
          <>
            <View style={[styles.header, { paddingTop: insets.top }]}>
              <RectButton
                style={styles.buttonContainerIcon}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="close" size={19.5} color={Colors.white} />
              </RectButton>
              <View style={styles.gridHeader}>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => toStep('senha')}
                >
                  <Text style={styles.text}>Voltar</Text>
                </RectButton>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => validateCPF()}
                >
                  {loading ? (
                    <ActivityIndicator size={'small'} color={Colors.white} />
                  ) : (
                    <Text style={styles.text}>Próximo</Text>
                  )}
                </RectButton>
              </View>
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.question}>Qual é seu CPF?</Text>
            </View>
            <TextInputMask
              type={'cpf'}
              value={data.cpf.value}
              onChangeText={(maskedCpf, cpf) => handleChange('cpf', cpf)}
              includeRawValueInChangeText
              placeholder="Digite seu CPF"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={styles.input}
            />
            {required && (
              <View style={styles.requiredContainer}>
                <AntDesign
                  name="warning"
                  size={18}
                  color={Colors.white}
                />
                <Text style={styles.textRequired}>{errorMessage}</Text>
              </View>
            )}
          </>
        )
      case 'termos':
        return (
          <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleTermos}
              onRequestClose={() => setModalVisibleTermos(false)}
            >
              <View style={styles.pdfContainer}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainerIcon}
                    onPress={() => setModalVisibleTermos(false)}
                  >
                    <View style={styles.gridHeaderTermos}>
                      <AntDesign
                        name="arrowleft"
                        size={19.5}
                        color={Colors.white}
                      />
                      <Text style={styles.textHeader}>Voltar</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollContainer}
                >
                  {loading ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ActivityIndicator color={Colors.blue} size="large" />
                    </View>
                  ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                      <Text style={{ fontSize: 16, color: Colors.blue, textAlign: 'center', marginBottom: 20 }}>
                        Para visualizar o documento, clique no botão abaixo:
                      </Text>
                      <TouchableOpacity 
                        style={{
                          backgroundColor: Colors.blue,
                          paddingHorizontal: 20,
                          paddingVertical: 12,
                          borderRadius: 8,
                        }}
                        onPress={() => {
                          // Abrir PDF no navegador
                          Linking.openURL(source_fetch.uri);
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                          Abrir Documento
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
              </View>
            </Modal>

            <View style={[styles.header, { paddingTop: insets.top }]}>
              <RectButton
                style={styles.buttonContainerIcon}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="close" size={19.5} color={Colors.white} />
              </RectButton>
              <View style={styles.gridHeader}>
                <RectButton
                  style={styles.buttonContainer}
                  onPress={() => toStep('cpf')}
                >
                  <Text style={styles.text}>Voltar</Text>
                </RectButton>
                {isAccepted ? (
                  <RectButton
                    style={styles.buttonContainer}
                    onPress={() => submit()}
                  >
                    {loading ? (
                      <ActivityIndicator size={'small'} color={Colors.white} />
                    ) : (
                      <Text style={styles.text}>Salvar</Text>
                    )}
                  </RectButton>
                ) : (
                  <RectButton
                    style={styles.buttonContainer}
                    onPress={() => setRequired(true)}
                  >
                    {loading ? (
                      <ActivityIndicator size={'small'} color={Colors.white} />
                    ) : (
                      <Text style={styles.text}>Salvar</Text>
                    )}
                  </RectButton>
                )}
              </View>
            </View>
            <View style={styles.questionTermosContainer}>
              <Text style={styles.question}>
                Falta pouco para finalizar o seu cadastro!
              </Text>
              <Text style={styles.textTermosContainer}>
                Leia e aceite os termos de uso
              </Text>
            </View>
            <View style={styles.inputTermosContainer}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setModalVisibleTermos(true)}
                style={styles.buttonCliqueAqui}
              >
                <Text style={styles.inputLinkTermosContainer}>
                  Clique aqui para ler
                </Text>
              </TouchableOpacity>
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
              >
                <TouchableOpacity
                  onPress={acceptedTerms}
                  style={styles.inputVisible}
                  activeOpacity={1}
                >
                  {isAccepted ? (
                    <View style={styles.gridTermos}>
                      <MaterialCommunityIcons
                        name="checkbox-marked"
                        size={24}
                        color="#2A3748"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.inputTextTermosContainer}>
                        Aceito as regras presentes no contrato
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.gridTermos}>
                      <MaterialCommunityIcons
                        name="checkbox-blank"
                        size={24}
                        color="#2A3748"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.inputTextTermosContainer}>
                        Aceito as regras presentes no contrato
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {required && (
                <View style={styles.requiredContainerTermos}>
                  <AntDesign
                    name="warning"
                    size={16}
                    color={Colors.red}
                  />
                  <Text style={styles.textRequiredTermos}>
                    Você deve aceitar os termos para finalizar o cadastro.
                  </Text>
                </View>
              )}
            </View>
          </>
        )
      case 'sucesso':
        return (
          <>
            <View style={styles.finalizarContainer}>
              <AntDesign
                name="check"
                size={50}
                color="white"
                style={styles.iconFinalizar}
              />
              <Text style={styles.titleFinalizar}>
                Cadastro realizado com sucesso!
              </Text>
              <TouchableOpacity
                style={styles.botaoFinalizarContainerSucesso}
                onPress={() => navigation.navigate('Entrar')}
                activeOpacity={0.7}
              >
                <Text style={styles.textBotaoFinalizarContainer}>OK</Text>
              </TouchableOpacity>
            </View>
          </>
        )
      case 'erro':
        return (
          <>
            <View style={styles.finalizarContainer}>
              <AntDesign
                name="close"
                size={50}
                color="white"
                style={styles.iconFinalizar}
              />
              <Text style={styles.titleFinalizar}>Erro no cadastro!</Text>
              <Text style={styles.textFinalizar}>
                {data.email.error || 'Deseja tentar novamente?'}
              </Text>
              <View style={styles.buttonsErro}>
                <TouchableOpacity
                  style={{
                    ...styles.botaoFinalizarContainer,
                    backgroundColor: Colors.white,
                  }}
                  onPress={() => toStep('nome')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      ...styles.textBotaoFinalizarContainer,
                      color: Colors.blue,
                    }}
                  >
                    Sim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoFinalizarContainer}
                  onPress={() => navigation.navigate('Entrar')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.textBotaoFinalizarContainer}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )
      default:
        ;<TextInput value="😂😂😂"></TextInput>
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      {renderStep()}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,

    backgroundColor: '#2795BF',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 10,
    minHeight: 60,
  },
  gridHeader: {
    flexDirection: 'row',
  },
  buttonContainerIcon: {
    justifyContent: 'center',
    padding: 4,
  },
  buttonContainer: {
    justifyContent: 'center',
    marginLeft: 16,
  },
  text: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 17,
    color: Colors.white,
    textAlign: 'right',
    textTransform: 'uppercase',
  },

  questionTermosContainer: {
    backgroundColor: Colors.blue,
    width: screenWidth - 40,
    maxWidth: 600,
    height: 3 * (screenHeight / 5),
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  textTermosContainer: {
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
    color: Colors.white,
    textAlign: 'left',
    marginTop: 18,
  },
  inputTermosContainer: {
    backgroundColor: Colors.white,
    width: screenWidth,
    height: 2 * (screenHeight / 5),
    padding: 20,
    paddingTop: 40,
  },
  buttonCliqueAqui: {
    height: 30,
  },
  inputLinkTermosContainer: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
    color: '#2A3748',
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  inputTextTermosContainer: {
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
    color: '#2A3748',
    textAlign: 'left',
  },
  gridTermos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  requiredContainerTermos: {
    paddingRight: 20,
    maxWidth: 600,
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  textRequiredTermos: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
    color: Colors.red,
    marginLeft: 10,
  },

  containerTermos: {
    flex: 1,
    alignItems: 'center',
  },
  gridHeaderTermos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 17,
    color: Colors.white,
    textAlign: 'right',
    textTransform: 'uppercase',
    marginLeft: 6,
  },
  scrollContainer: {
    marginTop: 80,
    marginBottom: 20,
  },
  textContent: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: 'black',
    marginLeft: 10,
    textAlign: 'justify',
  },
  pdf: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.softGray,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue,
  },

  requiredContainer: {
    width: screenWidth - 40,
    maxWidth: 600,
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 10,
    alignItems: 'center',
  },

  textRequired: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
    color: '#FFFFFF',
    marginLeft: 6,
  },

  questionContainer: {
    width: screenWidth - 40,
    maxWidth: 600,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  question: {
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: 28,

    color: Colors.white,
  },
  input: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: 28,

    marginTop: 35,
    width: screenWidth - 40,
    maxWidth: 600,

    color: Colors.white,

    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 5,
    borderBottomWidth: 2,
  },
  nameContainer: {
    flexDirection: 'column',
    marginTop: 35,
    width: screenWidth - 40,
    maxWidth: 600,
  },
  nameInput: {
    width: '100%',
    marginTop: 20,
    fontSize: 20,
    lineHeight: 24,
  },

  containermodal: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },

  modalView: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    justifyContent: 'center',
    width: screenWidth - 40,
    maxWidth: 600,
    height: 50,

    backgroundColor: 'rgba(47, 168, 213, 1)',
  },

  modalViewText: {
    fontSize: 16,
    lineHeight: 19,
    color: 'white',
    textAlign: 'left',
    marginLeft: 18,
  },

  modalView2: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    width: screenWidth - 40,
    maxWidth: 600,
    padding: 18,
  },

  modalViewText2: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'left',
  },

  modalViewText2Bold: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'justify',
  },

  modalButton: {
    width: 80,
    height: 25,
    alignSelf: 'flex-end',
    marginTop: 25,
  },

  modalButtonText: {
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(47, 168, 213, 1)',
    textAlign: 'right',
    textTransform: 'uppercase',
    bottom: 0,
  },
  instruction: {
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 20,
    marginTop: 10,
    color: Colors.white,
  },

  gridTimer: {
    marginTop: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  timer: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 20,

    color: Colors.white,
  },

  timerReenviarButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    marginTop: 25,
    paddingBottom: 1,
    width: 90,

    alignItems: 'center',

    backgroundColor: Colors.blue,
  },

  timerReenviarText: {
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 20,

    color: 'rgba(255,255,255,0.7)',
  },

  inputVisibleContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    height: 50,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    alignItems: 'center',
  },

  inputVisible: {
    width: screenWidth - 40,
    maxWidth: 600,
  },

  inputVisibleText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    textAlign: 'right',
    textTransform: 'uppercase',
    color: Colors.white,
  },

  finalizarContainer: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  iconFinalizar: {
    alignSelf: 'center',
    marginBottom: 30,
  },

  titleFinalizar: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    textAlign: 'center',
    textTransform: 'uppercase',
    textAlignVertical: 'center',
    alignSelf: 'center',
    color: Colors.white,
    maxWidth: screenWidth - 80,
  },

  textFinalizar: {
    fontSize: 20,
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    marginTop: 20,
    color: Colors.white,
    maxWidth: screenWidth - 80,
  },

  botaoFinalizarContainerSucesso: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: screenWidth - 80,
    maxWidth: 300,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 5,
    marginTop: 50,
    alignSelf: 'center',
    margin: 10,
  },

  botaoFinalizarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: (screenWidth - 100) / 2,
    maxWidth: 180,
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 25,
    marginTop: 50,
    alignSelf: 'center',
    margin: 10,
  },

  textBotaoFinalizarContainer: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    textAlign: 'right',
    color: Colors.white,
    padding: 5,
  },

  buttonsErro: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
})
