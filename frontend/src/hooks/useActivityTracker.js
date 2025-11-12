import { useEffect, useRef } from 'react';
import axios from 'axios';

const HEARTBEAT_INTERVAL = 30000; 

function useActivityTracker(userId, apiEndpoint) {
  const isUserActive = useRef(false);

  const sendHeartbeat = async () => {
    if (isUserActive.current) {
      
      const payload = {
        userId: userId,
        timestamp: new Date().toISOString()
      };

      try {
        const response = await axios.post(apiEndpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
   
        if (response.status === 200 || response.status === 201) {
          console.log(`[Heartbeat SUCCESS] Signal sent for user ${userId}`);
        } else {
          console.error(`[Heartbeat FAILED] Server status: ${response.status}`);
        }
      } catch (error) {
        console.error('[Heartbeat ERROR] Failed to send signal:', error.message);
      }
    } else {
      console.log(`[Heartbeat IDLE] User ${userId} was idle. No signal sent.`);
    }
    
    isUserActive.current = false;
  };

  useEffect(() => {
    const handleActivity = () => {
      isUserActive.current = true;
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
    
  }, [userId, apiEndpoint]);
}

export default useActivityTracker;