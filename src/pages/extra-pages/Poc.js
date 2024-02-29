import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Icon } from '@iconify/react';
import { Button } from '@mui/material';

const DraggableComponent = ({ id, children, x, y, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'BOX',
    item: { id, x, y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = Math.round(x + delta.x);
        const newY = Math.round(y + delta.y);
        onMove(id, newX, newY);
      }
    }
  });

  const ref = useRef(null);

  drag(ref);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        // transition: 'left 0.2s, top 0.2s' // Smooth out the movement
        transition: 'left 0.3s ease, top 0.3s ease' // Add this line
      }}
    >
      {children}
    </div>
  );
};

const DropZone = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'BOX',
    drop: (item, monitor) => {
      console.log({ monitor });
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div ref={drop} style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: isOver ? 'lightgreen' : 'transparent' }}>
      {children}
    </div>
  );
};

// ==============================|| SAMPLE PAGE ||============================== //

const randomNumber = () => Math.floor(Math.random() * 101);

const bigRandomNumber = () => Math.floor(Math.random() * 300) + 300;

const SamplePage = () => {
  const [items, setItems] = useState([
    { id: 'item-1', x: 500, y: 150, temp: 99, icon: 'mdi:server' },
    { id: 'item-2', x: 600, y: 150, temp: 80, icon: 'clarity:server-solid' },
    { id: 'item-3', x: 700, y: 150, temp: 75, icon: 'game-icons:server-rack' },
    { id: 'item-4', x: 850, y: 150, temp: 40, icon: 'heroicons:server-stack-solid' },
    { id: 'item-5', x: 950, y: 150, temp: 20, icon: 'clarity:rack-server-outline-badged' }
  ]);

  const moveItem = (id, x, y) => {
    setItems(items.map((item) => (item.id === id ? { ...item, x, y } : item)));
  };

  const handleRandomize = () => {
    const newItems = items.map((item) => ({ ...item, temp: randomNumber(), x: bigRandomNumber(), y: bigRandomNumber() }));
    setItems(newItems);
  };

  // const interpolateColor = (temp, minTemp = 20, maxTemp = 99) => {
  //   const ratio = (temp - minTemp) / (maxTemp - minTemp);
  //   const red = Math.round(ratio * 255);
  //   const blue = Math.round((1 - ratio) * 255);
  //   return `rgb(${red}, 0, ${blue})`;
  // };

  const narrowRangeInterpolateColor = (temp, minTemp = 20, maxTemp = 80) => {
    // Clamp temp to within the new narrower range
    const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
    const ratio = (clampedTemp - minTemp) / (maxTemp - minTemp);
    const red = Math.round(ratio * 255);
    const blue = Math.round((1 - ratio) * 255);
    return `rgb(${red}, 0, ${blue})`;
  };

  return (
    <Box width="400px">
      <DndProvider backend={HTML5Backend}>
        {items.map((item, index) => (
          <DraggableComponent key={`${item.id}/${index}`} id={item.id} x={item.x} y={item.y} onMove={moveItem}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                opacity: 0.5,
                backgroundColor: narrowRangeInterpolateColor(item.temp),
                color: '#fff',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1
              }}
            ></Box>
            <Icon icon={item.icon} style={{ fontSize: '96', zIndex: 99 }} />
          </DraggableComponent>
        ))}
        <DropZone />
      </DndProvider>
      <Button variant="contained" onClick={handleRandomize}>
        Randomize
      </Button>
    </Box>
  );
};

export default SamplePage;
