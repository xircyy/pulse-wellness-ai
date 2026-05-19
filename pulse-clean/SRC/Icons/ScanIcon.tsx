import * as React from "react"
import Svg, { Path } from "react-native-svg"

// 1. Renamed to ScanIcon
const ScanIcon = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24" // Added viewBox to ensure it scales correctly
    fill="none"
    {...props}
  >
    <Path
      // 2. Changed to use props.color
      fill={props.color || "#fff"}
      d="M17 22v-2h3v-3h2v3.5c0 .4-.2.7-.5 1-.3.3-.7.5-1 .5H17ZM7 22H3.5c-.4 0-.7-.2-1-.5-.3-.3-.5-.7-.5-1V17h2v3h3v2ZM17 2h3.5c.4 0 .7.2 1 .5.3.3.5.6.5 1V7h-2V4h-3V2ZM7 2v2H4v3H2V3.5c0-.4.2-.7.5-1 .3-.3.6-.5 1-.5H7Zm12 9H5v2h14v-2Z"
    />
  </Svg>
)
export default ScanIcon