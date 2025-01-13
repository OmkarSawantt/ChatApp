import crypto from "crypto";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");
const IV = process.env.IV || crypto.randomBytes(16).toString("hex");


export const generateKeyPair=() =>{
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // Length of the key
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
}

export const encryptData = (data) => {
  try {
      const cipher = crypto.createCipheriv(
          "aes-256-cbc",
          Buffer.from(ENCRYPTION_KEY, "hex"),
          Buffer.from(IV, "hex")
      );
      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
  } catch (error) {
      throw new Error("Encryption failed: " + error.message);
  }
};

export const decryptData = (encryptedData) => {
  try {
      const decipher = crypto.createDecipheriv(
          "aes-256-cbc",
          Buffer.from(ENCRYPTION_KEY, "hex"),
          Buffer.from(IV, "hex")
      );
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
  } catch (error) {
      throw new Error("Decryption failed: " + error.message);
  }
};