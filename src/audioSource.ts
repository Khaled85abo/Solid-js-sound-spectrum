import { createSignal } from "solid-js";

const [rawData, setRawData] = createSignal<number[]>([])


export const startFromFile = async () => {
    const res = await fetch('/trailer.mp3');
    const byteArray = await res.arrayBuffer();

    const context = new AudioContext();
    const audioBuffer = await context.decodeAudioData(byteArray);

    const source = context.createBufferSource();
    source.buffer = audioBuffer;

    const analyzer = context.createAnalyser();
    analyzer.fftSize = 512;

    source.connect(analyzer)
    analyzer.connect(context.destination);
    source.start();

    const butterLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(butterLength);

    const update = () => {
        analyzer.getByteFrequencyData(dataArray);
        const orig = Array.from(dataArray);
        setRawData([[...orig].reverse(), orig].flat())
        //console.log(Array.from(dataArray));
        requestAnimationFrame(update)
    }
    requestAnimationFrame(update)

}

export { rawData };