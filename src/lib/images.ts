// Banque d'images AFI Collection — photos réelles (ateliers, créations, terroir).
// Utilisée pour les heroes de pages et les images de repli (plus d'Unsplash).

const C = 'https://res.cloudinary.com/dzxesa3wi/image/upload';

export const AFI_IMAGES = {
  logo: `${C}/v1783162335/afiii_wqkawf.png`,
  heroSlide: `${C}/v1780563939/slide3_zsjt4w.png`,
  heroSlideAlt: `${C}/v1780563931/slide01_gwdcug.png`,
  atelierCadre:
    `${C}/v1785573442/WhatsApp_Image_2026-08-01_at_08.30.47_w1owpu.jpg`,
  tressageDetail:
    `${C}/v1785573443/WhatsApp_Image_2026-08-01_at_08.31.11_1_mu9zgn.jpg`,
  kluiKlui:
    `${C}/v1785573444/WhatsApp_Image_2026-08-01_at_08.31.11_2_x6h3lg.jpg`,
  malaxage:
    `${C}/v1785573441/WhatsApp_Image_2026-08-01_at_08.48.24_1_z0ovdv.jpg`,
  fierteArtisane:
    `${C}/v1785574438/WhatsApp_Image_2026-08-01_at_09.51.43_ykpwvs.jpg`,
  torrefaction:
    `${C}/v1785574438/WhatsApp_Image_2026-08-01_at_09.53.13_syzpyy.jpg`,
  remiseCreations:
    `${C}/v1785575610/WhatsApp_Image_2026-08-01_at_10.09.08_1_crzxkb.jpg`,
  exposition:
    `${C}/v1779441621/WhatsApp_Image_2026-05-03_at_13.03.09_2_cujxnk.jpg`,
  equipe:
    `${C}/v1779441647/WhatsApp_Image_2026-05-03_at_13.15.30_1_z0l9dw.jpg`,
  mainsOr:
    `${C}/v1779441670/WhatsApp_Image_2026-05-03_at_13.07.31_ian4cg.jpg`,
} as const;

// Image de repli générique (produit sans visuel)
export const AFI_FALLBACK_PRODUCT = AFI_IMAGES.exposition;
export const AFI_FALLBACK_PHOTO = AFI_IMAGES.atelierCadre;
