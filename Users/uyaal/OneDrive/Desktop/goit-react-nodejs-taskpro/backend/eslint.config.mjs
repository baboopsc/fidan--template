import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import pluginJs from '@eslint/js';

export default defineConfig([
  { files: ["src/**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node }, rules: {
	    semi: 'error',
	    'no-unused-vars': ['error', { args: 'none' }],
	    'no-undef': 'error'
	  } },
]);
