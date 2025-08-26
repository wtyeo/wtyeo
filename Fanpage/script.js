
document.addEventListener('DOMContentLoaded', () => {
  // Pause other YouTube iframes when a new one starts playing
  const iframes = Array.from(document.querySelectorAll('iframe'));
  window.addEventListener('message', (e) => {
    // YouTube postMessage events include 'data' with event info as JSON
    // We'll attempt to detect 'play' events; it's imperfect but works for embeds with enablejsapi=1
    try {
      const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (data && data.event === 'infoDelivery' && data.info && data.info.playerState === 1) {
        // a player started playing; pause others using postMessage via player API
        iframes.forEach(frame => {
          if (frame.contentWindow !== e.source) {
            // send pause command
            frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
          }
        });
      }
    } catch (err) {
      // ignore parsing errors
    }
  });
});
