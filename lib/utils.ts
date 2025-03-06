export const ensureStartWith = (stringValue: string, startWith: string) =>
  stringValue.startsWith(startWith) ? stringValue : `${startWith}${stringValue}`
