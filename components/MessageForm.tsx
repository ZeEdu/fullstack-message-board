import { useRouter } from "next/router";
import React, { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { Message } from "../interfaces/Message.interface";
import { api } from "../services/api";
import Button from "./Button";

const ErrorText = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #bf616a;
  padding: 0.5rem;
`;

const TextArea = styled.textarea`
  min-height: 7.75rem;
  resize: none;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  color: #2e3440;
  font-weight: 400;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 0.3125rem;
  border-color: #2e3440;
  border: 0.125rem solid;
  transition: 0.3s;
  ::placeholder {
    opacity: 1;
    color: #d8dee9;
  }
  &:focus,
  &:hover {
    outline: none;
    box-shadow: 0 0 0 3px #88c0d0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

interface MessageFormProps {
  // updateMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessageForm: FC<MessageFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [reqErr, setReqErr] = useState(null);

  const onSubmit = async ({ message }) => {
    setReqErr(null);
    setLoading(true);
    const body = {
      message,
      email: user.email,
    };
    try {
      const {
        data: { result },
      } = await api.post("/posts", body);
      if (result) {
        // updateMessages((current) => [...current, ...result]);
        reset();
      }
    } catch (err) {
      setReqErr(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        placeholder="Write your message here!!!"
        {...register("message", {
          required: { value: true, message: "Field is Required" },
          maxLength: {
            value: 360,
            message: "Every message can only have a max of 360 characters.",
          },
        })}
      ></TextArea>
      <Button
        type="submit"
        value={loading ? "Sending..." : `Send Message`}
        disabled={loading}
      />
      {errors["message"] && <ErrorText>{errors["message"].message}</ErrorText>}
      {reqErr && <ErrorText>{reqErr}</ErrorText>}
    </Form>
  );
};

export default MessageForm;
