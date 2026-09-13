/**
 * Mot-fantôme géant centré derrière une section,
 * transposition du "ghost-text" Wappe Food en vert AFI.
 * À placer en premier enfant d'une <section class="relative ...">.
 */
export function WappeWord({ word }: { word: string }) {
  return (
    <span aria-hidden="true" className="wappe-word">
      {word}
    </span>
  );
}
