import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import clear from 'rollup-plugin-clear'

export default defineConfig({
  input: 'lib/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    chunkFileNames: '[name].js'
  },

  plugins: [
    nodeResolve(),
    clear({ targets: ['dist'] }),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ]
})