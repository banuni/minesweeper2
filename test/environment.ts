import * as testkit from 'wix-bootstrap-testkit';
import * as configEmitter from 'wix-config-emitter';

export const app = bootstrapServer();

export function beforeAndAfter(board= [[]]) {
  before(() => emitConfigs(board));
  app.beforeAndAfter();
}

function emitConfigs(board: Array<any>[]) {
  return configEmitter({sourceFolders: ['./templates'], targetFolder: './target/configs'})
    .fn('scripts_domain', 'static.parastorage.com')
    .fn('static_url', 'com.wixpress.minesweeper2', 'http://localhost:3200/')
    .emit();
}

function bootstrapServer() {
  return testkit.app('./index', {
    env: {
      PORT: 3100,
      MANAGEMENT_PORT: 3104,
      NEW_RELIC_LOG_LEVEL: 'warn',
      DEBUG: ''
    }
  });
}
