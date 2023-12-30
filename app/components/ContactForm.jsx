"use client";

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
    const [message, setMessage] = useState(false);
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
          .sendForm(
            "service_wh5qpa9",
            "template_hqtwl7i",
            form.current,
            "8iNE8V3QPc16ceolR"
          )
          .then(
            (result) => {
              console.log(result.text);
              setMessage("Message sent successfully");
            },
            (error) => {
              console.log(error.text);
            }
          );
        e.target.reset();
        setMessage(null);
    };
  return (
    <div className="w-full mx-auto sm:px-4 ">
      <div className="contactForm">
        <form id="contact-form" ref={form} onSubmit={sendEmail}>
          <div className="flex-1">
            <input
              id="from_name"
              required
              placeholder="Your Name"
              name="from_name"
              type="text"
              className=" w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-blue-400 focus:shadow-outline border-black-100 text-blue-500 border rounded shadow-outline border-blue-00"
            />
          </div>
          <div className="mt-3">
            <input
              type="email"
              id="from_email"
              required
              placeholder="Type Your Email "
              name="from_email"
              className="w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-blue-400 focus:shadow-outline border-black-100 text-blue-500 border rounded shadow-outline border-blue-00 "
            />
          </div>
          <div className="mt-3">
            <input
              type="tel"
              id="from_phone"
              required
              placeholder="+8801234567"
              name="from_phone"
              className="w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-blue-400 focus:shadow-outline border-black-100 text-blue-500 border rounded shadow-outline border-blue-00 "
            />
          </div>

          <div className="mt-3">
            <textarea
              type="email"
              id="message"
              required
              placeholder="Write Message Us"
              name="message"
              rows={3}
              className="w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-blue-400  focus:shadow-outline border-black-100 text-blue-500 border rounded "
            />
          </div>

          <button
            className="submit-btn mt-3 mr-auto  bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-md py-1"
            type="submit"
          >
            Send Message
          </button>
          {message && <p className=" mt-3">Email Send Sucessfully</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;






