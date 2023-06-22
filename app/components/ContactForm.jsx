"use client";

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  const [message, setMassage] = useState(false);
  const form = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      const result = await emailjs.sendForm(
        "service_3ihl5qk",
        "template_rvjqf6g",
        form.current,
        "tb3LqvIh15hRE33Iz"
      );

      console.log(result.text);
      setMassage(true);
    } catch (error) {
      console.log(error.text);
    }
  };
  return (
    <div className="w-full mx-auto sm:px-4 ">
      <div className="contactForm">
        <form id="contact-form" ref={form} onSubmit={sendEmail}>
          <div className="flex-1">
            <input
              type="text"
              name="name"
              className=" w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-none focus:shadow-outline border-blue-400 text-blue-500 border rounded shadow-outline border-blue-00"
              placeholder="Name"
            />
          </div>

          <div className="mt-3">
            <input
              type="email"
              name="email"
              className="w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-none focus:shadow-outline border-blue-400 text-blue-500 border rounded "
              placeholder="Email address"
            />
          </div>

          <div className="mt-3">
            <textarea
              rows={3}
              name="message"
              className=" w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-none focus:shadow-outline border-blue-400 text-blue-500 border rounded "
              placeholder="Message"
            />
          </div>

          <button
            className="submit-btn mt-3 ml-auto  bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-md py-1"
            type="submit"
          >
            Submit
          </button>
          {message && <p className=" mt-3">Email Send Sucessfully</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
