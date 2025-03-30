// @ts-nocheck
import fs from "fs";

const MIX_ALL_COLORS = true;

const getRandomElementFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const colorThemes = [
  //   ["#e1417b", "#e8dcc8", "#5f66d5", "#1d313c", "white", "black"],
  //   ["#3d04fc", "#fce2f0dd", "#825df7", "white", "black"],
  //   ["#f04720", "#f4c273", "#f7e8c4", "#dd9bc6", "#9f4282", "white", "black"],
  ["#f4e9d3", "#f8ecd7", "#272727", "#0186b5", "#b8ddd8", "#fb4a2d"],
];

// const colorThemes = [
//   ["#ff00ff", "#2a2139", "#ff00ff", "#2a2139", "#00ffff", "#ffffff"],
//   ["#4a90e2", "#f5f5f5", "#4a90e2", "#ffffff", "#e2a74a", "#333333"],
//   ["#00ff00", "#000000", "#00ff00", "#000000", "#00ff00", "#00ff00"],
//   ["#6c5ce7", "#2c3e50", "#6c5ce7", "#34495e", "#00b894", "#ffffff"],
//   ["#000080", "#c0c0c0", "#808080", "#ffffff", "#800000", "#000000"],
//   ["#ff0000", "#000000", "#ff0000", "#000000", "#00ff00", "#ffffff"],
//   ["#e1417b", "#e8dcc8", "#5f66d5", "#1d313c", "white", "black"],
//   ["#3d04fc", "#fce2f0dd", "#825df7", "white", "black"],
//   ["#f04720", "#f4c273", "#f7e8c4", "#dd9bc6", "#9f4282", "white", "black"],
// ];

let colorTheme;

if (MIX_ALL_COLORS) {
  colorTheme = colorThemes.flat();
} else {
  colorTheme = getRandomElementFromArray(colorThemes);
}

colorTheme = shuffleArray(colorTheme);

const output = `
:root {
  --primary-color: ${getRandomElementFromArray(colorTheme)};
  --background-color: ${getRandomElementFromArray(colorTheme)};
  --window-shadow-color: ${getRandomElementFromArray(colorTheme)};
  --window-background-color: ${getRandomElementFromArray(colorTheme)};
}
`;

// const output = `
// :root {
//   --primary-color: ${colorTheme[0]};
//   --background-color: ${colorTheme[1]};
//   --window-shadow-color: ${colorTheme[2]};
//   --window-background-color: ${colorTheme[3]};
// }
// `;

fs.writeFileSync("src/styles/variables.css", output);
