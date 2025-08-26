import React from "react";
import { ReactTyped } from "react-typed";

const TypingEffect = () => {
  return (
    <ReactTyped
      strings={[
        "Hi, I'm Yinqi!",
        "Nice to meet you",
        "Welcome to my website.",
      ]}
      typeSpeed={50}
      backSpeed={25}
      loop
    />
  );
};

export default TypingEffect;
