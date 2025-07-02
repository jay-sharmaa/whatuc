'use client';
import { useState, useEffect } from 'react';

type CardProps = {
    title: string;
    staticText: string;
    hoverText?: string;
    expandable?: boolean;
};

function InfoCard({ title, staticText, hoverText, expandable = false }: CardProps) {
    const [hovered, setHovered] = useState(false);
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (hovered && expandable) {
            timeout = setTimeout(() => setExpand(true), 1000);
        } else {
            setExpand(false);
        }
        return () => clearTimeout(timeout);
    }, [hovered, expandable]);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`transition-all duration-500 p-4 border border-white rounded-xl bg-black text-white w-80
        ${expand ? 'h-60' : 'h-24'} flex flex-col justify-start relative`}
        >
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-base">{staticText}</p>
            {expand && hoverText && (
                <p className="text-sm mt-4 opacity-80 whitespace-pre-line">{hoverText}</p>
            )}
        </div>
    );
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <div className="flex items-center justify-center gap-4 relative">

                <InfoCard
                    title="Frontend"
                    staticText="Built using Next.js"
                    expandable={false}
                />

                <div className="flex flex-col items-center justify-center mx-2 h-8 w-16">
                    <span className="text-lg text-white mb-1">------</span>
                    <span className="text-lg text-white mt-1">------</span>
                </div>

                <div className="p-4 border border-white rounded-2xl bg-black relative flex gap-4 h-60 items-center">
                    <span className="absolute -top-4 left-4 text-white text-lg bg-black px-2">
                        Docker Compose Network
                    </span>
                    <p className="text-white text-sm text-center leading-relaxed max-w-xl">
                        Docker Compose uses multi-container.<br />
                        Each image not exceeding size of 10Gb<br />
                        Makes streamlined and efficient development
                    </p>

                    <InfoCard
                        title="Python Backend"
                        staticText="Hosted with FastAPI"
                        hoverText={`Converts webm to mp4\nUses Mediapipe to crop eye region \n Takes Prediction from model \n Maps results with confidence as radius \n Overlays the circles with 50% opacity`}
                        expandable
                    />

                    <div className="flex flex-col items-center justify-center mx-2 h-8 w-16">
                        <span className="text-lg text-white mb-1">------;</span>
                        <span className="text-lg text-white mt-1">------</span>
                    </div>

                    <InfoCard
                        title="Model"
                        staticText="ResNet18 architecture"
                        hoverText={`ResNet18 is a deep convolutional neural network\nIt uses residual connections to prevent vanishing gradients\nThis model classifies eye region data and outputs predictions with confidence scores`}
                        expandable
                    />
                </div>

            </div>
        </div>
    );
}