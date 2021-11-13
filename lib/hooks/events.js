import {useState, useEffect} from 'react';

const eventNames =  [
  'ready',
  'open',
  'error',
  'cancel',
  'close',
  'sign',
  'finish',
];
export default function useEvents(clientId) {
  const [client, setClient] = useState(null);
  const [events, setEvents] = useState([]);
  const handlers = [];

  function handleEvent(name, data, index) {
      setEvents((prevEvents) => prevEvents.concat({index, name, data}));
  }

  const [ready, setReady] = useState(false);

  useEffect(async () => {
    const { default: HelloSign } = await import('hellosign-embedded');
    const _client = new HelloSign({ clientId });
    setClient(_client);
    console.log('client created ', client);
    eventNames.forEach(name => {
      const boundHandler = handleEvent.bind(_client, name);
      handlers.push(boundHandler);
      _client.on(name, boundHandler);
    });
    setReady(true);
    return () => eventNames.forEach(boundHandler => _client.off(_boundHandler));
  }, []);
  return [client, events, ready]
}