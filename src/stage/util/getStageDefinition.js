import ini from "ini";
import { remote } from "electron";

const cache = new WeakMap();

export default function useStageDefinition(stage, currentDirectory) {
  const fs = remote.require("fs");
  const path = remote.require("path");

  if (cache.has(stage)) {
    return cache.get(stage);
  }

  if (!stage) {
    return null;
  }

  if (stage.random) {
    return null;
  }

  if (!stage.definition) {
    return null;
  }

  const definitionPath = path.resolve(currentDirectory, "stages", stage.definition);
  if (!fs.existsSync(definitionPath)) {
    return null;
  }

  const definition = ini.parse(fs.readFileSync(definitionPath, "utf-8"));
  cache.set(stage, definition);
  return definition;
}
