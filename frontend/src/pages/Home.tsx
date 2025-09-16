import React from 'react';
import { Mic } from 'lucide-react';

const Home = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Ready to Record</h1>
                <p className="text-muted-foreground">Click the button below to start capturing your thoughts.</p>
            </div>

            <button
                className="h-32 w-32 rounded-full bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 group"
            >
                <Mic className="h-12 w-12 text-white group-hover:animate-pulse" />
            </button>
        </div>
    );
};

export default Home;
