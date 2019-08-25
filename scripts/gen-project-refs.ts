import path from 'path';
import { getWorkspaces } from 'bolt';
import fse from 'fs-extra';
import chalk from 'chalk';
import prettier from 'prettier';
import json5 from 'json5';

export const projectPath = path.resolve(__dirname, '..');
export const tsconfigPath = path.join(projectPath, 'tsconfig');
export const allProjectsPath = path.join(tsconfigPath, 'all-projects.json');

export const main = async () => {
  try {
    const workspaces = await getWorkspaces();
    const allProjectsTsconfig = {
      references: workspaces.map(({ dir, name }) => ({
        path: path.relative(
          tsconfigPath,
          name === '@alg/web'
            ? path.join(dir, 'ts-project') // workaround because Next.js insists on messing with our tsconfig
            : dir,
        ),
      })),
    };
    await fse.writeFile(
      allProjectsPath,
      prettify(allProjectsPath, json5.stringify(allProjectsTsconfig)),
    );
  } catch (err) {
    console.error(chalk.red('Error:'), err);
    process.exit(1);
  }
};

export const prettify = (filePath: string, contents: string) =>
  prettier.format(contents, { filepath: filePath });

if (require.main === module) main();
