"use client";

// 搜索栏组件 - 带防抖、搜索历史提示的输入框

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Clock, X, MapPin } from "lucide-react";
import { cn, debounce } from "@/lib/utils";
import { getSearchHistory, removeSearchHistoryItem } from "@/lib/store";
import type { SearchHistoryItem } from "@/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onHistorySelect: (item: SearchHistoryItem) => void;
  placeholder?: string;
  className?: string;
}

// 常用搜索快捷词
const QUICK_SEARCHES = [
  "三里屯", "中关村", "望京", "五道口",
  "陆家嘴", "徐家汇", "国贸", "西二旗",
];

export function SearchBar({
  value,
  onChange,
  onHistorySelect,
  placeholder = "搜索位置、地铁站、小区名…",
  className,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 同步外部 value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 加载搜索历史
  useEffect(() => {
    if (isFocused) {
      setHistory(getSearchHistory());
    }
  }, [isFocused]);

  // 防抖通知父组件
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((val: unknown) => onChange(val as string), 300),
    [onChange]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedOnChange(val);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeSearchHistoryItem(id);
    setHistory(getSearchHistory());
  };

  const handleQuickSearch = (term: string) => {
    setInputValue(term);
    onChange(term);
    setIsFocused(false);
  };

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = isFocused && (history.length > 0 || inputValue.length === 0);

  return (
    <div className={cn("relative", className)}>
      {/* 搜索输入框 */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm transition-all duration-200",
          isFocused ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
        )}
      >
        <Search className={cn("h-4 w-4 shrink-0 transition-colors", isFocused ? "text-primary" : "text-muted-foreground")} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="搜索房源"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="清除搜索"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 下拉建议 */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          role="listbox"
          aria-label="搜索建议"
        >
          {/* 搜索历史 */}
          {history.length > 0 && (
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">最近搜索</span>
              </div>
              <ul className="space-y-0.5">
                {history.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <button
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted"
                      onClick={() => {
                        onHistorySelect(item);
                        setIsFocused(false);
                      }}
                      role="option"
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate text-sm">{item.label}</span>
                      <button
                        onClick={(e) => handleDeleteHistory(e, item.id)}
                        className="rounded p-0.5 text-muted-foreground hover:bg-muted-foreground/20"
                        aria-label="删除此记录"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 快捷搜索词 */}
          {inputValue.length === 0 && (
            <div className={cn("p-3", history.length > 0 && "border-t border-border")}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">热门区域</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <MapPin className="h-3 w-3" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
