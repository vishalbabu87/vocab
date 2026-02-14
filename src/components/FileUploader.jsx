import { useState } from 'react';
import { mergeImportedVocabulary } from '../data/questions';

function isValidItem(item) {
  return (
    item
    && typeof item.word === 'string'
    && typeof item.meaning === 'string'
    && typeof item.category === 'string'
    && Array.isArray(item.options)
    && item.options.length === 4
  );
}

export default function FileUploader() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [parseMode, setParseMode] = useState('auto');

  const handleChange = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!['pdf', 'docx', 'xlsx'].includes(ext)) {
      setStatus({ type: 'error', message: 'Only PDF, DOCX, and XLSX files are supported.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parseMode', parseMode);

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || 'Failed to extract vocabulary');
      }

      const payload = await response.json();

      if (!Array.isArray(payload)) {
        throw new Error('Invalid response format from extractor');
      }

      const validItems = payload.filter(isValidItem);

      if (validItems.length === 0) {
        throw new Error('No valid vocabulary items found in extracted output');
      }

      const importedCount = mergeImportedVocabulary(validItems);
      setStatus({
        type: 'success',
        message: `Successfully imported ${importedCount} word${importedCount === 1 ? '' : 's'}.`,
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <section className="rounded-2xl bg-zinc-800 p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-zinc-100">Import Vocabulary</h2>
      <p className="mt-1 text-sm text-zinc-400">Upload PDF, DOCX, or XLSX and auto-generate quiz words.</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="text-sm text-zinc-300" htmlFor="parse-mode">
          File parsing option
        </label>
        <select
          id="parse-mode"
          value={parseMode}
          onChange={(event) => setParseMode(event.target.value)}
          className="rounded-xl bg-zinc-700 px-3 py-2 text-sm text-zinc-100"
          disabled={isUploading}
        >
          <option value="auto">Auto-detect</option>
          <option value="pdf">Force PDF parser</option>
          <option value="docx">Force DOCX parser</option>
          <option value="xlsx">Force Excel parser</option>
        </select>
      </div>

      <label className="mt-4 inline-flex cursor-pointer items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-400">
        <input
          type="file"
          accept=".pdf,.docx,.xlsx"
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />
        {isUploading ? 'Importing...' : 'Choose File'}
      </label>

      {status.message ? (
        <p className={`mt-3 text-sm ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
          {status.message}
        </p>
      ) : null}
    </section>
  );
}
