import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6 relative">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg overflow-hidden">
          {icon ? (
            <img src={icon} alt="Icon" className="w-12 h-12 object-contain" />
          ) : (
            <LuImage />
          )}
        </div>
        <p>{icon ? "Change Icon" : "Pick Icon"}</p>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 bg-white shadow-lg rounded-md border border-gray-200 w-[320px] max-w-full overflow-auto max-h-[400px]">
          <button
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-full absolute -top-3 -right-3 shadow cursor-pointer z-10"
            onClick={() => setIsOpen(false)}
          >
            <LuX />
          </button>
          <EmojiPicker
            onEmojiClick={(emoji) => {
              onSelect(emoji?.imageUrl || "");
              setIsOpen(false); // optional: close on select
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
