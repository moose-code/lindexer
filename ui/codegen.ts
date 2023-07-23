import { CodegenConfig } from "@graphql-codegen/cli";
import { HASURA_URL } from "./src/gql_queries";
const config: CodegenConfig = {
  schema: HASURA_URL,
  documents: ["src/**/*.ts"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
