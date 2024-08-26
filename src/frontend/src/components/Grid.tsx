import React from 'react';
import GridLayout, { WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'tailwindcss/tailwind.css';

const ResponsiveGridLayout = WidthProvider(GridLayout);

const generateLayout = (itemCount: number, cols: number): Layout[] => {
  return Array.from({ length: itemCount }, (_, i) => ({
    i: i.toString(),
    x: (i % cols) * 2, // width of each item is 2
    y: Math.floor(i / cols) * 2, // height of each item is 2
    w: 1,
    h: 2,
    minH: 2,
  }));
};

interface DraggableGridProps {
  items: React.ReactNode[];
}

const Grid: React.FC<DraggableGridProps> = ({ items }) => {
  const cols = 3; // Number of columns in the grid
  const layout = generateLayout(items.length, cols / 2);

  return (
    <div className="p-4">
      <ResponsiveGridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={100}
        width={1200}
      >
        {items.map((item, index) => (
          <div key={index.toString()}>
            {item}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Grid;
