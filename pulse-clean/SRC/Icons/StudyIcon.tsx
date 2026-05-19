import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Renamed to StudyIcon
const StudyIcon = (props: any) => (
  <Svg
    width={props.width || 31}
    height={props.height || 31}
    viewBox="0 0 31 31" // Matches Figma original dimensions
    fill="none"
    {...props}
  >
    <Path
      // Wired up props.color to replace the hardcoded dark blue
      fill={props.color || "#262084"}
      fillRule="evenodd"
      d="M14.841 5.309a13.498 13.498 0 0 0-11.96-.956 1.498 1.498 0 0 0-.945 1.395v15.06a1.426 1.426 0 0 0 1.956 1.323 11.058 11.058 0 0 1 9.793.786l1.466.878a.65.65 0 0 0 .348.096.647.647 0 0 0 .348-.095l1.465-.88a11.058 11.058 0 0 1 9.794-.785 1.425 1.425 0 0 0 1.955-1.323V5.748c0-.615-.374-1.166-.944-1.395a13.498 13.498 0 0 0-11.96.958l-.658.396-.658-.398Zm1.628 3.087a.969.969 0 0 0-1.938 0v12.27a.97.97 0 0 0 1.938 0V8.397Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.color || "#262084"}
      d="M3.52 24.596a8.396 8.396 0 0 1 8.46 0l1.404.819a4.198 4.198 0 0 0 4.232 0l1.404-.82a8.396 8.396 0 0 1 8.46 0l.133.078a.969.969 0 0 1-.976 1.674l-.133-.077a6.458 6.458 0 0 0-6.508 0l-1.405.819a6.135 6.135 0 0 1-6.182 0l-1.405-.82a6.458 6.458 0 0 0-6.508 0l-.133.078a.969.969 0 1 1-.976-1.674l.133-.077Z"
    />
  </Svg>
)

export default StudyIcon