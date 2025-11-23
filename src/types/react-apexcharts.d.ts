declare module 'react-apexcharts' {
  import { Component } from 'react';
  import type { ApexOptions } from 'apexcharts';

  export interface ReactApexChartProps {
    type?:
      | 'line'
      | 'area'
      | 'bar'
      | 'histogram'
      | 'pie'
      | 'donut'
      | 'radialBar'
      | 'scatter'
      | 'bubble'
      | 'heatmap'
      | 'candlestick'
      | 'radar'
      | 'polarArea'
      | 'rangeBar'
      | 'rangeArea'
      | 'treemap'
      | 'boxPlot';
    series?: ApexOptions['series'];
    options?: ApexOptions;
    width?: string | number;
    height?: string | number;
  }

  export default class ReactApexChart extends Component<ReactApexChartProps> {}
}

