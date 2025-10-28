import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { SearchBar } from "@rneui/themed";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { request } from "../../utils/preventTooManyRequests.js";
import { AntDesign } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SearchingProps {
  setShowing: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchResult: any;
  lat?: number;
  long?: number;
  radius?: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function Search({
  setShowing,
  setLoading,
  setSearchResult,
  lat = -21.48,
  long = -47.5531,
  radius = 50,
  search,
  setSearch
}: SearchingProps) {
  const fetch = async () => {
    if (search.trim() === "") return;
    setLoading(true);
    const res = await request(
      `/list-medicos/?lat=${long}&long=${lat}&radius=${radius}&nome=${search}`
    );
    const novosMedicos = await res?.data;
    setSearchResult(novosMedicos);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetch();
      if (search == "") {
        setShowing(true);
      } else {
        setShowing(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [search]);

  function handleChangeText(search: any) {
    setSearch(search);
    if (search == "") {
      setShowing(true);
    } else {
      setShowing(false);
    }
  }

  function handleCancel() {
    setShowing(true);
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Busque por médicos, especialidades..."
        inputStyle={{
          fontFamily: Fonts.regular,
          fontSize: 16,
          lineHeight: 19,
          fontStyle: "normal",
          color: Colors.black
        }}
        inputContainerStyle={{
          backgroundColor: Colors.white
        }}
        autoFocus
        containerStyle={{
          justifyContent: "center",
          backgroundColor: Colors.white,
          borderColor: Colors.softGray,
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 4,
          height: 50,
          width: screenWidth - 30,
          shadowColor: Colors.softGray,
          shadowOffset: { width: 100, height: 100 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 0.5
        }}
        lightTheme={true}
        searchIcon={<AntDesign name="search" size={18} color={Colors.softGray} />}
        onClear={handleCancel}
        clearIcon={<AntDesign name="close" size={20} color={Colors.softGray} />}
        onChangeText={handleChangeText}
        value={search}
        loadingProps={{ animating: true, color: Colors.blue }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  }
});
