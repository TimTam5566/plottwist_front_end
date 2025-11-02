import React from 'react';
import './AboutPageInfo.css';

function AboutPageInfo() {
    return (
        <div className="about-content">
            <section className="about-intro">
                <h1>About Plot Twist</h1>
                <h2>✨ Plot Twist</h2>
                <p className="tagline">A Collaborative Crowdfunding App for Storytellers, Poets, and Mischief-Makers</p>
                <p className="welcome">Welcome to Plot Twist, where the currency is creativity and the economy runs on imagination.</p>
            </section>

            <section className="about-description">
                <p>This isn't your average crowdfunding platform. Here, we don't pledge dollars — we pledge verses, paragraphs, and fragments of wonder. Every contribution is a line in a living story, a stanza in a shared poem, a twist in a tale that no single author could write alone.</p>
                <p>Plot Twist is built for those who believe stories are better when they're co-authored, and that poetry should be passed around like a campfire — warming everyone who adds a spark.</p>
            </section>

            <section className="how-it-works">
                <h2>🖋️ How It Works</h2>
                <ul>
                    <li>Creators start a literary project: a poem seeking rhythm, a story craving plot.</li>
                    <li>Contributors pledge their words: a verse, a paragraph, a metaphor, a mood.</li>
                    <li>Each pledge becomes part of a growing, evolving piece — stitched together by strangers, friends, and fellow dreamers.</li>
                    <li>No money changes hands. Just meaning.</li>
                </ul>
            </section>

            <section className="why-plot-twist">
                <h2>📚 Why Plot Twist?</h2>
                <p>Because we've all had a moment where a single line changed everything. Because collaboration is the best kind of plot device. Because sometimes, the best way to support a creator is to create with them.</p>
                <p>Plot Twist is a playground for literary mischief, a sanctuary for shared expression, and a celebration of the unexpected. It's where error messages rhyme, contributors feel seen, and every project is a story waiting to surprise you.</p>
            </section>

            <section className="what-youll-find">
                <h2>💡 What You'll Find</h2>
                <ul>
                    <li>A community of co-authors and poetic co-conspirators.</li>
                    <li>Projects that invite you to pledge your voice, not your wallet.</li>
                    <li>A UX that feels like wandering through a whimsical library — complete with literary Easter eggs and metaphorical breadcrumbs.</li>
                </ul>
            </section>

            <section className="closing">
                <p>So if you've ever wanted to help write a poem with strangers, pledge a plot twist to a short story, or leave your mark on a collaborative literary universe… you're in the right place.</p>
                <p className="footer-quote">Welcome to Plot Twist. You're not just a user. You're an author now.</p>
            </section>
        </div>
    );
}

export default AboutPageInfo;