/**
 * Fond photo subtil pour une section claire : photo à faible opacité
 * + voile clair pour garder le texte parfaitement lisible.
 * À placer en premier enfant d'une <section class="relative ...">.
 */
export function SectionBg({ src }: { src: string }) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        style={{ opacity: 0.38 }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.66), rgba(241,245,241,0.76))',
        }}
      />
    </>
  );
}
