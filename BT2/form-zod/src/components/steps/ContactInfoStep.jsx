import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema } from "../../schemas/wizardSchema";

function ContactInfoStep({ form }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Contact Info</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            {...register("firstName")}
            type="text"
            placeholder="John"
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
              errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-600 focus:ring-indigo-500"
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            {...register("lastName")}
            type="text"
            placeholder="Doe"
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
              errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-600 focus:ring-indigo-500"
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-400">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            {...register("age")}
            type="number"
            placeholder="30"
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
              errors.age
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-600 focus:ring-indigo-500"
            }`}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-400">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="e.g. john@doe.com"
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-600 focus:ring-indigo-500"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactInfoStep;
