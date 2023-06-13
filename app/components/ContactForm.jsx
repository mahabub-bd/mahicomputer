"use client";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const toastifySuccess = () => {
    toast("Form sent!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      className: "submit-feedback success",
      toastId: "notifyToast",
    });
  };

  const onSubmit = async (data) => {
    const { name, email, message } = data;
    try {
      const templateParams = {
        name,
        email,
        message,
      };

      await emailjs.send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_USER_ID
      );

      reset();
      toastifySuccess();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full mx-auto sm:px-4 ">
      <div className="contactForm">
        <form id="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex-1">
            <input
              type="text"
              name="name"
              {...register("name", {
                required: {
                  value: true,
                  message: "Please enter your name",
                },
                maxLength: {
                  value: 30,
                  message: "Please use 30 characters or less",
                },
              })}
              className=" w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-none focus:shadow-outline border-blue-400 text-blue-500 border rounded"
              placeholder="Name"
            ></input>
            {errors.name && (
              <span className="errorMessage">{errors.name.message}</span>
            )}
          </div>

          <div className="mt-3">
            <input
              type="email"
              name="email"
              {...register("email", {
                required: true,
                pattern:
                  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              })}
              className="w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-none focus:shadow-outline border-blue-400 text-blue-500 border rounded "
              placeholder="Email address"
            ></input>
            {errors.email && (
              <span className="errorMessage">
                Please enter a valid email address
              </span>
            )}
          </div>

          <div className="mt-3">
            <textarea
              rows={3}
              name="message"
              {...register("message", {
                required: true,
              })}
              className=" w-full py-1 px-2 mb-1 text-base leading-normal bg-white focus:outline-none focus:shadow-outline border-blue-400 text-blue-500 border rounded "
              placeholder="Message"
            ></textarea>
            {errors.message && (
              <span className="errorMessage">Please enter a message</span>
            )}
          </div>

          <button
            className="submit-btn mt-3 ml-auto  bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-md py-1"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactForm;
