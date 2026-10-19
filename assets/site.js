// Filtres de la collection
const boutons = document.querySelectorAll('.filtres button');
const creations = document.querySelectorAll('.galerie figure');
boutons.forEach(b => b.addEventListener('click', () => {
  const f = b.dataset.f;
  boutons.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
  creations.forEach(c => { c.hidden = !(f === 'tout' || c.dataset.c.split(' ').includes(f)); });
}));
