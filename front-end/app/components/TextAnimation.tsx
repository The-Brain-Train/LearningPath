import React, { useEffect, useState } from 'react';

const TextAnimation: React.FC = () => {
    const words = ['create your own learning path.', 'learn something new.', 'explore other peoples paths.'];
    const colors = ['#00BBF0', '#FDB44B', '#03C988'];
  
    const [text, setText] = useState(""); 
    const [color, setColor] = useState(colors[0]);
  
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
    
      return () => {
        clearInterval(textInterval);
      };
    }, []);
  
    return (
      <div className="text-center font-roboto font-extrabold text-3xl absolute text-white left-8 right-8 mx-auto max-w-500">
        Start your journey with LearningPath today &&nbsp; 
        <span style={{ color: color }}>{text}</span>
      </div>
    );
  };
  
  export default TextAnimation;
