import React from "react";
import { TableRow, TableCell } from "./table";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  renderRow?: (index: number) => React.ReactNode;
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  renderRow,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        if (renderRow) {
          return (
            <React.Fragment key={rowIndex}>
              {renderRow(rowIndex)}
            </React.Fragment>
          );
        }

        return (
          <TableRow key={rowIndex} hoverable={false} className="animate-pulse">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <div className="h-4 w-full max-w-[120px] rounded bg-surface" />
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </>
  );
}
