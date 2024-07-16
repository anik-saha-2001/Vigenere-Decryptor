import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [key, setKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/encrypt");
        const { key, encrypted_text } = response.data;
        setKey(key);
        setEncryptedText(encrypted_text);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const decryptVigenere = (cipherText, key) => {
    const A_CODE = 65; // ASCII code for 'A'
    const ALPHABET_LENGTH = 26;

    const normalizeText = (text) => {
      return text.toUpperCase().replace(/[^A-Z]/g, "");
    };

    let normalizedCipherText = normalizeText(cipherText);
    let normalizedKey = normalizeText(key);

    let extendedKey = normalizedKey
      .repeat(Math.ceil(normalizedCipherText.length / normalizedKey.length))
      .slice(0, normalizedCipherText.length);

    let decryptedMessage = "";

    for (let i = 0; i < normalizedCipherText.length; i++) {
      let cipherChar = normalizedCipherText.charCodeAt(i) - A_CODE;
      let keyChar = extendedKey.charCodeAt(i) - A_CODE;
      let decryptedChar =
        (cipherChar - keyChar + ALPHABET_LENGTH) % ALPHABET_LENGTH;

      decryptedMessage += String.fromCharCode(decryptedChar + A_CODE);
    }

    return decryptedMessage;
  };

  const handleDecrypt = () => {
    const decrypted = decryptVigenere(encryptedText, key);
    setDecryptedText(decrypted);
  };

  return (
    <div>
      <h2>Encrypted Text:</h2>
      <p>{encryptedText}</p>
      <h2>Key:</h2>
      <p>{key}</p>
      <button onClick={handleDecrypt}>Decrypt</button>
      <h2>Decrypted Text:</h2>
      <p>{decryptedText}</p>
    </div>
  );
};

export default App;
