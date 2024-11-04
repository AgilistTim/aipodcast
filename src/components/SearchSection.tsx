import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Spinner } from "@nextui-org/react";
import { Search, AlertCircle } from 'lucide-react';
import { SearchResult } from '../utils/perplexitySearch';
import SearchResults from './SearchResults';

interface SearchSectionProps {
  onSearch: (query: string) => Promise<void>;
  isSearching: boolean;
  searchError: string;
  searchResults: SearchResult[];
  selectedResults: SearchResult[];
  onResultSelection: (result: SearchResult) => void;
  topic: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  isSearching,
  searchError,
  searchResults,
  selectedResults,
  onResultSelection,
  topic,
}) => {
  const [searchQuery, setSearchQuery] = useState(topic);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <Card>
      <CardBody className="gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Research Content</h3>
            <p className="text-default-600 mb-4">
              Search for relevant information to enhance your podcast. You can perform multiple searches
              and select the most relevant content to inform your transcript.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search terms..."
              description="Press search to find relevant content"
              startContent={<Search className="text-default-400" size={20} />}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handleSearch}
              color="primary"
              isLoading={isSearching}
              spinner={<Spinner size="sm" />}
              className="min-w-[100px]"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchError && (
            <div className="flex items-center gap-2 p-4 bg-danger-50 text-danger rounded-lg">
              <AlertCircle size={20} />
              <p>{searchError}</p>
            </div>
          )}

          {(searchResults.length > 0 || selectedResults.length > 0) && (
            <SearchResults
              results={searchResults}
              selectedResults={selectedResults}
              onResultSelection={onResultSelection}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SearchSection;