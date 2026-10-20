import {  motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
}) => {
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    Math.round(latest)
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
    });

    return controls.stop;
  }, [count, value, duration]);

  return (
    <>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </>
  );
};

export default AnimatedCounter;