import AIAdvisorChat from '../AIAdvisorChat';
import { useState } from 'react';

export default function AIAdvisorChatExample() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="h-screen">
      <AIAdvisorChat 
        isMinimized={isMinimized} 
        onToggle={() => setIsMinimized(!isMinimized)}
      />
    </div>
  );
}
