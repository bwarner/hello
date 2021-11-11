import {useState, useEffect} from 'react';

export default function useEvents(clientId) {
  const [client, setClient] = useState(null);
  const [events, setEvents] = useState([]);

  function handleEvent(name, data) {
      setEvents((prevEvents) => prevEvents.concat({name, data}));
  }

  const [ready, setReady] = useState(false);

  useEffect(async () => {
    const { default: HelloSign } = await import('hellosign-embedded');
    const _client = new HelloSign({ clientId });
    setClient(_client);
    console.log('client created ', client);
    _client.on('ready', handleEvent.bind(_client, 'ready'));
    _client.on('open', handleEvent.bind(_client, 'ready'));
    _client.on('error', handleEvent.bind(_client, 'ready'));
    _client.on('cancel', handleEvent.bind(_client, 'ready'));
    _client.on('close', handleEvent.bind(_client, 'ready'));
    _client.on('sign', handleEvent.bind(_client, 'ready'));
    _client.on('finish', handleEvent.bind(_client, 'ready'));
    setReady(true);
    return () => {
      _client.off('ready');
      _client.off('open');
      _client.off('error');
      _client.off('cancel');
      _client.off('close');
      _client.off('sign');
      _client.off('finish');
    }
  }, []);
  return [client, ready]
}