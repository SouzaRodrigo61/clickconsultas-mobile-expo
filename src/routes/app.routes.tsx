import NetInfo from '@react-native-community/netinfo'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect, useRef, useState } from 'react'
import { Modal, Platform } from 'react-native'

import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { register } from '../services/expoPushTokens.js'

import {
  Buscar,
  BuscarLocalidade1,
  CadastroCPF,
  CadastroCidade,
  CadastroEmail,
  CadastroGenero,
  CadastroNascimento,
  CadastroNome,
  CadastroTelefone,
  CadastroVerificarIdentidade,
  Compromissos,
  CompromissosResumoConsulta,
  DetalhePaciente,
  EncontreAgende,
  Especialidades,
  FormaDePagamento,
  Home,
  MaisSobreEducacao,
  MaisSobreEspecialidades,
  MaisSobreExperiencia,
  Perfil,
  PerfilMedico,
  ProblemasSaude,
  ResumoConsulta,
  SelecioneData,
  Servicos,
  SolicitarAlteracao,
  SolicitarAlteracaoAceitar,
  SolicitarAlteracaoRecusar,
  Termos,
} from '../pages'

import ConnectedFalse from '../components/IsConnected/ConnectedFalse'
import ConnectedTrue from '../components/IsConnected/ConnectedTrue'
import HeaderLocation from '../components/Localidade/HeaderLocation'
import MultiplosEnderecos from '../components/PerfilMedico/MultiplosEnderecos'
import SearchDoctor from '../components/Search/SearchDoctor'
import StatusBar from '../components/StatusBar'
import ArrowLeftButton from '../components/icons/ArrowLeft'

const AppStack = createStackNavigator()

const defaultOpts: any = {
  headerShown: true,
  headerStyle: {
    backgroundColor: '#2FA8D5',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 17,
    lineHeight: 20,
    color: '#ffffff',
    textAlign: 'center',
    alignSelf: 'center',
  },
  headerTitleAlign: 'center',
  headerLeft: () => <ArrowLeftButton colorIcon="#FFFFFF" />,
}

const defaultPerfil = {
  nome: 'Adicionar Nome',
  telefone: 'Adicionar Telefone',
  emailvar: 'Adicionar Email',
  cpfvar: 'Adicionar CPF',
  genero: 'Adicionar Gênero',
  data_nascimento: 'Adicionar Data',
  cidade: ['Cidade', 'UF'],
}

const defaultHome = { localSelected: 'Localidade' }

const defaultEncontreAgende = { localidade: 'Localidade' }

const defaultPagamento = {
  convenioSelecionado: 'Escolha a forma de pagamento',
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const AppRoutes: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<
    Notifications.Notification | boolean
  >(false)
  const notificationListener: any = useRef()
  const responseListener: any = useRef()

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync()
        setExpoPushToken(token)

        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification)
          })

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response)
          })
      } catch (error) {
        console.log('Erro ao inicializar notificações:', error)
      }
    }

    initializeNotifications()

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected)
    })
  }, [isConnected, setIsConnected])

  useEffect(() => {
    setIsVisible(true)

    if (isConnected) {
      setTimeout(() => {
        setIsVisible(false)
      }, 900)
    } else {
      setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    }
  }, [])

  return (
    <>
      <StatusBar />

      {isConnected ? (
        <Modal
          animationType={'fade'}
          transparent={true}
          // visible={isVisible}
          visible={false}
          statusBarTranslucent={true}
        >
          <ConnectedTrue />
        </Modal>
      ) : (
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={isVisible}
          statusBarTranslucent={true}
        >
          <ConnectedFalse />
        </Modal>
      )}

      <AppStack.Navigator>
        <AppStack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
          initialParams={defaultHome}
        />

        <AppStack.Screen
          name="CadastroNome"
          component={CadastroNome}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="CadastroTelefone"
          component={CadastroTelefone}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="CadastroEmail"
          component={CadastroEmail}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="CadastroVerificarIdentidade"
          component={CadastroVerificarIdentidade}
        />

        <AppStack.Screen
          name="CadastroCpf"
          component={CadastroCPF}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="CadastroGenero"
          component={CadastroGenero}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="CadastroNascimento"
          component={CadastroNascimento}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="CadastroCidade"
          component={CadastroCidade}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="Perfil"
          component={Perfil}
          options={{
            ...defaultOpts,
            title: 'Perfil do Paciente',
            headerLeft: () => null,
          }}
          initialParams={defaultPerfil}
        />

        <AppStack.Screen
          name="Compromissos"
          component={Compromissos}
          options={{
            ...defaultOpts,
            title: 'Compromissos',
            headerLeft: () => null,
          }}
        />

        <AppStack.Screen
          name="CompromissosResumoConsulta"
          component={CompromissosResumoConsulta}
          options={{
            ...defaultOpts,
            title: 'Resumo da Consulta',
          }}
        />

        <AppStack.Screen
          name="BuscarLocalidade1"
          component={BuscarLocalidade1}
          options={{
            ...defaultOpts,
            headerShown: false,
            // title: "",
            // headerLeft: () => <BuscarLocalidadeSearch setSearchResult={true} />,
          }}
        />

        <AppStack.Screen
          name="EncontreAgende"
          component={EncontreAgende}
          options={{
            ...defaultOpts,
            headerShown: false,
          }}
          initialParams={defaultEncontreAgende}
        />

        <AppStack.Screen
          name="ProblemasSaude"
          component={ProblemasSaude}
          options={{
            ...defaultOpts,
            title: 'Problemas de Saúde',
          }}
        />

        <AppStack.Screen
          name="Especialidades"
          component={Especialidades}
          options={{
            ...defaultOpts,
            title: 'Especialidades',
          }}
        />

        <AppStack.Screen
          name="Buscar"
          component={Buscar}
          options={{
            ...defaultOpts,
            title: 'Buscar',
            headerRight: () => <HeaderLocation location="localidade" />,
          }}
        />

        <AppStack.Screen
          name="SolicitarAlteracao"
          component={SolicitarAlteracao}
          options={{ ...defaultOpts, title: 'Solicitar Alteração' }}
        />

        <AppStack.Screen
          name="SolicitarAlteracaoAceitar"
          component={SolicitarAlteracaoAceitar}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="SolicitarAlteracaoRecusar"
          component={SolicitarAlteracaoRecusar}
          options={{ headerShown: false }}
        />

        <AppStack.Screen
          name="PerfilMedico"
          component={PerfilMedico}
          options={{
            ...defaultOpts,
            title: 'Perfil do Médico',
          }}
        />

        <AppStack.Screen
          name="MultiplosEnderecos"
          component={MultiplosEnderecos}
        />

        <AppStack.Screen
          name="Servicos"
          component={Servicos}
          options={{
            ...defaultOpts,
            title: 'Servicos',
          }}
        />

        <AppStack.Screen
          name="MaisSobreEspecialidades"
          component={MaisSobreEspecialidades}
          options={{
            ...defaultOpts,
            title: 'Especialidades',
          }}
        />

        <AppStack.Screen
          name="MaisSobreEducacao"
          component={MaisSobreEducacao}
          options={{
            ...defaultOpts,
            title: 'Educação',
          }}
        />

        <AppStack.Screen
          name="MaisSobreExperiencia"
          component={MaisSobreExperiencia}
          options={{
            ...defaultOpts,
            title: 'Experiencia',
          }}
        />

        <AppStack.Screen
          name="SelecioneData"
          component={SelecioneData}
          options={{
            ...defaultOpts,
            title: 'Detalhes da Consulta',
          }}
        />

        <AppStack.Screen
          name="FormaDePagamento"
          component={FormaDePagamento}
          options={{
            ...defaultOpts,
            title: 'Forma de pagamento',
            headerLeft: () => <ArrowLeftButton colorIcon={'#FFF'} />,
          }}
          initialParams={defaultPagamento}
        />

        <AppStack.Screen
          name="Termos"
          component={Termos}
          options={{
            ...defaultOpts,
            title: 'Termos',
            headerLeft: () => <ArrowLeftButton colorIcon={'#FFF'} />,
          }}
        />

        <AppStack.Screen
          name="DetalhePaciente"
          component={DetalhePaciente}
          options={{
            ...defaultOpts,
            title: 'Detalhes do paciente',
          }}
        />

        <AppStack.Screen
          name="ResumoConsulta"
          component={ResumoConsulta}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#2FA8D5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontFamily: 'Lato_700Bold',
              fontSize: 17,
              lineHeight: 20,
              color: '#ffffff',
              textAlign: 'center',
              alignSelf: 'center',
            },
            headerTitleAlign: 'center',
            title: 'Resumo da Consulta',
            headerLeft: () => null,
          }}
        />

        <AppStack.Screen name="SearchDoctor" component={SearchDoctor} />
      </AppStack.Navigator>
    </>
  )
}

async function registerForPushNotificationsAsync() {
  try {
    let token
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!')
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
      register(token)
    } else {
      console.log('Must use physical device for Push Notifications')
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2fa8d5',
      })
    }

    return token
  } catch (error) {
    console.log('Erro ao registrar notificações:', error)
    return null
  }
}

export default AppRoutes
