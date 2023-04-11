import React from 'react';
import s from './SaleDescription.scss';

const SaleDescription = () => {
  const content =
    'A short description of the collection and the main features purely fish text can even be longer ';
  return (
    <div className={s.main}>
      <h3>GURU PUNKS</h3>
      <p>{content}</p>
    </div>
  );
};

export default SaleDescription;
