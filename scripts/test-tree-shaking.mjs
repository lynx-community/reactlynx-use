import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { rspack } from "@rslib/core";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
await access(path.join(packageRoot, "dist/useTouchEmulation.js"));
await assert.rejects(access(path.join(packageRoot, "dist/index.cjs")), {
  code: "ENOENT",
});

const temporaryRoot = await mkdtemp(
  path.join(tmpdir(), "reactlynx-use-tree-shaking-"),
);

try {
  const entryPath = path.join(temporaryRoot, "index.js");
  const outputPath = path.join(temporaryRoot, "dist");

  await writeFile(
    entryPath,
    [
      'import { useTouchEmulation } from "@lynx-js/react-use";',
      "globalThis.__useTouchEmulation = useTouchEmulation;",
    ].join("\n"),
  );

  const compiler = rspack({
    mode: "production",
    entry: entryPath,
    externals: {
      "@lynx-js/react": "@lynx-js/react",
    },
    externalsType: "commonjs",
    output: {
      clean: true,
      filename: "bundle.js",
      path: outputPath,
    },
    optimization: {
      minimize: false,
    },
    resolve: {
      alias: {
        "@lynx-js/react-use$": packageRoot,
      },
    },
  });

  try {
    const stats = await new Promise((resolve, reject) => {
      compiler.run((error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (result?.hasErrors()) {
          reject(new Error(result.toString({ all: false, errors: true })));
          return;
        }
        resolve(result);
      });
    });

    assert.ok(stats);

    const bundle = await readFile(path.join(outputPath, "bundle.js"), "utf8");
    assert.match(bundle, /useTouchEmulation/);
    assert.doesNotMatch(bundle, /useExposureForNode/);
    assert.doesNotMatch(bundle, /useExposureForPage/);
    assert.doesNotMatch(bundle, /useStayTime/);
    assert.doesNotMatch(bundle, /createKeyedAdmissionGate/);
    assert.doesNotMatch(bundle, /react-use\/esm/);
    assert.doesNotMatch(bundle, /nanoid|immer/);
  } finally {
    await new Promise((resolve, reject) => {
      compiler.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
} finally {
  await rm(temporaryRoot, { force: true, recursive: true });
}
