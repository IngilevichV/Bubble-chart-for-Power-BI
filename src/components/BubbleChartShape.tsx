import * as React from 'react';
import * as d3 from 'd3';
import { BubbleChartState } from "../types";
import { color } from '../utils';

const WIDTH = 600;
const HEIGHT = 700;

class BubbleChart extends React.Component<any, BubbleChartState> {

  state: BubbleChartState = {
    data: [],
    width: 0,
    height: 0,
    fontColor: 'black'
  };

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      width: this.props.width,
      height: this.props.height,
      fontColor: this.props.fontColor
    };

    props.onCreate(this);
  }

  setStateValue(value: BubbleChartState) {
    this.setState(value);
  }

  renderChart() {
    const { data, width, fontColor } = this.state;

    const root = d3.hierarchy({ children: data })
      .sum(function (d: any) { return d.Value; })
      .sort(function (a: any, b: any) { return String(a.data.GroupId).localeCompare(String(b.data.GroupId)); })
      .each((d: any) => {
        if (d.data.Category) {
          d.label = d.data.Category;
          d.id = d.data.Category;
          d.groupId = d.data.GroupId;
        }
      });

    const bubblesWidth = width;
    const graph = {
      zoom: 1,
      padding: 0.011
    };

    const pack = d3.pack()
      .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
      .padding(graph.padding);

    const nodes = pack(root).leaves();

    const nodesElements = nodes.map((node: any, i) => (
      <g transform={`translate(${node.x}, ${node.y})`}>
        <circle id={node.id} r={node.r - (node.r * 0.05)} fill={String(color(node.data.GroupId))} />
        <clipPath id={`clip-${node.id}`}>
          <use xlinkHref={`#${node.id}`} />
        </clipPath>
        <text clipPath={`url(#clip-${node.id})`} fontSize={'20px'} fill={fontColor} textAnchor="middle" dominantBaseline="middle">{node.id}</text>
      </g>
    ));

    return nodesElements;
  }


  render() {
    const { width, height, data } = this.state;

    if (data && width && height) {
      return (<svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        {this.renderChart()}
      </svg>);
    }

    return (<svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT}>
      <text x={10} y={15} textAnchor="start" fontSize="16px">
        Please fill in all required fields
      </text>
    </svg>);

  }
}

export default BubbleChart;
