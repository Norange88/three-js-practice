const isCodeSandbox =
  'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;

export default {
  root: 'src/',
  publicDir: '../static/',
  base: './',
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './src/index.html',
        letters: './src/3d-letters-game.html',
        model: './src/3d-model.html',
        portfolio: './src/3d-portfolio.html',
      },
    },
  },
};
