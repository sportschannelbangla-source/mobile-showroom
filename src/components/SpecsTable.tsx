'use client';

import React from 'react';

interface SpecsTableProps {
  specifications: Record<string, string>;
}

export function SpecsTable({ specifications }: SpecsTableProps) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return (
      <p className="text-xs text-gray-500 italic">
        General manufacturer specifications included with product manual.
      </p>
    );
  }

  // Format keys into title case
  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <tbody>
          {Object.entries(specifications).map(([key, value], idx) => (
            <tr
              key={key}
              className={`${
                idx % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'
              } border-b border-gray-100 last:border-0`}
            >
              <td className="py-2.5 px-3.5 font-bold text-gray-600 w-2/5 sm:w-1/3">
                {formatKey(key)}
              </td>
              <td className="py-2.5 px-3.5 font-medium text-gray-900">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
