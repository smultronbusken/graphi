import * as Ariakit from "@ariakit/react";
import { matchSorter } from "match-sorter";
import { startTransition, useEffect, useMemo, useState } from "react";
import "./SearchSuggestions.css";
import input from "@/input/input";

interface SearchSuggestionsProps {
  list: string[];
  onSelect?: (selected: string) => void;
}

export default function SearchSuggestions({ list, onSelect }: SearchSuggestionsProps) {
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => matchSorter(list, searchValue).slice(0, 5), [list, searchValue]);
  
  return (
    <Ariakit.ComboboxProvider
      setValue={(value) => {
        startTransition(() => setSearchValue(value));
      }}
    >
      <Ariakit.ComboboxLabel className="label">
      </Ariakit.ComboboxLabel>
      <Ariakit.Combobox 
      placeholder="Search" 
      className="combobox" 
      onKeyDown={(event) => {
        if (!list.includes(searchValue)) return;
        if (event.key === "Enter") {
          onSelect?.(searchValue);
        }
      }}
       />
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
