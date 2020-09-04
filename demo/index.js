function getCanvas(el) {
    const canvas = document.getElementById(el);
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    return { canvas, ctx };
}
