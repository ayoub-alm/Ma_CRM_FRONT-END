export interface DisplayColumnsInterface{
  order:number;
  title:string;
  label:string;
}

export class FilterOption{
  label:string;
  value:number | string;
  constructor(label: string, value: number| string) {
    this.label = label;
    this.value = value;
  }
}
