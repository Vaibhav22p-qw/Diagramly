"use client";

type Props = {
  showDocument: boolean;
  setShowDocument: React.Dispatch<React.SetStateAction<boolean>>;

  showCompiler: boolean;
  setShowCompiler: React.Dispatch<React.SetStateAction<boolean>>;

  showCanvas: boolean;
  setShowCanvas: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ViewSwitcher({
  showDocument,
  setShowDocument,
  showCompiler,
  setShowCompiler,
  showCanvas,
  setShowCanvas,
}: Props) {
  return (
    <div className="flex justify-center py-3 border-b bg-white">
      <div className="flex items-center gap-6 rounded-full bg-gray-100 px-6 py-2">

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDocument}
            onChange={() => setShowDocument(!showDocument)}
          />
          <span>Document</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCompiler}
            onChange={() => setShowCompiler(!showCompiler)}
          />
          <span>Compiler</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCanvas}
            onChange={() => setShowCanvas(!showCanvas)}
          />
          <span>Canvas</span>
        </label>

      </div>
    </div>
  );
}
