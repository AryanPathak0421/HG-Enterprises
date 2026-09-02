import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../data/testimonialData';

const BinderClip = () => (
    <div className="testimonial-clip" aria-hidden="true">
        <div className="testimonial-clip-handle" />
        <div className="testimonial-clip-jaws">
            <span />
            <span />
        </div>
    </div>
);

const PolaroidCard = ({ item }) => (
    <article
        className="testimonial-polaroid"
        style={{ '--card-rotate': `${item.rotate}deg` }}
    >
        <BinderClip />
        <div className="testimonial-polaroid-body">
            <div className="testimonial-polaroid-photo">
                <img
                    src={item.image}
                    alt={`${item.name} with HG Enterprises jewellery`}
                    loading="lazy"
                    className="testimonial-polaroid-img"
                />
            </div>
            <div className="testimonial-polaroid-caption">
                <h3 className="testimonial-polaroid-name">
                    {item.name}, {item.age}
                </h3>
                <p className="testimonial-polaroid-text">{item.text}</p>
            </div>
        </div>
    </article>
);

const TestimonialSection = () => {
    const loopItems = [...TESTIMONIALS, ...TESTIMONIALS];

    return (
        <section className="testimonial-clothesline-section" aria-label="Customer testimonials">
            <div className="testimonial-clothesline-inner">
                <motion.header
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="testimonial-header"
                >
                    <h2 className="testimonial-title">Customer Testimonials</h2>
                    <p className="testimonial-hashtag">#HGAndMe</p>
                </motion.header>

                <div className="testimonial-clothesline-stage">
                    <svg
                        className="testimonial-wire"
                        viewBox="0 0 1200 40"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M0,22 C150,8 300,34 450,20 C600,6 750,32 900,18 C1050,4 1150,26 1200,20"
                            fill="none"
                            stroke="#c8c8c8"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="testimonial-autoscroll-viewport">
                        <div className="testimonial-autoscroll-track">
                            {loopItems.map((item, index) => (
                                <PolaroidCard key={`${item.id}-${index}`} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
