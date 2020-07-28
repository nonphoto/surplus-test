// rollup.config.js
import surplus from "rollup-plugin-surplus";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "main.js",
  output: {
    file: "bundle.js",
    format: "esm",
  },
  plugins: [surplus(), resolve({ extensions: [".js", ".jsx"] })],
};
