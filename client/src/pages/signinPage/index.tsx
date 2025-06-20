import SigninForm from "./components/SigninForm";
import type { SigninFormValues } from "./schemas/signinSchema";

const SigninPage = () => {
  const handleSubmit = (data: SigninFormValues) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="page-container flex items-center justify-center bg-background">
      <SigninForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SigninPage;
