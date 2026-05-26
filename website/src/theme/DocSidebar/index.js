/* eslint-disable */
import { useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import OriginalDocSidebar from '@theme-original/DocSidebar';

let scriptPromise = null;

async function loadEthicalAdsScript() {
  let script = document.getElementById('ethical-script');

  if (!script) {
    script = document.createElement('script');
    script.id = 'ethical-script';
    script.src = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
    script.async = true;
    document.head.appendChild(script);

    scriptPromise = (async () => {
      while (typeof ethicalads === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return (await ethicalads.wait) || [];
    })();
  }

  return scriptPromise || Promise.resolve([]);
}

function createEthicalAdsBlock(root) {
  const banner = document.createElement('div');

  banner.className = 'eab flat horizontal bwndw-loading';
  banner.id = 'bwndw';
  banner.setAttribute('data-ea-publisher', 'react-chartjs-2jsorg');
  banner.setAttribute('data-ea-type', 'image');

  root?.appendChild(banner);

  if (typeof ethicalads !== 'undefined') {
    ethicalads.load();
  }

  return banner;
}

function setColorMode(banner, colorMode) {
  banner?.classList.toggle('dark', colorMode === 'dark');
}

export default function DocSidebar(props) {
  const bannerRef = useRef();
  const { colorMode } = useColorMode();
  const colorModeRef = useRef(colorMode);

  colorModeRef.current = colorMode;

  useEffect(() => {
    if (!document.getElementById('bwndw')) {
      const root = document.querySelector(
        '.theme-doc-sidebar-menu'
      )?.parentElement;
      let banner;
      const showBanner = () => {
        setColorMode(banner, colorModeRef.current);
        bannerRef.current = banner;
        banner.classList.remove('bwndw-loading');
      };

      banner = createEthicalAdsBlock(root);

      loadEthicalAdsScript().then(showBanner);
    }
  }, []);

  useEffect(() => {
    setColorMode(bannerRef.current, colorMode);
  }, [colorMode]);

  return <OriginalDocSidebar {...props} />;
}
