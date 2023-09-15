import React, { useEffect, useState } from 'react';
import styles from '../animation.module.css';

const TextAnimation: React.FC = () => {
    const words = ['create your own LearningPath.', 'learn something new.', 'create personalized learning plans.'];
    const colors = ['#00BBF0', '#FDB44B', '#03C988'];
  
    const [text, setText] = useState(""); 
    const [color, setColor] = useState(colors[0]);
    const [underscoreClass, setUnderscoreClass] = useState(styles['console-underscore']);
  
    useEffect(() => {
      let letterCount = 1; 
      let x = 1;
      let waiting = false;
  
      const textInterval = setInterval(() => {
        if (letterCount === 0 && !waiting) {
          waiting = true;
          setText(words[0].substring(0, letterCount));
          setTimeout(() => {
            colors.push(colors.shift()!);
            words.push(words.shift()!);
            x = 1;
            setColor(colors[0]);
            letterCount += x;
            waiting = false;
          }, 1000);
        } else if (letterCount === words[0].length + 1 && !waiting) {
          waiting = true;
          setTimeout(() => {
            x = -1;
            letterCount += x;
            waiting = false;
          }, 1000);
        } else if (!waiting) {
          setText(words[0].substring(0, letterCount));
          letterCount += x;
        }
      }, 120);

      const underscoreInterval = setInterval(() => {
        if (underscoreClass === styles['console-underscore']) {
            setUnderscoreClass(`${styles['console-underscore']} ${styles['hidden']}`);
        } else {
            setUnderscoreClass(styles['console-underscore']);
        }
    }, 400);
    
  
      return () => {
        clearInterval(textInterval);
        clearInterval(underscoreInterval);
      };
    }, []);
  
    return (
      <div className={styles['console-container']}>
        Welcome to LearningPath! Here you can&nbsp; 
        <span style={{ color: color }}>{text}</span>
      </div>
    );
  };
  
  export default TextAnimation;
