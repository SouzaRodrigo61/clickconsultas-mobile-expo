import React from "react";

import { StatusBar } from "react-native";

export default function BarraStatus({
  color = "#F4F4F4",
  barStyle = "dark-content",
}) {
  return (
    <StatusBar
      barStyle={barStyle}
      hidden={false}
      backgroundColor={color}
      translucent={false}
      networkActivityIndicatorVisible={true}
    />
  );
}
