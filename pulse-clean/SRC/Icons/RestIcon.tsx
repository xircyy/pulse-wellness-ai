import * as React from "react"
import Svg, { Path } from "react-native-svg"

// 1. Renamed to RestIcon and added types for clarity
const RestIcon = (props: any) => (
  <Svg
    width={props.width || 33}
    height={props.height || 33}
    viewBox="0 0 33 33" // Ensures the SVG scales correctly
    fill="none"
    {...props}
  >
    <Path
      // 2. Wired up props.color to replace the hardcoded green
      fill={props.color || "#14AE5C"} 
      d="M27.844 14.87a5.119 5.119 0 0 0-2.063-.432H7.22c-.71-.001-1.413.146-2.063.43a5.162 5.162 0 0 0-3.093 4.726v7.218a1.031 1.031 0 0 0 2.062 0v-.515a.522.522 0 0 1 .516-.516h23.718a.522.522 0 0 1 .516.516v.515a1.031 1.031 0 1 0 2.063 0v-7.218a5.162 5.162 0 0 0-3.094-4.725Zm-3.61-9.714H8.766a3.61 3.61 0 0 0-3.61 3.61v4.64a.258.258 0 0 0 .33.248 6.16 6.16 0 0 1 1.733-.248h.272a.257.257 0 0 0 .258-.229 2.062 2.062 0 0 1 2.048-1.833h3.61a2.062 2.062 0 0 1 2.049 1.833.258.258 0 0 0 .258.23h1.576a.258.258 0 0 0 .258-.23 2.063 2.063 0 0 1 2.046-1.833h3.61a2.062 2.062 0 0 1 2.049 1.833.258.258 0 0 0 .258.23h.27c.587-.001 1.17.082 1.733.247a.259.259 0 0 0 .33-.248v-4.64a3.61 3.61 0 0 0-3.61-3.61Z"
    />
  </Svg>
)

export default RestIcon