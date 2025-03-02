import * as Ariakit from "@ariakit/react";
import { matchSorter } from "match-sorter";
import { startTransition, useMemo, useState } from "react";
import "./SearchSuggestions.css";

interface SearchSuggestionsProps {
  list: string[];
  onSelect?: (selected: string) => void;
}

export default function SearchSuggestions({ list, onSelect }: SearchSuggestionsProps) {
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => matchSorter(list, searchValue), [list, searchValue]);
  
  return (
    <Ariakit.ComboboxProvider
      setValue={(value) => {
        startTransition(() => setSearchValue(value));
      }}
    >
      <Ariakit.ComboboxLabel className="label">
      </Ariakit.ComboboxLabel>
      <Ariakit.Combobox placeholder="Search" className="combobox" />
      <Ariakit.ComboboxPopover gutter={8} sameWidth className="popover">
        {matches.length ? (
          matches.map((value) => (
            <Ariakit.ComboboxItem
              key={value}
              value={value}
              className="combobox-item"
              onClick={() => {
                if (onSelect) onSelect(value);
              }}
            />
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
}
