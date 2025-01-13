/* eslint-disable no-restricted-globals */
import { encryptLargeMessage, decryptLargeMessage } from './cryptoUtils';

self.onmessage = async (event) => {
  const { type, key, data } = event.data;

  try {
    if (type === 'encrypt') {
      const encryptedData = await encryptLargeMessage(key, data);
      self.postMessage({ type: 'encrypt', result: encryptedData });
    } else if (type === 'decrypt') {
      const decryptedData = await decryptLargeMessage(key, data);
      self.postMessage({ type: 'decrypt', result: decryptedData });
    }
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};