import { useEffect, useState} from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userText = localStorage.getItem('user');
    if (userText) {
      setUser(userText);
    }
  }, []);
  return [user, setUser];
}