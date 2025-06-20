import { InputWithIcon } from "@/components/InputWithIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  signinFormDefaultValues,
  signinFormSchema,
  type SigninFormValues,
} from "@/features/auth/schemas/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type SigninFormProps = {
  onSubmit: (data: SigninFormValues) => void;
};

const SigninForm = ({ onSubmit }: SigninFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: signinFormDefaultValues,
  });

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl uppercase">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      icon={showPassword ? EyeIcon : EyeOffIcon}
                      iconPosition="right"
                      iconFunction={toggleShowPassword}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full" variant="submit">
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SigninForm;
