#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const registryJsonPath = join(root, "registry.json");
const publicRDir = join(root, "public", "r");
const registryStagingDir = join(root, "registry");

function removeIfExists(path: string) {
  rmSync(path, { recursive: true, force: true });
}

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function isWindows() {
  return process.platform === "win32";
}

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: isWindows(),
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

interface RegistryFile {
  interface: string;
  path: string;
  target?: string;
}

interface RegistryItem {
  files?: RegistryFile[];
  name?: string;
}

interface Registry {
  items?: RegistryItem[];
}

const registry: Registry = JSON.parse(readFileSync(registryJsonPath, "utf-8"));

removeIfExists(publicRDir);
removeIfExists(registryStagingDir);
ensureDir(registryStagingDir);

for (const item of registry.items ?? []) {
  for (const file of item.files ?? []) {
    if (!(file?.target && file?.path)) {
      console.error(
        `Invalid registry file entry for "${item?.name ?? "unknown"}": each files[] item must include both "target" and "path".`
      );
      process.exit(1);
    }

    const sourcePath = resolve(join(root, file.target.replace(/^~\//, "")));
    const destinationPath = resolve(join(root, file.path));
    if (sourcePath === destinationPath) {
      continue;
    }
    ensureDir(dirname(destinationPath));
    cpSync(sourcePath, destinationPath);
  }
}

try {
  run("npx", ["shadcn", "build"]);
  console.log("✅ Registry outputs generated in public/r");
} finally {
  removeIfExists(registryStagingDir);
}
