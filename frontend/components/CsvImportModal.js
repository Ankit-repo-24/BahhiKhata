import { useState } from 'react';

export default function CsvImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      previewCSV(selectedFile);
    }
  };

  const previewCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').slice(0, 6); // Preview first 5 lines
      const parsed = lines.map(line => line.split(','));
      setPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',');

        const expenses = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          if (values.length < 3) return null;

          return {
            id: Date.now() + index,
            title: values[0]?.trim() || 'Imported Expense',
            amount: parseFloat(values[1]?.trim()) || 0,
            category: values[2]?.trim() || 'Other',
            date: values[3]?.trim() || new Date().toISOString(),
            source: 'IMPORTED',
            type: 'debit'
          };
        }).filter(Boolean);

        onImport(expenses);
        onClose();
      };
      reader.readAsText(file);
    } catch (error) {
      alert('Error processing CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Import CSV</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                CSV format: Title,Amount,Category,Date (optional)
              </p>
            </div>

            {/* Preview */}
            {preview.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {preview[0]?.map((header, i) => (
                          <th key={i} className="text-left py-2 px-2 font-medium text-gray-700">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(1).map((row, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          {row.map((cell, j) => (
                            <td key={j} className="py-2 px-2 text-gray-600">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sample Format */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Expected CSV Format</h4>
              <pre className="text-xs text-blue-800 whitespace-pre-wrap">
{`Title,Amount,Category,Date
Swiggy Order,340,Food & Dining,2024-01-15
Auto Rickshaw,80,Transportation,2024-01-14
Movie Tickets,600,Entertainment,2024-01-13`}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!file || isProcessing}
                className="btn btn-primary disabled:opacity-50"
              >
                {isProcessing ? 'Importing...' : 'Import Expenses'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}