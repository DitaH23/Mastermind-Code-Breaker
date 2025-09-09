import React from 'react';
import { Feedback } from '../types';
import { CODE_LENGTH } from '../constants';

interface FeedbackPegsProps {
  feedback: Feedback;
}

const FeedbackPegs: React.FC<FeedbackPegsProps> = ({ feedback }) => {
  const pegs = [];
  for (let i = 0; i < feedback.black; i++) {
    pegs.push(<div key={`b-${i}`} className="w-4 h-4 bg-black rounded-full border-2 border-gray-400"></div>);
  }
  for (let i = 0; i < feedback.white; i++) {
    pegs.push(<div key={`w-${i}`} className="w-4 h-4 bg-white rounded-full border-2 border-gray-400"></div>);
  }
  while (pegs.length < CODE_LENGTH) {
    pegs.push(<div key={`e-${pegs.length}`} className="w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-400"></div>);
  }

  return (
    <div className="w-12 h-12 flex flex-wrap gap-1 content-start">
      {pegs}
    </div>
  );
};

export default FeedbackPegs;