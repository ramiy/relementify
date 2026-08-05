import wordpress from '@wordpress/eslint-plugin';

export default [
	{ ignores: [ 'eslint.config.mjs' ] },
	...wordpress.configs[ 'recommended-with-formatting' ],
	{
		languageOptions: {
			globals: {
				relementify: 'writable',
				elementor: 'readonly',
				elementorCommon: 'readonly',
				$e: 'readonly',
			},
			ecmaVersion: 2023,
			sourceType: 'module',
		},
		rules: {
			'no-console': 'off',
		},
	},
];
