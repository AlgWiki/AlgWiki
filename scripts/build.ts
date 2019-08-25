import path from 'path';
import ts from 'typescript';
// @ts-ignore
// import Project from 'bolt/dist/modern/Project';
// @ts-ignore
// import Package from 'bolt/dist/modern/Package';

const watch = async (packagePath: string) => {
  // https://github.com/microsoft/TypeScript/issues/25376
  // const cwd = process.cwd();
  // const project = await Project.init(cwd);
  // const packages = await project.getPackages();
  // const pkg = await project.getPackageByName(packages, '@alg/web-api');
  // const depGraph = await project.getDependencyGraph(packages);
  // console.log({ packages, pkg, depGraph });

  // TODO: Update to use the build API when it becomes available
  const packageName = path.basename(packagePath);
  console.log(`Watching '${packageName}' package (and dependencies)...`);
  const configPath = ts.findConfigFile(packagePath, ts.sys.fileExists);
  if (!configPath) {
    console.error(`Could not find 'tsconfig.json' file in: ${packagePath}`);
    process.exit(1);
    throw 0;
  }
  const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  };
  const printDiagnostic = (diagnostic: ts.Diagnostic) =>
    ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost);
  let lastMessage: string | null = null;
  // ts.createSolution...
  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    diagnostic => {
      const text = printDiagnostic(diagnostic);
      if (text !== lastMessage) {
        console.error(text);
        lastMessage = text;
      }
    },
    diagnostic => {
      console.info(printDiagnostic(diagnostic));
    },
  );
  ts.createWatchProgram(host);
};

// watch(process.cwd());
watch(path.resolve('./packages/dev/server'));
