import {useCallback} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import AuthState from '../ui/auth/auth-state';
import useAuth from '../hooks/login';

export default function Main({ heading, children, aside }) {
  const [user, setUser] = useAuth();
  const userObj =  user && JSON.parse(user);
  const onLogout = useCallback((e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    setUser(null);
  }, [user]);

  const onLogin = useCallback((e) => {
    e.preventDefault();
    const newUser = JSON.stringify({email: "bwarner@oncue.co", name: "Byron Warner"});
    localStorage.setItem('user', newUser);
    setUser(newUser);
  }, [user]);

  return (
    <section className={styles.container}>
      <Head>
        <title>HelloSign Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        {heading && <h1 className={styles.title}>
          {heading}
        </h1>}
      </header>
      <nav>
        <ul>
          <li><AuthState user={userObj} onLogout={onLogout} onLogin={onLogin}/></li>
        </ul>
      </nav>
      <main className={styles.main}>
        {children}
      </main>
      {aside && <aside>
        {aside()}
      </aside>}
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </section>);
}

Main.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
  aside: PropTypes.func,
};