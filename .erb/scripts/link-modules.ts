import fs from "fs";
import webpackPaths from "../configs/webpack.paths";

const ensureSymlink = (target: string, source: string): void => {
  try {
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(target);
    } else {
      return;
    }
  } catch {
    // target doesn't exist, proceed to create symlink
  }
  fs.symlinkSync(source, target, "junction");
};

const { srcNodeModulesPath, appNodeModulesPath, erbNodeModulesPath } = webpackPaths;

if (fs.existsSync(appNodeModulesPath)) {
  ensureSymlink(srcNodeModulesPath, appNodeModulesPath);
  ensureSymlink(erbNodeModulesPath, appNodeModulesPath);
}
