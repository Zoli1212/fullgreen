// app/not-found/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import React, { JSX } from 'react';

interface Styles {
  [key: string]: React.CSSProperties;
}

export default function NotFoundPage(): JSX.Element {
  const router = useRouter();

  const handleBackToHome = (): void => {
    router.push('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <p style={styles.description}>Oops! The page you are looking for does not exist.</p>
        <button style={styles.button} onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
      <div style={styles.backgroundAnimation}>
        <div style={styles.circle}></div>
        <div style={styles.circle}></div>
        <div style={styles.circle}></div>
      </div>
    </div>
  );
}

const styles: Styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    textAlign: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: '10rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#1e293b',
  },
  description: {
    fontSize: '1.5rem',
    color: '#64748b',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '200px',
    height: '200px',
    backgroundColor: '#60a5fa',
    borderRadius: '50%',
    opacity: 0.2,
    animation: 'float 6s ease-in-out infinite',
    position: 'absolute',
    animationTimingFunction: 'ease-in-out',
  },
};

const circleKeyframes = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = circleKeyframes;
  document.head.appendChild(styleSheet);
}
