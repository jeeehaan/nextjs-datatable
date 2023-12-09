'use client';

import { useEffect, useState } from 'react';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
  columnHelper.accessor('jobTitle', {
    header: 'Job Title',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
];

interface TableComponentProps {
  initialData: User[];
}
export const TableComponent: React.FC<TableComponentProps> = ({ initialData }) => {
  const [data] = useState(initialData);
  const [isClient, setIsClient] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div>
      <div>
        {table.getAllColumns().map((column) => {
          return (
            <input
              key={column.id}
              {...{
                type: 'checkbox',
                checked: column.getIsVisible(),
                onChange: column.getToggleVisibilityHandler(),
              }}
            />
          );
        })}
      </div>
      <Table>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <TableHeader key={headerGroup.id}>
              {headerGroup.headers.map((column) => {
                return (
                  <TableHead key={column.id}>
                    {flexRender(column.column.columnDef.header, column.getContext())}
                  </TableHead>
                );
              })}
            </TableHeader>
          );
        })}
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
