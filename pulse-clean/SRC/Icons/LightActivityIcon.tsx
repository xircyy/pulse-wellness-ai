import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Renamed to LightActivityIcon for clarity
const LightActivityIcon = (props: any) => (
  <Svg
    width={props.width || 37}
    height={props.height || 38}
    viewBox="0 0 37 38" // Matches Figma original dimensions for perfect scaling
    fill="none"
    {...props}
  >
    <Path
      // Wired up props.color to both paths
      fill={props.color || "#4FB2C4"}
      d="M21.969 3.469a3.469 3.469 0 1 1-6.938 0 3.469 3.469 0 0 1 6.938 0Zm-7.077 5.208a1.734 1.734 0 0 1 1.296-.583h3.341a2.891 2.891 0 0 1 2.875 3.191l-.995 9.442a4.161 4.161 0 0 1-.203.913l-.736 2.095.493.56c.105.123.194.259.263.405l4.625 9.828a1.735 1.735 0 1 1-3.138 1.475l-4.523-9.606-3.885-4.442a1.735 1.735 0 0 1-.43-1.235l.32-6.043-1.007 1.131-1.073 6.443a1.735 1.735 0 0 1-3.422-.569l1.156-6.937c.054-.323.198-.624.416-.868l4.625-5.203.002.003Z"
    />
    <Path
      fill={props.color || "#4FB2C4"}
      d="M14.453 27.16v-3.279l2.784 3.18.604 1.212a1.848 1.848 0 0 1-.278.534l-5.78 7.515A1.735 1.735 0 1 1 9.03 34.21l5.423-7.049Zm9.759-9.747-1.142-1.142.474-4.262.013-.155 2.6 2.6h3.33a1.735 1.735 0 0 1 0 3.468h-4.05a1.735 1.735 0 0 1-1.228-.509h.003Z"
    />
  </Svg>
)

export default LightActivityIcon    