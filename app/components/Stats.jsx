import { stats } from "../constants";
import styles from "../styles/style";

const Stats = () => (
  <div className="bg-slate-100 h-full py-3">
    
    <section className={` ${styles.boxWidth} flex flex-wrap justify-around mt-10 sm:mb-20 mb-6`}>
      {stats.map((stat) => (
        <div key={stat.id} className="flex items-center flex-col m-3">
          <h4 className="text-[#EC1B24]  font-semibold xs:text-[40px] text-[30px] xs:leading-[53px] leading-[43px]">
            {stat.value}
          </h4>
          <p className="text-black  font-normal mt-5 xs:text-[20px] text-[14px] xs:leading-[26px] leading-[21px]">
            {stat.title}
          </p>
        </div>
      ))}
    </section>
  </div>
);

export default Stats;
