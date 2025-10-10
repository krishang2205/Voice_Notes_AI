import React from 'react';
import { Github, Globe, Mail, Shield, Award, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full space-y-8 p-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex items-center space-x-4 border-b border-border pb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Voice Notes AI</h1>
                    <p className="text-muted-foreground">Version 1.0.0 (Beta)</p>
                </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                    Voice Notes AI is designed to transform how you capture and process information.
                    By combining state-of-the-art voice recognition with advanced AI summarization,
                    we help you focus on the conversation, not the note-taking.
                </p>
            </div>

            {/* Credits / Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border flex items-start space-x-4">
                    <Shield className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                        <h3 className="font-semibold">Privacy First</h3>
                        <p className="text-sm text-muted-foreground">
                            Your audio data is processed locally where possible and securely handled.
                            We do not sell your personal data.
                        </p>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-card border border-border flex items-start space-x-4">
                    <Award className="w-6 h-6 text-yellow-500 mt-1" />
                    <div>
                        <h3 className="font-semibold">Open Source</h3>
                        <p className="text-sm text-muted-foreground">
                            Built with transparency in mind. Check our repository for contribution guidelines.
                        </p>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="flex flex-col space-y-2 pt-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Connect</h3>
                <div className="flex space-x-6">
                    <a href="#" className="flex items-center text-sm hover:text-primary transition-colors">
                        <Github className="w-4 h-4 mr-2" /> GitHub
                    </a>
                    <a href="#" className="flex items-center text-sm hover:text-primary transition-colors">
                        <Globe className="w-4 h-4 mr-2" /> Website
                    </a>
                    <a href="#" className="flex items-center text-sm hover:text-primary transition-colors">
                        <Mail className="w-4 h-4 mr-2" /> Support
                    </a>
                </div>
            </div>

            {/* Back Button */}
            <div className="pt-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    &larr; Back to Application
                </button>
            </div>
        </div>
    );
}
