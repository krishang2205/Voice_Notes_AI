import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    stream: MediaStream | null;
    isRecording: boolean;
    barColor?: string;
    width?: number;
    height?: number;
}

/**
 * AudioVisualizer - Renders a real-time waveform for a MediaStream using Canvas API.
 * 
 * @param stream - The active MediaStream (microphone)
 * @param isRecording - Whether the visualizer should be active
 */
export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
    stream,
    isRecording,
    barColor = '#3b82f6', // Default blue-500
    width = 300,
    height = 50
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!stream || !isRecording) {
            cleanup();
            clearCanvas();
            return;
        }

        initializeAudioContext();
        draw();

        return () => {
            cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream, isRecording]);

    const initializeAudioContext = () => {
        if (!stream) return;

        // Initialize Audio Context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        contextRef.current = ctx;

        // Create Analyzer
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256; // Defines data resolution
        analyserRef.current = analyser;

        // Connect Source
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;
    };

    const cleanup = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        if (contextRef.current && contextRef.current.state !== 'closed') {
            contextRef.current.close();
        }
        contextRef.current = null;
        sourceRef.current = null;
        analyzerRef.current = null;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyzerRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scaling for Retina
        // (Assuming standard handling, but usually we just draw relative)

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            animationRef.current = requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;

                // Gradient or solid color
                ctx.fillStyle = barColor;

                // Rounded bars looking
                // ctx.roundRect(...) if supported, else rect
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        renderFrame();
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full rounded-md"
        />
    );
};
