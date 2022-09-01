import { useState } from "react";
import { useForm } from "react-hook-form";
// function ToDoList() {
//   const [toDo, setToDo] = useState("");
//   const onChnage = (event: React.FormEvent<HTMLInputElement>) => {
//     const {
//       currentTarget: { value },
//     } = event;
//     setToDo(value);
//   };
//   const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     console.log(toDo);
//   };
//   return (
//     <div>
//       <form onSubmit={onSubmit}>
//         <input onChange={onChnage} value={toDo} placeholder="Write a to do" />
//         <button>Add</button>
//       </form>
//     </div>
//   );
// }

interface IForm {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  password1: string;
  extraError?: string;
}

function ToDoList() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IForm>({
    defaultValues: {
      email: "@naver.com",
    },
  });
  const onValid = (data: IForm) => {
    if (data.password !== data.password1) {
      setError(
        "password1",
        { message: "Password are not the same" },
        { shouldFocus: true }
      );
    }
    //setError("extraError", { message: "Server offline" });
  };
  console.log(errors);
  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit(onValid)}
      >
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver\.com$/,
              message: "Only naver.com",
            },
          })}
          placeholder="Email"
        />
        <span>{errors?.email?.message}</span>
        <input
          {...register("firstName", {
            required: "wirte here",
            validate: {
              noJin: (value) => (value.includes("jin") ? "no allowed" : true),
            },
          })}
          placeholder="First Name"
        />
        <span>{errors?.firstName?.message}</span>
        <input
          {...register("lastName", { required: "wirte here" })}
          placeholder="Last Name"
        />
        <span>{errors?.lastName?.message}</span>
        <input
          {...register("username", {
            required: "wirte here",
            minLength: { value: 5, message: "No" },
          })}
          placeholder="Username"
        />
        <span>{errors?.username?.message}</span>
        <input
          {...register("password", { required: "wirte here" })}
          placeholder="Password"
        />
        <span>{errors?.password?.message}</span>
        <input
          {...register("password1", { required: "wirte here" })}
          placeholder="Password1"
        />
        <span>{errors?.password1?.message}</span>
        <button>Add</button>
        <span>{errors?.extraError?.message}</span>
      </form>
    </div>
  );
}

export default ToDoList;
