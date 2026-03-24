import ThoughtStream from './ThoughtStream';
import BentoGrid from './BentoGrid';

const HeroSection = () => {
  return (
    <section id="hero" className="hero-section-new" aria-label="Introduction to Shashwat Upadhyay - ML Researcher and Cybersecurity Student">
      {/* Background elements */}
      <div className="hero-bg-glow" />
      <div className="hero-grain" />
      
      <div className="hero-content-new">
        {/* Main heading */}
        <header className="hero-header">
          <h1 className="hero-main-title">
            <span className="hero-hi">Hi, I'm </span>
            <span className="hero-name-bold">Shashwat Upadhyay</span>
          </h1>
          
          {/* Morphing thought stream - blue italic */}
          <ThoughtStream />
        </header>

        {/* Clustered tilted bento cards */}
        <BentoGrid />

        {/* Bio section */}
        <article className="bio-section">
          <p className="bio-text">
            Machine Learning researcher and cybersecurity student at IIT Madras, focused on building intelligent systems that bridge academic rigor with real-world impact — from ISRO-funded digital twin research to AI-driven healthcare analytics.
          </p>
        </article>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
};

export default HeroSection;
