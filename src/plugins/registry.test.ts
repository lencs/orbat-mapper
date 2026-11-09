import { describe, expect, it } from "vitest";
import type { ScenarioPlugin } from "@/plugins/types";
import { collectPlugins } from "@/plugins/registry";

function plugin(id: string, name = id): ScenarioPlugin {
  return {
    id,
    name,
    description: name,
    icon: {} as ScenarioPlugin["icon"],
    component: {} as ScenarioPlugin["component"],
  };
}

describe("collectPlugins", () => {
  it("returns the manifests in the order they were given", () => {
    const plugins = [plugin("alpha", "Alpha"), plugin("beta", "Beta")];
    expect(collectPlugins(plugins)).toEqual(plugins);
  });

  it("throws when two plugins share an id", () => {
    expect(() => collectPlugins([plugin("alpha"), plugin("alpha")])).toThrow(
      'Duplicate scenario plugin id "alpha"',
    );
  });

  it("throws when a plugin reuses a reserved id", () => {
    expect(() => collectPlugins([plugin("export")], ["export"])).toThrow(
      'Scenario plugin id "export" is reserved',
    );
  });
});
