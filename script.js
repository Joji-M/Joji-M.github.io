// Opt-in: shrink photo stacks to the adjacent text height on desktop.
document.querySelectorAll('.match-visual-height').forEach((layout) => {
  const [text, visuals] = layout.children;
  const images = [...visuals.querySelectorAll('img')];
  if (!images.length) return;

  const fitImages = () => {
    images.forEach((image) => {
      image.style.width = '';
      image.style.marginInline = '';
    });
    if (window.matchMedia('(max-width: 720px)').matches) return;
    if (images.some((image) => !image.naturalWidth)) return;

    // Measure at the normal CSS width; reserve space for captions and gaps.
    const sizes = images.map((image) => image.getBoundingClientRect());
    const imageHeight = sizes.reduce((sum, size) => sum + size.height, 0);
    const extraHeight = visuals.getBoundingClientRect().height - imageHeight;
    const availableHeight = text.getBoundingClientRect().height - extraHeight;
    if (availableHeight <= 0 || imageHeight <= availableHeight) return;

    const scale = availableHeight / imageHeight;
    images.forEach((image, index) => {
      image.style.width = `${sizes[index].width * scale}px`;
      image.style.marginInline = 'auto';
    });
  };

  const observer = new ResizeObserver(fitImages);
  observer.observe(text);
  images.forEach((image) => image.addEventListener('load', fitImages));
  window.addEventListener('resize', fitImages);
  fitImages();
});
