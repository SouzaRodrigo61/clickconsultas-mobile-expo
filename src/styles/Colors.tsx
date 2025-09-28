const Colors = {
  darkBlue: "#2795BF",
  titleBlue: "#4F6787",
  blue: "#2FA8D5",
  softBlue: "#EEF8FC",
  darkPurple: "#7B61FF",
  purple: "#6A4CFF",
  softPurple: "#EEEBFF",
  green: "#26B04D",
  gray: "#A7BBC2",
  primaryGray: "#9C9C9C",
  softGray: "#EDEDED",
  white: "#FFFFFF",
  smokeWhite: "#F4F4F4",
  black: "#000000",
  input: "rgba(0, 0, 0, 0.3)",
  red: "#E20613",
};

export const getColor = (status) => {
  switch (status) {
    case "Solicitada":
      return "#FD9800";
    case "Agendada":
      return "#00cc8f";
    case "Pendente":
      return "#E20613";
    default:
      return "grey";
  }
};

export default Colors;
