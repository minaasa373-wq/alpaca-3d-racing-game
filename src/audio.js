// audio.js
// サウンド管理モジュール。
//  - エンジン音: WebAudio で合成（ファイル不要・速度に連動）
//  - BGM: assets/bgm.mp3 を再生（ファイルが無ければ自動スキップ）
//
// ブラウザの自動再生制限があるため、最初のユーザー操作（クリック/キー）まで
// 音声は鳴らせない。init() を操作イベントの中で呼ぶこと。

const BGM_URL = '../assets/bgm.mp3';
const BGM_VOLUME = 0.45;   // BGM の音量 (0〜1)
const ENGINE_VOLUME = 0.18; // エンジン音の最大音量 (0〜1)

let audioCtx = null;
let masterGain = null;

// --- エンジン音用ノード ---
let engineOsc = null;       // メインの「ブーン」
let engineOsc2 = null;      // 倍音を足して厚みを出す
let engineGain = null;
let engineStarted = false;

// --- BGM 用 ---
let bgmElement = null;
let bgmGain = null;
let bgmSource = null;
let bgmReady = false;

let initialized = false;
let mutedState = false;

// オーディオを初期化する（ユーザー操作の中で呼ぶ）
export function initAudio() {
  if (initialized) {
    // すでに初期化済みなら、サスペンド状態だけ復帰させる
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  initialized = true;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    console.warn('WebAudio 未対応のブラウザです。音は無効になります。');
    return;
  }

  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = mutedState ? 0 : 1;
  masterGain.connect(audioCtx.destination);

  setupEngine();
  setupBgm();
}

// --- エンジン音のセットアップ ---
function setupEngine() {
  engineGain = audioCtx.createGain();
  engineGain.gain.value = 0; // 停車中は無音
  engineGain.connect(masterGain);

  // ローパスフィルタで角を取って「エンジンらしい」音にする
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  filter.connect(engineGain);

  engineOsc = audioCtx.createOscillator();
  engineOsc.type = 'sawtooth';
  engineOsc.frequency.value = 60;
  engineOsc.connect(filter);

  engineOsc2 = audioCtx.createOscillator();
  engineOsc2.type = 'square';
  engineOsc2.frequency.value = 90;
  const osc2Gain = audioCtx.createGain();
  osc2Gain.gain.value = 0.4;
  engineOsc2.connect(osc2Gain);
  osc2Gain.connect(filter);

  engineOsc.start();
  engineOsc2.start();
  engineStarted = true;
}

// 毎フレーム呼んで、速度に応じてエンジン音を更新する
//   speed: 現在の車速, maxSpeed: 最高速
export function updateEngine(speed, maxSpeed) {
  if (!engineStarted || !audioCtx) return;
  const ratio = Math.min(Math.abs(speed) / maxSpeed, 1); // 0〜1
  const now = audioCtx.currentTime;

  // 音程: アイドリング 55Hz 〜 全開 220Hz くらい
  const baseFreq = 55 + ratio * 165;
  engineOsc.frequency.setTargetAtTime(baseFreq, now, 0.05);
  engineOsc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.05);

  // 音量: 停車中も軽くアイドリング音、加速で大きく
  const targetVol = (0.35 + ratio * 0.65) * ENGINE_VOLUME;
  engineGain.gain.setTargetAtTime(targetVol, now, 0.08);
}

// --- BGM のセットアップ ---
function setupBgm() {
  bgmElement = new Audio();
  bgmElement.src = BGM_URL;
  bgmElement.loop = true;
  bgmElement.preload = 'auto';
  bgmElement.crossOrigin = 'anonymous';

  bgmElement.addEventListener('canplaythrough', () => { bgmReady = true; }, { once: true });
  bgmElement.addEventListener('error', () => {
    console.warn(`BGM ファイルが見つかりません (${BGM_URL})。BGM なしで動作します。`);
    bgmReady = false;
  });

  // WebAudio 経由で音量を masterGain にまとめる
  try {
    bgmSource = audioCtx.createMediaElementSource(bgmElement);
    bgmGain = audioCtx.createGain();
    bgmGain.gain.value = BGM_VOLUME;
    bgmSource.connect(bgmGain);
    bgmGain.connect(masterGain);
  } catch (err) {
    // createMediaElementSource が使えない場合は element 単体で鳴らす
    bgmElement.volume = BGM_VOLUME;
  }
}

// BGM 再生開始
export function playBgm() {
  if (!bgmElement) return;
  const p = bgmElement.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => { /* 自動再生ブロック時は無視。次の操作で再試行される */ });
  }
}

// BGM 停止（先頭に戻す）
export function stopBgm() {
  if (!bgmElement) return;
  bgmElement.pause();
  bgmElement.currentTime = 0;
}

// ミュート切り替え（M キーなどに割り当て可）。戻り値 = ミュート状態
export function toggleMute() {
  mutedState = !mutedState;
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(mutedState ? 0 : 1, audioCtx.currentTime, 0.02);
  }
  return mutedState;
}

export function isMuted() {
  return mutedState;
}
