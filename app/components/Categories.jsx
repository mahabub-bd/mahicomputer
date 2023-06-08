import React from 'react'
import styles from '../styles/style'

const Categories = () => {
  return (
    <div className={`${styles.boxWidth}`}>
      <h2 className={`${styles.heading2} text-center`}>Categories</h2>
      <p className={`${styles.paragraph} text-center`}>
        Pick your favorite course from our hand Picked categories.
      </p>
      <p className={`${styles.paragraph} text-center`}>
       A Well organized collection of  excellence
      </p>
    </div>
  );
}

export default Categories;