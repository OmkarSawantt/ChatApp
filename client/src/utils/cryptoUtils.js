import forge from 'node-forge';
// Generate a random AES key
const generateAESKey = () => forge.random.getBytesSync(32); // 256-bit key

// Encrypt data with AES
const encryptWithAES = (aesKey, data) => {
  const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
  const iv = forge.random.getBytesSync(16); // Initialization vector
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  return {
    encryptedData: cipher.output.toHex(), // AES-encrypted data
    iv: forge.util.encode64(iv), // IV (must be sent along with encrypted data)
  };
};

// Decrypt data with AES
const decryptWithAES = (aesKey, encryptedData, iv) => {
  const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
  decipher.start({ iv: forge.util.decode64(iv) });
  decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedData)));
  const result = decipher.finish();
  if (result) return decipher.output.toString();
  throw new Error('AES decryption failed');
};

// Encrypt the AES key with RSA
const encryptAESKeyWithRSA = (PublicKey, aesKey) => {
  const publicKey = forge.pki.publicKeyFromPem(PublicKey);
  return forge.util.encode64(publicKey.encrypt(aesKey)); // RSA-encrypted AES key
};

// Decrypt the AES key with RSA
const decryptAESKeyWithRSA = (PrivateKey, encryptedAESKey) => {
  try {
    const privateKey = forge.pki.privateKeyFromPem(PrivateKey);
    return privateKey.decrypt(forge.util.decode64(encryptedAESKey)); // Original AES key
  } catch (error) {
    console.log(error);
  }
};

// Example: Encrypting a Base64 image
export const encryptLargeMessage = (PublicKey, base64Image) => {
  if (!base64Image) return "";
  const aesKey = generateAESKey(); // Generate AES key
  const { encryptedData, iv } = encryptWithAES(aesKey, base64Image); // AES-encrypt the image
  const encryptedAESKey = encryptAESKeyWithRSA(PublicKey, aesKey); // RSA-encrypt the AES key
  return { encryptedAESKey, encryptedData, iv }; // Return all encrypted components
};

// Example: Decrypting the Base64 image
export const decryptLargeMessage = (PrivateKey, { encryptedAESKey, encryptedData, iv }) => {
  try {
    if (encryptedAESKey === undefined || encryptedData === undefined || iv === undefined) {
      return '';
    }
    const aesKey = decryptAESKeyWithRSA(PrivateKey, encryptedAESKey);
    return decryptWithAES(aesKey, encryptedData, iv);
  } catch (error) {
    console.log(error)
  }
};
