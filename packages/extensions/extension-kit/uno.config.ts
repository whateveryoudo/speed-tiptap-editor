import { fileURLToPath } from 'node:url'
import { createPackageUnoConfig } from '../../../tools/uno.config'

export default createPackageUnoConfig(fileURLToPath(new URL('.', import.meta.url)))
