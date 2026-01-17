export class WmsDashboardCounts {
    public countOfNeeds: number = 0;
    public countOfOffers: number = 0;
    public countOfContracts: number = 0;
    public countOfInvoices: number = 0;
    public countOfDeliveryNotes: number = 0;

    constructor(data?: any) {
        if (data) {
            this.countOfNeeds = data.countOfNeeds || 0;
            this.countOfOffers = data.countOfOffers || 0;
            this.countOfContracts = data.countOfContracts || 0;
            this.countOfInvoices = data.countOfInvoices || 0;
            this.countOfDeliveryNotes = data.countOfDeliveryNotes || 0;
        }
    }
}
