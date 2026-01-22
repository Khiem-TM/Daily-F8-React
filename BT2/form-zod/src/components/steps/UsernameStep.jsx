import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "../../schemas/wizardSchema";

function UsernameStep({ form, firstName }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Username</h2>
      <p className="text-gray-400 mb-8">
        Username should include your first name. This step is to demonstrate
        that we can validate field based on what user typed in the previous
        step.
      </p>

      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input
          {...register("username")}
          type="text"
          placeholder={`e.g. ${firstName ? firstName.toLowerCase() : "john"}`}
          className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
            errors.username
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-600 focus:ring-indigo-500"
          }`}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
        )}
      </div>
    </div>
  );
}

export default UsernameStep;
