function WarningStep({ onYes, onNo }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Warning</h2>
      <p className="text-gray-400 mb-4">
        Seems like you did not fill your email. Would you like to do it?
      </p>
      <p className="text-sm text-gray-500 mb-8">
        <strong>Note:</strong> This step is automatically skipped if user filled
        their email in the first step.
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onNo}
          className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
        >
          NO
        </button>
        <button
          type="button"
          onClick={onYes}
          className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
        >
          YES
        </button>
      </div>
    </div>
  );
}

export default WarningStep;
