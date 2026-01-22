function AsyncStep() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Async</h2>
      <p className="text-gray-400 mb-8">
        Pressing "Next" does async operation that takes 2 seconds before we
        proceed to the next step.
      </p>

      <div className="flex justify-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default AsyncStep;
