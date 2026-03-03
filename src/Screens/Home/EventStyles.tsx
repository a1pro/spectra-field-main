import {statusTextColor} from '../../Constants/statusColor';

export const eventCellStyle = event => {
  const backgroundColor = 'white';
  const fontSize = 5;
  const borderRadius = 5;
  const justifyContent = 'space-between';
  const height = 70;

  return {
    elevation: 4, // Android only
    backgroundColor,
    fontSize,
    borderRadius,
    justifyContent,
    height,
  };
};

// export const eventDayCellStyle = (event:) => {
//   const backgroundColor = event.color
//   // const borderColor = statusTextColor[event?.status]
//   const borderWidth = 1
//   // const color = statusTextColor[event?.status]
//   const fontSize = 5
//   const borderLeftWidth = 10
//   // const borderLeftColor = statusTextColor[event?.status]
//   const borderRadius = 5
//   const justifyContent = "space-between"

//   return {
//     elevation: 4, // Android only
//     borderWidth,
//     borderColor,
//     backgroundColor,
//     fontSize,
//     color,
//     borderLeftWidth,
//     borderLeftColor,
//     borderRadius,
//     justifyContent,
//   }
// }
