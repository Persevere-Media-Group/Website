"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import React, { useRef } from "react";

interface ScrollDrawProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  pathClassName?: string;
  path: string;
  viewBox?: string;
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  strokeWidth?: number | string;
  startLength?: number;
  endLength?: number;
}

const ScrollDraw = ({
  children,
  className,
  containerClassName,
  pathClassName,
  path,
  viewBox,
  width = 1278,
  height = 2319,
  strokeColor = "#C2F84F",
  strokeWidth = 20,
  startLength = 0.5,
  endLength = 1,
}: ScrollDrawProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  return (
    <div ref={ref} className={containerClassName}>
      <div className={className}>
        {children}

        <LinePath
          className={pathClassName}
          scrollYProgress={scrollYProgress}
          path={path}
          viewBox={viewBox ?? `0 0 ${width} ${height}`}
          width={width}
          height={height}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          startLength={startLength}
          endLength={endLength}
        />
      </div>
    </div>
  );
};

export { ScrollDraw };

const LinePath = ({
  className,
  scrollYProgress,
  path,
  viewBox,
  width,
  height,
  strokeColor,
  strokeWidth,
  startLength,
  endLength,
}: {
  className?: string;
  scrollYProgress: MotionValue<number>;
  path: string;
  viewBox: string;
  width: number | string;
  height: number | string;
  strokeColor: string;
  strokeWidth: number | string;
  startLength: number;
  endLength: number;
}) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [startLength, endLength]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
    </svg>
  );
};
