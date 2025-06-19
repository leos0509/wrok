import SignupForm from "../components/SignupForm";
import type { SigninFormValues } from "../schemas/signinSchema";

const SignupPage = () => {
  const handleSubmit = (data: SigninFormValues) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="page-container flex items-center justify-center bg-background">
      <SignupForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SignupPage;
