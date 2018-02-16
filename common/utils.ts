// Add zero in front of numbers < 10
export function zeroPad(i: string): number {
  if (parseInt(i) < 10) {
    i = `0${i}`;
  }
  return parseInt(i);
}
