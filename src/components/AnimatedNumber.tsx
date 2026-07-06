import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

// Number rolls to its new value with a spring (React Bits' CountUp pattern).

export default function AnimatedNumber({
  value,
  format = (n: number) => Math.round(n).toString(),
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const mv = useMotionValue(value);
  const reduced = useReducedMotion();
  const spring = useSpring(mv, reduced ? { duration: 0 } : { stiffness: 90, damping: 24 });
  const text = useTransform(spring, format);

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  return <motion.span>{text}</motion.span>;
}
