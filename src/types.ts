export interface BubbleChartViewModel {
    IsNotValid: boolean;
    DataPoints?: object;
}

export type BubbleChartState = {
    data: any;
    width: number,
    height: number,
    fontColor: string
};

export interface DataPoint {
    Category: string;
    Value: number;
    GroupId?: any;
}