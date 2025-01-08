export class StockedItemCreateDto{
  conditionnement: string;              // Required field
  structure?: string;                   // Optional field
  temperatureStockage: string;          // Required field
  largeur?: number;                     // Optional field, must be >= 0
  longueur?: number;                    // Optional field, must be >= 0
  hauteur?: number;                     // Optional field, must be >= 0
  hauteurMax?: number;                  // Optional field, must be >= 0
  poids?: number;                       // Optional field, must be >= 0
  metreCubeMax?: number;                // Optional field, must be >= 0
  niveauxGerbabilite: number;           // Required field, must be >= 0
  volumeStock?: number;                 // Optional field, must be >= 0
  nombreUvc?: number;

  constructor(data: any) {
    this.conditionnement = data.conditionnement;
    this.structure = data.structure;
    this.temperatureStockage = data.temperatureStockage;
    this.largeur = data.largeur;
    this.longueur = data.longueur;
    this.hauteur = data.hauteur;
    this.hauteurMax = data.hauteurMax;
    this.poids = data.poids;
    this.metreCubeMax = data.metreCubeMax;
    this.niveauxGerbabilite = data.niveauxGerbabilite;
    this.volumeStock = data.volumeStock;
    this.nombreUvc = data.nombreUvc;
  }
}
