import React from 'react'

const Map = () => {
  return (
    <div>
      <iframe title='map' className='w-screen h-[40vh]'
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7484415562553!2d90.4210082745189!3d23.791970687180747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c76498e3c7e3%3A0x5d40fe44a7af631e!2sMahi%20Computers%20and%20Training%20Center!5e0!3m2!1sen!2sbd!4v1686542976316!5m2!1sen!2sbd"
       
        allowFullscreen="true"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default Map;