import React from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Check, ChevronDown } from 'lucide-react';
import { SearchResult } from '../utils/perplexitySearch';

interface SearchResultCardProps {
  result: SearchResult;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = React.memo(({
  result,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand
}) => {
  return (
    <Card className={isSelected ? "border-success border-2" : ""}>
      <CardBody className="p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <p className="font-medium">{result.summary}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              color={isSelected ? "success" : "primary"}
              variant={isSelected ? "flat" : "solid"}
              onClick={onSelect}
              startContent={isSelected ? <Check size={16} /> : null}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onClick={onToggleExpand}
            >
              <ChevronDown
                className={`transform transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>
        </div>
        {isExpanded && (
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
  );
});

SearchResultCard.displayName = 'SearchResultCard';

export default SearchResultCard;
