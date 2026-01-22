import { useState } from "react";

function CompletionStep({ formData }) {
  const [showHideNext, setShowHideNext] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Congratulations!</h2>
      <p className="text-gray-400 mb-2">
        You did it <span className="text-yellow-400">{formData.firstName}</span>
        !
      </p>
      <p className="text-gray-400 mb-8">Here's your input:</p>

      <div className="mb-8">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowHideNext(!showHideNext)}
            className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            TOGGLE HIDENEXT
          </button>
        </div>

        <div className="bg-black rounded-lg p-6 font-mono text-sm">
          <pre className="text-gray-300">
            {`{
  "username": "${formData.username}",
  "firstName": "${formData.firstName}",
  "lastName": "${formData.lastName}",
  "age": ${formData.age},
  "email": "${formData.email}"
}`}
          </pre>
        </div>
      </div>

      {!showHideNext && (
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            You can hide the navigation buttons by setting hideNext prop
          </p>
        </div>
      )}
    </div>
  );
}

export default CompletionStep;
