const TARGET_SAMPLE_RATE = 16_000;
const MAX_RECORDING_SECONDS = 100;
const MAX_WAV_BYTES = 3_800_000;

export function encodeAudioBufferAsWav(audioBuffer) {
  if (!audioBuffer || !Number.isFinite(audioBuffer.sampleRate) || audioBuffer.sampleRate <= 0
    || !Number.isInteger(audioBuffer.numberOfChannels) || audioBuffer.numberOfChannels < 1
    || !Number.isInteger(audioBuffer.length) || audioBuffer.length < 1) {
    throw new Error('The recording could not be decoded. Please record again.');
  }

  const duration = audioBuffer.length / audioBuffer.sampleRate;
  const outputLength = Math.ceil(duration * TARGET_SAMPLE_RATE);
  const dataLength = outputLength * 2;
  if (duration > MAX_RECORDING_SECONDS || dataLength + 44 > MAX_WAV_BYTES) {
    throw new Error('Recordings must be no longer than 100 seconds. Please record a shorter clip.');
  }

  const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) => {
    const channel = audioBuffer.getChannelData(index);
    if (!channel || channel.length !== audioBuffer.length) {
      throw new Error('The recording could not be decoded. Please record again.');
    }
    return channel;
  });
  const wav = new ArrayBuffer(dataLength + 44);
  const view = new DataView(wav);
  const writeText = (offset, text) => {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, TARGET_SAMPLE_RATE, true);
  view.setUint32(28, TARGET_SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, dataLength, true);

  const ratio = audioBuffer.sampleRate / TARGET_SAMPLE_RATE;
  for (let index = 0; index < outputLength; index += 1) {
    const sourcePosition = index * ratio;
    const firstSample = Math.floor(sourcePosition);
    const secondSample = Math.min(firstSample + 1, audioBuffer.length - 1);
    const fraction = sourcePosition - firstSample;
    let sample = 0;
    for (const channel of channels) {
      sample += channel[firstSample] * (1 - fraction) + channel[secondSample] * fraction;
    }
    sample = Math.max(-1, Math.min(1, sample / channels.length));
    view.setInt16(44 + index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return new Blob([wav], { type: 'audio/wav' });
}

export async function convertRecordingToWav(recording) {
  if (!recording?.size) throw new Error('No audio was recorded. Please try again.');
  const AudioContextConstructor = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (typeof AudioContextConstructor !== 'function') {
    throw new Error('Audio conversion is not supported in this browser. Try a modern browser.');
  }

  const context = new AudioContextConstructor();
  try {
    const decoded = await context.decodeAudioData(await recording.arrayBuffer());
    return encodeAudioBufferAsWav(decoded);
  } finally {
    if (context.state !== 'closed') await context.close();
  }
}
