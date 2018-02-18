// Add zero in front of numbers < 10
export function zeroPad(i: string): string {
  if (parseInt(i) < 10) {
    i = i.toString();
    i = `0${i}`;
  }
  return i;
}
