/* eslint-disable global-require */
import path from 'path';
import hasDependency from '../hasDependency';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'react-native' ||
    (!options.framework && hasDependency('@storybook/react-native'))
  );
}

function configure(options: StoryshotsOptions, storybook: any) {
  const { configPath = 'storybook', config } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const resolvedConfigPath = path.resolve(configPath);
  jest.requireActual(resolvedConfigPath);
}

function load(options: StoryshotsOptions) {
  const storybook = jest.requireActual('@storybook/react-native');
  const clientAPI = jest.requireActual('@storybook/client-api');

  const api = {
    ...clientAPI,
    ...storybook,
  };

  configure(options, api);

  return {
    renderTree: require('../react/renderTree').default,
    renderShallowTree: require('../react/renderShallowTree').default,
    framework: 'react-native' as const,
    storybook: api,
  };
}

const reactNativeLoader: Loader = {
  load,
  test,
};

export default reactNativeLoader;
