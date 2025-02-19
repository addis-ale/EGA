import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

import { FieldValues } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  id: Path<T>; // Ensure the id is a valid key of T
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  className?: string;
}

const Input = <T extends FieldValues>({
  id,
  label,
  type = "text",
  disabled = false,
  required = false,
  register,
  errors,
  className = "",
}: InputProps<T>) => {
  return (
    <div className="w-full relative">
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        placeholder=" "
        type={type}
        {...register(id, { required })}
        className={`peer w-full p-4 pt-6 pb-2 outline-none font-light bg-white border-2 rounded-xl transition 
          disabled:opacity-70 disabled:cursor-not-allowed text-shadGray
         
          ${
            errors[id as keyof typeof errors]
              ? "border-rose-400 focus:border-rose-400"
              : "border-gray-300 focus:border-shadGray"
          }
          ${className}`}
      />
      <label
        htmlFor={id}
        className={`absolute cursor-text duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
        peer-focus:scale-75 peer-focus:-translate-y-4
        ${
          errors[id as keyof typeof errors] ? "text-rose-500" : "text-shadGray"
        }`}
      >
        {label}
      </label>
      {errors[id as keyof typeof errors] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[id as keyof typeof errors]?.message as string}
        </p>
      )}
    </div>
  );
};

export default Input;
