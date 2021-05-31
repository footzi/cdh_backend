export const STREAM_CONFIG = {
  logType: 3,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: process.env.STREAM_PORT,
    allow_origin: '*',
    mediaroot: './media',
  },
  trans: {
    ffmpeg: process.env.STREAM_FFMPEG_PATH,
    tasks: [
      {
        app: 'stream',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
      },
    ],
  },
  relay: {
    ffmpeg: process.env.STREAM_FFMPEG_PATH,
    tasks: [
      {
        app: 'stream',
        mode: 'static',
        edge: process.env.STREAM_CAM_1_LINK,
        name: process.env.STREAM_CAM_1_NAME,
        rtsp_transport: 'tcp',
      }
    ],
  },
};
