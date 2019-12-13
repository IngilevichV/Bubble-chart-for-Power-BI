import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

import powerbi from "powerbi-visuals-api";
import Fill = powerbi.Fill;

export class VisualSettings extends DataViewObjectsParser {
  public BubbleChartProperties: BubbleChartProperties = new BubbleChartProperties();
}

export class BubbleChartProperties {
  public fontColor: Fill = { "solid": { "color": "#808080" } };
}

