"use strict";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import PrimitiveValue = powerbi.PrimitiveValue;
import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;
import DataViewCategorical = powerbi.DataViewCategorical;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import { VisualSettings } from './settings';
import "./../style/visual.less";
import { BubbleChartViewModel, DataPoint, BubbleChartState } from "./types";
import * as React from "react";
import * as ReactDOM from "react-dom";
import BubbleChartShape from './components/BubbleChartShape';


export class Visual implements IVisual {
    private settings: VisualSettings;
    private reactRoot: React.ComponentElement<any, any>;
    private instance: BubbleChartShape;
    private target: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement( BubbleChartShape, {onCreate: (instance) => {
            this.instance = instance;
        }} );
        this.target = options.element;

        ReactDOM.render( this.reactRoot, this.target );

        this.settings = VisualSettings.getDefault() as VisualSettings;
    }

    getColor(colorFromSettings: any): string {
        let color = "";

        if (typeof (colorFromSettings) === "string") {
            color = <string>colorFromSettings;
        }
        else {
            color = <string>colorFromSettings.solid.color;
        }

        return color;
    }

    createDataPoint(categoryValues: PrimitiveValue[], categoryNames: PrimitiveValue[], groupIds?: PrimitiveValue[]): DataPoint[] {
        const dataPoints: DataPoint[] = [];

        for (let i = 0; i < categoryValues.length; i++) {
            const category: string = <string>categoryNames[i];
            const categoryValue: number = <number>categoryValues[i];
            const groupId = groupIds && groupIds.length > 0 ? groupIds[i] : '1';

            dataPoints.push({
                Category: category,
                Value: categoryValue,
                GroupId: groupId
            });
        }


        return dataPoints;
    }

    public update(options: VisualUpdateOptions) {
        const viewport: IViewport = options && options.viewport;
        const {width, height} = viewport;
        const dataView = options && options.dataViews && options.dataViews[ 0 ] || null;

        if (!dataView) {
            return null;
        }

        const viewModel: BubbleChartViewModel = this.createViewModel(options.dataViews[0]);
        const BubbleChartState: BubbleChartState = {
            data: viewModel.DataPoints,
            width: width,
            height: height,
            fontColor: this.getColor(this.settings.BubbleChartProperties.fontColor)
          };

          if (viewModel.DataPoints) {
            this.instance.setState(BubbleChartState);
        }
    }

    public createViewModel(dataView: DataView): BubbleChartViewModel {

        if (typeof dataView === "undefined" ||
            typeof dataView.categorical === "undefined" ||
            typeof dataView.categorical.values === "undefined") {
            return { IsNotValid: true };
        }

        this.settings = VisualSettings.parse(dataView) as VisualSettings;

        const categoricalDataView: DataViewCategorical = dataView.categorical;
        const categoryNames: PrimitiveValue[] = categoricalDataView.categories[0].values;
        const categoryValues: PrimitiveValue[] = categoricalDataView.values[0].values;
        let groupIds = [];
        if (categoricalDataView.values[1]) {
            groupIds = categoricalDataView.values[1].values;
        }
        const chartDataPoints: DataPoint[] = this.createDataPoint(categoryValues, categoryNames, groupIds);

        return {
            IsNotValid: false,
            DataPoints: chartDataPoints
        };

    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const visualObjects: VisualObjectInstanceEnumerationObject = <VisualObjectInstanceEnumerationObject>VisualSettings.enumerateObjectInstances(this.settings, options);

        return visualObjects;
    }
}