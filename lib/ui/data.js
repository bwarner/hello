import { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Home.module.css';

export default function Data(props) {
  console.log('props is  ', props);
  const { object } = props;
  const keys = useMemo(() => object ? Object.keys(object) : []);

  return (
     <dl className={styles.dlist2}>
        {keys.map(key => (
          <>
            <dt key={key}>{key}</dt>
            <dd key={`dd${key}`}>{typeof object[key] === 'object' ? <Data object={object[key]} /> : String(object[key])}</dd>
          </>
        ))}
      </dl>
  );
}

Data.propTypes = {
  object: PropTypes.object,
};
