import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_NAME = 'AFI Collection';
const BASE_URL = 'https://aficollection.com';
const DEFAULT_DESC =
  'Découvrez AFI Collection, votre boutique artisanale de sacs macramé, sandales, pagnes, accessoires et tissus africains. Livraison 48h au Bénin.';
const DEFAULT_IMG = 'https://res.cloudinary.com/dy3wikx3p/image/upload/v1743179979/slide01_gwdcug.png';

export default function SEO({ title, description, image, url }: SEOProps) {
  const pageTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMG;
  const href = url || BASE_URL;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta name="author" content={SITE_NAME} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={href} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      <link rel="canonical" href={href} />
    </Helmet>
  );
}
