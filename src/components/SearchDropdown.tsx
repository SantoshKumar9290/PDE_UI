import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "../../styles/components/Table.module.scss";
import debounce from "lodash/debounce";

interface SearchableDropdownProps {
  required?: boolean;
  name: string;
  value?: string;
  multi?: boolean;
  fetchOptions: (query: string) => Promise<any[]>;
  onChange: (selected: any) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  required = false,
  name,
  value = "",
  multi = false,
  fetchOptions,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSelected, setHasSelected] = useState(!!value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedFetch = useCallback(
    debounce(async (text: string) => {
      if (!text.trim()) {
        setOptions([]);
        setShowSuggestions(false);
        return;
      }

      const results = await fetchOptions(text);
      if (results.length === 0) {
        setOptions([{ label: "No Data", value: "No Data" }]);
      } else {
        setOptions(results);
      }
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    }, 700),
    [fetchOptions]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    setHasSelected(false);
    debouncedFetch(text);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);

        if (!hasSelected) {
          setInputValue("");
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hasSelected]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || options.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = options[highlightedIndex];
      if (selected.value !== "No Data") handleSelect(selected);
    }
  };

  const handleSelect = (selected: any) => {
    const selectedValue = multi ? selected.code : selected.value || selected;
    setInputValue(selectedValue === "No Data" ? "" : selectedValue);
    onChange(selected.value === "No Data" ? null : selected);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setHasSelected(true);
  };

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
      <input
        type="text"
        name={name}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        required={required}
        className={styles.columnInputBox}
        style={{ fontFamily: "Montserrat" }}
        autoComplete="off"
      />
      {showSuggestions && options.length > 0 && (
        <ul className={styles.suggestionsList}>
          {options.map((item: any, index: number) => (
            <li
              key={index}
              onClick={() => item.value !== "No Data" && handleSelect(item)}
              className={index === highlightedIndex ? styles.highlighted : ""}
              style={{
                color: item.value === "No Data" ? "gray" : "inherit",
                cursor: item.value === "No Data" ? "default" : "pointer",
              }}
            >
              {multi ? item.type : item.label || item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
