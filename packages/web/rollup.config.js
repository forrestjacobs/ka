import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

function makeConfig(outputFile, shouldMinify) {
  return {
    input: "src/index.ts",
    output: {
      file: `public/${outputFile}`,
      format: "iife",
      globals: {
        "react": "React",
        "react-dom": "ReactDOM",
      }
    },
    external: [ "react", "react-dom" ],
    plugins: [
      resolve(),
      commonjs({
        namedExports: {
          "react": [ "Children", "Component", "createElement" ],
          "react-dom": [ "render" ],
          "react-is": [ "isValidElementType" ],
        },
      }),
      typescript(),
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      shouldMinify && terser(),
    ],
  };
}

export default [
  makeConfig("app.js"),
  makeConfig("app.min.js", true),
];
