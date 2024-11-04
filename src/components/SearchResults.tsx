import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { SearchResult } from '../utils/perplexitySearch';
import SearchResultCard from './SearchResultCard';

interface SearchResultsProps {
  results: SearchResult[];
  selectedResults: SearchResult[];
  onResultSelection: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  selectedResults,
  onResultSelection,
}) => {
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(new Set());

  const isSelected = React.useCallback((result: SearchResult) => 
    selectedResults.some(r => r.summary === result.summary),
    [selectedResults]
  );

  const handleToggleExpand = React.useCallback((key: string) => {
    setExpandedKeys(prev => {
      const newKeys = new Set(prev);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      return newKeys;
    });
  }, []);

  return (
    <div className="space-y-4">
      {selectedResults.length > 0 && (
        <Card className="bg-success-50">
          <CardBody>
            <h4 className="font-semibold mb-2">Selected Research ({selectedResults.length})</h4>
            <div className="space-y-2">
              {selectedResults.map((result, index) => (
                <div
                  key={`selected-${index}`}
                  className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                >
                  <p className="text-sm truncate flex-1">{result.summary}</p>
                  <button
                    className="px-2 py-1 text-sm text-danger hover:bg-danger-50 rounded"
                    onClick={() => onResultSelection(result)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="space-y-2">
        {results.map((result, index) => {
          const key = `result-${index}`;
          return (
            <SearchResultCard
              key={key}
              result={result}
              isSelected={isSelected(result)}
              isExpanded={expandedKeys.has(key)}
              onSelect={() => onResultSelection(result)}
              onToggleExpand={() => handleToggleExpand(key)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SearchResults);
