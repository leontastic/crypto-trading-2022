import BigNumber from 'bignumber.js'
import React from 'react'
import { useSelector } from 'react-redux'
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { selectAll } from '../store/selectors/tickers'
import { Ticker } from '../types'
import './index.css'

const columnHelper = createColumnHelper<Ticker>()

const defaultColumns: Array<ColumnDef<Ticker, string>> = [
  columnHelper.accessor(({ symbol }) => symbol, {
    id: 'symbol',
  }),
  columnHelper.accessor(({ bid }) => bid, {
    id: 'bid',
  }),
  columnHelper.accessor(({ ask }) => ask, {
    id: 'ask',
  }),
  columnHelper.accessor(
    ({ bid, ask }) =>
      new BigNumber(ask)
        .minus(new BigNumber(bid))
        .dividedBy(
          new BigNumber(ask)
            .minus(new BigNumber(bid))
            .dividedBy(2)
            .plus(new BigNumber(ask))
        )
        .times(10_000)
        .toFixed(4),
    {
      id: 'margin',
    }
  ),
  columnHelper.accessor(({ exchange }) => exchange, {
    id: 'exchange',
  }),
  columnHelper.accessor(({ time }) => time, {
    id: 'time',
  }),
]

const App = () => {
  const tickers = useSelector(selectAll)

  const table = useReactTable({
    data: tickers,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
