import React from 'react';
import { CommentOutlined } from '@ant-design/icons';

import indonesiaFlag from '../../assets/images/indonesia.jpg';
import facebookLogo from '../../assets/images/fb.png';
import youtubeLogo from '../../assets/images/youtube.png';
import instagramLogo from '../../assets/images/instagram.png';
import tiktokLogo from '../../assets/images/tiktok.png';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3>Untuk Penerbit</h3>
          <ul style={styles.list}>
            <li>
              <a
                href='#'
                style={styles.link}
              >
                Daftarkan judul Anda di E-Morpshop
              </a>
            </li>
            <li>
              <a
                href='#'
                style={styles.link}
              >
                Pelajari lebih lanjut tentang kami
              </a>
            </li>
          </ul>
        </div>
        <div style={styles.section}>
          <h3>Butuh Bantuan?</h3>
          <a
            href='https://wa.me/6285173321510?text=Hai,%20saya%20saya%20mengalami%20masalah%20saat%20transaksi'
            target='_blank'
            style={styles.button}
          >
            <CommentOutlined style={styles.shareIcon} /> Hubungi Kami
          </a>
        </div>
        <div style={styles.section}>
          <h3>Area</h3>
          <p style={styles.area}>
            <img
              src={indonesiaFlag}
              alt='Indonesia Flag'
              style={styles.flag}
            />{' '}
            Indonesia
          </p>
        </div>
        <div style={styles.section}>
          <h3>Dapatkan berita E-Morp di:</h3>
          <div style={styles.socialIcons}>
            <img
              src={facebookLogo}
              alt='Facebook'
              style={styles.icon}
            />
            <img
              src={youtubeLogo}
              alt='YouTube'
              style={styles.icon}
            />
            <a
              href='https://www.instagram.com/webemorp?igsh=cXNmNXBrMXo2aXE1'
              target='_blank'
            >
              <img
                src={instagramLogo}
                alt='Instagram'
                style={styles.icon}
              />
            </a>
            <img
              src={tiktokLogo}
              alt='TikTok'
              style={styles.icon}
            />
          </div>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p style={styles.footerText}>
          <a
            href='#'
            style={styles.link}
          >
            ©Hak Cipta E-Morp Payments
          </a>{' '}
          |
          <a
            href='#'
            style={styles.link}
          >
            Pemasaran dan Kemitraan
          </a>{' '}
          |
          <a
            href='#'
            style={styles.link}
          >
            {' '}
            Untuk Penerbit Game
          </a>{' '}
          |
          <a
            href='#'
            style={styles.link}
          >
            {' '}
            Syarat & Ketentuan
          </a>{' '}
          |
          <a
            href='#'
            style={styles.link}
          >
            {' '}
            Kebijakan Privasi
          </a>{' '}
          |
          <a
            href='#'
            style={styles.link}
          >
            {' '}
            Bounty Bug
          </a>
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f4e300',
    color: '#4b2c2c',
    padding: '60px 0 0',
    textAlign: 'left',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  section: {
    margin: '0 10px',
    flex: '1',
    minWidth: '150px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#4b2c2c',
  },
  button: {
    backgroundColor: '#d4b100',
    padding: '7px',
    borderRadius: '5px',
    color: '#4b2c2c',
    display: 'inline-flex',
    alignItems: 'center',
  },
  shareIcon: {
    marginRight: '10px',
  },
  flag: {
    width: '20px',
    verticalAlign: 'middle',
    marginLeft: '5px',
  },
  area: {
    backgroundColor: '#d4b100',
    padding: '7px',
    borderRadius: '5px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '10px',
    marginLeft: '0px',
  },
  icon: {
    width: '40px',
    height: '40px',
    margin: '0 10px',
    borderRadius: '50%',
  },
  footerBottom: {
    marginTop: '0',
    backgroundColor: '#e0e0e0',
    padding: '10px 10px',
    width: '100%',
    position: 'relative',
    left: 0,
    right: 0,
  },
  footerText: {
    margin: '5px 10',
    textAlign: 'left',
  },
};

export default Footer;
