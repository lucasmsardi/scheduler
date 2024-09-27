import globals from 'globals';
import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			parser: tsParser,
			globals: { ...globals.browser, ...globals.node },
		},
		plugins: {
			'@typescript-eslint': tseslint,
			react: pluginReact,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-var-requires': 'error',
			'react/react-in-jsx-scope': 'off',
		},
	},
	pluginJs.configs.recommended,

	tseslint.configs.recommended,

	pluginReact.configs.flat.recommended,
];
