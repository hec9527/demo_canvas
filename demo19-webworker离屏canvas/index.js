const canvas = document.getElementById('canvas').transferControlToOffscreen();

console.log(canvas);

const worker = new Worker('./worker.js');

worker.postMessage({ canvas }, [canvas]);

setTimeout(() => {
    console.log(canvas);
}, [10]);

setInterval(() => {
    let x = 1;
    while (++x < 1000000000) {}
}, [1000]);
