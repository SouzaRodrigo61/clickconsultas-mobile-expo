import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLocalidadeOnAsyncStorage = async (localidade) => {
  await AsyncStorage.setItem(
    "@ClickConsultas:localidade",
    JSON.stringify(localidade)
  );
};

export const getLocalidadeFromAsyncStorage = async () => {
  const localidade = await AsyncStorage.getItem("@ClickConsultas:localidade");
  if (localidade) return JSON.parse(localidade);
  return null;
};
