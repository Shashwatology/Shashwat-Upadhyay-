import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GSAPScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  stagger?: boolean;
  staggerSelector?: string;
}

const GSAPScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 80,
  duration = 0.8,
  stagger = false,
  staggerSelector = '.stagger-item'
}: GSAPScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    // Calculate initial position based on direction
    const getInitialPosition = () => {
      switch (direction) {
        case 'up': return { y: distance, x: 0 };
        case 'down': return { y: -distance, x: 0 };
        case 'left': return { y: 0, x: distance };
        case 'right': return { y: 0, x: -distance };
        default: return { y: distance, x: 0 };
      }
    };

    const initial = getInitialPosition();

    if (stagger) {
      const staggerElements = element.querySelectorAll(staggerSelector);
      
      if (staggerElements.length > 0) {
        gsap.fromTo(
          staggerElements,
          { 
            y: initial.y, 
            x: initial.x, 
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration,
            delay,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    } else {
      gsap.fromTo(
        element,
        { 
          y: initial.y, 
          x: initial.x, 
          opacity: 0,
          scale: 0.98
        },
        {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [delay, direction, distance, duration, stagger, staggerSelector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default GSAPScrollReveal;