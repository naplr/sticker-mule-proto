export default function Info() {
  return (
    <div className="mt-6 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="w-5 h-5 text-blue-500 mt-0.5 inline-block text-center text-sm" role="img" aria-label="Info">
            ℹ️
          </span>
        </div>
        <div>
          <h4 className="text-md font-semibold text-blue-900 mb-1">
            Instruction
          </h4>
          <p className="text-sm text-blue-800">
            1. Paste Sticker Mule product URL and click &quot;Add Sticker&quot;
            <br />
            2. Drag stickers on the visualizer to arrange them
            <br />
            3. Add multiple stickers and save your session
            <br />
            4. Use Sticker Manager to order and remove stickers when you have more than 1 sticker
            <br /><br />
            <span className="font-medium">Accepted URL:</span> https://www.stickermule.com/[store]/item/[item-id]
            <br />
            <span className="font-medium">Example:</span> 
            <br />
            - https://www.stickermule.com/herman/item/14591453 <br />
            - https://www.stickermule.com/zamaxdesign/item/12572771?origin=PUBLIC_PROFILE <br />
            <br />
            <span>Visualize stickers at actual size on MacBook Pro lid. Drag to arrange multiple stickers.  </span>
          </p>
        </div>
      </div>
    </div>
  );
}