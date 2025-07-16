export interface StockedItemProvision {
  id?: number;
  initPrice: number;
  discountType: string;
  discountValue: number;
  salesPrice: number;
  increaseValue: number;
  ref: string;
  stockedItem: any;  // Adjust based on the actual type
  stockedItemId: number;  // Adjust based on the actual type
  provision: any;  // Adjust based on the actual type
}
