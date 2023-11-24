import React, { type SVGProps } from "react";

export interface SvgComponentProps extends SVGProps<SVGSVGElement> {
  fill?: string;
}

const accent = "#08d69f";

const UpArrow: React.FC<SvgComponentProps> = ({ fill = accent, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill={fill}
      fillRule="evenodd"
      d="M0 15a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM3.293 4.707a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L8 3.414V11a1 1 0 1 1-2 0V3.414L4.707 4.707a1 1 0 0 1-1.414 0Z"
      clipRule="evenodd"
    />
  </svg>
);

const DownArrow: React.FC<SvgComponentProps> = ({
  fill = accent,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={16}
    fill=""
    {...props}
  >
    <path
      fill={fill}
      fillRule="evenodd"
      d="M0 15a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1Zm3.293-7.707a1 1 0 0 1 1.414 0L6 8.586V1a1 1 0 0 1 2 0v7.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414Z"
      clipRule="evenodd"
    />
  </svg>
);

export { UpArrow, DownArrow };
