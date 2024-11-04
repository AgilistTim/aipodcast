import React, { useState } from 'react';
import { Card, CardBody, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { Check, ChevronDown } from 'lucide-react';
import { SearchResult } from '../utils/perplexitySearch';

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
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const isSelected = (result: SearchResult) => 
    selectedResults.some(r => r.summary === result.summary);

  const toggleExpand = (key: string) => {
    const newKeys = new Set(expandedKeys);
    if (newKeys.has(key)) {
      newKeys.delete(key);
    } else {
      newKeys.add(key);
    }
    setExpandedKeys(newKeys);
  };

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
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onClick={() => onResultSelection(result)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="space-y-2">
        {results.map((result, index) => (
          <Card
            key={`result-${index}`}
            className={isSelected(result) ? "border-success border-2" : ""}
          >
            <CardBody className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="font-medium">{result.summary}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color={isSelected(result) ? "success" : "primary"}
                    variant={isSelected(result) ? "flat" : "solid"}
                    onClick={() => onResultSelection(result)}
                    startContent={isSelected(result) ? <Check size={16} /> : null}
                  >
                    {isSelected(result) ? 'Selected' : 'Select'}
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={() => toggleExpand(`result-${index}`)}
                  >
                    <ChevronDown
                      className={`transform transition-transform ${
                        expandedKeys.has(`result-${index}`) ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>
              {expandedKeys.has(`result-${index}`) && (
                <div className="px-4 pb-4">
                  <ul className="list-disc list-inside space-y-1">
                    {result.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-default-600">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;