const canvas = document.getElementById('canvas').transferControlToOffscreen();

console.log(canvas);

const worker = new Worker('./worker.js');

worker.postMessage({ canvas }, [canvas]);

setTimeout(() => {
    console.log(canvas);
}, [10]);
