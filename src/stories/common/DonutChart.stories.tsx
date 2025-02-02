import React, { useState } from 'react';

import DonutChart from '~v5/common/DonutChart';
import { ChartData } from '~v5/common/DonutChart/types';

import type { Meta, StoryObj } from '@storybook/react';

const data: ChartData[] = [
  {
    id: '1',
    label: 'Product',
    value: 20,
    color: '#0fa98a',
    stroke: '#0fa98a',
  },
  {
    id: '2',
    label: 'All other',
    value: 25,
    color: '#fffc10',
    stroke: '#fffc10',
  },
  {
    id: '3',
    label: 'Business',
    value: 60,
    color: '#c4320a',
    stroke: '#c4320a',
  },
  {
    id: '4',
    label: 'Development team for frontend',
    value: 15,
    color: '#488cfd',
    stroke: '#488cfd',
  },
];

const DonutChartMeta: Meta<typeof DonutChart> = {
  title: 'Common/Donut chart',
  component: DonutChart,
};

export default DonutChartMeta;

const DonutChartWithHooks = () => {
  const [hoveredSegment, setHoveredSegment] = useState<
    ChartData | undefined | null
  >();

  const updateHoveredSegment = (segment) => {
    setHoveredSegment(segment);
  };

  return (
    <div className="relative w-[12.5rem]">
      <DonutChart
        data={data}
        hoveredSegment={hoveredSegment}
        updateHoveredSegment={updateHoveredSegment}
      />
    </div>
  );
};

export const Base: StoryObj<typeof DonutChart> = {
  render: () => {
    return <DonutChartWithHooks />;
  },
};
