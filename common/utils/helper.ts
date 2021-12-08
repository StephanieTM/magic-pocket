import { LabeledValue } from 'antd/lib/select';

export function generateStringOptions(obj: Record<string, string>): LabeledValue[] {
  return Object.keys(obj).map(key => ({ label: obj[key], value: key }));
}

export function generateNumberOptions(obj: unknown, nameObj: Record<string, string>): LabeledValue[] {
  return Object.keys(nameObj).map(key => ({ label: nameObj[key], value: (obj as Record<string, number>)[key] }));
}
