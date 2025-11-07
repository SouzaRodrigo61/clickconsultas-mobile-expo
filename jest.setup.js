// Configuração global do Jest

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock do NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock do expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-token' })),
  setNotificationChannelAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock do expo-constants
jest.mock('expo-constants', () => ({
  isDevice: true,
}));

// Mock do react-navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock do react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View, TouchableOpacity, TouchableWithoutFeedback } = require('react-native');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: (props: any) => {
      return React.createElement(TouchableOpacity, props);
    },
    TouchableOpacity: (props: any) => {
      return React.createElement(TouchableOpacity, props);
    },
    TouchableWithoutFeedback: (props: any) => {
      return React.createElement(TouchableWithoutFeedback, props);
    },
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock do react-native-reanimated (se existir)
try {
  jest.mock('react-native-reanimated', () => {
    try {
      const Reanimated = require('react-native-reanimated/mock');
      Reanimated.default.call = () => {};
      return Reanimated;
    } catch {
      return {};
    }
  });
} catch {
  // Ignorar se não estiver instalado
}

// Mock do serviço de API
jest.mock('./src/services/api', () => {
  const mockApi = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: {
      headers: {
        Authorization: null,
      },
    },
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };
  return {
    __esModule: true,
    default: mockApi,
    RECAPTCHA_TOKEN: '6LcDvHEaAAAAADExXf46EMayH7sxiPcyxMm9Cjrl',
  };
});

// Mock do expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: -23.5505, longitude: -46.6333 },
  })),
}));

// Mock do expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ cancelled: false, uri: 'mock-uri' })),
}));

// Mock do expo-document-picker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(() => Promise.resolve({ type: 'success', uri: 'mock-uri' })),
}));

// Mock do react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = React.forwardRef((props, ref) => <View ref={ref} {...props} />);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: View,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock do react-native-webview
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props, ref) => <View ref={ref} {...props} />);
});

// Mock do react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  function SafeAreaView({ children, ...props }: any) {
    return React.createElement(View, props, children);
  }
  SafeAreaView.displayName = 'SafeAreaView';
  return {
    SafeAreaView,
    SafeAreaProvider: ({ children }: any) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock do SafeAreaWrapper (deve vir depois do mock do react-native-safe-area-context)
jest.mock('./src/components/SafeAreaWrapper', () => {
  const React = require('react');
  const { View } = require('react-native');
  function SafeAreaWrapper({ children, ...props }: any) {
    return React.createElement(View, props, children);
  }
  SafeAreaWrapper.displayName = 'SafeAreaWrapper';
  return {
    __esModule: true,
    default: SafeAreaWrapper,
  };
});

// Mock de imagens estáticas
jest.mock('./src/images/logo-bem-vindo.png', () => 'logo-bem-vindo.png', { virtual: true });
jest.mock('./src/images/colorful-logo.png', () => 'colorful-logo.png', { virtual: true });
jest.mock('./src/images/home.png', () => 'home.png', { virtual: true });
jest.mock('./src/images/bemvindo.png', () => 'bemvindo.png', { virtual: true });

// Mock do @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  function Icon({ name, ...props }: any) {
    return React.createElement(Text, props, name);
  }
  Icon.displayName = 'Icon';
  return {
    MaterialIcons: Icon,
    AntDesign: Icon,
    Ionicons: Icon,
    Fontisto: Icon,
    Feather: Icon,
    MaterialCommunityIcons: Icon,
  };
});

// Mock do StatusBar component
jest.mock('./src/components/StatusBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  function StatusBarComponent(props: any) {
    return React.createElement(View, { testID: 'statusBar', ...props });
  }
  StatusBarComponent.displayName = 'StatusBar';
  return {
    __esModule: true,
    default: StatusBarComponent,
  };
});

// Mock do react-native-masked-text
jest.mock('react-native-masked-text', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    TextInputMask: React.forwardRef((props: any, ref: any) => {
      return React.createElement(TextInput, { ...props, ref });
    }),
  };
});

// Mock do expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: ({ style, backgroundColor }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'expo-status-bar', style, backgroundColor });
  },
}));

// Mock do @rneui/themed
jest.mock('@rneui/themed', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress, ...props }: any) => 
      React.createElement(TouchableOpacity, { onPress, ...props }, 
        React.createElement(Text, null, title)
      ),
    ButtonGroup: ({ buttons, onPress, selectedIndex, ...props }: any) =>
      React.createElement(View, props,
        buttons.map((button: string, index: number) =>
          React.createElement(TouchableOpacity, {
            key: index,
            onPress: () => onPress(index),
            testID: `button-${index}`,
          }, React.createElement(Text, null, button))
        )
      ),
  };
});

// Mock do react-native-modal-datetime-picker
jest.mock('react-native-modal-datetime-picker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ isVisible, onConfirm, onCancel, ...props }: any) =>
      isVisible ? React.createElement(View, { testID: 'date-picker', ...props }) : null,
  };
});

// Mock do @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  const Picker = ({ children, selectedValue, onValueChange, ...props }: any) => {
    return React.createElement(View, { testID: 'picker', ...props },
      React.Children.map(children, (child: any) => {
        if (child && child.props && child.props.value === selectedValue) {
          return React.createElement(TouchableOpacity, {
            onPress: () => onValueChange(child.props.value),
            testID: `picker-item-${child.props.value}`,
          }, React.createElement(Text, null, child.props.label));
        }
        return null;
      })
    );
  };
  Picker.Item = ({ label, value }: any) => React.createElement(View, { testID: `picker-item-${value}` });
  return { Picker };
});

// Mock do axios (usado no City component)
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

// Mock do moment/locale/pt-br para evitar erros nos testes
jest.mock('moment/locale/pt-br', () => ({}), { virtual: true });

// Mock global do componente Gender
jest.mock('./src/components/CadastroGenero/Gender', () => {
  const React = require('react');
  const { View } = require('react-native');
  function GenderComponent({ setGenero, gender }: any) {
    return React.createElement(View, { testID: 'gender-component' });
  }
  GenderComponent.displayName = 'GenderComponent';
  return {
    __esModule: true,
    default: GenderComponent,
  };
});

// Mock global do componente Date
jest.mock('./src/components/CadastroNascimento/Date', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ setData, data }: any) => 
      React.createElement(View, { testID: 'date-component' },
        React.createElement(Text, { testID: 'date-display' }, data ? data.toString() : 'Sem data')
      ),
  };
});

// Mock global do componente City
jest.mock('./src/components/CadastroCidade/City', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ setCidade, initialUf, initialCity }: any) => 
      React.createElement(View, { testID: 'city-component' },
        React.createElement(TouchableOpacity, { onPress: () => setCidade(['SP', 'São Paulo']) },
          React.createElement(Text, null, 'Selecionar São Paulo')
        )
      ),
  };
});

// Silenciar console.log durante os testes (opcional)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

