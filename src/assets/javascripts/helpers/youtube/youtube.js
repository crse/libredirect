"use strict";

window.browser = window.browser || window.chrome;

import commonHelper from '../common.js'
import {
  youtubeListen, getYoutubeListen,
  invidiousQuality, getInvidiousQuality,
  invidiousAlwaysProxy, getInvidiousAlwaysProxy,
  invidiousPlayerStyle, getInvidiousPlayerStyle,
  invidiousVideoLoop, getInvidiousVideoLoop,
  invidiousContinueAutoplay, getInvidiousContinueAutoplay,
  invidiousContinue, getInvidiousContinue,
  invidiousSpeed, getInvidiousSpeed,
  invidiousQualityDash, getInvidiousQualityDash,
  invidiousComments, getInvidiousComments,
  invidiousCaptions, getInvidiousCaptions,
  invidiousRelatedVideos, getInvidiousRelatedVideos,
  invidiousAnnotations, getInvidiousAnnotations,
  invidiousExtendDesc, getInvidiousExtendDesc,
  invidiousVrMode, getInvidiousVrMode,
  invidiousSavePlayerPos, getInvidiousSavePlayerPos,
  invidiousRegion, getInvidiousRegion,
  invidiousDarkMode, getInvidiousDarkMode,
  invidiousThinMode, getInvidiousThinMode,
  invidiousDefaultHome, getInvidiousDefaultHome,
  invidiousFeedMenuList, getInvidiousFeedMenuList,
  getPipedBufferGoal,
  getPipedComments,
  getPipedDisableLBRY,
  getPipedEnabledCodecs,
  getPipedHomepage,
  getPipedMinimizeDescription,
  getPipedProxyLBRY,
  getPipedQuality,
  getPipedRegion,
  getPipedSelectedSkip,
  getPipedSponsorblock,
  getPipedDdlTheme,
  getPipedWatchHistory,
  volume, getVolume, setVolume,
  youtubeAutoplay, getAutoplay, setAutoplay,
  getPipedMaterialSkipToLastPoint,
  initOptions
} from './options.js';

const targets = [
  /^https?:\/{2}(www\.|music\.|m\.|)youtube\.com(\/.*|$)/,

  /^https?:\/{2}img\.youtube\.com\/vi\/.*\/..*/, // https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
  /^https?:\/{2}(i|s)\.ytimg\.com\/vi\/.*\/..*/,

  /^https?:\/{2}(www\.|music\.|)youtube\.com\/watch\?v\=..*/,

  /^https?:\/{2}youtu\.be\/..*/,

  /^https?:\/{2}(www\.|)(youtube|youtube-nocookie)\.com\/embed\/..*/,
];
let redirects = {
  "invidious": {
    "normal": [],
    "tor": []
  },
  "piped": {
    "normal": [
      "https://piped.kavin.rocks",
      "https://piped.silkky.cloud",
      "https://piped.tokhmi.xyz",
      "https://piped.moomoo.me",
      "https://il.ax",
      "https://piped.syncpundit.com",
      "https://piped.mha.fi",
      "https://piped.mint.lgbt",
      "https://piped.privacy.com.de",
      "https://piped.notyourcomputer.net"
    ],
    "tor": [
      "http://piped2bbch4xslbl2ckr6k62q56kon56ffowxaqzy42ai22a4sash3ad.onion"
    ]
  },
  "pipedMaterial": {
    "normal": [
      "https://piped-material.xn--17b.net",
      "https://piped-material.ftp.sh",
    ],
    "tor": []
  }
};

const getRedirects = () => redirects;

function getCustomRedirects() {
  return {
    "invidious": {
      "normal": [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects],
      "tor": [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects]
    },
    "piped": {
      "normal": [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects],
      "tor": [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects]
    }
  };
};

async function setYoutubeSettings(val) {
  return new Promise(
    resolve => {
      browser.storage.local.set(val).then(resolve);
    }
  )

}

function setInvidiousRedirects(val) {
  redirects.invidious = val;
  browser.storage.local.set({ youtubeRedirects: redirects })
  console.log("invidiousRedirects: ", val)
}

let invidiousNormalRedirectsChecks;
const getInvidiousNormalRedirectsChecks = () => invidiousNormalRedirectsChecks;
function setInvidiousNormalRedirectsChecks(val) {
  invidiousNormalRedirectsChecks = val;
  browser.storage.local.set({ invidiousNormalRedirectsChecks })
  console.log("invidiousNormalRedirectsChecks: ", val)
}

let invidiousNormalCustomRedirects = [];
const getInvidiousNormalCustomRedirects = () => invidiousNormalCustomRedirects;
function setInvidiousNormalCustomRedirects(val) {
  invidiousNormalCustomRedirects = val;
  browser.storage.local.set({ invidiousNormalCustomRedirects })
  console.log("invidiousNormalCustomRedirects: ", val)
}

let invidiousTorRedirectsChecks;
const getInvidiousTorRedirectsChecks = () => invidiousTorRedirectsChecks;
function setInvidiousTorRedirectsChecks(val) {
  invidiousTorRedirectsChecks = val;
  browser.storage.local.set({ invidiousTorRedirectsChecks })
  console.log("invidiousTorRedirectsChecks: ", val)
}

let invidiousTorCustomRedirects = [];
const getInvidiousTorCustomRedirects = () => invidiousTorCustomRedirects;
function setInvidiousTorCustomRedirects(val) {
  invidiousTorCustomRedirects = val;
  browser.storage.local.set({ invidiousTorCustomRedirects })
  console.log("invidiousTorCustomRedirects: ", val)
}

let pipedNormalRedirectsChecks;
const getPipedNormalRedirectsChecks = () => pipedNormalRedirectsChecks;
function setPipedNormalRedirectsChecks(val) {
  pipedNormalRedirectsChecks = val;
  browser.storage.local.set({ pipedNormalRedirectsChecks })
  console.log("pipedNormalRedirectsChecks: ", val)
}

let pipedNormalCustomRedirects = [];
const getPipedNormalCustomRedirects = () => pipedNormalCustomRedirects;
function setPipedNormalCustomRedirects(val) {
  pipedNormalCustomRedirects = val;
  browser.storage.local.set({ pipedNormalCustomRedirects })
  console.log("pipedNormalCustomRedirects: ", val)
}

let pipedTorRedirectsChecks;
const getPipedTorRedirectsChecks = () => pipedTorRedirectsChecks;
function setPipedTorRedirectsChecks(val) {
  pipedTorRedirectsChecks = val;
  browser.storage.local.set({ pipedTorRedirectsChecks })
  console.log("pipedTorRedirectsChecks: ", val)
}

let pipedTorCustomRedirects = [];
const getPipedTorCustomRedirects = () => pipedTorCustomRedirects;
function setPipedTorCustomRedirects(val) {
  pipedTorCustomRedirects = val;
  browser.storage.local.set({ pipedTorCustomRedirects })
  console.log("pipedTorCustomRedirects: ", val)
}

function setPipedRedirects(val) {
  redirects.piped = val;
  browser.storage.local.set({ youtubeRedirects: redirects })
  console.log("pipedRedirects: ", val)
}

let pipedMaterialNormalRedirectsChecks;
const getPipedMaterialNormalRedirectsChecks = () => pipedMaterialNormalRedirectsChecks;
function setPipedMaterialNormalRedirectsChecks(val) {
  pipedMaterialNormalRedirectsChecks = val;
  browser.storage.local.set({ pipedMaterialNormalRedirectsChecks })
  console.log("pipedMaterialNormalRedirectsChecks: ", val)
}

let pipedMaterialNormalCustomRedirects = [];
const getPipedMaterialNormalCustomRedirects = () => pipedMaterialNormalCustomRedirects;
function setPipedMaterialNormalCustomRedirects(val) {
  pipedMaterialNormalCustomRedirects = val;
  browser.storage.local.set({ pipedMaterialNormalCustomRedirects })
  console.log("pipedMaterialNormalCustomRedirects: ", val)
}

let pipedMaterialTorRedirectsChecks;
const getPipedMaterialTorRedirectsChecks = () => pipedMaterialTorRedirectsChecks;
function setPipedMaterialTorRedirectsChecks(val) {
  pipedMaterialTorRedirectsChecks = val;
  browser.storage.local.set({ pipedMaterialTorRedirectsChecks })
  console.log("pipedMaterialTorRedirectsChecks: ", val)
}

let pipedMaterialTorCustomRedirects = [];
const getPipedMaterialTorCustomRedirects = () => pipedMaterialTorCustomRedirects;
function setPipedMaterialTorCustomRedirects(val) {
  pipedMaterialTorCustomRedirects = val;
  browser.storage.local.set({ pipedMaterialTorCustomRedirects })
  console.log("pipedMaterialTorCustomRedirects: ", val)
}

function setPipedMaterialRedirects(val) {
  redirects.pipedMaterial = val;
  browser.storage.local.set({ youtubeRedirects: redirects })
  console.log("pipedMaterialRedirects: ", val)
}

let disable;
const getDisable = () => disable;
function setDisable(val) {
  disable = val;
  browser.storage.local.set({ disableYoutube: disable })
  console.log("disableYoutube: ", disable)
}

let enableCustomSettings;
const getEnableCustomSettings = () => enableCustomSettings;
let protocol;
const getProtocol = () => protocol;
let OnlyEmbeddedVideo;
const getOnlyEmbeddedVideo = () => OnlyEmbeddedVideo;
let frontend;
const getFrontend = () => frontend;
let youtubeEmbedFrontend;
const getYoutubeEmbedFrontend = () => youtubeEmbedFrontend;
let bypassWatchOnYoutube;
const getBypassWatchOnYoutube = () => bypassWatchOnYoutube;

let alwaysUsePreferred;
function redirect(url, details, initiator) {
  if (disable) return null;

  let protocolHost = commonHelper.protocolHost(url);

  let isInvidious = [
    ...redirects.invidious.normal,
    ...redirects.invidious.tor
  ].includes(protocolHost);

  let isCheckedInvidious = [
    ...invidiousNormalRedirectsChecks,
    ...invidiousNormalCustomRedirects,
    ...invidiousTorRedirectsChecks,
    ...invidiousTorCustomRedirects,
  ].includes(protocolHost);

  let isPiped = [
    ...redirects.piped.normal,
    ...redirects.piped.tor
  ].includes(protocolHost);

  let isCheckedPiped = [
    ...pipedNormalRedirectsChecks,
    ...pipedNormalCustomRedirects,
    ...pipedTorRedirectsChecks,
    ...pipedTorCustomRedirects,
  ].includes(protocolHost)

  if (
    alwaysUsePreferred && frontend == 'invidious' &&
    (isInvidious || isPiped) && !isCheckedInvidious
  ) return switchInstance(url);

  if (
    alwaysUsePreferred && frontend == 'piped' &&
    (isInvidious || isPiped) && !isCheckedPiped
  ) return switchInstance(url);

  if (!targets.some(rx => rx.test(url.href))) return null;

  if (
    bypassWatchOnYoutube &&
    initiator && (
      [...redirects.invidious.normal,
      ...invidiousNormalCustomRedirects,
      ...redirects.invidious.tor,
      ...invidiousTorCustomRedirects,

      ...redirects.piped.normal,
      ...redirects.piped.tor,
      ...pipedNormalCustomRedirects,
      ...pipedTorCustomRedirects
      ].includes(initiator.origin)
    )
  ) return 'BYPASSTAB';

  if (url.pathname.match(/iframe_api/) || url.pathname.match(/www-widgetapi/)) return null; // Don't redirect YouTube Player API.

  if (frontend == 'yatte' && details.type === "main_frame")
    return url.href.replace(/^https?:\/{2}/, 'yattee://');

  else if (frontend == 'freetube' && details.type === "main_frame")
    return `freetube://${url}`;

  else if (frontend == 'freetube' && details.type !== "main_frame" && youtubeEmbedFrontend == "youtube")
    return null;

  else if (
    frontend == 'invidious' ||
    ((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'invidious' && details.type == "sub_frame")
  ) {

    if (OnlyEmbeddedVideo == 'onlyEmbedded' && details.type !== "sub_frame") return null;
    if (
      OnlyEmbeddedVideo == 'onlyNotEmbedded' && details.type !== "main_frame" &&
      !((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'invidious' && details.type === "sub_frame")
    ) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;

  } else if (
    frontend == 'piped' ||
    ((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'piped' && details.type === "sub_frame")
  ) {

    if (OnlyEmbeddedVideo == 'onlyEmbedded' && details.type !== "sub_frame") return null;
    if (
      OnlyEmbeddedVideo == 'onlyNotEmbedded' && details.type !== "main_frame" &&
      !((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'piped' && details.type == "sub_frame")
    ) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
    if (instancesList.length === 0) return null;
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;
  }
  else if (frontend == 'pipedMaterial' ||
    ((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'pipedMaterial' && details.type === "sub_frame")) {
    if (OnlyEmbeddedVideo == 'onlyEmbedded' && details.type !== "sub_frame") return null;
    if (
      OnlyEmbeddedVideo == 'onlyNotEmbedded' && details.type !== "main_frame" &&
      !((frontend == 'freetube' || frontend == 'yatte') && youtubeEmbedFrontend == 'pipedMaterial' && details.type == "sub_frame")
    ) return null;

    let instancesList;
    if (protocol == 'normal') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
    let randomInstance = commonHelper.getRandomInstance(instancesList);

    return `${randomInstance}${url.pathname}${url.search}`;
  }
  return 'CANCEL';
}

function reverse(url) {
  let protocolHost = commonHelper.protocolHost(url);

  if (![
    ...redirects.invidious.normal,
    ...redirects.invidious.tor,
    ...invidiousNormalCustomRedirects,
    ...invidiousTorCustomRedirects,
    ...redirects.piped.normal,
    ...redirects.piped.tor,
    ...pipedNormalCustomRedirects,
    ...pipedTorCustomRedirects,
  ].includes(protocolHost)) return;

  return `https://youtube.com${url.pathname}${url.search}`;
}

function switchInstance(url) {
  let protocolHost = commonHelper.protocolHost(url);
  if (
    protocol == 'normal' &&
    ![
      ...redirects.invidious.normal,
      ...redirects.piped.normal,
      ...redirects.pipedMaterial.normal,

      ...invidiousNormalCustomRedirects,
      ...pipedNormalCustomRedirects,
      ...pipedMaterialNormalCustomRedirects
    ].includes(protocolHost)
  ) return null;

  if (protocol == 'tor' &&
    ![
      ...redirects.invidious.tor,
      ...redirects.piped.tor,
      ...redirects.pipedMaterial.tor,

      ...invidiousTorCustomRedirects,
      ...pipedTorCustomRedirects,
      ...pipedMaterialTorCustomRedirects
    ].includes(protocolHost)
  ) return null;

  let instancesList;
  if (frontend == 'invidious') {
    if (protocol == 'normal') instancesList = [...invidiousNormalRedirectsChecks, ...invidiousNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...invidiousTorRedirectsChecks, ...invidiousTorCustomRedirects];
  }
  else if (frontend == 'piped') {
    if (protocol == 'normal') instancesList = [...pipedNormalRedirectsChecks, ...pipedNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedTorRedirectsChecks, ...pipedTorCustomRedirects];
  }
  else if (frontend == 'pipedMaterial') {
    if (protocol == 'normal') instancesList = [...pipedMaterialNormalRedirectsChecks, ...pipedMaterialNormalCustomRedirects];
    else if (protocol == 'tor') instancesList = [...pipedMaterialTorRedirectsChecks, ...pipedMaterialTorCustomRedirects];
  }
  else return null;

  console.log("instancesList", instancesList);
  let index = instancesList.indexOf(protocolHost);
  if (index > -1) instancesList.splice(index, 1);

  if (instancesList.length === 0) return null;
  let randomInstance = commonHelper.getRandomInstance(instancesList);
  return `${randomInstance}${url.pathname}${url.search}`;
}

function isPipedorInvidious(url, type, frontend) {
  let protocolHost = commonHelper.protocolHost(url);

  if (type !== "main_frame" && type !== "sub_frame") return false;

  if (frontend == 'invidious')
    return [
      ...redirects.invidious.normal,
      ...redirects.invidious.tor,
      ...invidiousNormalCustomRedirects,
      ...invidiousTorCustomRedirects,
    ].includes(protocolHost);

  if (frontend == 'piped')
    return [
      ...redirects.piped.normal,
      ...redirects.piped.tor,
      ...pipedNormalCustomRedirects,
      ...pipedTorCustomRedirects,
    ].includes(protocolHost);

  if (frontend == 'pipedMaterial')
    return [
      ...redirects.pipedMaterial.normal,
      ...redirects.pipedMaterial.tor,
      ...pipedMaterialNormalCustomRedirects,
      ...pipedMaterialTorCustomRedirects,
    ].includes(protocolHost);

  return [
    ...redirects.invidious.normal,
    ...redirects.invidious.tor,
    ...invidiousNormalCustomRedirects,
    ...invidiousTorCustomRedirects,

    ...redirects.piped.normal,
    ...redirects.piped.tor,
    ...pipedNormalCustomRedirects,
    ...pipedTorCustomRedirects,
  ].includes(protocolHost);
}

function initPipedLocalStorage(tabId) {
  if (!disable && frontend == 'piped' && enableCustomSettings)
    browser.tabs.executeScript(
      tabId,
      {
        file: "/assets/javascripts/helpers/youtube/piped-preferences.js",
        runAt: "document_start"
      }
    );
}

function initPipedMaterialLocalStorage(tabId) {
  if (!disable && frontend == 'pipedMaterial' && enableCustomSettings)
    browser.tabs.executeScript(
      tabId,
      {
        file: "/assets/javascripts/helpers/youtube/pipedMaterial-preferences.js",
        runAt: "document_start"
      }
    );
}

function initInvidiousCookies() {
  if (!disable && frontend == 'invidious' && enableCustomSettings) {
    let checkedInstances = [
      ...invidiousNormalRedirectsChecks,
      ...invidiousNormalCustomRedirects,
      ...invidiousTorRedirectsChecks,
      ...invidiousTorCustomRedirects,
    ];
    for (const instanceUrl of checkedInstances)
      browser.cookies.get(
        {
          url: instanceUrl,
          name: "PREFS",
        },
        cookie => {
          let prefs = {};
          if (cookie) {
            prefs = JSON.parse(decodeURIComponent(cookie.value));
            browser.cookies.remove({ url: instanceUrl, name: "PREFS" });
          }

          prefs.local = invidiousAlwaysProxy;
          prefs.video_loop = invidiousVideoLoop;
          prefs.continue_autoplay = invidiousContinueAutoplay;
          prefs.continue = invidiousContinue;
          prefs.listen = youtubeListen;
          prefs.speed = parseFloat(invidiousSpeed);
          prefs.quality = invidiousQuality;
          prefs.quality_dash = invidiousQualityDash;

          prefs.comments = invidiousComments;
          prefs.captions = invidiousCaptions;

          prefs.related_videos = invidiousRelatedVideos;
          prefs.annotations = invidiousAnnotations
          prefs.extend_desc = invidiousExtendDesc;
          prefs.vr_mode = invidiousVrMode;
          prefs.save_player_pos = invidiousSavePlayerPos;

          prefs.volume = parseInt(volume);
          prefs.player_style = invidiousPlayerStyle;
          prefs.autoplay = youtubeAutoplay;

          prefs.region = invidiousRegion;
          prefs.dark_mode = invidiousDarkMode;
          prefs.thin_mode = invidiousThinMode;
          prefs.default_home = invidiousDefaultHome;
          prefs.feed_menu = invidiousFeedMenuList;

          browser.cookies.set({
            url: instanceUrl,
            name: "PREFS",
            value: encodeURIComponent(JSON.stringify(prefs))
          })
        }
      )
  }
}

let theme;
async function init() {
  await initOptions();
  return new Promise(
    resolve => {
      fetch('/instances/data.json').then(response => response.text()).then(data => {
        let dataJson = JSON.parse(data);
        browser.storage.local.get(
          [
            "theme",
            "disableYoutube",
            "enableYoutubeCustomSettings",
            "OnlyEmbeddedVideo",
            "youtubeRedirects",
            "youtubeFrontend",

            "invidiousNormalRedirectsChecks",
            "invidiousNormalCustomRedirects",

            "invidiousTorRedirectsChecks",
            "invidiousTorCustomRedirects",

            "pipedNormalRedirectsChecks",
            "pipedNormalCustomRedirects",

            "pipedMaterialNormalRedirectsChecks",
            "pipedMaterialNormalCustomRedirects",

            "pipedMaterialTorRedirectsChecks",
            "pipedMaterialTorCustomRedirects",

            "pipedTorRedirectsChecks",
            "pipedTorCustomRedirects",
            "alwaysUsePreferred",
            "youtubeEmbedFrontend",

            "youtubeProtocol",

            "bypassWatchOnYoutube"
          ],
          r => {
            redirects.invidious = dataJson.invidious;
            if (r.youtubeRedirects) redirects = r.youtubeRedirects;

            disable = r.disableYoutube ?? false;
            enableCustomSettings = r.enableYoutubeCustomSettings ?? false;
            protocol = r.youtubeProtocol ?? 'normal';
            frontend = r.youtubeFrontend ?? 'invidious';
            youtubeEmbedFrontend = r.youtubeEmbedFrontend ?? 'invidious';

            theme = r.theme ?? 'dark';

            OnlyEmbeddedVideo = r.OnlyEmbeddedVideo ?? 'both';

            invidiousNormalRedirectsChecks = r.invidiousNormalRedirectsChecks ?? [...redirects.invidious.normal];
            invidiousNormalCustomRedirects = r.invidiousNormalCustomRedirects ?? [];

            invidiousTorRedirectsChecks = r.invidiousTorRedirectsChecks ?? [...redirects.invidious.tor];
            invidiousTorCustomRedirects = r.invidiousTorCustomRedirects ?? [];

            pipedNormalRedirectsChecks = r.pipedNormalRedirectsChecks ?? [...redirects.piped.normal];
            pipedNormalCustomRedirects = r.pipedNormalCustomRedirects ?? [];

            pipedTorRedirectsChecks = r.pipedTorRedirectsChecks ?? [...redirects.piped.tor];
            pipedTorCustomRedirects = r.pipedTorCustomRedirects ?? [];

            pipedMaterialNormalRedirectsChecks = r.pipedMaterialNormalRedirectsChecks ?? [...redirects.pipedMaterial.normal];
            pipedMaterialNormalCustomRedirects = r.pipedMaterialNormalCustomRedirects ?? [];

            pipedMaterialTorRedirectsChecks = r.pipedMaterialTorRedirectsChecks ?? [...redirects.pipedMaterial.tor];
            pipedMaterialTorCustomRedirects = r.pipedMaterialTorCustomRedirects ?? [];

            alwaysUsePreferred = r.alwaysUsePreferred ?? false;

            bypassWatchOnYoutube = r.bypassWatchOnYoutube ?? true;

            initInvidiousCookies();

            resolve();

          });
      });
    })
}

export default {
  setYoutubeSettings,
  getBypassWatchOnYoutube,
  initPipedLocalStorage,
  initPipedMaterialLocalStorage,
  getFrontend,
  getYoutubeEmbedFrontend,
  getRedirects,
  getCustomRedirects,
  setInvidiousRedirects,
  setPipedRedirects,
  redirect,
  switchInstance,
  isPipedorInvidious,
  initInvidiousCookies,
  getInvidiousAlwaysProxy,
  getInvidiousQuality,
  getInvidiousPlayerStyle,
  getInvidiousVideoLoop,
  getInvidiousRegion,
  getInvidiousDarkMode,
  getInvidiousThinMode,
  getInvidiousDefaultHome,
  getInvidiousFeedMenuList,

  getDisable,
  setDisable,

  reverse,

  getEnableCustomSettings,
  getProtocol,
  getOnlyEmbeddedVideo,
  setVolume,
  getVolume,
  setAutoplay,
  getAutoplay,
  getInvidiousContinueAutoplay,
  getInvidiousContinue,
  getYoutubeListen,
  getInvidiousSpeed,
  getInvidiousQualityDash,
  getInvidiousComments,
  getInvidiousCaptions,
  getInvidiousRelatedVideos,
  getInvidiousAnnotations,
  getInvidiousExtendDesc,
  getInvidiousVrMode,
  getInvidiousSavePlayerPos,
  getPipedBufferGoal,
  getPipedComments,
  getPipedDisableLBRY,
  getPipedEnabledCodecs,
  getPipedHomepage,
  getPipedMinimizeDescription,
  getPipedProxyLBRY,
  getPipedQuality,
  getPipedRegion,
  getPipedSelectedSkip,
  getPipedSponsorblock,
  getPipedDdlTheme,
  getPipedWatchHistory,
  getPipedMaterialSkipToLastPoint,

  getInvidiousNormalRedirectsChecks,
  setInvidiousNormalRedirectsChecks,

  getInvidiousNormalCustomRedirects,
  setInvidiousNormalCustomRedirects,

  getPipedNormalRedirectsChecks,
  setPipedNormalRedirectsChecks,

  getPipedNormalCustomRedirects,
  setPipedNormalCustomRedirects,

  getInvidiousTorRedirectsChecks,
  setInvidiousTorRedirectsChecks,

  getInvidiousTorCustomRedirects,
  setInvidiousTorCustomRedirects,

  getPipedTorRedirectsChecks,
  setPipedTorRedirectsChecks,

  getPipedTorCustomRedirects,
  setPipedTorCustomRedirects,

  getPipedMaterialNormalRedirectsChecks,
  setPipedMaterialNormalRedirectsChecks,

  getPipedMaterialNormalCustomRedirects,
  setPipedMaterialNormalCustomRedirects,

  getPipedMaterialTorRedirectsChecks,
  setPipedMaterialTorRedirectsChecks,

  getPipedMaterialTorCustomRedirects,
  setPipedMaterialTorCustomRedirects,

  setPipedMaterialRedirects,

  init,
};
