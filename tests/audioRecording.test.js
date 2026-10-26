import assert from 'node:assert/strict';
import test from 'node:test';
import { encodeAudioBufferAsWav } from '../src/audioRecording.js';

test('audio recordings are encoded as mono 16 kHz PCM WAV', () => {
  const audioBuffer = {
    sampleRate: 8_000,
    numberOfChannels: 2,
    length: 4,
    getChannelData(channel) {
      return channel === 0
        ? new Float32Array([0, 0.5, -0.5, 1])
        : new Float32Array([0, 0.5, -0.5, 1]);
    },
  };

  const wav = encodeAudioBufferAsWav(audioBuffer);
  assert.equal(wav.type, 'audio/wav');
  assert.equal(wav.size, 60);
  return wav.arrayBuffer().then((buffer) => {
    const view = new DataView(buffer);
    assert.equal(new TextDecoder().decode(buffer.slice(0, 4)), 'RIFF');
    assert.equal(new TextDecoder().decode(buffer.slice(8, 12)), 'WAVE');
    assert.equal(view.getUint16(20, true), 1);
    assert.equal(view.getUint16(22, true), 1);
    assert.equal(view.getUint32(24, true), 16_000);
    assert.equal(view.getUint16(34, true), 16);
    assert.equal(view.getInt16(48, true), 16_383);
    assert.equal(view.getInt16(52, true), -16_384);
  });
});

test('audio recordings that exceed the upload duration limit are rejected', () => {
  const audioBuffer = {
    sampleRate: 16_000,
    numberOfChannels: 1,
    length: 16_000 * 101,
    getChannelData: () => new Float32Array(16_000 * 101),
  };
  assert.throws(
    () => encodeAudioBufferAsWav(audioBuffer),
    /no longer than 100 seconds/i,
  );
});
