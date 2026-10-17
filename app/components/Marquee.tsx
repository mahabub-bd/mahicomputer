import React from 'react'

const Marquee = () => {
  return (
    <div className="bg-[#FFB802] text-black py-2 font-bangla font-light">
      <marquee behavior="scroll" direction="left">
        <strong>
          “বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক অনুমোদিত প্রতিষ্ঠান। কোড: 50969 
          **** মাহি কম্পিউটার আধুনিক কম্পিউটার শিক্ষার উন্নয়নে এক অনন্য উদহারণ।
          *** মাহী সকল কোর্স 85% প্যাক্ট্রিক্যাল কাজের মাধ্যমে বাস্তবমূখী
          ট্রেনিং প্রদান করেন। *** প্রশিক্ষন শেষে কারিগরি শিক্ষাবোর্ডের অধীনে
          পরীক্ষার মাধ্যমে সরকারী সার্টিফিকেট প্রদান করেন। **** মাহী 100% পাশের
          নিশ্চয়তা প্রদান করে ইনশাল্লাহ ।
        </strong>
      </marquee>
    </div>
  );
}

export default Marquee