import React from 'react'
import styles from '../styles/style'
import Image from 'next/image';

import Link from 'next/link';
import { categories } from '../constants';

const Categories = () => {
  return (
    <div className={`${styles.boxWidth} my-5`}>
      <h2 className={`${styles.heading2} text-center my-4`}>Categories</h2>
      <p className={`${styles.paragraph} text-center`}>
        Pick your favorite course from our hand Picked categories.
      </p>
      <p className={`${styles.paragraph} text-center`}>
        A Well organized collection of excellence
      </p>
      <div className="flex flex-wrap my-10 justify-around">
        {categories.map((item) => (
          <div
            key={item.alt}
            className="xs:w-[190px] xl:w-[230px] shadow-2xl m-2 rounded-lg hover:translate-y-1"
          >
            <Link
              href={item.link}
              className="flex flex-col  items-center justify-around flex-wrap p-2 "
            >
              <Image className="w-[80px]" src={item.img} alt={item.alt} />
              <h3 className="text-mahitwo mt-3 font-semibold text-[16px]">
                {item.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;