export function sleep(ms: number): Promise<any> {
  return new Promise((res: any): any => setTimeout(res, ms));
}