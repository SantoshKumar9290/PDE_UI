import React, { useState } from "react";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      className="btn bg-transparent p-0 border-0"
      style={{
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {copied ? (
        // ✅ Green check icon
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="green"
        >
          <path d="M9 16.17L4.83 12 3.41 13.41 9 19l12-12-1.41-1.41z" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
        >
          {/* Back shell */}
          <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z"
            fill="#999"
            stroke="#666"
            strokeWidth="0.5"
          />
          {/* Front shell */}
          <path
            d="M19 5H8c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 17H8V7h11v15z"
            fill="gray"
            stroke="#333"
            strokeWidth="0.6"
          />
        </svg>
      )}
    </button>
  );
};

export default CopyButton;
