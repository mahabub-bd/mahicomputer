const styles = {
  boxWidth: "xl:max-w-[1300px] lg:max-w-[1300px] w-full mx-auto",

  heading2:
    "font-poppins font-semibold font-plusjakarta  vxs:text-[24px] lg:text-[36px] text-blue-600  vxs:leading-[56.8px] lg:leading-[70.8px] w-full",
  heading3:
    " font-semibold vxs:text-[16 px] font-plusjakarta text-[24px] text-center text-[#EC1B24] xs:leading-[40.8px] leading-[47px] w-full font-sans",
  paragraph:
    "font-poppins  text-gray-800 font-normal font-plusjakarta  text-[18px] p-2 leading-[30.8px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
  mobileMenu:
    "font-poppins font-normal text-white hover:text-dimWhite cursor-pointer text-[16px] mb-4 font-semibold border-b-[1px] border-t-[#3F3E45] tracking-wide border-dotted",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY}`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export default styles;
