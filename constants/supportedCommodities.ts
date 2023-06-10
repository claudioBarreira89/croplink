export type SupportedCommodityType = {
  commodityCode: number;
  commodityName: string;
  unitId: number;
  unitName: string;
};

export const supportedCommodities = [
  {
    commodityCode: 101,
    commodityName: "Wheat - HRW",
    unitId: 1,
    unitName: "Metric Tons",
  },
  {
    commodityCode: 301,
    commodityName: "Barley",
    unitId: 1,
    unitName: "Metric Tons",
  },
  {
    commodityCode: 801,
    commodityName: "Soybeans",
    unitId: 1,
    unitName: "Metric Tons",
  },
  {
    commodityCode: 1110,
    commodityName: "Sunflowerseed Oil",
    unitId: 1,
    unitName: "Metric Tons",
  },
  {
    commodityCode: 1501,
    commodityName: "Rice- LG Brown",
    unitId: 1,
    unitName: "Metric Tons",
  },
];
