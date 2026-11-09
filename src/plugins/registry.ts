import type { ScenarioPlugin } from "@/plugins/types";

/** Built-in tool ids. A plugin must not reuse one; the Tools tab renders those itself. */
export const RESERVED_PLUGIN_IDS = ["export"] as const;

type PluginModule = { plugin?: ScenarioPlugin };

/**
 * Validate and return the plugins that should be listed.
 * `reservedIds` are treated as already taken, so a plugin cannot shadow a built-in tool.
 */
export function collectPlugins(
  plugins: readonly ScenarioPlugin[],
  reservedIds: readonly string[] = [],
): ScenarioPlugin[] {
  const reserved = new Set(reservedIds);
  const seen = new Set<string>();
  for (const plugin of plugins) {
    if (reserved.has(plugin.id)) {
      throw new Error(`Scenario plugin id "${plugin.id}" is reserved`);
    }
    if (seen.has(plugin.id)) {
      throw new Error(`Duplicate scenario plugin id "${plugin.id}"`);
    }
    seen.add(plugin.id);
  }
  return [...plugins];
}

const pluginModules = import.meta.glob<PluginModule>("./*/index.ts", { eager: true });

function pluginFromModule(path: string, mod: PluginModule): ScenarioPlugin {
  if (!mod.plugin) {
    throw new Error(`${path} must export a scenario plugin as \`plugin\``);
  }
  return mod.plugin;
}

export const scenarioPlugins = collectPlugins(
  Object.entries(pluginModules).map(([path, mod]) => pluginFromModule(path, mod)),
  RESERVED_PLUGIN_IDS,
);
