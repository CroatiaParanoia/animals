import { Point, Path, Shape, Size } from 'paper';

export const createPointer = (x: number, y: number) => {
  return new Point(x, y);
};

export const createSize = (width: number, height: number) => {
  return new Size(width, height);
};

export const createCircle = (center: paper.Point, radius: number) => {
  return new Path.Circle(center, radius);
};

export const createRectangle = (point: paper.Point, size: paper.Size) => {
  return new Shape.Rectangle(point, size);
};
