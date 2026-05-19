import * as React from "react"
import Svg, { Path } from "react-native-svg"

const StressIcon = (props: any) => (
  <Svg
    width={props.width || 32}
    height={props.height || 32}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#D0021B"}
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
    />
    <Path
      stroke={props.color || "#D0021B"}
      strokeWidth="2"
      strokeLinecap="round"
      d="M8 5l2 2M14 5l-2 2M19 12l-2-2M5 12l2-2"
    />
  </Svg>
)

export default StressIcon