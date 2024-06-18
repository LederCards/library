export function tryNavigateToHash() {
  console.log(document.location.hash);
  if (!document.location.hash) return;

  setTimeout(() => {
    navigateTo(document.location.hash.replace('#', ''));
  }, 500);
}

export function navigateTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    document.location.hash = id;
  }, 0);
}
