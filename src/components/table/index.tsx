'use client';

import { useEffect, useState } from 'react';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  age: number;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('id', {
    header: ({ table }) => {
      return (
        <input
          {...{
            type: 'checkbox',
            checked: table.getIsAllRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <input
          {...{
            type: 'checkbox',
            checked: row.getIsSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      );
    },
  }),

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
  columnHelper.accessor('age', {
    header: 'Age',
    cell: (data) => <div>{data.getValue()}</div>,
  }),
];

interface TableComponentProps {
  initialData: User[];
}
export const TableComponent: React.FC<TableComponentProps> = ({ initialData }) => {
  const [isClient, setIsClient] = useState(false);
  const [data] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 1000);

  const table = useReactTable({
    state: {
      sorting,
      globalFilter: debouncedGlobalFilter,
    },
    initialState: {
      columnVisibility: {
        firstName: false,
        lastName: false,
        email: true,
        jobTitle: true,
        age: true,
      },
      pagination: {
        pageSize: 10,
      },
    },
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div>
      {/* <pre>{JSON.stringify(sorting, null, 2)}</pre> */}
      <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
      <div>
        {table.getAllColumns().map((column) => {
          return (
            <div key={column.id} className="flex gap-2">
              <input
                key={column.id}
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler(),
                }}
              />
              <p>{column.columnDef.header as string}</p>
            </div>
          );
        })}
      </div>
      <Table>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <TableHeader key={headerGroup.id}>
              {headerGroup.headers.map((column) => {
                return (
                  <TableHead
                    className="cursor-pointer hover:bg-zinc-100"
                    key={column.id}
                    onClick={() => {
                      if (column.id === 'id') {
                        // do nothing
                      } else {
                        column.column.toggleSorting();
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>{flexRender(column.column.columnDef.header, column.getContext())}</div>
                      {column.column.getIsSorted() === 'asc' ? <ArrowDown size={13} /> : null}
                      {column.column.getIsSorted() === 'desc' ? <ArrowUp size={13} /> : null}
                    </div>
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
      <div>
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
      </div>
      <div>
        <select onChange={(e) => table.setPageSize(Number(e.target.value))}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value={data.length}>All</option>
        </select>
      </div>
    </div>
  );
};
