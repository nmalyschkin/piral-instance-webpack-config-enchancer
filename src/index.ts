import { DefinePlugin } from "webpack";
import { setEnvironment, getDefineVariables, getVariables } from "./helpers";

const pluginName = "PiralInstanceWebpackPlugin";

export interface PiralInstanceWebpackPluginOptions {
    name: string;
    version: string;
    externals: Array<string>;
    variables?: Record<string, string>;
    debug?: boolean | string;
    emulator?: boolean | string;
}

export const piralInstanceWebpackConfigEnchancer = (options: PiralInstanceWebpackPluginOptions) => (
    compilerOptions
) => {
    const { name, version, debug, emulator, externals } = options;
    const environment = process.env.NODE_ENV || "development";
    const variables = {
        ...getVariables(name, version, externals, environment),
        ...options.variables,
    };

    if (debug) {
        variables.DEBUG_PIRAL = debug === true ? "1.0" : debug;
    }

    if (emulator) {
        variables.DEBUG_PILET = emulator === true ? "/$pilet-api" : emulator;
    }

    const plugins = [new DefinePlugin(getDefineVariables(variables))];

    setEnvironment(variables);

    // plugins.forEach((plugin) => plugin.apply(compiler));
    compilerOptions.plugins = [...compilerOptions.plugins, ...plugins];

    return compilerOptions;
};
