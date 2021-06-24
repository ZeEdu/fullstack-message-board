import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

const MessageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const [errs, setErrs] = useState(null);

  const onSubmit = async ({ message }) => {
    setErrs(null);
    const response = await api.post("/post", { message, user: user.email });

    console.log(response);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
        {...register("message", {
          required: { value: true, message: "Field is Required" },
          maxLength: {
            value: 360,
            message: "Every message can only have a max 360 characters",
          },
        })}
      ></textarea>
      <button type="submit">Send Message</button>
      {errors["message"] && <p>{errors["message"].message}</p>}
    </form>
  );
};

export default MessageForm;
