import js from '@eslint/js';

export default [
    js.configs.recommended,

    {
        languageOptions: {
            globals: {
                google: 'readonly',
                document: 'readonly',
                fetch: 'readonly',
                console: 'readonly',
                DOMParser: 'readonly',
                window: 'readonly',
                alert: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
        },
    },
];
