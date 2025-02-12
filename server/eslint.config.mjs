export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier, // Thêm eslint-config-prettier để vô hiệu hóa các quy tắc ESLint xung đột với Prettier
  {
    plugins: {
      prettier: eslintPluginPrettier, // Kích hoạt plugin Prettier
    },
    rules: {
      'prettier/prettier': 'warn', // Cảnh báo nhưng không lỗi nghiêm trọng
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
);
