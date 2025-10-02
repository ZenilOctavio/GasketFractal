//
//                   /\                     -
//                  /  \
//                 /  9 \                    3
//                /      \
//                --------                  -
//              /\        /\
//             /  \      /  \
//            /  7 \    / 8  \               2
//           /      \  /      \
//           --------  --------             -
//         /\                  /\
//        /  \                /  \
//       /  5 \              /  6 \          1
//      /      \            /      \
//      --------            --------        -
//    /\        /\         /\       /\
//   /  \      /  \       /  \     /  \
//  /  1 \    / 2  \     /  3 \   / 4  \     0
// /      \  /      \   /      \ /      \
// --------  --------   -----------------    -   Y levels               
// | 0 | 1 | 2  | 3  | 4   | 5  | 6 |  7 |
//
// X levels
//
//
//
export function generateCategorizer(height: number, width: number) {

  const hStep = height / 4
  const wStep = width / 8
  const half = height / 2
  //Returns a categorizer for each 9 sub-triangles [0-8]
  return function getCategory(x: number, y: number) {
    //Make them positives
    const px = x + half
    const py = y + half


    //Get their location relative to the coordinates steps
    const yLevel = Math.floor(py / hStep)
    const xLevel = Math.floor(px / wStep)

    let category: number
    switch (yLevel) {
      case 0:
        category = Math.floor(xLevel / 2)
        break
      case 1:
        if (xLevel == 1 || xLevel == 2)
          category = 4
        else
          category = 5
        break
      case 2:
        if (xLevel == 2 || xLevel == 3) category = 6
        else category = 7
        break
      case 3:
        category = 8
        break
      default:
        category = -1
        break
    }

    return category

  }
}


