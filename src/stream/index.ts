import { STREAM_CONFIG } from '../config/stream';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodeMediaServer = require('node-media-server');

export class Stream {
  start() {
    const nms = new NodeMediaServer(STREAM_CONFIG);
    nms.run();
  }
}