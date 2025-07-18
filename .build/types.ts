/* eslint-disable no-console */
import { packageOptions } from './common.js';
import { execSync } from 'child_process';

const buildType = (packageName: string) => {
  console.log(`Building types for ${packageName}`);
  try {
    const out = execSync(`tsc -p ./packages/${packageName}/tsconfig.json --emitDeclarationOnly`);
    if (out.length > 0) {
      console.log(out.toString());
    }
  } catch (e) {
    if (e.stdout.length > 0) {
      console.error(e.stdout.toString());
    }
    if (e.stderr.length > 0) {
      console.error(e.stderr.toString());
    }
    // Exit the build process if we are in CI
    if (process.env.CI) {
      throw new Error(`Failed to build types for ${packageName}`);
    }
  }
};

for (const { packageName } of Object.values(packageOptions)) {
  buildType(packageName);
}
