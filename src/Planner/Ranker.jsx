import { X, Plus, Check } from "lucide-react";
import React from "react";

export function Ranker({
  items,
  selectedItems,
  onChange,
  renderItem,
  itemKey,
  hideAvailable,
}) {
  const availableItems = items.filter(
    (item) =>
      !selectedItems.some((selected) => itemKey(selected) === itemKey(item)),
  );

  const handleAdd = (item) => {
    onChange([...selectedItems, item]);
  };

  const handleRemove = (index) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <div>
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          {selectedItems.map((item, index) => (
            <div
              key={itemKey(item)}
              className="group flex items-center justify-between p-3 border border-transparent hover:border-[#F1889B]/30 hover:shadow-sm bg-white hover:bg-[#FFF4F6]/50 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4 w-full">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F1889B] text-white shrink-0 shadow-sm">
                  <Check size={14} strokeWidth={3} />
                </span>
                <div className="font-medium text-neutral-900 w-full">
                  {renderItem(item)}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pl-2">
                <button
                  onClick={() => handleRemove(index)}
                  className="p-1.5 text-neutral-400 hover:text-[#E9666E] transition-colors ml-1 bg-white rounded-full border border-neutral-100 shadow-sm"
                  aria-label="Remove"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!hideAvailable && availableItems.length > 0 && (
        <div
          className={`pt-6 ${selectedItems.length > 0 ? "mt-6 border-t border-dashed border-neutral-200" : ""}`}
        >
          <p className="text-xs text-neutral-400 mb-4 uppercase tracking-widest font-bold flex items-center gap-2">
            แตะเพื่อเพิ่ม (Tap to Add)
          </p>
          <div className="space-y-2">
            {availableItems.map((item) => (
              <button
                key={itemKey(item)}
                onClick={() => handleAdd(item)}
                className="group flex items-center gap-3 w-full p-3 rounded-xl border border-neutral-200 text-left hover:border-[#3CB4E5] transition-colors bg-[#FCF9F2] hover:bg-white shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 group-hover:border-[#3CB4E5] group-hover:bg-[#EAF7FD] transition-colors">
                  <Plus
                    size={14}
                    className="text-neutral-400 group-hover:text-[#3CB4E5]"
                    strokeWidth={3}
                  />
                </div>
                <div className="flex-1 w-full text-[#3f3f46]">
                  {renderItem(item)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
