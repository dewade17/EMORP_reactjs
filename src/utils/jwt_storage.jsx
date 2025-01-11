import { EncryptStorage } from 'encrypt-storage';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi

const SECRET_KEY = import.meta.env.VITE_REACT_APP_SECRET_KEY_STORE;
if (!SECRET_KEY) {
  throw new Error('Missing SECRET_KEY environment variable. Please set it in .env');
}
const storage = new EncryptStorage(SECRET_KEY);
const token_auth = 'token_auth';
const expiration_key = 'token_expiration';

export const jwtStorage = {
  /**
   * Menyimpan token bersama waktu kedaluwarsa
   * @param {string} token - JWT token yang akan disimpan
   * @param {number} expires_in - Waktu kedaluwarsa dalam detik
   */
  async storeToken(token, expires_in) {
    try {
      const expirationTime = Date.now() + expires_in * 1000; // Menghitung waktu kedaluwarsa dalam milidetik
      await storage.setItem(token_auth, token);
      await storage.setItem(expiration_key, expirationTime); // Menyimpan waktu kedaluwarsa
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  },

  /**
   * Mengambil token dan memeriksa apakah token sudah kedaluwarsa
   * @param {function} navigate - Fungsi navigate dari react-router-dom untuk mengarahkan ke halaman lain
   * @returns {string|null} - Token jika masih valid, atau null jika sudah kedaluwarsa
   */
  async retrieveToken(navigate) {
    try {
      const token = await storage.getItem(token_auth);
      const expirationTime = await storage.getItem(expiration_key);

      if (token && expirationTime) {
        const currentTime = Date.now();
        // Memeriksa apakah token sudah kedaluwarsa
        if (currentTime > expirationTime) {
          await this.removeItem(); // Menghapus token jika kedaluwarsa
          navigate('/dashboard-customer'); // Mengarahkan ke halaman login
          return null;
        }
        return token; // Token masih valid
      }
      return null; // Token atau expirationTime tidak ditemukan
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  /**
   * Menghapus token dan waktu kedaluwarsa dari penyimpanan
   */
  async removeItem() {
    try {
      await storage.removeItem(token_auth);
      await storage.removeItem(expiration_key); // Menghapus waktu kedaluwarsa
    } catch (error) {
      console.error('Error removing token:', error);
      return null;
    }
  },
};

// Optional: Wrap in an immediately invoked function expression (IIFE)
// untuk menghindari kebocoran kunci rahasia dalam modul
(function () {
  Object.freeze(jwtStorage); // Mencegah perubahan lebih lanjut
})();
