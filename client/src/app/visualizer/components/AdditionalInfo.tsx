export default function AdditionalInfo() {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="w-5 h-5 text-blue-500 mt-0.5 inline-block text-center text-sm" role="img" aria-label="Info">
            ℹ️
          </span>
        </div>
        <div>
          <h4 className="text-md font-semibold text-blue-900 mb-1">
            Sticker Preview
          </h4>
          <p className="text-sm text-blue-800">
            This visualization shows your stickers at actual size relative to the MacBook Pro lid. 
            You can add multiple stickers and drag them around to find the perfect arrangement.
          </p>
        </div>
      </div>
    </div>
  );
}