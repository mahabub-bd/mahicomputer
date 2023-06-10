import { stats } from "../constants";
import styles from "../styles/style";

const Stats = () => (
  <div className=" h-full py-4 ">
    <section
      className={` ${styles.boxWidth} flex flex-wrap gap-5 justify-around mt-10 sm:mb-20 mb-6`}
    >
      <h4 className={`${styles.heading3}  mb-5 text-blue-950`}>
        সাফল্য মাহি কম্পিউটার এক নজরে
      </h4>

      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.class} backdrop-blur-md flex items-center flex-col px-8 min-w-[220px] py-5 shadow-2xl rounded-lg`}
        >
          <h4 className="text-[#EC1B24]  font-plusjakarta font-semibold xs:text-[40px] text-[30px] xs:leading-[53px] leading-[43px]">
            {stat.value}
          </h4>
          <p className="text-black  font-normal font-plusjakarta mt-5 xs:text-[20px] text-[14px] xs:leading-[26px] leading-[21px]">
            {stat.title}
          </p>
        </div>
      ))}
    </section>
  </div>
);

export default Stats;
