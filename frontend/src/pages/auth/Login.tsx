import { useForm } from "react-hook-form";
import { loginUser } from "../../api/auth.api";
import { useSetAtom } from "jotai";
import { userAtom } from "../../jotai/user.atom";
import AuthLayout from "../../components/layout/AuthLayout";
import TextInput from "../../components/form/TextInput";
import PasswordInput from "../../components/form/PasswordInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

export default function Login() {
  const setUser = useSetAtom(userAtom);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (values :any) => {
    try {
      const res = await loginUser(values);
      localStorage.setItem("access_token", res.token);
      setUser(res.user);
      alert("Login successful!");
    } catch (err) {
      alert(err || "Login failed");
    }
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Email"
          name="email"
          register={register}
          errors={errors}
        />

        <PasswordInput
          label="Password"
          name="password"
          register={register}
          errors={errors}
        />

        <PrimaryButton title="Login" type="submit" />
      </form>
    </AuthLayout>
  );
}
