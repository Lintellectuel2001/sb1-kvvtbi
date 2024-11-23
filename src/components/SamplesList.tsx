import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ClipboardList, Trash2, Edit3 } from 'lucide-react';
import { getAllRows, runQuery } from '../lib/db';

type Sample = {
  id: number;
  sampleNumber: string;
  fabricationDate: string;
  day7Date: string;
  day14Date: string;
  day28Date: string;
  client: string;
  site: string;
  concreteType: string;
  elementCoule: string;
  day7Result: number | null;
  day14Result: number | null;
  day28Result: number | null;
};

const columnHelper = createColumnHelper<Sample>();

export function SamplesList() {
  const { data: samples = [], refetch } = useQuery({
    queryKey: ['samples'],
    queryFn: () => getAllRows('SELECT * FROM samples ORDER BY fabricationDate DESC'),
  });

  const [editingResult, setEditingResult] = React.useState<{
    id: number;
    field: 'day7Result' | 'day14Result' | 'day28Result';
    value: string;
  } | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet échantillon ?')) {
      await runQuery('DELETE FROM samples WHERE id = ?', [id]);
      refetch();
    }
  };

  const handleEditResult = (id: number, field: 'day7Result' | 'day14Result' | 'day28Result', currentValue: number | null) => {
    setEditingResult({
      id,
      field,
      value: currentValue?.toString() || '',
    });
  };

  const handleSaveResult = async (id: number, field: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      await runQuery(`UPDATE samples SET ${field} = ? WHERE id = ?`, [numValue, id]);
      refetch();
    }
    setEditingResult(null);
  };

  const columns = [
    columnHelper.accessor('sampleNumber', {
      header: 'N° Échantillon',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('fabricationDate', {
      header: 'Date de Fabrication',
      cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
    }),
    columnHelper.accessor('client', {
      header: 'Client',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('site', {
      header: 'Chantier',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('concreteType', {
      header: 'Type de Béton',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('elementCoule', {
      header: 'Élément Coulé',
      cell: info => info.getValue(),
    }),
    columnHelper.group({
      header: '7 Jours',
      columns: [
        columnHelper.accessor('day7Date', {
          header: 'Date',
          cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
        }),
        columnHelper.accessor('day7Result', {
          header: 'Résultat',
          cell: info => {
            const id = info.row.original.id;
            if (editingResult?.id === id && editingResult?.field === 'day7Result') {
              return (
                <input
                  type="number"
                  step="0.1"
                  value={editingResult.value}
                  onChange={e => setEditingResult({ ...editingResult, value: e.target.value })}
                  onBlur={() => handleSaveResult(id, 'day7Result', editingResult.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSaveResult(id, 'day7Result', editingResult.value)}
                  className="w-20 px-2 py-1 border rounded"
                  autoFocus
                />
              );
            }
            return (
              <div className="flex items-center gap-2">
                <span>{info.getValue() ? `${info.getValue()} MPa` : '-'}</span>
                <button
                  onClick={() => handleEditResult(id, 'day7Result', info.getValue())}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            );
          },
        }),
      ],
    }),
    columnHelper.group({
      header: '14 Jours',
      columns: [
        columnHelper.accessor('day14Date', {
          header: 'Date',
          cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
        }),
        columnHelper.accessor('day14Result', {
          header: 'Résultat',
          cell: info => {
            const id = info.row.original.id;
            if (editingResult?.id === id && editingResult?.field === 'day14Result') {
              return (
                <input
                  type="number"
                  step="0.1"
                  value={editingResult.value}
                  onChange={e => setEditingResult({ ...editingResult, value: e.target.value })}
                  onBlur={() => handleSaveResult(id, 'day14Result', editingResult.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSaveResult(id, 'day14Result', editingResult.value)}
                  className="w-20 px-2 py-1 border rounded"
                  autoFocus
                />
              );
            }
            return (
              <div className="flex items-center gap-2">
                <span>{info.getValue() ? `${info.getValue()} MPa` : '-'}</span>
                <button
                  onClick={() => handleEditResult(id, 'day14Result', info.getValue())}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            );
          },
        }),
      ],
    }),
    columnHelper.group({
      header: '28 Jours',
      columns: [
        columnHelper.accessor('day28Date', {
          header: 'Date',
          cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
        }),
        columnHelper.accessor('day28Result', {
          header: 'Résultat',
          cell: info => {
            const id = info.row.original.id;
            if (editingResult?.id === id && editingResult?.field === 'day28Result') {
              return (
                <input
                  type="number"
                  step="0.1"
                  value={editingResult.value}
                  onChange={e => setEditingResult({ ...editingResult, value: e.target.value })}
                  onBlur={() => handleSaveResult(id, 'day28Result', editingResult.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSaveResult(id, 'day28Result', editingResult.value)}
                  className="w-20 px-2 py-1 border rounded"
                  autoFocus
                />
              );
            }
            return (
              <div className="flex items-center gap-2">
                <span>{info.getValue() ? `${info.getValue()} MPa` : '-'}</span>
                <button
                  onClick={() => handleEditResult(id, 'day28Result', info.getValue())}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            );
          },
        }),
      ],
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <button
          onClick={() => handleDelete(info.row.original.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: samples,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!samples.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Liste des Échantillons
        </h2>
        <p className="text-center text-gray-500 py-8">Aucun échantillon enregistré</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <ClipboardList className="w-6 h-6 text-blue-600" />
        Liste des Échantillons
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    colSpan={header.colSpan}
                  >
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
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}