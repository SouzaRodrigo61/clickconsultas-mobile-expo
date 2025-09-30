import React from "react";

import { StatusBar } from "expo-status-bar";

export default function BarraStatus({
  color = "#2FA8D5",
  barStyle = "light-content",
}) {
  return (
    <StatusBar
      style={barStyle === "light-content" ? "light" : "dark"}
      backgroundColor={color}
    />
  );
}
