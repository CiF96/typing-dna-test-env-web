export function compareTexts(t1: string, t2: string) {
  const dt1 = t1.split(' ')
  const dt2 = t2.split(' ')
  let total2 = 0
  let total1 = 0
  for (const i in dt2) {
    total2 += dt1.includes(dt2[i]) ? 1 : 0
  }
  for (const i in dt1) {
    total1 += dt2.includes(dt1[i]) ? 1 : 0
  }

  const total = dt1.length > dt2.length ? dt1.length : dt2.length
  const length = dt1.length > dt2.length ? dt1.length : dt2.length
  console.log(total1, total2)

  return total / length
}
