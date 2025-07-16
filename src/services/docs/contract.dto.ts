export class LineItem {
  designation: string;
  unite: string;
  pu: string;

  constructor(designation: string, unite: string, pu: string) {
    this.designation = designation;
    this.unite = unite;
    this.pu = pu;
  }
}

export class ContractDTO {
  company: string;
  RC: string;
  IF: string;
  Siege_social: string;
  Representant: string;
  Sa_qualite: string;
  Type_de_produit: string;
  Nombre_de_SKU: number;
  Duree_de_stockage: number;
  Raison_de_stockage: string;
  Livre: string;
  Delais_de_paiement: number;
  Date_effet: string;
  Date_echeance: string;
  Duree_Tacite_Reconduction: number;
  Facturation_minimale_assuree: string;
  Emplacements_palettes_reserves: number;
  Valeur_de_frais_de_gestion: string;
  Assurance_AD_Valorem_en_sus: string;
  Notes: string;
  line_items_1: LineItem[];
  line_items_2: LineItem[];
  line_items_3: LineItem[];
  line_items_4: LineItem[];

  constructor(data: any) {
    this.company = data.company || "N/A";
    this.RC = data.RC || "N/A";
    this.IF = data.IF || "N/A";
    this.Siege_social = data.Siege_social || "N/A";
    this.Representant = data.Representant || "N/A";
    this.Sa_qualite = data.Sa_qualite || "N/A";
    this.Type_de_produit = data.Type_de_produit || "N/A";
    this.Nombre_de_SKU = data.Nombre_de_SKU || 0;
    this.Duree_de_stockage = data.Duree_de_stockage || 0;
    this.Raison_de_stockage = data.Raison_de_stockage || "N/A";
    this.Livre = data.Livre || "N/A";
    this.Delais_de_paiement = data.Delais_de_paiement || 0;
    this.Date_effet = data.Date_effet || new Date().toISOString().split("T")[0];
    this.Date_echeance = data.Date_echeance || "N/A";
    this.Duree_Tacite_Reconduction = data.Duree_Tacite_Reconduction || 0;
    this.Facturation_minimale_assuree = data.Facturation_minimale_assuree || "N/A";
    this.Emplacements_palettes_reserves = data.Emplacements_palettes_reserves || 0;
    this.Valeur_de_frais_de_gestion = data.Valeur_de_frais_de_gestion || "N/A";
    this.Assurance_AD_Valorem_en_sus = data.Assurance_AD_Valorem_en_sus || "N/A";
    this.Notes = data.Notes || "N/A";

    this.line_items_1 = (data.line_items_1 || []).map(
      (item: any) => new LineItem(item.designation, item.unite, item.pu)
    );
    this.line_items_2 = (data.line_items_2 || []).map(
      (item: any) => new LineItem(item.designation, item.unite, item.pu)
    );
    this.line_items_3 = (data.line_items_3 || []).map(
      (item: any) => new LineItem(item.designation, item.unite, item.pu)
    );
    this.line_items_4 = (data.line_items_4 || []).map(
      (item: any) => new LineItem(item.designation, item.unite, item.pu)
    );
  }
}
