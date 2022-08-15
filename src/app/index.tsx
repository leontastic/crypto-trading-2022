import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Column,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
} from '@tanstack/react-table'
import { selectAll } from '../store/selectors/tickers'
import { Ticker } from '../types'
import './index.css'

const columnHelper = createColumnHelper<Ticker>()

const columns = [
  columnHelper.accessor(({ symbol }) => symbol, {
    id: 'symbol',
    enableMultiSort: true,
  }),
  columnHelper.accessor(({ bid }) => new BigNumber(bid).toNumber(), {
    id: 'bid',
    enableMultiSort: true,
  }),
  columnHelper.accessor(({ ask }) => new BigNumber(ask).toNumber(), {
    id: 'ask',
    enableMultiSort: true,
  }),
  columnHelper.accessor(
    ({ bid, ask }) => {
      const diff = new BigNumber(ask).minus(new BigNumber(bid))
      const avg = new BigNumber(ask).plus(new BigNumber(bid)).dividedBy(2)
      return diff.dividedBy(avg).times(10_000).toNumber()
    },
    {
      id: 'spread',
      enableMultiSort: true,
    }
  ),
  columnHelper.accessor(({ exchange }) => exchange, {
    id: 'exchange',
    enableMultiSort: true,
  }),
  columnHelper.accessor(({ time }) => time, {
    id: 'time',
    enableMultiSort: true,
  }),
]

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => {
      clearTimeout(timeout)
    }
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={({ target: { value } }) => {
        setValue(value)
      }}
    />
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<Ticker>
  table: Table<Ticker>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(() => {
    if (typeof firstValue === 'number') return []
    const values = Array.from(
      column.getFacetedUniqueValues().keys()
    ) as string[]
    values.sort()
    return values
  }, [column.getFacetedUniqueValues()])

  return typeof firstValue === 'number' ? (
    <div>
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(value) => {
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }}
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0] ?? ''})`
            : ''
        }`}
      />
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(value) => {
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }}
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1] ?? ''})`
            : ''
        }`}
      />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => {
          column.setFilterValue(value)
        }}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        list={column.id + 'list'}
      />
    </>
  )
}

const App = () => {
  const tickers = useSelector(selectAll)
  const [sorting, onSortingChange] = useState<SortingState>([])
  const [columnFilters, onColumnFiltersChange] =
    React.useState<ColumnFiltersState>([])
  const [globalFilter, onGlobalFilterChange] = React.useState('')

  const table = useReactTable({
    columns,
    data: tickers,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    isMultiSortEvent: () => true,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onSortingChange,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
  })

  return (
    <div id="app">
      <pre>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div>
                        <div
                          {...{
                            style: {
                              cursor: header.column.getCanSort()
                                ? 'pointer'
                                : 'auto',
                            },
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        <div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </pre>
    </div>
  )
}

export default App
